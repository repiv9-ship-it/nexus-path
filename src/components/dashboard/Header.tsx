import { Gem, Flame, Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { User } from '@/lib/constants';

interface HeaderProps {
  user: User;
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  if (!user) return null;

  return (
    <header className="h-16 md:h-24 px-4 md:px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 rounded-xl bg-accent flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Stats */}
      <div className="flex items-center gap-2 md:gap-6">
        <div className="glass-card px-3 md:px-4 py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
          <Gem size={16} className="md:w-5 md:h-5 text-primary" fill="currentColor" />
          <span className="font-black text-sm md:text-lg">{user.gems.toLocaleString()}</span>
        </div>
        <div className="glass-card px-3 md:px-4 py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
          <Flame size={16} className="md:w-5 md:h-5 text-warning" fill="currentColor" />
          <span className="font-black text-sm md:text-lg">{user.streak}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-6">
        <ThemeToggle />
        
        <button className="w-10 h-10 md:w-12 md:h-12 glass-card rounded-xl md:rounded-2xl flex items-center justify-center relative group hover:border-primary transition-colors">
          <Bell size={18} className="md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-black text-primary-foreground flex items-center justify-center">3</span>
        </button>
        
        <div className="hidden sm:block w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl gradient-primary p-0.5 shadow-xl">
          <div className="w-full h-full rounded-[0.6rem] md:rounded-[0.8rem] bg-card overflow-hidden flex items-center justify-center">
            <span className="font-black text-lg md:text-xl gradient-text">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

