import { Scroll, Zap, Shield, Sparkles, Rocket, Globe, Crown, Ghost, Lock } from 'lucide-react';

export const ROLES = {
  GUEST: 'Wanderer',
  STUDENT: 'Vanguard',
  PROFESSOR: 'Architect',
  UNIVERSITY_ADMIN: 'Overlord',
  ADMIN: 'Supreme',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

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

export const CATEGORIES = [
  'All', 'Computer Science', 'Data Science', 'Business', 'Design', 'Mathematics', 'Engineering', 'Medicine', 'Languages'
] as const;

export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  bestseller?: boolean;
  isNew?: boolean;
  hours: number;
  lectures: number;
}

export const ALL_COURSES: Course[] = [
  // Popular
  { id: 'cs50', title: 'The Complete Computer Science Bootcamp', instructor: 'Dr. Ada Lovelace', rating: 4.8, students: 42500, price: 0, level: 'Beginner', category: 'Computer Science', thumbnail: '', bestseller: true, hours: 52, lectures: 340 },
  { id: 'ml-101', title: 'Machine Learning A-Z: From Zero to Hero', instructor: 'Prof. Andrew Ng', rating: 4.9, students: 38200, price: 19.99, originalPrice: 89.99, level: 'Intermediate', category: 'Data Science', thumbnail: '', bestseller: true, hours: 44, lectures: 280 },
  { id: 'web-dev', title: 'Full-Stack Web Development 2025', instructor: 'Tim Berners-Lee Jr.', rating: 4.7, students: 31000, price: 24.99, originalPrice: 99.99, level: 'Beginner', category: 'Computer Science', thumbnail: '', hours: 63, lectures: 420 },
  { id: 'python', title: 'Python for Data Science & AI', instructor: 'Dr. Guido van R.', rating: 4.8, students: 28500, price: 14.99, originalPrice: 79.99, level: 'Beginner', category: 'Data Science', thumbnail: '', bestseller: true, hours: 38, lectures: 250 },
  { id: 'design-ux', title: 'UX/UI Design Masterclass', instructor: 'Sarah Chen', rating: 4.6, students: 19800, price: 29.99, originalPrice: 109.99, level: 'Intermediate', category: 'Design', thumbnail: '', hours: 32, lectures: 210 },
  // Newest
  { id: 'quantum-2', title: 'Quantum Computing Fundamentals', instructor: 'Dr. Quantum', rating: 4.5, students: 3200, price: 34.99, originalPrice: 119.99, level: 'Advanced', category: 'Computer Science', thumbnail: '', isNew: true, hours: 28, lectures: 180 },
  { id: 'ai-agents', title: 'Building AI Agents with LLMs', instructor: 'Prof. Transformer', rating: 4.7, students: 5100, price: 39.99, originalPrice: 129.99, level: 'Advanced', category: 'Data Science', thumbnail: '', isNew: true, hours: 22, lectures: 150 },
  { id: 'rust-prog', title: 'Systems Programming with Rust', instructor: 'Ferris Crabson', rating: 4.6, students: 4800, price: 19.99, originalPrice: 89.99, level: 'Intermediate', category: 'Computer Science', thumbnail: '', isNew: true, hours: 35, lectures: 230 },
  { id: 'biotech', title: 'Introduction to Biotechnology', instructor: 'Dr. Gene Splice', rating: 4.4, students: 2100, price: 0, level: 'Beginner', category: 'Medicine', thumbnail: '', isNew: true, hours: 18, lectures: 120 },
  { id: 'blockchain', title: 'Blockchain & Smart Contracts', instructor: 'Satoshi Jr.', rating: 4.3, students: 6700, price: 24.99, originalPrice: 94.99, level: 'Intermediate', category: 'Engineering', thumbnail: '', isNew: true, hours: 26, lectures: 170 },
  // Recommended
  { id: 'math-lin', title: 'Linear Algebra for Machine Learning', instructor: 'Prof. Eigenvalue', rating: 4.7, students: 14200, price: 0, level: 'Intermediate', category: 'Mathematics', thumbnail: '', hours: 24, lectures: 160 },
  { id: 'startup-101', title: 'Startup Masterclass: Idea to IPO', instructor: 'ElonUsk', rating: 4.5, students: 22300, price: 29.99, originalPrice: 99.99, level: 'Beginner', category: 'Business', thumbnail: '', hours: 30, lectures: 200 },
  { id: 'cyber-sec', title: 'Cybersecurity Essentials', instructor: 'Agent Shield', rating: 4.8, students: 17600, price: 19.99, originalPrice: 84.99, level: 'Beginner', category: 'Engineering', thumbnail: '', hours: 28, lectures: 190 },
  { id: 'german-a1', title: 'German for Beginners (A1-A2)', instructor: 'Frau Schmidt', rating: 4.6, students: 9400, price: 0, level: 'Beginner', category: 'Languages', thumbnail: '', hours: 20, lectures: 140 },
  { id: 'deep-learn', title: 'Deep Learning Specialization', instructor: 'Prof. Neural', rating: 4.9, students: 25600, price: 44.99, originalPrice: 149.99, level: 'Advanced', category: 'Data Science', thumbnail: '', bestseller: true, hours: 48, lectures: 310 },
];

export const FREE_COURSES = ALL_COURSES.filter(c => c.price === 0);
export const POPULAR_COURSES = ALL_COURSES.filter(c => c.bestseller);
export const NEWEST_COURSES = ALL_COURSES.filter(c => c.isNew);
export const RECOMMENDED_COURSES = ALL_COURSES.slice(10);

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
  { name: 'Wanderer', price: 'Free', features: ['3 Daily Lessons', 'Global Chat Access', 'Public Guilds'], icon: Ghost, popular: false },
  { name: 'Vanguard', price: '$9.99', features: ['Unlimited Energy', 'Exclusive Badges', 'Private Guilds', 'Offline Mode'], icon: Zap, popular: true },
  { name: 'Guild Master', price: '$24.99', features: ['All Vanguard Perks', 'Create Your Own Guild', '1-on-1 Mentorship', 'Early Beta Access'], icon: Crown, popular: false },
] as const;

export const FIELDS = [
  'Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business', 'Medicine', 'Law', 'Arts',
] as const;

export const LEVELS = ['L1', 'L2', 'L3', 'M1', 'M2', 'PhD'] as const;

export const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Chen', email: 'alice@uni.edu', level: 'L2', xp: 4500, progress: 78, streak: 15, avatar: 'AC' },
  { id: '2', name: 'Bob Smith', email: 'bob@uni.edu', level: 'L1', xp: 2300, progress: 45, streak: 8, avatar: 'BS' },
  { id: '3', name: 'Carol Davis', email: 'carol@uni.edu', level: 'L3', xp: 8200, progress: 92, streak: 32, avatar: 'CD' },
  { id: '4', name: 'David Lee', email: 'david@uni.edu', level: 'M1', xp: 6100, progress: 67, streak: 21, avatar: 'DL' },
  { id: '5', name: 'Emma Wilson', email: 'emma@uni.edu', level: 'L2', xp: 3800, progress: 55, streak: 12, avatar: 'EW' },
] as const;

export const MOCK_PROFESSOR_COURSES = [
  { id: 'p1', title: 'Data Structures', students: 156, completion: 72, avgScore: 85, status: 'active' },
  { id: 'p2', title: 'Machine Learning', students: 89, completion: 45, avgScore: 78, status: 'active' },
  { id: 'p3', title: 'Web Development', students: 234, completion: 88, avgScore: 91, status: 'completed' },
] as const;

export type User = {
  name: string;
  role: string;
  xp: number;
  streak: number;
  gems: number;
  university?: string;
} | null;
