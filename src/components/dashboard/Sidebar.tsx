import { LogOut, Zap, Building2, ChevronDown, ArrowLeftRight, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  studentNav, uniStudentNav, independentProfessorNav, uniProfessorNav,
  uniAdminNav, superAdminNav,
  type ViewType, type NavSection,
} from '@/lib/navigation';

export type { ViewType } from '@/lib/navigation';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
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
      <item.icon size={18} className={isActive ? 'text-primary-foreground' : 'group-hover:text-primary'} />
      <span className="font-semibold text-sm tracking-tight">{item.label}</span>
    </button>
  );
}

function SectionDivider({ title, icon: Icon }: { title: string; icon?: any }) {
  return (
    <div className="pt-4 pb-1.5">
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-px bg-sidebar-border" />
        <span className="text-[11px] font-bold text-sidebar-muted uppercase tracking-widest flex items-center gap-1">
          {Icon && <Icon size={11} />} {title}
        </span>
        <div className="flex-1 h-px bg-sidebar-border" />
      </div>
    </div>
  );
}

export function Sidebar({ currentView, onViewChange, onSwitchRole }: SidebarProps) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const sections = getNavSections(user.activeRole, !!user.university);
  const showInvitations = user.activeRole === 'student';

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
      <div className="mb-3 px-3 py-2.5 bg-sidebar-accent rounded-xl">
        <p className="text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest">Logged in as</p>
        <p className="font-bold text-sm text-primary mt-0.5 capitalize">{user.activeRole.replace('_', ' ')}</p>
      </div>

      {/* University selector */}
      {(user.activeRole === 'university_student' || user.activeRole === 'professor') && user.university && (
        <button className="mb-3 w-full px-3 py-2.5 bg-sidebar-accent rounded-xl flex items-center gap-2 hover:bg-sidebar-accent/80 transition-colors text-left">
          <Building2 size={15} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest">University</p>
            <p className="font-semibold text-sm truncate mt-0.5">{user.university}</p>
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

        {showInvitations && (
          <>
            <SectionDivider title="University" icon={Building2} />
            <NavButton
              item={{ id: 'invitations' as ViewType, label: 'Invitations', icon: Mail }}
              isActive={currentView === ('invitations' as ViewType)}
              onClick={() => onViewChange('invitations' as ViewType)}
            />
          </>
        )}
      </nav>

      {/* User Info + Role Switch */}
      <div className="pt-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{user.name}</p>
            <p className="text-xs text-sidebar-muted">{user.university || 'Free Learner'}</p>
          </div>
        </div>

        {onSwitchRole && user.roles.length > 1 && (
          <button
            onClick={onSwitchRole}
            className="w-full flex items-center gap-2 text-sidebar-muted hover:text-primary font-semibold px-3 py-2 transition-colors text-sm bg-sidebar-accent rounded-lg"
          >
            <ArrowLeftRight size={14} /> Switch Account
          </button>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="flex items-center gap-3 text-sidebar-muted hover:text-destructive font-semibold p-3 transition-colors text-sm mt-2"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}
