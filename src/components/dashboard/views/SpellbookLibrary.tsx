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
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">THE SPELLBOOK</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Select your path of study
          </p>
        </div>
        <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2">
          <Zap size={16} className="text-primary fill-primary" />
          <span className="font-black text-sm">15 / 20 Energy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        {COURSES.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden"
          >
            <div className={`${course.color} w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl mb-4 sm:mb-6 group-hover:rotate-6 transition-transform`}>
              <course.icon size={24} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter mb-1 leading-none">
              {course.title}
            </h3>
            <p className="text-muted-foreground font-bold text-xs uppercase mb-4 sm:mb-6 tracking-widest">
              {course.instructor}
            </p>
            <XPBar progress={course.progress} />
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-border flex justify-between items-center text-primary font-black text-sm">
              VIEW PATH <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
