import { Zap, Globe, Compass, Scroll, Crown, Shield, LogOut, BookOpen, Users, BarChart3, Building2 } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';

export type ViewType = 'dashboard' | 'nexus' | 'courses' | 'subscription' | 'achievements' | 'professor' | 'university';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const studentNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'dashboard', label: 'Quest Map', icon: Globe },
  { id: 'nexus', label: 'Nexus Hub', icon: Compass },
  { id: 'courses', label: 'Spellbook', icon: Scroll },
  { id: 'subscription', label: 'Power-Up', icon: Crown },
  { id: 'achievements', label: 'Armory', icon: Shield },
];

const professorNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'professor', label: 'Command Center', icon: BarChart3 },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'achievements', label: 'Armory', icon: Shield },
];

const universityNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'university', label: 'Control Tower', icon: Building2 },
  { id: 'nexus', label: 'Staff', icon: Users },
  { id: 'courses', label: 'All Courses', icon: BookOpen },
  { id: 'subscription', label: 'Billing', icon: Crown },
];

export function Sidebar({ user, currentView, onViewChange, onLogout }: SidebarProps) {
  const getNavItems = () => {
    if (!user) return studentNavItems;
    switch (user.role) {
      case ROLES.PROFESSOR: return professorNavItems;
      case ROLES.UNIVERSITY_ADMIN: return universityNavItems;
      default: return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 lg:w-72 bg-sidebar h-screen fixed left-0 top-0 z-50 text-sidebar-foreground p-4 lg:p-6 flex flex-col shadow-2xl transform transition-transform lg:translate-x-0 -translate-x-full lg:block hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 lg:mb-10">
        <div className="w-10 h-10 lg:w-11 lg:h-11 gradient-primary rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl glow-primary">
          <Zap className="text-primary-foreground fill-primary-foreground" size={18} />
        </div>
        <h1 className="font-black text-xl tracking-tighter italic">UNILINGO</h1>
      </div>

      {/* Role Badge */}
      {user && (
        <div className="mb-4 lg:mb-6 px-3 py-2 bg-sidebar-accent rounded-lg lg:rounded-xl">
          <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
          <p className="font-black text-sm text-primary">{user.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg lg:rounded-xl transition-all group ${
              currentView === item.id 
                ? 'gradient-primary text-primary-foreground shadow-lg' 
                : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon size={18} className={currentView === item.id ? 'text-primary-foreground' : 'group-hover:text-primary'} />
            <span className="font-black text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
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
              <p className="text-[10px] text-sidebar-muted">{user.university || 'Free User'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-bold p-3 transition-colors text-sm"
      >
        <LogOut size={18} /> Sign Off
      </button>
    </aside>
  );
}
