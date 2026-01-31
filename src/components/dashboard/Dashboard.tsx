import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { QuestMap } from './views/QuestMap';
import { NexusHub } from './views/NexusHub';
import { SpellbookLibrary } from './views/SpellbookLibrary';
import { CoursePath } from './views/CoursePath';
import { LevelContent } from './views/LevelContent';
import { SubscriptionPage } from './views/SubscriptionPage';
import { Achievements } from './views/Achievements';
import type { User } from '@/lib/constants';

type ViewType = 'dashboard' | 'nexus' | 'courses' | 'subscription' | 'achievements';

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
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    setSelectedCourse(null);
    setActiveLevel(null);
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
      default:
        return <QuestMap user={user} onNavigate={handleViewChange} />;
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

      <main className="ml-72 min-h-screen relative pb-20">
        <Header user={user} />
        <div className="p-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
