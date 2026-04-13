import { BookOpen, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCourseSubmissions, useSubjects, useSemesters } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';

interface SpellbookLibraryProps {
  onSelectCourse: (course: any) => void;
}

export function SpellbookLibrary({ onSelectCourse }: SpellbookLibraryProps) {
  const { user } = useAuth();
  const { data: approvedCourses, loading } = useCourseSubmissions('approved');
  const isUniUser = !!user?.university;

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">MY COURSES</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            {isUniUser ? 'University & public courses' : 'Browse and continue learning'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading courses...</p>
        </div>
      ) : (approvedCourses || []).length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground text-lg">No courses yet</p>
          <p className="text-sm text-muted-foreground mt-1">Enroll in courses from the Explore page to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {(approvedCourses || []).map(course => (
            <div key={course.id} className="glass-card p-5 sm:p-6 rounded-2xl group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted mb-4 group-hover:rotate-6 transition-transform">
                <Globe size={22} className="text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight mb-1 leading-tight pr-12">
                {course.title}
              </h3>
              <p className="text-muted-foreground font-semibold text-xs mb-2">
                {course.instructor_name || 'Unknown instructor'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-muted rounded">{course.category}</span>
                <span>{course.price === 0 ? 'Free' : `${course.price} DT`}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs">
                  {course.price > 0 ? 'Subscribe to Access' : 'Start for Free'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
