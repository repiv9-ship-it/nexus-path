import { User, Building2, GraduationCap, Shield, Zap, ArrowLeftRight, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

interface RoleSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: (role: string) => void;
}

const ROLE_META: Record<string, { label: string; icon: typeof User; color: string }> = {
  student: { label: 'Student', icon: User, color: 'bg-primary/10 text-primary' },
  university_student: { label: 'University Student', icon: GraduationCap, color: 'bg-success/10 text-success' },
  professor: { label: 'Professor', icon: Building2, color: 'bg-warning/10 text-warning' },
  admin: { label: 'University Admin', icon: Shield, color: 'bg-destructive/10 text-destructive' },
  super_admin: { label: 'Super Admin', icon: Zap, color: 'bg-primary/10 text-primary' },
};

export function RoleSwitcher({ isOpen, onClose, onSwitchRole }: RoleSwitcherProps) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black text-lg">
            <ArrowLeftRight size={18} className="text-primary" />
            Switch Account
          </DialogTitle>
          <DialogDescription>
            Choose which role to use. Your available roles are based on your account privileges.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {user.roles.map((role) => {
            const meta = ROLE_META[role] || { label: role, icon: User, color: 'bg-muted text-muted-foreground' };
            const isActive = user.activeRole === role;
            const Icon = meta.icon;
            return (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 group ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.university && (role === 'university_student' || role === 'professor' || role === 'admin')
                      ? user.university
                      : role === 'student' ? 'Free learner' : 'Platform access'}
                  </p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
