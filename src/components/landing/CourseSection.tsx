import { ChevronRight, Flame, Sparkles, Target, GraduationCap } from 'lucide-react';
import { CourseCard, type CourseCardCourse } from './CourseCard';
import { Button } from '@/components/ui/button';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  'Most Popular': <Flame size={22} className="text-warning" />,
  'Newest Courses': <Sparkles size={22} className="text-success" />,
  'Recommended for You': <Target size={22} className="text-primary" />,
  'Free Courses': <GraduationCap size={22} className="text-secondary" />,
};

interface CourseSectionProps {
  title: string;
  subtitle?: string;
  courses: CourseCardCourse[];
  onPreviewCourse?: (id: string) => void;
  onViewAll?: () => void;
}

export function CourseSection({ title, subtitle, courses, onPreviewCourse, onViewAll }: CourseSectionProps) {
  const icon = SECTION_ICONS[title] || null;

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" className="text-primary font-bold hidden sm:flex" onClick={onViewAll}>
              View All <ChevronRight size={16} />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {courses.map(course => <CourseCard key={course.id} course={course} onPreview={onPreviewCourse} />)}
        </div>
      </div>
    </section>
  );
}
