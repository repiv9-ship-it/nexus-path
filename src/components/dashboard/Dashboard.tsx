import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import { RoleSwitcher } from './RoleSwitcher';
import { SupportChatBubble } from './SupportChatBubble';
import { HomeView } from './views/HomeView';
import { NexusHub } from './views/NexusHub';
import { SpellbookLibrary } from './views/SpellbookLibrary';
import { CoursePath } from './views/CoursePath';
import { LevelContent } from './views/LevelContent';
import { SubscriptionPage } from './views/SubscriptionPage';
import { Achievements } from './views/Achievements';
import { MarksSection } from './views/MarksSection';
import { ApplicationWizard } from './views/ApplicationWizard';
import { UserInvitations } from './views/UniversityInvitations';
import { ProfessorDashboard } from './views/professor/ProfessorDashboard';
import { UniversityDashboard } from './views/university/UniversityDashboard';
import { SuperAdminDashboard } from './views/superadmin/SuperAdminDashboard';
import { UniHomeView } from './views/university/UniHomeView';
import { UniCoursesView } from './views/university/UniCoursesView';
import { UniMarksView } from './views/university/UniMarksView';
import { ScheduleView } from './views/university/ScheduleView';
import { AcademicCenterView } from './views/university/AcademicCenterView';
import { useAuth } from '@/hooks/useAuth';
import type { ViewType } from '@/lib/navigation';

// Map DB role names to view defaults
function getDefaultView(activeRole: string, hasUniversity: boolean): ViewType {
  switch (activeRole) {
    case 'professor': return hasUniversity ? 'professor' : 'home';
    case 'admin': return 'university';
    case 'university_student': return 'uni_home';
    case 'super_admin': return 'super_admin';
    default: return 'home';
  }
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

export function Dashboard() {
  const { user, signOut, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [applicationWizard, setApplicationWizard] = useState<'professor' | 'university' | null>(null);

  const [view, setView] = useState<ViewType>(
    getDefaultView(user?.activeRole || 'student', !!user?.university)
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    setSelectedCourse(null);
    setActiveLevel(null);
    setMobileMenuOpen(false);
  };

  const handleSwitchRole = (role: string) => {
    switchRole(role);
    setRoleSwitcherOpen(false);
    // Reset view to default for the new role
    setView(getDefaultView(role, !!user?.university));
  };

  const activeRole = user?.activeRole || 'student';

  const showSupportChat = activeRole === 'student' || 
    (activeRole === 'professor' && !user?.university) ||
    view === 'home';

  const renderContent = () => {
    if (activeLevel) return <LevelContent level={activeLevel} onBack={() => setActiveLevel(null)} />;
    if (selectedCourse) return <CoursePath course={selectedCourse} onSelectLevel={setActiveLevel} onBack={() => setSelectedCourse(null)} />;

    switch (view) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleViewChange}
            onApplyProfessor={() => setApplicationWizard('professor')}
            onApplyUniversity={() => setApplicationWizard('university')}
          />
        );
      case 'my-courses':
        return <SpellbookLibrary onSelectCourse={setSelectedCourse} />;
      case 'explore':
        return <NexusHub />;
      case 'badges':
      case 'achievements':
        return <Achievements />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'invitations' as ViewType:
        return <UserInvitations />;

      // University student views
      case 'uni_home': return <UniHomeView onNavigate={handleViewChange} />;
      case 'uni_courses': return <UniCoursesView />;
      case 'uni_marks': return <UniMarksView />;
      case 'schedule': return <ScheduleView />;
      case 'academic_center': return <AcademicCenterView />;

      // Professor views (independent)
      case 'prof_my_courses': return <ProfessorDashboard activeSection="prof_courses" />;
      case 'prof_public_profile': return <ProfessorDashboard activeSection="prof_public_profile" />;
      case 'prof_earnings': return <ProfessorDashboard activeSection="prof_payments" />;

      // Professor views (university)
      case 'professor':
      case 'prof_sessions':
      case 'prof_attendance':
      case 'prof_courses':
      case 'prof_schedule':
      case 'prof_payments':
      case 'prof_messages':
      case 'prof_salary':
      case 'prof_meetings':
        return <ProfessorDashboard activeSection={view} />;

      // University admin views
      case 'university':
      case 'uni_classes':
      case 'uni_finance':
      case 'uni_announcements':
      case 'uni_exams':
      case 'uni_stages':
      case 'uni_documents':
      case 'uni_reports':
      case 'uni_students':
      case 'uni_professors':
      case 'uni_salaries':
      case 'uni_certifications':
      case 'uni_modules':
      case 'uni_employees':
        return <UniversityDashboard activeSection={view} />;

      // Super Admin views
      case 'super_admin':
      case 'sa_universities':
      case 'sa_courses':
      case 'sa_analytics':
      case 'sa_support':
      case 'sa_cms':
      case 'sa_requests':
      case 'sa_users':
        return <SuperAdminDashboard activeSection={view} />;

      case 'marks': return <MarksSection />;
      case 'courses': return <SpellbookLibrary onSelectCourse={setSelectedCourse} />;
      case 'nexus': return <NexusHub />;
      case 'dashboard': return <HomeView onNavigate={handleViewChange} />;

      default: return <HomeView onNavigate={handleViewChange} />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        currentView={view}
        onViewChange={handleViewChange}
        onSwitchRole={() => setRoleSwitcherOpen(true)}
      />

      <MobileSidebar
        currentView={view}
        onViewChange={handleViewChange}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSwitchRole={() => setRoleSwitcherOpen(true)}
      />

      <main className="lg:ml-72 min-h-screen relative pb-12 sm:pb-20">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onNavigate={handleViewChange}
        />
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <RoleSwitcher
        isOpen={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
        onSwitchRole={handleSwitchRole}
      />

      {applicationWizard && (
        <ApplicationWizard
          type={applicationWizard}
          onClose={() => setApplicationWizard(null)}
        />
      )}

      {showSupportChat && <SupportChatBubble />}
    </div>
  );
}
