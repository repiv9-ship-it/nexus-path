import { Globe, ChevronRight, Zap, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XPBar } from '@/components/ui/xp-bar';
import type { User } from '@/lib/constants';

interface QuestMapProps {
  user: User;
  onNavigate: (view: string) => void;
}

export function QuestMap({ user, onNavigate }: QuestMapProps) {
  if (!user) return null;

  const quests = [
    { title: 'Complete First Lesson', xp: 100, progress: 100, completed: true },
    { title: 'Achieve 3-Day Streak', xp: 250, progress: user.streak >= 3 ? 100 : (user.streak / 3) * 100, completed: user.streak >= 3 },
    { title: 'Earn 500 XP', xp: 500, progress: Math.min(100, (user.xp / 500) * 100), completed: user.xp >= 500 },
    { title: 'Complete a Course', xp: 1000, progress: 0, completed: false },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-5 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <div className="w-16 h-16 sm:w-24 sm:h-24 gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl glow-primary shrink-0">
            <Globe size={32} className="sm:w-12 sm:h-12 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-3xl font-black italic tracking-tighter">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground font-bold mt-1 text-sm">Continue your learning journey</p>
            <div className="mt-3 sm:mt-4 max-w-md">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold">Level Progress</span>
                <span className="font-black text-primary">{user.xp.toLocaleString()} XP</span>
              </div>
              <XPBar progress={45} />
            </div>
          </div>
          <Button 
            onClick={() => onNavigate('courses')}
            className="gradient-primary font-black rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-6 shadow-xl w-full sm:w-auto"
          >
            Continue Learning
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Daily Quests */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter flex items-center gap-2 sm:gap-3">
              <Target className="text-primary" size={22} /> Daily Quests
            </h3>
            <p className="text-muted-foreground font-bold text-xs sm:text-sm">Complete quests to earn bonus XP</p>
          </div>
          <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
            <span className="font-black text-primary text-sm">2/4</span>
            <span className="text-muted-foreground font-bold text-sm"> done</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {quests.map((quest, i) => (
            <div 
              key={i}
              className={`glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 transition-all ${
                quest.completed ? 'opacity-60' : 'hover:scale-[1.02]'
              }`}
            >
              <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                quest.completed ? 'bg-success text-success-foreground' : 'bg-muted'
              }`}>
                {quest.completed ? (
                  <Trophy size={20} />
                ) : (
                  <Zap size={20} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm ${quest.completed ? 'line-through' : ''}`}>{quest.title}</p>
                <div className="mt-2">
                  <XPBar progress={quest.progress} size="sm" />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-primary text-sm">+{quest.xp}</p>
                <p className="text-[10px] text-muted-foreground font-bold">XP</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: 'Practice', desc: 'Quick 5-min session', icon: Zap, action: () => onNavigate('courses') },
          { title: 'Leaderboard', desc: 'See your ranking', icon: Trophy, action: () => {} },
          { title: 'Explore', desc: 'Find new courses', icon: Globe, action: () => onNavigate('nexus') },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="glass-card p-5 sm:p-6 rounded-xl sm:rounded-2xl text-left group hover:scale-[1.02] transition-all"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
              <item.icon size={20} className="text-primary-foreground" />
            </div>
            <h4 className="font-black text-base sm:text-lg">{item.title}</h4>
            <p className="text-muted-foreground font-bold text-xs sm:text-sm">{item.desc}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
