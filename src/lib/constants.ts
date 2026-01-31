import { Scroll, Zap, Shield, Sparkles, Rocket, Globe, Crown, Ghost, Lock } from 'lucide-react';

export const ROLES = {
  GUEST: 'Wanderer',
  STUDENT: 'Vanguard',
  PROFESSOR: 'Architect',
  ADMIN: 'Overlord',
} as const;

export const GUILDS = [
  { id: 'mit', name: 'MIT Tech-Nexus', location: 'Cambridge Sector', members: '12k', rating: 4.9, icon: 'M' },
  { id: 'stanford', name: 'Stanford Silicon Valley', location: 'Palo Alto Hub', members: '15k', rating: 4.8, icon: 'S' },
  { id: 'oxford', name: 'Oxford Spire', location: 'Old World Domain', members: '9k', rating: 4.7, icon: 'O' },
] as const;

export const GLOBAL_COURSES = [
  { id: 'quantum', title: 'Quantum Computing 101', guild: 'MIT Tech-Nexus', color: 'bg-blue-600', icon: Sparkles, xp: 8000 },
  { id: 'startup', title: 'Zero to One Startup', guild: 'Stanford Silicon Valley', color: 'bg-red-600', icon: Rocket, xp: 6500 },
] as const;

export const COURSES = [
  { id: 'algos', title: 'Advanced Algorithms', instructor: 'Dr. Turing', color: 'bg-primary', icon: Scroll, xp: 5000, progress: 45 },
  { id: 'neural', title: 'Neural Networks', instructor: 'Prof. Lovelace', color: 'bg-secondary', icon: Zap, xp: 3200, progress: 12 },
  { id: 'ethics', title: 'Digital Ethics', instructor: 'Master Sokrates', color: 'bg-success', icon: Shield, xp: 1500, progress: 0 },
] as const;

export const FREE_COURSES = [
  { id: 'intro-cs', title: 'Introduction to Computer Science', instructor: 'Dr. Ada', level: 'Beginner', students: 15000, rating: 4.8 },
  { id: 'web-basics', title: 'Web Development Fundamentals', instructor: 'Prof. Tim', level: 'Beginner', students: 12000, rating: 4.7 },
  { id: 'data-science', title: 'Data Science Essentials', instructor: 'Dr. Stats', level: 'Intermediate', students: 8500, rating: 4.6 },
] as const;

export const STATS = [
  { label: 'Students Enrolled', value: 50000, suffix: '+' },
  { label: 'Courses Available', value: 500, suffix: '+' },
  { label: 'Partner Universities', value: 120, suffix: '' },
  { label: 'XP Awarded', value: 10, suffix: 'M+' },
] as const;

export const PARTNERS = [
  { name: 'MIT', logo: 'M' },
  { name: 'Stanford', logo: 'S' },
  { name: 'Oxford', logo: 'O' },
  { name: 'Harvard', logo: 'H' },
  { name: 'Cambridge', logo: 'C' },
  { name: 'Yale', logo: 'Y' },
] as const;

export const SUBSCRIPTION_TIERS = [
  { 
    name: 'Wanderer', 
    price: 'Free', 
    features: ['3 Daily Lessons', 'Global Chat Access', 'Public Guilds'], 
    icon: Ghost, 
    popular: false 
  },
  { 
    name: 'Vanguard', 
    price: '$9.99', 
    features: ['Unlimited Energy', 'Exclusive Badges', 'Private Guilds', 'Offline Mode'], 
    icon: Zap, 
    popular: true 
  },
  { 
    name: 'Guild Master', 
    price: '$24.99', 
    features: ['All Vanguard Perks', 'Create Your Own Guild', '1-on-1 Mentorship', 'Early Beta Access'], 
    icon: Crown, 
    popular: false 
  },
] as const;

export type User = {
  name: string;
  role: typeof ROLES[keyof typeof ROLES];
  xp: number;
  streak: number;
  gems: number;
} | null;
