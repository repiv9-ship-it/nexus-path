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
import { ROLES } from '@/lib/constants';
import type { User } from '@/lib/constants';
import type { ViewType } from '@/lib/navigation';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onSwitchUser?: (user: User) => void;
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

export function Dashboard({ user, onLogout, onSwitchUser }: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [applicationWizard, setApplicationWizard] = useState<'professor' | 'university' | null>(null);

  const getDefaultView = (): ViewType => {
    if (!user) return 'home';
    switch (user.role) {
      case ROLES.PROFESSOR: return user.university ? 'professor' : 'home';
      case ROLES.UNIVERSITY_ADMIN: return 'university';
      case ROLES.UNIVERSITY_STUDENT: return 'uni_home';
      case ROLES.SUPER_ADMIN: return 'super_admin';
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

  const handleSwitchRole = (newUser: User) => {
    if (onSwitchUser) onSwitchUser(newUser);
    setRoleSwitcherOpen(false);
  };

  // Show support chat for student, independent professor, and home
  const showSupportChat = user?.role === ROLES.STUDENT || 
    (user?.role === ROLES.PROFESSOR && !user?.university) ||
    view === 'home';

  const renderContent = () => {
    if (activeLevel) return <LevelContent level={activeLevel} onBack={() => setActiveLevel(null)} />;
    if (selectedCourse) return <CoursePath course={selectedCourse} onSelectLevel={setActiveLevel} onBack={() => setSelectedCourse(null)} />;

    switch (view) {
      case 'home':
        return (
          <HomeView
            user={user}
            onNavigate={handleViewChange}
            onApplyProfessor={() => setApplicationWizard('professor')}
            onApplyUniversity={() => setApplicationWizard('university')}
          />
        );
      case 'my-courses':
        return <SpellbookLibrary onSelectCourse={setSelectedCourse} user={user} />;
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

      // Legacy
      case 'marks': return <MarksSection />;
      case 'courses': return <SpellbookLibrary onSelectCourse={setSelectedCourse} user={user} />;
      case 'nexus': return <NexusHub />;
      case 'dashboard': return <HomeView user={user} onNavigate={handleViewChange} />;

      default: return <HomeView user={user} onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
        onSwitchRole={() => setRoleSwitcherOpen(true)}
      />

      <MobileSidebar
        user={user}
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={onLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSwitchRole={() => setRoleSwitcherOpen(true)}
      />

      <main className="lg:ml-72 min-h-screen relative pb-12 sm:pb-20">
        <Header
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
          onNavigate={handleViewChange}
          onLogout={onLogout}
        />
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {user && (
        <RoleSwitcher
          isOpen={roleSwitcherOpen}
          onClose={() => setRoleSwitcherOpen(false)}
          currentUser={user}
          onSwitchRole={handleSwitchRole}
        />
      )}

      {/* Application Wizard */}
      {applicationWizard && (
        <ApplicationWizard
          type={applicationWizard}
          onClose={() => setApplicationWizard(null)}
        />
      )}

      {/* Support Chat (only for student / independent prof / home) */}
      {showSupportChat && <SupportChatBubble />}
    </div>
  );
}
