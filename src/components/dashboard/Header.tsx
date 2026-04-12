import { useState, useRef, useEffect } from 'react';
import { Gem, Flame, Bell, Menu, BookOpen, BarChart3, Calendar, Briefcase, AlertTriangle, Megaphone, X, CheckCheck, Users, CreditCard, Building2, UserPlus, TrendingUp, Headphones } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '@/hooks/useAuth';
import type { ViewType } from '@/lib/navigation';
import { NOTIFICATION_CATEGORIES_BY_ROLE } from '@/lib/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
  onNavigate?: (view: ViewType) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  isRead: boolean;
  link?: ViewType;
  time: string;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  course: BookOpen, Courses: BookOpen,
  marks: BarChart3, Marks: BarChart3,
  schedule: Calendar, Schedule: Calendar,
  internship: Briefcase, Internships: Briefcase,
  attendance: AlertTriangle,
  announcement: Megaphone, Announcements: Megaphone,
  Students: Users,
  Payments: CreditCard,
  Universities: Building2,
  Tickets: Headphones,
  Revenue: TrendingUp,
  Requests: UserPlus,
  Admin: AlertTriangle,
  Promotions: Gem,
  Exams: BarChart3,
};

export function Header({ onMenuClick, onNavigate }: HeaderProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const panelRef = useRef<HTMLDivElement>(null);

  const activeRole = user?.activeRole || 'student';
  const categories = NOTIFICATION_CATEGORIES_BY_ROLE[activeRole] || ['All'];

  // TODO: Fetch real notifications from DB
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
    return n.category === filter;
  });

  if (!user) return null;

  const showGamification = activeRole === 'student' || activeRole === 'university_student';

  return (
    <header className="h-16 sm:h-18 md:h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <button onClick={onMenuClick} className="lg:hidden w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 sm:gap-4">
        {showGamification && (
          <>
            <div className="glass-card px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2">
              <Gem size={16} className="text-primary" fill="currentColor" />
              <span className="font-bold text-sm">0</span>
            </div>
            <div className="glass-card px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2">
              <Flame size={16} className="text-warning" fill="currentColor" />
              <span className="font-bold text-sm">0</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />

        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 glass-card rounded-xl flex items-center justify-center relative group hover:border-primary/50 transition-colors"
          >
            <Bell size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-[11px] font-bold text-destructive-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-primary" />
                  <span className="font-bold text-sm">Notifications</span>
                </div>
                <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="flex gap-1.5 px-4 py-2.5 border-b border-border overflow-x-auto scrollbar-hide">
                {categories.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      filter === f ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground glass-card'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {filteredNotifs.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  filteredNotifs.map((notif) => {
                    const IconComp = CATEGORY_ICON_MAP[notif.category] || Bell;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-0 ${
                          !notif.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/10">
                          <IconComp size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{notif.title}</p>
                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-muted-foreground text-xs mt-1">{notif.time}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <ProfileDropdown />
      </div>
    </header>
  );
}
