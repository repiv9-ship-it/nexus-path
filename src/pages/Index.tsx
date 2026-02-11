import { useState, useMemo } from 'react';
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
import { ALL_COURSES, POPULAR_COURSES, NEWEST_COURSES, RECOMMENDED_COURSES, FREE_COURSES } from '@/lib/constants';
import type { User } from '@/lib/constants';

const Index = () => {
  const [user, setUser] = useState<User>(null);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'signup',
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAuth = (newUser: User) => {
    setUser(newUser);
    setAuthModal({ open: false, mode: 'signup' });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredCourses = useMemo(() => {
    let courses = ALL_COURSES;
    if (selectedCategory !== 'All') {
      courses = courses.filter(c => c.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return courses;
  }, [selectedCategory, searchQuery]);

  const isFiltering = selectedCategory !== 'All' || searchQuery.length > 0;

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
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
          setSearchQuery(q);
          document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div id="courses">
        <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {isFiltering ? (
        <CourseSection
          title={searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
          subtitle={`${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
          courses={filteredCourses}
          onPreviewCourse={(id) => console.log('Preview:', id)}
        />
      ) : (
        <>
          <CourseSection
            title="🔥 Most Popular"
            subtitle="Top-rated courses loved by thousands of students"
            courses={POPULAR_COURSES}
            onPreviewCourse={(id) => console.log('Preview:', id)}
            onViewAll={() => {}}
          />
          <div className="border-t border-border/50" />
          <CourseSection
            title="🆕 Newest Courses"
            subtitle="Just launched — be among the first to enroll"
            courses={NEWEST_COURSES}
            onPreviewCourse={(id) => console.log('Preview:', id)}
            onViewAll={() => {}}
          />
          <div className="border-t border-border/50" />
          <CourseSection
            title="🎯 Recommended for You"
            subtitle="Curated picks based on trending topics"
            courses={RECOMMENDED_COURSES}
            onPreviewCourse={(id) => console.log('Preview:', id)}
            onViewAll={() => {}}
          />
          <div className="border-t border-border/50" />
          <CourseSection
            title="🎓 Free Courses"
            subtitle="Start learning today — completely free"
            courses={FREE_COURSES}
            onPreviewCourse={(id) => console.log('Preview:', id)}
            onViewAll={() => {}}
          />
        </>
      )}

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
