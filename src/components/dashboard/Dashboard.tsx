import { useState } from 'react';
import { Sidebar, ViewType } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import { QuestMap } from './views/QuestMap';
import { NexusHub } from './views/NexusHub';
import { SpellbookLibrary } from './views/SpellbookLibrary';
import { CoursePath } from './views/CoursePath';
import { LevelContent } from './views/LevelContent';
import { SubscriptionPage } from './views/SubscriptionPage';
import { Achievements } from './views/Achievements';
import { ProfessorDashboard } from './views/professor/ProfessorDashboard';
import { UniversityDashboard } from './views/university/UniversityDashboard';
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
    if (!user) return 'dashboard';
    switch (user.role) {
      case ROLES.PROFESSOR:
        return 'professor';
      case ROLES.UNIVERSITY_ADMIN:
        return 'university';
      default:
        return 'dashboard';
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
      case 'dashboard':
        return <QuestMap user={user} onNavigate={handleViewChange} />;
      case 'nexus':
        return <NexusHub />;
      case 'courses':
        return <SpellbookLibrary onSelectCourse={setSelectedCourse} />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'achievements':
        return <Achievements />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'university':
        return <UniversityDashboard />;
      default:
        return <QuestMap user={user} onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-72 min-h-screen relative pb-12 sm:pb-20">
        <Header user={user} onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
