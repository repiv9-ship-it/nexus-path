import { ChevronRight, Zap } from 'lucide-react';
import { COURSES } from '@/lib/constants';
import { XPBar } from '@/components/ui/xp-bar';

interface Course {
  id: string;
  title: string;
  instructor: string;
  color: string;
  icon: typeof Zap;
  xp: number;
  progress: number;
}

interface SpellbookLibraryProps {
  onSelectCourse: (course: Course) => void;
}

export function SpellbookLibrary({ onSelectCourse }: SpellbookLibraryProps) {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none">THE SPELLBOOK</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Select your path of study
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2">
            <Zap size={18} className="text-primary fill-primary" />
            <span className="font-black">15 / 20 Energy</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COURSES.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="glass-card p-8 rounded-4xl group cursor-pointer hover:scale-[1.03] transition-all relative overflow-hidden"
          >
            <div className={`${course.color} w-16 h-16 rounded-3xl flex items-center justify-center text-primary-foreground shadow-xl mb-6 group-hover:rotate-6 transition-transform`}>
              <course.icon size={32} />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter mb-1 leading-none">
              {course.title}
            </h3>
            <p className="text-muted-foreground font-bold text-xs uppercase mb-6 tracking-widest">
              {course.instructor}
            </p>
            <XPBar progress={course.progress} />
            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-primary font-black text-sm">
              VIEW PATH <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
