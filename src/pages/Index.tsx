import { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { FreeCoursesSection } from '@/components/landing/FreeCoursesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { Dashboard } from '@/components/dashboard/Dashboard';
import type { User } from '@/lib/constants';

const Index = () => {
  const [user, setUser] = useState<User>(null);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'signup',
  });

  const handleAuth = (newUser: User) => {
    setUser(newUser);
    setAuthModal({ open: false, mode: 'signup' });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show dashboard if logged in
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar 
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
      />
      
      <HeroSection
        onGetStarted={() => setAuthModal({ open: true, mode: 'signup' })}
        onExploreCourses={() => {
          document.getElementById('free-courses')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <StatsSection />
      <PartnersSection />
      <div id="free-courses">
        <FreeCoursesSection onPreviewCourse={(id) => console.log('Preview:', id)} />
      </div>
      <HowItWorksSection />
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
        onAuth={handleAuth}
        initialMode={authModal.mode}
      />
    </div>
  );
};

export default Index;
