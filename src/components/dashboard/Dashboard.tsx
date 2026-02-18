import { useState } from 'react';
import { Sidebar, ViewType } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import { HomeView } from './views/HomeView';
import { NexusHub } from './views/NexusHub';
import { SpellbookLibrary } from './views/SpellbookLibrary';
import { CoursePath } from './views/CoursePath';
import { LevelContent } from './views/LevelContent';
import { SubscriptionPage } from './views/SubscriptionPage';
import { Achievements } from './views/Achievements';
import { MarksSection } from './views/MarksSection';
import { ProfessorDashboard } from './views/professor/ProfessorDashboard';
import { UniversityDashboard } from './views/university/UniversityDashboard';
import { UniCoursesView } from './views/university/UniCoursesView';
import { UniMarksView } from './views/university/UniMarksView';
import { ScheduleView } from './views/university/ScheduleView';
import { AcademicCenterView } from './views/university/AcademicCenterView';
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  color: string;
  icon: any;
  xp: number;
  progress: number;
}

interface Level {
  id: number;
  title: string;
  type: 'text' | 'video' | 'quiz';
  xp: number;
  status: string;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDefaultView = (): ViewType => {
    if (!user) return 'home';
    switch (user.role) {
      case ROLES.PROFESSOR: return 'professor';
      case ROLES.UNIVERSITY_ADMIN: return 'university';
      default: return 'home';
    }
  };

  const [view, setView] = useState<ViewType>(getDefaultView());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    setSelectedCourse(null);
    setActiveLevel(null);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    if (activeLevel) {
      return <LevelContent level={activeLevel} onBack={() => setActiveLevel(null)} />;
    }

    if (selectedCourse) {
      return (
        <CoursePath
          course={selectedCourse}
          onSelectLevel={setActiveLevel}
          onBack={() => setSelectedCourse(null)}
        />
      );
    }

    switch (view) {
      // New student views (clean labels)
      case 'home':
        return <HomeView user={user} onNavigate={handleViewChange} />;
      case 'my-courses':
        return <SpellbookLibrary onSelectCourse={setSelectedCourse} user={user} />;
      case 'explore':
        return <NexusHub />;
      case 'badges':
      case 'achievements':
        return <Achievements />;
      case 'subscription':
        return <SubscriptionPage />;

      // University-specific views
      case 'uni_courses':
        return <UniCoursesView />;
      case 'uni_marks':
        return <UniMarksView />;
      case 'schedule':
        return <ScheduleView />;
      case 'academic_center':
        return <AcademicCenterView />;

      // Legacy marks (professor context)
      case 'marks':
        return <MarksSection />;

      // Admin/Professor views (unchanged)
      case 'professor':
        return <ProfessorDashboard />;
      case 'university':
        return <UniversityDashboard />;

      // Legacy support
      case 'courses':
        return <SpellbookLibrary onSelectCourse={setSelectedCourse} user={user} />;
      case 'nexus':
        return <NexusHub />;
      case 'dashboard':
        return <HomeView user={user} onNavigate={handleViewChange} />;

      default:
        return <HomeView user={user} onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
      />

      <MobileSidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-72 min-h-screen relative pb-12 sm:pb-20">
        <Header
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
          onNavigate={handleViewChange}
        />
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
