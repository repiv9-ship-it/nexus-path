import { 
  Home, BookOpen, Compass, Trophy, Crown, BarChart3, Users, Building2, 
  ClipboardList, Calendar, GraduationCap, Clock, DollarSign, MessageSquare, 
  Bell, FileText, TrendingUp, Settings, Briefcase, BadgeCheck, CreditCard, 
  QrCode, Shield, Layout, Headphones, UserPlus, Globe, Star
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ViewType =
  // Student views
  | 'home' | 'my-courses' | 'explore' | 'badges' | 'subscription'
  // University student exclusive
  | 'uni_home' | 'uni_courses' | 'uni_marks' | 'schedule' | 'academic_center'
  // Professor views (independent)
  | 'prof_home' | 'prof_my_courses' | 'prof_public_profile' | 'prof_earnings'
  // Professor views (university)
  | 'professor' | 'prof_sessions' | 'prof_courses' | 'prof_schedule' | 'prof_payments' | 'prof_messages' | 'prof_salary' | 'prof_meetings'
  // University admin views
  | 'university' | 'uni_classes' | 'uni_finance' | 'uni_announcements' | 'uni_exams' | 'uni_stages' | 'uni_documents' | 'uni_reports' | 'uni_certifications' | 'uni_salaries' | 'uni_modules' | 'uni_employees'
  // Super Admin views
  | 'super_admin' | 'sa_universities' | 'sa_courses' | 'sa_analytics' | 'sa_support' | 'sa_cms' | 'sa_requests' | 'sa_users'
  // Legacy compat
  | 'nexus' | 'marks' | 'dashboard' | 'courses' | 'achievements'
  | 'prof_attendance' | 'uni_students' | 'uni_professors';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  titleIcon?: LucideIcon;
  items: NavItem[];
}

// ─── Student (free learner) ───
export const studentNav: NavSection[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'my-courses', label: 'My Courses', icon: BookOpen },
      { id: 'explore', label: 'Explore', icon: Compass },
      { id: 'badges', label: 'Badges & Rewards', icon: Trophy },
      { id: 'subscription', label: 'Plans', icon: Crown },
    ],
  },
];

// ─── University Student ───
export const uniStudentNav: NavSection[] = [
  {
    title: 'University',
    titleIcon: GraduationCap,
    items: [
      { id: 'uni_home', label: 'University Home', icon: Building2 },
      { id: 'uni_courses', label: 'Courses', icon: ClipboardList },
      { id: 'uni_marks', label: 'Marks', icon: BarChart3 },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'academic_center', label: 'Academic Center', icon: GraduationCap },
    ],
  },
];

// ─── Independent Professor ───
export const independentProfessorNav: NavSection[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'prof_my_courses', label: 'My Courses', icon: BookOpen },
      { id: 'prof_public_profile', label: 'Public Profile', icon: Globe },
      { id: 'prof_earnings', label: 'Earnings', icon: DollarSign },
      { id: 'explore', label: 'Explore', icon: Compass },
    ],
  },
];

// ─── University Professor ───
export const uniProfessorNav: NavSection[] = [
  {
    title: 'University',
    titleIcon: Building2,
    items: [
      { id: 'professor', label: 'Overview', icon: BarChart3 },
      { id: 'prof_sessions', label: 'Sessions', icon: Calendar },
      { id: 'prof_courses', label: 'My Courses', icon: BookOpen },
      { id: 'prof_schedule', label: 'Schedule', icon: Clock },
      { id: 'prof_messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Personal',
    titleIcon: Settings,
    items: [
      { id: 'prof_salary', label: 'Salary', icon: DollarSign },
      { id: 'prof_meetings', label: 'Meetings', icon: Users },
    ],
  },
];

// ─── University Admin ───
export const uniAdminNav: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'university', label: 'Dashboard', icon: Building2 },
      { id: 'uni_classes', label: 'Classes', icon: Users },
    ],
  },
  {
    title: 'Management',
    titleIcon: Settings,
    items: [
      { id: 'uni_finance', label: 'Student Payments', icon: CreditCard },
      { id: 'uni_exams', label: 'Exams & QR', icon: QrCode },
      { id: 'uni_salaries', label: 'Professor Salaries', icon: DollarSign },
      { id: 'uni_certifications', label: 'Certifications', icon: BadgeCheck },
      { id: 'uni_announcements', label: 'Announcements', icon: Bell },
      { id: 'uni_stages', label: 'Internships', icon: Briefcase },
      { id: 'uni_documents', label: 'Requests', icon: FileText },
      { id: 'uni_reports', label: 'Reports', icon: TrendingUp },
    ],
  },
  {
    title: 'Admin',
    titleIcon: Shield,
    items: [
      { id: 'uni_modules', label: 'Module Visibility', icon: Layout },
      { id: 'uni_employees', label: 'Employees & Roles', icon: UserPlus },
    ],
  },
];

// ─── Super Admin ───
export const superAdminNav: NavSection[] = [
  {
    items: [
      { id: 'super_admin', label: 'Command Center', icon: Shield },
      { id: 'sa_requests', label: 'Requests & Tickets', icon: UserPlus },
      { id: 'sa_universities', label: 'Universities', icon: Building2 },
      { id: 'sa_courses', label: 'Course Governance', icon: BookOpen },
      { id: 'sa_users', label: 'User Management', icon: Users },
      { id: 'sa_analytics', label: 'Analytics & Revenue', icon: TrendingUp },
      { id: 'sa_support', label: 'Support Center', icon: Headphones },
      { id: 'sa_cms', label: 'Platform CMS', icon: Layout },
    ],
  },
];

// ─── Notification categories per role ───
export const NOTIFICATION_CATEGORIES_BY_ROLE: Record<string, string[]> = {
  student: ['All', 'Courses', 'Promotions'],
  university_student: ['All', 'Marks', 'Schedule', 'Courses', 'Internships', 'Announcements'],
  professor: ['All', 'Students', 'Schedule', 'Admin'],
  university_admin: ['All', 'Payments', 'Students', 'Exams', 'Requests'],
  super_admin: ['All', 'Universities', 'Tickets', 'Revenue', 'Requests'],
};
