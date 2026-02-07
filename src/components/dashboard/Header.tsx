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
    <header className="h-14 sm:h-16 md:h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-lg bg-muted flex items-center justify-center"
      >
        <Menu size={18} />
      </button>

      {/* Stats */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
          <Gem size={14} className="sm:w-4 sm:h-4 text-primary" fill="currentColor" />
          <span className="font-black text-xs sm:text-sm md:text-base">{user.gems.toLocaleString()}</span>
        </div>
        <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
          <Flame size={14} className="sm:w-4 sm:h-4 text-warning" fill="currentColor" />
          <span className="font-black text-xs sm:text-sm md:text-base">{user.streak}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <ThemeToggle />
        
        <button className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-lg sm:rounded-xl flex items-center justify-center relative group hover:border-primary/50 transition-colors">
          <Bell size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-black text-primary-foreground flex items-center justify-center">3</span>
        </button>
        
        <div className="hidden sm:block w-10 h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl gradient-primary p-0.5 shadow-lg">
          <div className="w-full h-full rounded-[0.4rem] sm:rounded-[0.6rem] bg-card overflow-hidden flex items-center justify-center">
            <span className="font-black text-base sm:text-lg gradient-text">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
