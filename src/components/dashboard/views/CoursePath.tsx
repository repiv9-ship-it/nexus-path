import { ArrowLeft, Play, FileText, Skull, Gem } from 'lucide-react';
import { XPBar } from '@/components/ui/xp-bar';

interface Level {
  id: number;
  title: string;
  type: 'text' | 'video' | 'quiz';
  xp: number;
  status: 'completed' | 'active' | 'locked';
}

interface Course {
  id: string;
  title: string;
  progress: number;
}

interface CoursePathProps {
  course: Course;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const levels: Level[] = [
  { id: 1, title: 'The First Scroll', type: 'text', xp: 100, status: 'completed' },
  { id: 2, title: 'Binary Oracles', type: 'video', xp: 150, status: 'active' },
  { id: 3, title: 'The Mid-Term Boss', type: 'quiz', xp: 1000, status: 'active' },
  { id: 4, title: 'Graph Secrets', type: 'text', xp: 200, status: 'locked' },
  { id: 5, title: 'Recursive Loops', type: 'video', xp: 250, status: 'locked' },
];

export function CoursePath({ course, onSelectLevel, onBack }: CoursePathProps) {
  return (
    <div className="max-w-md mx-auto py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-16">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-black italic text-xl tracking-tighter">{course.title}</h2>
          <XPBar progress={course.progress} size="sm" className="w-32 mx-auto mt-2" />
        </div>
        <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center text-warning font-black">
          <Gem size={18} fill="currentColor" />
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-12">
        {levels.map((lvl, i) => {
          const isOffset = i % 2 !== 0;
          return (
            <div 
              key={lvl.id} 
              className={`relative flex flex-col items-center ${isOffset ? 'translate-x-12' : '-translate-x-12'}`}
            >
              {/* Connector Line */}
              {i < levels.length - 1 && (
                <div className={`absolute top-20 h-16 w-1 bg-muted rounded-full z-0 ${isOffset ? '-left-6 rotate-[25deg]' : '-right-6 -rotate-[25deg]'}`} />
              )}

              {/* Level Button */}
              <button
                disabled={lvl.status === 'locked'}
                onClick={() => onSelectLevel(lvl)}
                className={`w-20 h-20 rounded-4xl z-10 flex items-center justify-center border-b-[10px] transition-all active:scale-90 relative group
                  ${lvl.status === 'completed' 
                    ? 'gradient-primary border-primary/50 text-primary-foreground' 
                    : lvl.status === 'active' 
                      ? 'bg-card border-muted text-primary shadow-[0_15px_40px_rgba(99,102,241,0.2)]' 
                      : 'bg-muted border-muted/50 text-muted-foreground'
                  }`}
              >
                {lvl.status === 'active' && lvl.type === 'quiz' && (
                  <div className="absolute -top-12 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-black text-[10px] uppercase animate-pulse whitespace-nowrap">
                    BOSS!
                  </div>
                )}
                {lvl.type === 'quiz' ? <Skull size={32} /> : lvl.type === 'video' ? <Play size={32} /> : <FileText size={32} />}
              </button>
              
              <p className={`mt-3 font-black text-[10px] uppercase tracking-tighter text-center max-w-[100px] ${
                lvl.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {lvl.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
