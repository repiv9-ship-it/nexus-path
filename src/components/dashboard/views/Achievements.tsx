import { Lock, Trophy, Star, Zap, Shield, Award, Target, Flame, Crown, Gem } from 'lucide-react';

const achievements = [
  { id: 1, title: 'First Steps', icon: Zap, unlocked: true, color: 'bg-primary' },
  { id: 2, title: 'Quick Learner', icon: Star, unlocked: true, color: 'bg-warning' },
  { id: 3, title: 'Streak Master', icon: Flame, unlocked: false, color: 'bg-destructive' },
  { id: 4, title: 'Quiz Champion', icon: Trophy, unlocked: false, color: 'bg-success' },
  { id: 5, title: 'Course Complete', icon: Award, unlocked: false, color: 'bg-secondary' },
  { id: 6, title: 'Perfect Score', icon: Target, unlocked: false, color: 'bg-primary' },
  { id: 7, title: 'Guild Leader', icon: Crown, unlocked: false, color: 'bg-warning' },
  { id: 8, title: 'Gem Collector', icon: Gem, unlocked: false, color: 'bg-primary' },
  { id: 9, title: 'Defender', icon: Shield, unlocked: false, color: 'bg-success' },
  { id: 10, title: 'Legend', icon: Star, unlocked: false, color: 'bg-secondary' },
];

export function Achievements() {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-black italic tracking-tighter">THE ARMORY</h2>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mt-2">
          Collect badges and achievements
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`glass-card p-8 rounded-3xl text-center group transition-all cursor-help ${
              achievement.unlocked 
                ? 'hover:scale-105' 
                : 'opacity-40 grayscale hover:opacity-60 hover:grayscale-0'
            }`}
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${
              achievement.unlocked ? achievement.color : 'bg-muted'
            }`}>
              {achievement.unlocked ? (
                <achievement.icon size={28} className="text-primary-foreground" />
              ) : (
                <Lock size={28} className="text-muted-foreground" />
              )}
            </div>
            <p className="font-black text-sm uppercase tracking-tight">
              {achievement.unlocked ? achievement.title : 'Mystery Relic'}
            </p>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <section className="mt-16 space-y-6">
        <h3 className="text-2xl font-black italic">Certificates</h3>
        <div className="glass-card p-12 rounded-4xl text-center">
          <Award size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-bold">Complete a course to earn your first certificate</p>
        </div>
      </section>
    </div>
  );
}
