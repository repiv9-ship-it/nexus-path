import { LogOut, Zap, X, Building2, ChevronDown, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  studentNav, uniStudentNav, independentProfessorNav, uniProfessorNav,
  uniAdminNav, superAdminNav,
  type ViewType, type NavSection,
} from '@/lib/navigation';

interface MobileSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole?: () => void;
}

function getNavSections(activeRole: string, hasUniversity: boolean): NavSection[] {
  switch (activeRole) {
    case 'super_admin': return superAdminNav;
    case 'admin': return uniAdminNav;
    case 'professor': return hasUniversity ? uniProfessorNav : independentProfessorNav;
    case 'university_student': return uniStudentNav;
    default: return studentNav;
  }
}

export function MobileSidebar({ currentView, onViewChange, isOpen, onClose, onSwitchRole }: MobileSidebarProps) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const sections = getNavSections(user.activeRole, !!user.university);

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-xl glow-primary">
              <Zap className="text-primary-foreground fill-primary-foreground" size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tighter italic">UNILINGO</h1>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center text-sidebar-muted hover:text-sidebar-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-3 px-3 py-2 bg-sidebar-accent rounded-xl">
          <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
          <p className="font-black text-sm text-primary capitalize">{user.activeRole.replace('_', ' ')}</p>
        </div>

        {(user.activeRole === 'university_student' || user.activeRole === 'professor') && user.university && (
          <button className="mb-3 w-full px-3 py-2 bg-sidebar-accent rounded-xl flex items-center gap-2 hover:bg-sidebar-accent/80 transition-colors text-left">
            <Building2 size={14} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">University</p>
              <p className="font-bold text-xs truncate">{user.university}</p>
            </div>
            <ChevronDown size={14} className="text-sidebar-muted shrink-0" />
          </button>
        )}

        <nav className="flex-1 space-y-0.5">
          {sections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <div className="pt-4 pb-1.5">
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-px bg-sidebar-border" />
                    <span className="text-[10px] font-black text-sidebar-muted uppercase tracking-widest flex items-center gap-1">
                      {section.titleIcon && <section.titleIcon size={10} />} {section.title}
                    </span>
                    <div className="flex-1 h-px bg-sidebar-border" />
                  </div>
                </div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                    currentView === item.id
                      ? 'gradient-primary text-primary-foreground shadow-xl'
                      : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon size={17} className={currentView === item.id ? 'text-primary-foreground' : 'group-hover:text-primary'} />
                  <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="pt-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-xs truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-muted">{user.university || 'Free Learner'}</p>
            </div>
          </div>
          {onSwitchRole && user.roles.length > 1 && (
            <button
              onClick={() => { onSwitchRole(); onClose(); }}
              className="w-full flex items-center gap-2 text-sidebar-muted hover:text-primary font-bold px-3 py-2 transition-colors text-xs bg-sidebar-accent rounded-lg"
            >
              <ArrowLeftRight size={14} /> Switch Account
            </button>
          )}
        </div>

        <button onClick={signOut} className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-bold p-3 transition-colors text-sm mt-2">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>
    </>
  );
}
