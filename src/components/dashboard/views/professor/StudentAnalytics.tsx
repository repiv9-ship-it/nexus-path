import { ArrowLeft, Users, TrendingUp, Award, Clock, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentAnalyticsProps {
  courseId: string;
  onBack: () => void;
}

export function StudentAnalytics({ courseId, onBack }: StudentAnalyticsProps) {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Student Analytics</h2>
            <p className="text-muted-foreground font-bold">Course performance overview</p>
          </div>
        </div>
      </div>

      <div className="text-center py-16 glass-card rounded-2xl">
        <TrendingUp size={48} className="mx-auto text-muted-foreground/20 mb-4" />
        <p className="font-bold text-muted-foreground text-lg">Analytics coming soon</p>
        <p className="text-sm text-muted-foreground mt-1">Student analytics will be available once data is recorded</p>
      </div>
    </div>
  );
}
