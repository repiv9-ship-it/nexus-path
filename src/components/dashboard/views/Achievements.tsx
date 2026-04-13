import { Award, BookOpen } from 'lucide-react';

export function Achievements() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter">BADGES & REWARDS</h2>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Track your achievements</p>
      </div>

      <div className="text-center py-16 glass-card rounded-2xl">
        <Award size={48} className="mx-auto text-muted-foreground/20 mb-4" />
        <p className="font-bold text-muted-foreground text-lg">Coming soon</p>
        <p className="text-sm text-muted-foreground mt-1">Your badges and achievements will appear here as you progress</p>
      </div>
    </div>
  );
}
