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
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-xl glow-primary">
            <Globe size={48} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black italic tracking-tighter">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground font-bold mt-1">Continue your learning journey</p>
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold">Level Progress</span>
                <span className="font-black text-primary">{user.xp.toLocaleString()} XP</span>
              </div>
              <XPBar progress={45} />
            </div>
          </div>
          <Button 
            onClick={() => onNavigate('courses')}
            className="gradient-primary font-black rounded-2xl px-8 py-6 shadow-xl"
          >
            Continue Learning
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Daily Quests */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
              <Target className="text-primary" /> Daily Quests
            </h3>
            <p className="text-muted-foreground font-bold text-sm">Complete quests to earn bonus XP</p>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl">
            <span className="font-black text-primary">2/4</span>
            <span className="text-muted-foreground font-bold"> completed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((quest, i) => (
            <div 
              key={i}
              className={`glass-card p-6 rounded-3xl flex items-center gap-4 transition-all ${
                quest.completed ? 'opacity-60' : 'hover:scale-[1.02]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                quest.completed ? 'bg-success text-success-foreground' : 'bg-muted'
              }`}>
                {quest.completed ? (
                  <Trophy size={24} />
                ) : (
                  <Zap size={24} className="text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-black ${quest.completed ? 'line-through' : ''}`}>{quest.title}</p>
                <div className="mt-2">
                  <XPBar progress={quest.progress} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-primary">+{quest.xp}</p>
                <p className="text-xs text-muted-foreground font-bold">XP</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Practice', desc: 'Quick 5-min session', icon: Zap, action: () => onNavigate('courses') },
          { title: 'Leaderboard', desc: 'See your ranking', icon: Trophy, action: () => {} },
          { title: 'Explore', desc: 'Find new courses', icon: Globe, action: () => onNavigate('nexus') },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="glass-card p-6 rounded-3xl text-left group hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <item.icon size={24} className="text-primary-foreground" />
            </div>
            <h4 className="font-black text-lg">{item.title}</h4>
            <p className="text-muted-foreground font-bold text-sm">{item.desc}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
