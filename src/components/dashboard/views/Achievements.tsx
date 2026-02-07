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
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter">THE ARMORY</h2>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs sm:text-sm mt-2">
          Collect badges and achievements
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`glass-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center group transition-all cursor-help ${
              achievement.unlocked 
                ? 'hover:scale-105' 
                : 'opacity-40 grayscale hover:opacity-60 hover:grayscale-0'
            }`}
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:rotate-12 ${
              achievement.unlocked ? achievement.color : 'bg-muted'
            }`}>
              {achievement.unlocked ? (
                <achievement.icon size={22} className="text-primary-foreground" />
              ) : (
                <Lock size={22} className="text-muted-foreground" />
              )}
            </div>
            <p className="font-black text-[10px] sm:text-sm uppercase tracking-tight">
              {achievement.unlocked ? achievement.title : 'Locked'}
            </p>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <section className="mt-8 sm:mt-16 space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl font-black italic">Certificates</h3>
        <div className="glass-card p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center">
          <Award size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-bold text-sm">Complete a course to earn your first certificate</p>
        </div>
      </section>
    </div>
  );
}
