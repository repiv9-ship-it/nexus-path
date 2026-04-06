import { useState } from 'react';
import { Lock, Trophy, Star, Zap, Shield, Award, Target, Flame, Crown, Gem, BookOpen, Users, Clock, Medal, TrendingUp, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: typeof Zap;
  unlocked: boolean;
  color: string;
  category: string;
  xp?: number;
  unlockedDate?: string;
  progress?: number;
  total?: number;
}

const BADGES: Badge[] = [
  // Learning
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: Zap, unlocked: true, color: 'bg-primary', category: 'Learning', xp: 50, unlockedDate: '2025-09-15' },
  { id: 2, title: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: Star, unlocked: true, color: 'bg-warning', category: 'Learning', xp: 100, unlockedDate: '2025-10-02' },
  { id: 3, title: 'Course Complete', description: 'Finish your first full course', icon: Award, unlocked: true, color: 'bg-success', category: 'Learning', xp: 500, unlockedDate: '2025-12-20' },
  { id: 4, title: 'Knowledge Seeker', description: 'Enroll in 5 different courses', icon: BookOpen, unlocked: true, color: 'bg-secondary', category: 'Learning', xp: 200, unlockedDate: '2026-01-05' },
  { id: 5, title: 'Scholar', description: 'Complete 10 courses', icon: Trophy, unlocked: false, color: 'bg-warning', category: 'Learning', progress: 4, total: 10 },
  { id: 6, title: 'Master Class', description: 'Score 100% on any quiz', icon: Target, unlocked: false, color: 'bg-destructive', category: 'Learning', progress: 92, total: 100 },

  // Engagement
  { id: 7, title: 'Streak Starter', description: 'Maintain a 7-day learning streak', icon: Flame, unlocked: true, color: 'bg-destructive', category: 'Streak', xp: 150, unlockedDate: '2025-10-10' },
  { id: 8, title: 'Streak Master', description: 'Maintain a 30-day streak', icon: Flame, unlocked: false, color: 'bg-destructive', category: 'Streak', progress: 15, total: 30 },
  { id: 9, title: 'Unstoppable', description: '100-day learning streak', icon: Crown, unlocked: false, color: 'bg-warning', category: 'Streak', progress: 15, total: 100 },

  // Social
  { id: 10, title: 'Networker', description: 'Join a study group', icon: Users, unlocked: false, color: 'bg-primary', category: 'Social' },
  { id: 11, title: 'Mentor', description: 'Help 10 other students', icon: Shield, unlocked: false, color: 'bg-success', category: 'Social', progress: 3, total: 10 },
  { id: 12, title: 'Legend', description: 'Top 1% of all learners', icon: Gem, unlocked: false, color: 'bg-primary', category: 'Social' },
];

const CATEGORIES = ['All', 'Learning', 'Streak', 'Social'];

const STATS = {
  totalXP: 1000,
  level: 5,
  nextLevelXP: 1500,
  coursesCompleted: 4,
  quizzesPassed: 18,
  currentStreak: 15,
  longestStreak: 22,
  badgesUnlocked: BADGES.filter(b => b.unlocked).length,
  totalBadges: BADGES.length,
};

export function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBadges = selectedCategory === 'All' ? BADGES : BADGES.filter(b => b.category === selectedCategory);
  const unlockedCount = filteredBadges.filter(b => b.unlocked).length;
  const levelProgress = (STATS.totalXP / STATS.nextLevelXP) * 100;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter">BADGES & REWARDS</h2>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Track your achievements and unlock rewards
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Level', value: STATS.level, icon: Medal, color: 'text-primary', sub: `${STATS.totalXP} XP` },
          { label: 'Badges', value: `${STATS.badgesUnlocked}/${STATS.totalBadges}`, icon: Award, color: 'text-warning', sub: 'Unlocked' },
          { label: 'Streak', value: `${STATS.currentStreak}d`, icon: Flame, color: 'text-destructive', sub: `Best: ${STATS.longestStreak}d` },
          { label: 'Courses', value: STATS.coursesCompleted, icon: BookOpen, color: 'text-success', sub: 'Completed' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl text-center">
            <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-muted-foreground text-[10px] font-bold uppercase">{stat.label}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-lg">
              {STATS.level}
            </div>
            <div>
              <p className="font-black text-sm">Level {STATS.level}</p>
              <p className="text-muted-foreground text-xs">{STATS.totalXP} / {STATS.nextLevelXP} XP to Level {STATS.level + 1}</p>
            </div>
          </div>
          <span className="text-primary font-black text-sm">{levelProgress.toFixed(0)}%</span>
        </div>
        <Progress value={levelProgress} className="h-3" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 justify-center flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
              selectedCategory === cat
                ? 'gradient-primary text-primary-foreground shadow-md'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 text-[10px] opacity-75">
                ({BADGES.filter(b => b.category === cat && b.unlocked).length}/{BADGES.filter(b => b.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`glass-card p-4 sm:p-5 rounded-2xl text-center group transition-all ${
              badge.unlocked 
                ? 'hover:scale-[1.03] cursor-pointer' 
                : 'opacity-50 hover:opacity-70'
            }`}
          >
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:rotate-6 ${
              badge.unlocked ? badge.color : 'bg-muted'
            }`}>
              {badge.unlocked ? (
                <badge.icon size={24} className="text-primary-foreground" />
              ) : (
                <Lock size={24} className="text-muted-foreground" />
              )}
            </div>
            <p className="font-black text-sm">{badge.title}</p>
            <p className="text-muted-foreground text-[10px] mt-1 leading-relaxed">{badge.description}</p>
            
            {badge.unlocked && badge.xp && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <Zap size={10} className="text-warning" />
                <span className="text-warning text-[10px] font-black">+{badge.xp} XP</span>
              </div>
            )}
            {badge.unlocked && badge.unlockedDate && (
              <p className="text-muted-foreground text-[10px] mt-1 flex items-center justify-center gap-1">
                <CheckCircle size={9} className="text-success" />
                {new Date(badge.unlockedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}

            {!badge.unlocked && badge.progress !== undefined && badge.total !== undefined && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{badge.progress}/{badge.total}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificates */}
      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-black italic tracking-tight flex items-center gap-2">
          <Award size={18} className="text-primary" /> Certificates
        </h3>
        {STATS.coursesCompleted > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { course: 'Advanced Algorithms', date: '2025-12-20', grade: 'A' },
              { course: 'Neural Networks', date: '2026-01-15', grade: 'A+' },
              { course: 'Digital Ethics', date: '2026-02-10', grade: 'B+' },
              { course: 'Web Development Basics', date: '2026-02-28', grade: 'A' },
            ].map((cert, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                  <Award size={20} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">{cert.course}</p>
                  <p className="text-muted-foreground text-xs">{new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-primary text-lg">{cert.grade}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 sm:p-12 rounded-2xl text-center">
            <Award size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-bold text-sm">Complete a course to earn your first certificate</p>
          </div>
        )}
      </section>
    </div>
  );
}
