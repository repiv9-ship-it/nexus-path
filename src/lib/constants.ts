import { Ghost, Zap, Crown } from 'lucide-react';

export const ROLES = {
  GUEST: 'Wanderer',
  STUDENT: 'Student',
  UNIVERSITY_STUDENT: 'University Student',
  PROFESSOR: 'Architect',
  UNIVERSITY_ADMIN: 'Overlord',
  ADMIN: 'Supreme',
  SUPER_ADMIN: 'Super Admin',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const CATEGORIES = [
  'All', 'Computer Science', 'Data Science', 'Business', 'Design', 'Mathematics', 'Engineering', 'Medicine', 'Languages'
] as const;

export const SUBSCRIPTION_TIERS = [
  { name: 'Wanderer', price: 'Free', features: ['3 Daily Lessons', 'Global Chat Access', 'Public Guilds'], icon: Ghost, popular: false },
  { name: 'Vanguard', price: '$9.99', features: ['Unlimited Energy', 'Exclusive Badges', 'Private Guilds', 'Offline Mode'], icon: Zap, popular: true },
  { name: 'Guild Master', price: '$24.99', features: ['All Vanguard Perks', 'Create Your Own Guild', '1-on-1 Mentorship', 'Early Beta Access'], icon: Crown, popular: false },
] as const;

export const FIELDS = [
  'Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business', 'Medicine', 'Law', 'Arts',
] as const;

export const LEVELS = ['L1', 'L2', 'L3', 'M1', 'M2', 'PhD'] as const;
