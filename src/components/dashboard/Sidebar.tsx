import { Zap, Globe, Compass, Scroll, Crown, Shield, LogOut, BookOpen, Users, BarChart3, Settings, Building2 } from 'lucide-react';
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
      case ROLES.PROFESSOR:
        return professorNavItems;
      case ROLES.UNIVERSITY_ADMIN:
        return universityNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-72 bg-sidebar h-screen fixed left-0 top-0 z-50 text-sidebar-foreground p-6 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.2)]">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-xl glow-primary">
          <Zap className="text-primary-foreground fill-primary-foreground" size={24} />
        </div>
        <h1 className="font-black text-2xl tracking-tighter italic">UNILINGO</h1>
      </div>

      {/* Role Badge */}
      {user && (
        <div className="mb-6 px-4 py-2 bg-sidebar-accent rounded-xl">
          <p className="text-xs font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
          <p className="font-black text-primary">{user.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
              currentView === item.id 
                ? 'gradient-primary text-primary-foreground shadow-xl' 
                : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-primary-foreground' : 'group-hover:text-primary'} />
            <span className="font-black tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      {user && (
        <div className="pt-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{user.name}</p>
              <p className="text-xs text-sidebar-muted">{user.university || 'Free User'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-bold p-4 transition-colors"
      >
        <LogOut size={20} /> Sign Off
      </button>
    </aside>
  );
}
