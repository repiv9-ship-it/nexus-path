import { BookOpen, Users, Star, ChevronRight } from 'lucide-react';
import { FREE_COURSES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface FreeCoursesSectionProps {
  onPreviewCourse: (courseId: string) => void;
}

export function FreeCoursesSection({ onPreviewCourse }: FreeCoursesSectionProps) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            Free Courses Preview
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
            Start learning today — no signup required
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FREE_COURSES.map((course, i) => (
            <div 
              key={course.id}
              className="glass-card rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Course Header */}
              <div className="h-32 gradient-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-primary-foreground/20 backdrop-blur-sm rounded-lg text-primary-foreground text-xs font-bold uppercase">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black italic tracking-tight leading-tight">
                  {course.title}
                </h3>
                <p className="text-muted-foreground font-bold text-sm">
                  {course.instructor}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users size={14} />
                    <span className="font-bold">{(course.students / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold">{course.rating}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onPreviewCourse(course.id)}
                  variant="outline"
                  className="w-full mt-4 font-bold rounded-xl group-hover:gradient-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                >
                  Preview Course
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
