import { Zap, Globe, Compass, Scroll, Crown, Shield, LogOut, BookOpen, Users, BarChart3, Building2, X, ClipboardList } from 'lucide-react';
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

const studentNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'dashboard', label: 'Quest Map', icon: Globe },
  { id: 'nexus', label: 'Nexus Hub', icon: Compass },
  { id: 'courses', label: 'Courses', icon: Scroll },
  { id: 'marks', label: 'Marks', icon: ClipboardList },
  { id: 'subscription', label: 'Power-Up', icon: Crown },
  { id: 'achievements', label: 'Armory', icon: Shield },
];

const professorNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'professor', label: 'Command Center', icon: BarChart3 },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'marks', label: 'Student Marks', icon: ClipboardList },
  { id: 'achievements', label: 'Armory', icon: Shield },
];

const universityNavItems: { id: ViewType; label: string; icon: typeof Globe }[] = [
  { id: 'university', label: 'Control Tower', icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: Globe },
  { id: 'courses', label: 'All Courses', icon: BookOpen },
  { id: 'marks', label: 'Marks', icon: ClipboardList },
  { id: 'nexus', label: 'Staff', icon: Users },
  { id: 'subscription', label: 'Billing', icon: Crown },
];

export function MobileSidebar({ user, currentView, onViewChange, onLogout, isOpen, onClose }: MobileSidebarProps) {
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
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 w-72 bg-sidebar z-50 text-sidebar-foreground p-5 flex flex-col shadow-2xl lg:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
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
    </>
  );
}
