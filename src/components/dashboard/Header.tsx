import { useState, useRef, useEffect } from 'react';
import { Gem, Flame, Bell, Menu, BookOpen, BarChart3, Calendar, Briefcase, AlertTriangle, Megaphone, X, CheckCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { User } from '@/lib/constants';
import type { ViewType } from './Sidebar';

interface HeaderProps {
  user: User;
  onMenuClick?: () => void;
  onNavigate?: (view: ViewType) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'course' | 'marks' | 'schedule' | 'internship' | 'attendance' | 'announcement';
  isRead: boolean;
  link?: ViewType;
  time: string;
}

const CATEGORY_CONFIG = {
  course: { icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  marks: { icon: BarChart3, color: 'text-success', bg: 'bg-success/10' },
  schedule: { icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
  internship: { icon: Briefcase, color: 'text-warning', bg: 'bg-warning/10' },
  attendance: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  announcement: { icon: Megaphone, color: 'text-muted-foreground', bg: 'bg-muted' },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Marks Published', message: 'Your Digital Ethics final exam marks are now available', category: 'marks', isRead: false, link: 'uni_marks', time: '2h ago' },
  { id: '2', title: 'Schedule Updated', message: "Thursday's Algorithms class moved to Room 204", category: 'schedule', isRead: false, link: 'schedule', time: '5h ago' },
  { id: '3', title: 'New Course Material', message: 'Prof. Lovelace uploaded Neural Networks Chapter 8 slides', category: 'course', isRead: false, link: 'uni_courses', time: '1d ago' },
  { id: '4', title: 'Internship Opportunity', message: 'TechCorp is hiring software engineering interns — apply by Feb 28', category: 'internship', isRead: true, link: 'academic_center', time: '2d ago' },
  { id: '5', title: 'Absence Warning', message: 'You have 2 unjustified absences in Data Structures. Limit is 3.', category: 'attendance', isRead: true, link: 'academic_center', time: '3d ago' },
  { id: '6', title: 'University Announcement', message: 'Campus will be closed on Feb 20 for maintenance', category: 'announcement', isRead: true, time: '4d ago' },
];

const CATEGORY_FILTERS = ['All', 'Marks', 'Schedule', 'Courses', 'Internships'] as const;

export function Header({ user, onMenuClick, onNavigate }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('All');
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotifClick = (notif: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    if (notif.link && onNavigate) {
      onNavigate(notif.link);
      setNotifOpen(false);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Marks') return n.category === 'marks';
    if (filter === 'Schedule') return n.category === 'schedule';
    if (filter === 'Courses') return n.category === 'course';
    if (filter === 'Internships') return n.category === 'internship';
    return true;
  });

  if (!user) return null;

  return (
    <header className="h-14 sm:h-16 md:h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Mobile Menu */}
      <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
        <Menu size={18} />
      </button>

      {/* Stats */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
          <Gem size={14} className="sm:w-4 sm:h-4 text-primary" fill="currentColor" />
          <span className="font-black text-xs sm:text-sm md:text-base">{user.gems.toLocaleString()}</span>
        </div>
        <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
          <Flame size={14} className="sm:w-4 sm:h-4 text-warning" fill="currentColor" />
          <span className="font-black text-xs sm:text-sm md:text-base">{user.streak}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-lg sm:rounded-xl flex items-center justify-center relative group hover:border-primary/50 transition-colors"
          >
            <Bell size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-black text-destructive-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-primary" />
                  <span className="font-black text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-black rounded-full">{unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Category filters */}
              <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto scrollbar-hide">
                {CATEGORY_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 transition-all ${
                      filter === f ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground glass-card'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto">
                {filteredNotifs.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-bold text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  filteredNotifs.map((notif) => {
                    const cfg = CATEGORY_CONFIG[notif.category];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-0 ${
                          !notif.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                          <Icon size={14} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-xs">{notif.title}</p>
                            {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-muted-foreground text-[10px] mt-1 font-bold">{notif.time}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="hidden sm:block w-10 h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl gradient-primary p-0.5 shadow-lg">
          <div className="w-full h-full rounded-[0.4rem] sm:rounded-[0.6rem] bg-card overflow-hidden flex items-center justify-center">
            <span className="font-black text-base sm:text-lg gradient-text">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
