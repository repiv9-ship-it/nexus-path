import { Home, BookOpen, Compass, Trophy, Crown, LogOut, BarChart3, Users, Building2, ClipboardList, Calendar, GraduationCap, Zap, Settings, DollarSign, MessageSquare, Clock, Bell, FileText, TrendingUp } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';

export type ViewType =
  // Student views
  | 'home' | 'my-courses' | 'explore' | 'badges' | 'subscription'
  // University student exclusive
  | 'uni_home' | 'uni_courses' | 'uni_marks' | 'schedule' | 'academic_center'
  // Professor views
  | 'professor' | 'prof_sessions' | 'prof_attendance' | 'prof_courses' | 'prof_schedule' | 'prof_payments' | 'prof_messages'
  // University admin views
  | 'university' | 'uni_classes' | 'uni_students' | 'uni_professors' | 'uni_salaries' | 'uni_announcements' | 'uni_documents' | 'uni_reports'
  // Legacy
  | 'nexus' | 'marks' | 'dashboard' | 'courses' | 'achievements';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
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

function NavButton({ item, isActive, onClick }: { item: { id: ViewType; label: string; icon: typeof Home }; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
        isActive
          ? 'gradient-primary text-primary-foreground shadow-lg'
          : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
      }`}
    >
      <item.icon size={18} className={isActive ? 'text-primary-foreground' : 'group-hover:text-primary'} />
      <span className="font-black text-sm tracking-tight">{item.label}</span>
    </button>
  );
}

export function Sidebar({ user, currentView, onViewChange, onLogout }: SidebarProps) {
  const isUniStudent = user?.role === ROLES.UNIVERSITY_STUDENT;
  const isProfessor = user?.role === ROLES.PROFESSOR;
  const isUniAdmin = user?.role === ROLES.UNIVERSITY_ADMIN;

  const getNavItems = () => {
    if (isProfessor) return { main: professorNavItems, uni: [] };
    if (isUniAdmin) return { main: universityNavItems, uni: [] };
    if (isUniStudent) return { main: uniStudentMainNavItems, uni: uniStudentUniNavItems };
    return { main: studentNavItems, uni: [] };
  };

  const { main: mainNavItems, uni: uniNavItems } = getNavItems();

  return (
    <aside className="w-64 lg:w-72 bg-sidebar h-screen fixed left-0 top-0 z-50 text-sidebar-foreground p-4 lg:p-6 flex flex-col shadow-2xl transform transition-transform lg:translate-x-0 -translate-x-full lg:block hidden overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 lg:mb-10">
        <div className="w-10 h-10 lg:w-11 lg:h-11 gradient-primary rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl glow-primary">
          <Zap className="text-primary-foreground fill-primary-foreground" size={18} />
        </div>
        <h1 className="font-black text-xl tracking-tighter italic">UNILINGO</h1>
      </div>

      {/* Role Badge */}
      {user && (
        <div className="mb-4 lg:mb-6 px-3 py-2 bg-sidebar-accent rounded-xl">
          <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
          <p className="font-black text-sm text-primary">{user.role}</p>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={currentView === item.id}
            onClick={() => onViewChange(item.id)}
          />
        ))}

        {/* University Section Separator */}
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
              <NavButton
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                onClick={() => onViewChange(item.id)}
              />
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
              <p className="font-black text-sm truncate">{user.name}</p>
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
  );
}
