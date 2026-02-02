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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-primary-foreground fill-primary-foreground" size={20} />
            </div>
            <span className="font-black text-lg md:text-xl tracking-tighter italic hidden sm:block">
              UNILINGO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#free-courses" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </a>
            <a href="#testimonials" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              onClick={onLogin}
              className="hidden sm:inline-flex font-bold"
            >
              Login
            </Button>
            <Button
              onClick={onSignUp}
              className="gradient-primary text-primary-foreground font-bold rounded-xl px-4 md:px-6"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Sign Up</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-card rounded-2xl p-4 space-y-2 animate-fade-in">
            <a 
              href="#features" 
              className="block py-3 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#free-courses" 
              className="block py-3 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </a>
            <a 
              href="#testimonials" 
              className="block py-3 px-4 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <Button
              variant="ghost"
              onClick={() => { onLogin(); setMobileMenuOpen(false); }}
              className="w-full justify-start font-bold"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
