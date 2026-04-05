import { useState, useRef, useEffect } from 'react';
import { Gem, Flame, Bell, Menu, BookOpen, BarChart3, Calendar, Briefcase, AlertTriangle, Megaphone, X, CheckCheck, Users, CreditCard, Building2, UserPlus, TrendingUp, Headphones } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';
import type { ViewType } from '@/lib/navigation';
import { NOTIFICATION_CATEGORIES_BY_ROLE } from '@/lib/navigation';

interface HeaderProps {
  user: User;
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

function getNotificationsForRole(role: string): Notification[] {
  switch (role) {
    case ROLES.STUDENT:
      return [
        { id: '1', title: 'New Course Available', message: 'Machine Learning A-Z just launched with a 50% discount!', category: 'Courses', isRead: false, link: 'explore', time: '2h ago' },
        { id: '2', title: 'Achievement Unlocked', message: 'You earned the "Quick Learner" badge!', category: 'Promotions', isRead: false, link: 'badges', time: '1d ago' },
        { id: '3', title: 'Course Update', message: 'Your enrolled course "Python for AI" has new lessons', category: 'Courses', isRead: true, link: 'my-courses', time: '2d ago' },
      ];
    case ROLES.UNIVERSITY_STUDENT:
      return [
        { id: '1', title: 'Marks Published', message: 'Your Digital Ethics final exam marks are now available', category: 'Marks', isRead: false, link: 'uni_marks', time: '2h ago' },
        { id: '2', title: 'Schedule Updated', message: "Thursday's Algorithms class moved to Room 204", category: 'Schedule', isRead: false, link: 'schedule', time: '5h ago' },
        { id: '3', title: 'New Course Material', message: 'Prof. Lovelace uploaded Neural Networks Ch.8 slides', category: 'Courses', isRead: false, link: 'uni_courses', time: '1d ago' },
        { id: '4', title: 'Internship Opportunity', message: 'TechCorp is hiring interns — apply by Feb 28', category: 'Internships', isRead: true, link: 'academic_center', time: '2d ago' },
        { id: '5', title: 'Absence Warning', message: 'You have 2 unjustified absences in Data Structures.', category: 'Announcements', isRead: true, link: 'academic_center', time: '3d ago' },
      ];
    case ROLES.PROFESSOR:
      return [
        { id: '1', title: 'New Student Message', message: 'Alice Chen asked about TP 3 exercise', category: 'Students', isRead: false, link: 'prof_messages', time: '1h ago' },
        { id: '2', title: 'Schedule Change', message: 'Your Monday lecture moved to Amphi B', category: 'Schedule', isRead: false, link: 'prof_schedule', time: '3h ago' },
        { id: '3', title: 'Admin Notice', message: 'Department meeting rescheduled to March 22', category: 'Admin', isRead: true, time: '1d ago' },
      ];
    case ROLES.UNIVERSITY_ADMIN:
      return [
        { id: '1', title: 'Payment Received', message: 'Ines Bouaziz paid 2000 DT (Tranche 2)', category: 'Payments', isRead: false, link: 'uni_finance', time: '1h ago' },
        { id: '2', title: 'Document Request', message: 'Bob Smith requested an attendance certificate', category: 'Requests', isRead: false, link: 'uni_documents', time: '4h ago' },
        { id: '3', title: 'Exam Scheduled', message: 'Final exam for Data Structures confirmed', category: 'Exams', isRead: true, link: 'uni_exams', time: '1d ago' },
      ];
    case ROLES.SUPER_ADMIN:
      return [
        { id: '1', title: 'New University Request', message: 'ISG Tunis wants to join the platform', category: 'Universities', isRead: false, link: 'sa_requests', time: '30m ago' },
        { id: '2', title: 'Professor Promotion', message: 'John Doe requested instructor privileges', category: 'Requests', isRead: false, link: 'sa_requests', time: '2h ago' },
        { id: '3', title: 'Course Submission', message: 'New course "Intro to AI" awaiting review', category: 'Tickets', isRead: false, link: 'sa_courses', time: '5h ago' },
        { id: '4', title: 'Revenue Milestone', message: 'Monthly revenue exceeded 200K DT', category: 'Revenue', isRead: true, link: 'sa_analytics', time: '1d ago' },
      ];
    default:
      return [];
  }
}

function getRoleKey(role: string): string {
  switch (role) {
    case ROLES.STUDENT: return 'student';
    case ROLES.UNIVERSITY_STUDENT: return 'university_student';
    case ROLES.PROFESSOR: return 'professor';
    case ROLES.UNIVERSITY_ADMIN: return 'university_admin';
    case ROLES.SUPER_ADMIN: return 'super_admin';
    default: return 'student';
  }
}

export function Header({ user, onMenuClick, onNavigate }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) setNotifications(getNotificationsForRole(user.role));
  }, [user?.role]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const roleKey = user ? getRoleKey(user.role) : 'student';
  const categories = NOTIFICATION_CATEGORIES_BY_ROLE[roleKey] || ['All'];

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

  const showGamification = user.role === ROLES.STUDENT || user.role === ROLES.UNIVERSITY_STUDENT;

  return (
    <header className="h-14 sm:h-16 md:h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Mobile Menu */}
      <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
        <Menu size={18} />
      </button>

      {/* Stats — only for student roles */}
      <div className="flex items-center gap-2 sm:gap-4">
        {showGamification && (
          <>
            <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
              <Gem size={14} className="sm:w-4 sm:h-4 text-primary" fill="currentColor" />
              <span className="font-black text-xs sm:text-sm">{user.gems.toLocaleString()}</span>
            </div>
            <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
              <Flame size={14} className="sm:w-4 sm:h-4 text-warning" fill="currentColor" />
              <span className="font-black text-xs sm:text-sm">{user.streak}</span>
            </div>
          </>
        )}
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
                {categories.map(f => (
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
                    const IconComp = CATEGORY_ICON_MAP[notif.category] || Bell;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-0 ${
                          !notif.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/10">
                          <IconComp size={14} className="text-primary" />
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
