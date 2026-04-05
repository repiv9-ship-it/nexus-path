import { useState } from 'react';
import { User, Building2, GraduationCap, Shield, Zap, ArrowLeftRight, Plus, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import type { User as UserType } from '@/lib/constants';

interface RoleSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onSwitchRole: (user: UserType) => void;
}

interface MockAccount {
  id: string;
  name: string;
  role: string;
  university?: string;
  xp: number;
  streak: number;
  gems: number;
  icon: typeof User;
  color: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  { id: 'student', name: 'Alex Student', role: ROLES.STUDENT, xp: 1240, streak: 12, gems: 350, icon: User, color: 'bg-primary/10 text-primary' },
  { id: 'uni-student', name: 'Alex UniStudent', role: ROLES.UNIVERSITY_STUDENT, university: 'ESPRIT', xp: 2400, streak: 25, gems: 780, icon: GraduationCap, color: 'bg-success/10 text-success' },
  { id: 'professor', name: 'Prof. Alex', role: ROLES.PROFESSOR, xp: 0, streak: 0, gems: 0, icon: Building2, color: 'bg-warning/10 text-warning' },
  { id: 'uni-professor', name: 'Prof. Alex (ESPRIT)', role: ROLES.PROFESSOR, university: 'ESPRIT', xp: 0, streak: 0, gems: 0, icon: Building2, color: 'bg-secondary/10 text-secondary' },
  { id: 'admin', name: 'Admin ESPRIT', role: ROLES.UNIVERSITY_ADMIN, university: 'ESPRIT', xp: 0, streak: 0, gems: 0, icon: Shield, color: 'bg-destructive/10 text-destructive' },
  { id: 'super', name: 'Super Admin', role: ROLES.SUPER_ADMIN, xp: 0, streak: 0, gems: 0, icon: Zap, color: 'bg-primary/10 text-primary' },
];

export function RoleSwitcher({ isOpen, onClose, currentUser, onSwitchRole }: RoleSwitcherProps) {
  const handleSwitch = (account: MockAccount) => {
    onSwitchRole({
      name: account.name,
      role: account.role,
      xp: account.xp,
      streak: account.streak,
      gems: account.gems,
      university: account.university,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black text-lg">
            <ArrowLeftRight size={18} className="text-primary" />
            Switch Account
          </DialogTitle>
          <DialogDescription>
            Choose an account to switch to. Each account has its own role and data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {MOCK_ACCOUNTS.map((account) => {
            const isActive = currentUser?.role === account.role && currentUser?.university === account.university;
            const Icon = account.icon;
            return (
              <button
                key={account.id}
                onClick={() => handleSwitch(account)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 group ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${account.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.role}
                    {account.university && ` · ${account.university}`}
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

        <div className="border-t border-border pt-3 mt-2">
          <Button variant="outline" className="w-full font-bold text-sm" disabled>
            <Plus size={14} className="mr-2" /> Request New Role (Coming Soon)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
