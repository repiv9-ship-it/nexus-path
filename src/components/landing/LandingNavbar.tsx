import { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingNavbarProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function LandingNavbar({ onLogin, onSignUp }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-xl sm:rounded-2xl px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-primary-foreground fill-primary-foreground" size={18} />
            </div>
            <span className="font-black text-lg md:text-xl tracking-tighter italic hidden sm:block">
              UNILINGO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#courses" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </a>
            <a href="#how-it-works" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              onClick={onLogin}
              className="hidden sm:inline-flex font-bold text-sm"
            >
              Login
            </Button>
            <Button
              onClick={onSignUp}
              className="gradient-primary text-primary-foreground font-bold rounded-lg sm:rounded-xl px-3 sm:px-6 text-sm"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Sign Up</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-card rounded-xl p-3 space-y-1 animate-fade-in">
            <a 
              href="#courses" 
              className="block py-2.5 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </a>
            <a 
              href="#how-it-works" 
              className="block py-2.5 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="block py-2.5 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <Button
              variant="ghost"
              onClick={() => { onLogin(); setMobileMenuOpen(false); }}
              className="w-full justify-start font-bold text-sm"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
