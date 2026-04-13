import { Star, Clock, BookOpen } from 'lucide-react';

export interface CourseCardCourse {
  id: string;
  title: string;
  instructor_name: string | null;
  category: string;
  price: number;
  description?: string | null;
}

interface CourseCardProps {
  course: CourseCardCourse;
  onPreview?: (id: string) => void;
}

const THUMBNAIL_COLORS = [
  'from-primary/80 to-secondary/80',
  'from-secondary/80 to-primary/80',
  'from-success/80 to-primary/80',
  'from-warning/80 to-destructive/80',
  'from-primary/80 to-success/80',
];

function getColorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return THUMBNAIL_COLORS[Math.abs(hash) % THUMBNAIL_COLORS.length];
}

export function CourseCard({ course, onPreview }: CourseCardProps) {
  const gradient = getColorForId(course.id);

  return (
    <div onClick={() => onPreview?.(course.id)}
      className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="text-primary-foreground/30" size={48} />
        </div>
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold uppercase rounded-md">
          {course.category}
        </span>
      </div>
      <div className="p-4 space-y-2.5">
        <h3 className="text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{course.instructor_name || 'Unknown'}</p>
        <div className="flex items-center gap-2 pt-1">
          {course.price === 0 ? (
            <span className="text-base font-black text-success">Free</span>
          ) : (
            <span className="text-base font-black text-foreground">{course.price} DT</span>
          )}
        </div>
      </div>
    </div>
  );
}
