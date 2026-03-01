import { Home, BookOpen, Compass, Trophy, Crown, LogOut, BarChart3, Users, Building2, ClipboardList, Calendar, GraduationCap, Zap, X, DollarSign, MessageSquare, Clock, Bell, FileText, TrendingUp } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';
import type { ViewType } from './Sidebar';

interface MobileSidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const studentNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'badges', label: 'Badges & Rewards', icon: Trophy },
  { id: 'subscription', label: 'Plans', icon: Crown },
];

const uniStudentMainNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'badges', label: 'Badges & Rewards', icon: Trophy },
  { id: 'subscription', label: 'Plans', icon: Crown },
];

const uniStudentUniNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'uni_home', label: 'University Home', icon: Building2 },
  { id: 'uni_courses', label: 'Courses', icon: ClipboardList },
  { id: 'uni_marks', label: 'Marks', icon: BarChart3 },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'academic_center', label: 'Academic Center', icon: GraduationCap },
];

const professorNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'professor', label: 'Overview', icon: BarChart3 },
  { id: 'prof_sessions', label: 'Sessions', icon: Calendar },
  { id: 'prof_attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'prof_courses', label: 'My Courses', icon: BookOpen },
  { id: 'prof_schedule', label: 'Schedule', icon: Clock },
  { id: 'prof_payments', label: 'Payments', icon: DollarSign },
  { id: 'prof_messages', label: 'Messages', icon: MessageSquare },
];

const universityNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'university', label: 'Overview', icon: Building2 },
  { id: 'uni_classes', label: 'Classes', icon: Calendar },
  { id: 'uni_students', label: 'Students', icon: Users },
  { id: 'uni_professors', label: 'Professors', icon: GraduationCap },
  { id: 'uni_salaries', label: 'Salaries', icon: DollarSign },
  { id: 'uni_announcements', label: 'Announcements', icon: Bell },
  { id: 'uni_documents', label: 'Requests', icon: FileText },
  { id: 'uni_reports', label: 'Reports', icon: TrendingUp },
];

export function MobileSidebar({ user, currentView, onViewChange, onLogout, isOpen, onClose }: MobileSidebarProps) {
  const isUniStudent = user?.role === ROLES.UNIVERSITY_STUDENT;
  const isProfessor = user?.role === ROLES.PROFESSOR;
  const isUniAdmin = user?.role === ROLES.UNIVERSITY_ADMIN;

  const getNavData = () => {
    if (isProfessor) return { main: professorNavItems, uni: [] };
    if (isUniAdmin) return { main: universityNavItems, uni: [] };
    if (isUniStudent) return { main: uniStudentMainNavItems, uni: uniStudentUniNavItems };
    return { main: studentNavItems, uni: [] };
  };

  const { main: mainNavItems, uni: uniNavItems } = getNavData();

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-sidebar z-50 text-sidebar-foreground p-5 flex flex-col shadow-2xl lg:hidden transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-xl glow-primary">
              <Zap className="text-primary-foreground fill-primary-foreground" size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tighter italic">UNILINGO</h1>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center text-sidebar-muted hover:text-sidebar-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge */}
        {user && (
          <div className="mb-4 px-3 py-2 bg-sidebar-accent rounded-xl">
            <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
            <p className="font-black text-sm text-primary">{user.role}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                currentView === item.id
                  ? 'gradient-primary text-primary-foreground shadow-xl'
                  : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon size={18} className={currentView === item.id ? 'text-primary-foreground' : 'group-hover:text-primary'} />
              <span className="font-black text-sm tracking-tight">{item.label}</span>
            </button>
          ))}

          {uniNavItems.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <div className="flex items-center gap-2 px-2">
                  <div className="flex-1 h-px bg-sidebar-border" />
                  <span className="text-[10px] font-black text-sidebar-muted uppercase tracking-widest flex items-center gap-1">
                    <GraduationCap size={10} /> University
                  </span>
                  <div className="flex-1 h-px bg-sidebar-border" />
                </div>
              </div>
              {uniNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    currentView === item.id
                      ? 'gradient-primary text-primary-foreground shadow-xl'
                      : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon size={18} className={currentView === item.id ? 'text-primary-foreground' : 'group-hover:text-primary'} />
                  <span className="font-black text-sm tracking-tight">{item.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User Info */}
        {user && (
          <div className="pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs truncate">{user.name}</p>
                <p className="text-[10px] text-sidebar-muted">{user.university || 'Free Learner'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-bold p-3 transition-colors text-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>
    </>
  );
}
