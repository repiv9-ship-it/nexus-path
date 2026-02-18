import { Home, BookOpen, Compass, Trophy, Crown, LogOut, BarChart3, Users, Building2, ClipboardList, Calendar, GraduationCap, Zap, Settings } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';

export type ViewType =
  // Student views (clean labels)
  | 'home' | 'my-courses' | 'explore' | 'badges' | 'subscription'
  // University student exclusive
  | 'uni_courses' | 'uni_marks' | 'schedule' | 'academic_center'
  // Professor/Admin (unchanged)
  | 'professor' | 'university'
  // Legacy (professor/admin navs)
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
  { id: 'uni_courses', label: 'Courses', icon: ClipboardList },
  { id: 'uni_marks', label: 'Marks', icon: BarChart3 },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'academic_center', label: 'Academic Center', icon: GraduationCap },
];

const professorNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'professor', label: 'Command Center', icon: BarChart3 },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'marks', label: 'Student Marks', icon: ClipboardList },
  { id: 'achievements', label: 'Armory', icon: Trophy },
];

const universityNavItems: { id: ViewType; label: string; icon: typeof Home }[] = [
  { id: 'university', label: 'Control Tower', icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'courses', label: 'All Courses', icon: BookOpen },
  { id: 'marks', label: 'Marks', icon: ClipboardList },
  { id: 'nexus', label: 'Staff', icon: Users },
  { id: 'subscription', label: 'Billing', icon: Crown },
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
