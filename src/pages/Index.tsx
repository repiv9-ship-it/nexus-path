import { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CategoryBar } from '@/components/landing/CategoryBar';
import { CourseSection } from '@/components/landing/CourseSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { Zap } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'signup',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center glow-primary animate-pulse">
            <Zap className="text-primary-foreground fill-primary-foreground" size={28} />
          </div>
          <p className="text-muted-foreground font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
      />

      <HeroSection
        onGetStarted={() => setAuthModal({ open: true, mode: 'signup' })}
        onExploreCourses={() => {
          document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSearch={(q) => {
          document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div id="courses">
        <CategoryBar selected="All" onSelect={() => {}} />
      </div>

      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <CTASection
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
      />
      <Footer />

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialMode={authModal.mode}
      />
    </div>
  );
};

export default Index;
