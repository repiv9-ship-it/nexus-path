import { LogOut, Zap, GraduationCap, ChevronDown, Building2, ArrowLeftRight } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';
import {
  studentNav, uniStudentNav, independentProfessorNav, uniProfessorNav,
  uniAdminNav, superAdminNav,
  type ViewType, type NavSection,
} from '@/lib/navigation';

// Re-export ViewType so existing imports keep working
export type { ViewType } from '@/lib/navigation';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  onSwitchRole?: () => void;
  selectedUniversity?: string;
}

function getNavSections(user: User): NavSection[] {
  if (!user) return studentNav;
  switch (user.role) {
    case ROLES.SUPER_ADMIN: return superAdminNav;
    case ROLES.UNIVERSITY_ADMIN: return uniAdminNav;
    case ROLES.PROFESSOR: return user.university ? uniProfessorNav : independentProfessorNav;
    case ROLES.UNIVERSITY_STUDENT: return uniStudentNav;
    default: return studentNav;
  }
}

function NavButton({ item, isActive, onClick }: { item: { id: ViewType; label: string; icon: any }; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
        isActive
          ? 'gradient-primary text-primary-foreground shadow-lg'
          : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
      }`}
    >
      <item.icon size={17} className={isActive ? 'text-primary-foreground' : 'group-hover:text-primary'} />
      <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
    </button>
  );
}

function SectionDivider({ title, icon: Icon }: { title: string; icon?: any }) {
  return (
    <div className="pt-4 pb-1.5">
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-px bg-sidebar-border" />
        <span className="text-[10px] font-black text-sidebar-muted uppercase tracking-widest flex items-center gap-1">
          {Icon && <Icon size={10} />} {title}
        </span>
        <div className="flex-1 h-px bg-sidebar-border" />
      </div>
    </div>
  );
}

export function Sidebar({ user, currentView, onViewChange, onLogout, onSwitchRole, selectedUniversity }: SidebarProps) {
  const sections = getNavSections(user);

  return (
    <aside className="w-64 lg:w-72 bg-sidebar h-screen fixed left-0 top-0 z-50 text-sidebar-foreground p-4 lg:p-5 flex flex-col shadow-2xl transform transition-transform lg:translate-x-0 -translate-x-full lg:block hidden overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-xl glow-primary">
          <Zap className="text-primary-foreground fill-primary-foreground" size={18} />
        </div>
        <h1 className="font-black text-xl tracking-tighter italic">UNILINGO</h1>
      </div>

      {/* Role Badge */}
      {user && (
        <div className="mb-3 px-3 py-2 bg-sidebar-accent rounded-xl">
          <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
          <p className="font-black text-sm text-primary">{user.role}</p>
        </div>
      )}

      {/* University selector for multi-uni users */}
      {(user?.role === ROLES.UNIVERSITY_STUDENT || user?.role === ROLES.PROFESSOR) && user?.university && (
        <button className="mb-3 w-full px-3 py-2 bg-sidebar-accent rounded-xl flex items-center gap-2 hover:bg-sidebar-accent/80 transition-colors text-left">
          <Building2 size={14} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest">University</p>
            <p className="font-bold text-xs truncate">{selectedUniversity || user.university}</p>
          </div>
          <ChevronDown size={14} className="text-sidebar-muted shrink-0" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && <SectionDivider title={section.title} icon={section.titleIcon} />}
            {section.items.map((item) => (
              <NavButton key={item.id} item={item} isActive={currentView === item.id} onClick={() => onViewChange(item.id)} />
            ))}
          </div>
        ))}
      </nav>

      {/* User Info + Role Switch */}
      {user && (
        <div className="pt-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-muted">{user.university || 'Free Learner'}</p>
            </div>
          </div>

          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              className="w-full flex items-center gap-2 text-sidebar-muted hover:text-primary font-bold px-3 py-2 transition-colors text-xs bg-sidebar-accent rounded-lg"
            >
              <ArrowLeftRight size={14} /> Switch Account
            </button>
          )}
        </div>
      )}

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-bold p-3 transition-colors text-sm mt-2"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}
