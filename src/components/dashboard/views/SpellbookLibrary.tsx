import { ChevronRight, Zap, Lock, Building2, Globe } from 'lucide-react';
import { COURSES, ALL_COURSES } from '@/lib/constants';
import type { User } from '@/lib/constants';
import { XPBar } from '@/components/ui/xp-bar';
import { Button } from '@/components/ui/button';

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
  user?: User;
}

// Mock university-specific courses
const UNI_COURSES = COURSES;

// Public courses from the landing page catalog
const PUBLIC_COURSES_SAMPLE = ALL_COURSES.slice(0, 6);

export function SpellbookLibrary({ onSelectCourse, user }: SpellbookLibraryProps) {
  const isUniUser = user?.university;

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">MY COURSES</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            {isUniUser ? 'University & public courses' : 'Browse and continue learning'}
          </p>
        </div>
        <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2">
          <Zap size={16} className="text-primary fill-primary" />
          <span className="font-black text-sm">15 / 20 Energy</span>
        </div>
      </div>

      {/* University Courses Section (for uni users) */}
      {isUniUser && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-primary" />
            <h3 className="text-lg sm:text-xl font-black italic tracking-tight">University Courses</h3>
            <span className="ml-2 px-2 py-0.5 bg-success/10 border border-success/20 rounded-md text-success text-[10px] font-black uppercase">
              Included
            </span>
          </div>
          <p className="text-muted-foreground text-xs font-bold">
            Free with your {user.university} enrollment
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {UNI_COURSES.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="glass-card p-5 sm:p-6 rounded-2xl group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden border border-primary/10"
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-success/10 border border-success/20 rounded-md text-success text-[10px] font-black uppercase">
                    Free
                  </span>
                </div>
                <div className={`${course.color} w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground shadow-xl mb-4 group-hover:rotate-6 transition-transform`}>
                  <course.icon size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-black italic tracking-tighter mb-1 leading-none pr-12">
                  {course.title}
                </h3>
                <p className="text-muted-foreground font-bold text-xs uppercase mb-4 tracking-widest">
                  {course.instructor}
                </p>
                <XPBar progress={course.progress} />
                <div className="mt-5 pt-4 border-t border-border flex justify-between items-center text-primary font-black text-sm">
                  CONTINUE <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Divider for uni users */}
      {isUniUser && <div className="border-t border-border/50" />}

      {/* Public / Explore Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-secondary" />
          <h3 className="text-lg sm:text-xl font-black italic tracking-tight">
            {isUniUser ? 'Explore Public Courses' : 'All Courses'}
          </h3>
        </div>
        {isUniUser && (
          <p className="text-muted-foreground text-xs font-bold">
            These courses require a separate subscription
          </p>
        )}

        {!isUniUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {UNI_COURSES.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="glass-card p-5 sm:p-6 rounded-2xl group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden"
              >
                <div className={`${course.color} w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground shadow-xl mb-4 group-hover:rotate-6 transition-transform`}>
                  <course.icon size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-black italic tracking-tighter mb-1 leading-none">
                  {course.title}
                </h3>
                <p className="text-muted-foreground font-bold text-xs uppercase mb-4 tracking-widest">
                  {course.instructor}
                </p>
                <XPBar progress={course.progress} />
                <div className="mt-5 pt-4 border-t border-border flex justify-between items-center text-primary font-black text-sm">
                  VIEW PATH <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {PUBLIC_COURSES_SAMPLE.map((course) => (
            <div
              key={course.id}
              className="glass-card p-5 sm:p-6 rounded-2xl group hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              {course.price > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {isUniUser && <Lock size={10} className="text-warning" />}
                  <span className="px-2 py-0.5 bg-warning/10 border border-warning/20 rounded-md text-warning text-[10px] font-black">
                    ${course.price}
                  </span>
                </div>
              )}
              {course.price === 0 && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-success/10 border border-success/20 rounded-md text-success text-[10px] font-black uppercase">
                    Free
                  </span>
                </div>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted mb-4 group-hover:rotate-6 transition-transform">
                <Globe size={22} className="text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mb-1 leading-tight pr-12">
                {course.title}
              </h3>
              <p className="text-muted-foreground font-bold text-xs mb-2">
                {course.instructor}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>⭐ {course.rating}</span>
                <span>·</span>
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full font-black text-xs">
                  {course.price > 0 ? 'Subscribe to Access' : 'Start for Free'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
