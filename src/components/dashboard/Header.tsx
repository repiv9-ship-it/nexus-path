import { Gem, Flame, Bell } from 'lucide-react';
import type { User } from '@/lib/constants';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  if (!user) return null;

  return (
    <header className="h-24 px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3">
          <Gem size={20} className="text-primary" fill="currentColor" />
          <span className="font-black text-lg">{user.gems.toLocaleString()}</span>
        </div>
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3">
          <Flame size={20} className="text-warning" fill="currentColor" />
          <span className="font-black text-lg">{user.streak}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center relative group hover:border-primary transition-colors">
          <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-black text-primary-foreground flex items-center justify-center">3</span>
        </button>
        
        <div className="w-14 h-14 rounded-2xl gradient-primary p-0.5 shadow-xl">
          <div className="w-full h-full rounded-[0.8rem] bg-card overflow-hidden flex items-center justify-center">
            <span className="font-black text-xl gradient-text">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
