import { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, BookOpen, Award, Zap, X, TrendingUp, Gift, GraduationCap, Building2, Users, ChevronRight, Globe, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALL_COURSES, POPULAR_COURSES, NEWEST_COURSES, FREE_COURSES, CATEGORIES } from '@/lib/constants';
import type { Course, User } from '@/lib/constants';
import type { ViewType } from '@/lib/navigation';

interface HomeViewProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  onApplyProfessor?: () => void;
  onApplyUniversity?: () => void;
}

const PRICE_FILTERS = ['All', 'Free', 'Paid'] as const;
const RATING_FILTERS = ['Any', '4.5+', '4.0+'] as const;

// Mock professors for search
const MOCK_PROFESSORS = [
  {
    id: 'prof-xy',
    name: 'Xavier Yamamoto',
    title: 'AI & Machine Learning Expert',
    avatar: 'XY',
    rating: 4.9,
    students: 12500,
    courses: 6,
    specialties: ['Machine Learning', 'Deep Learning', 'Python'],
    bio: 'PhD in AI from MIT. 10+ years teaching experience. Published researcher in neural networks.',
    courseList: [
      { id: 'xy-1', title: 'Machine Learning A-Z: From Zero to Hero', rating: 4.9, students: 8200, price: 24.99 },
      { id: 'xy-2', title: 'Deep Learning with PyTorch', rating: 4.8, students: 4300, price: 34.99 },
    ],
  },
  {
    id: 'prof-zw',
    name: 'Zara Williams',
    title: 'Full-Stack Web Developer & Educator',
    avatar: 'ZW',
    rating: 4.7,
    students: 9800,
    courses: 4,
    specialties: ['Web Development', 'React', 'Node.js', 'TypeScript'],
    bio: 'Senior engineer at Google. Passionate about making web development accessible to everyone.',
    courseList: [
      { id: 'zw-1', title: 'Full-Stack Web Development 2025', rating: 4.7, students: 6100, price: 19.99 },
      { id: 'zw-2', title: 'React & TypeScript Masterclass', rating: 4.6, students: 3700, price: 29.99 },
    ],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < Math.round(rating) ? 'text-warning fill-warning' : 'text-muted-foreground'} />
      ))}
      <span className="text-xs font-bold text-warning ml-1">{rating}</span>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all border border-border hover:border-primary/30 flex flex-col">
      <div className="h-32 bg-gradient-to-br from-primary/15 to-secondary/15 relative flex items-center justify-center shrink-0">
        <BookOpen size={28} className="text-primary/30" />
        {course.bestseller && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-warning text-warning-foreground text-xs font-bold rounded uppercase">Bestseller</span>
        )}
        {course.isNew && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-success text-success-foreground text-xs font-bold rounded uppercase">New</span>
        )}
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded ${
          course.price === 0 ? 'bg-success/90 text-success-foreground' : 'bg-background/85 text-foreground'
        }`}>
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h4 className="font-bold text-sm leading-tight mb-1.5 line-clamp-2 flex-1">{course.title}</h4>
        <p className="text-muted-foreground text-xs font-semibold mb-2">{course.instructor}</p>
        <StarRating rating={course.rating} />
        <p className="text-muted-foreground text-xs mt-1">({course.students.toLocaleString()} students)</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1"><Clock size={11} /> {course.hours}h</span>
          <span className="px-2 py-0.5 bg-muted rounded text-xs">{course.level}</span>
        </div>
      </div>
    </div>
  );
}

function CourseRow({ title, icon: Icon, courses }: { title: string; icon?: typeof BookOpen; courses: Course[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
        {Icon && <Icon size={20} className="text-primary" />}
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {courses.slice(0, 5).map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </section>
  );
}

// Professor Profile Card in search results
function ProfessorCard({ professor, onView }: { professor: typeof MOCK_PROFESSORS[0]; onView: () => void }) {
  return (
    <div className="glass-card p-4 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer" onClick={onView}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg shrink-0">
          {professor.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-base">{professor.name}</h4>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-lg flex items-center gap-1">
              <GraduationCap size={11} /> Instructor
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{professor.title}</p>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-1 text-warning">
              <Star size={13} className="fill-warning" />
              <span className="font-bold text-sm">{professor.rating}</span>
            </div>
            <span className="text-muted-foreground text-xs flex items-center gap-1"><Users size={12} /> {professor.students.toLocaleString()} students</span>
            <span className="text-muted-foreground text-xs flex items-center gap-1"><BookOpen size={12} /> {professor.courses} courses</span>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {professor.specialties.slice(0, 3).map(s => (
              <span key={s} className="px-2 py-0.5 bg-muted text-muted-foreground border border-border rounded-lg text-xs font-semibold">{s}</span>
            ))}
          </div>
        </div>
        <ChevronRight size={18} className="text-muted-foreground shrink-0 mt-2" />
      </div>
    </div>
  );
}

// Professor Detail View
function ProfessorProfile({ professor, onBack }: { professor: typeof MOCK_PROFESSORS[0]; onBack: () => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
        ← Back to search
      </button>

      {/* Profile Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shrink-0">
            {professor.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black tracking-tight">{professor.name}</h2>
            <p className="text-primary font-semibold text-sm mt-0.5">{professor.title}</p>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{professor.bio}</p>
            <div className="flex items-center gap-5 mt-3 flex-wrap">
              <div className="flex items-center gap-1 text-warning">
                <Star size={15} className="fill-warning" />
                <span className="font-bold text-sm">{professor.rating}</span>
                <span className="text-muted-foreground text-xs">rating</span>
              </div>
              <span className="text-muted-foreground text-sm flex items-center gap-1"><Users size={14} /> {professor.students.toLocaleString()} students</span>
              <span className="text-muted-foreground text-sm flex items-center gap-1"><BookOpen size={14} /> {professor.courses} courses</span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {professor.specialties.map(s => (
                <span key={s} className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen size={18} className="text-primary" /> Courses by {professor.name.split(' ')[0]}
        </h3>
        {professor.courseList.map(course => (
          <div key={course.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition-all cursor-pointer">
            <div className="w-16 h-12 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-primary/40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{course.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className={i < Math.round(course.rating) ? 'text-warning fill-warning' : 'text-muted-foreground/30'} />
                  ))}
                  <span className="text-xs font-bold text-warning ml-1">{course.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">{course.students.toLocaleString()} students</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-bold text-base text-primary">${course.price}</span>
              <Button className="gradient-primary font-bold rounded-xl text-sm h-9 px-4">
                Enroll Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeView({ user, onNavigate, onApplyProfessor, onApplyUniversity }: HomeViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<typeof PRICE_FILTERS[number]>('All');
  const [ratingFilter, setRatingFilter] = useState<typeof RATING_FILTERS[number]>('Any');
  const [viewingProfessor, setViewingProfessor] = useState<typeof MOCK_PROFESSORS[0] | null>(null);

  const filtered = useMemo(() => {
    let courses = ALL_COURSES;
    if (selectedCategory !== 'All') courses = courses.filter(c => c.category === selectedCategory);
    if (priceFilter === 'Free') courses = courses.filter(c => c.price === 0);
    if (priceFilter === 'Paid') courses = courses.filter(c => c.price > 0);
    if (ratingFilter !== 'Any') {
      const min = parseFloat(ratingFilter);
      courses = courses.filter(c => c.rating >= min);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return courses;
  }, [search, selectedCategory, priceFilter, ratingFilter]);

  // Professor search results
  const matchedProfessors = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return MOCK_PROFESSORS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.specialties.some(s => s.toLowerCase().includes(q))
    );
  }, [search]);

  const isFiltering = !!search.trim() || selectedCategory !== 'All' || priceFilter !== 'All' || ratingFilter !== 'Any';

  // If viewing a professor profile
  if (viewingProfessor) {
    return <ProfessorProfile professor={viewingProfessor} onBack={() => setViewingProfessor(null)} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome + Quick access */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
            </h2>
            <p className="text-muted-foreground font-semibold text-sm mt-1">
              What do you want to learn today?
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('badges')}
              className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-bold hover:border-primary/50 transition-all"
            >
              <Award size={15} className="text-warning" /> Badges
            </button>
            <div className="glass-card px-4 py-2.5 rounded-xl flex items-center gap-2">
              <Zap size={15} className="text-primary" />
              <span className="font-bold text-sm">{user?.streak}d streak</span>
            </div>
          </div>
        </div>

        {/* Apply buttons */}
        <div className="flex gap-2 flex-wrap">
          {onApplyProfessor && (
            <button
              onClick={onApplyProfessor}
              className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/50 transition-all border border-dashed border-border"
            >
              <GraduationCap size={15} className="text-primary" /> Become an Instructor
            </button>
          )}
          {onApplyUniversity && (
            <button
              onClick={onApplyUniversity}
              className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/50 transition-all border border-dashed border-border"
            >
              <Building2 size={15} className="text-secondary" /> Register Institution
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search courses, instructors, professors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-xl font-semibold text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-muted-foreground shrink-0 mt-1" />
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'gradient-primary text-primary-foreground shadow-sm'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PRICE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPriceFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priceFilter === f
                    ? 'bg-success/20 border border-success/40 text-success'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {RATING_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setRatingFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  ratingFilter === f
                    ? 'bg-warning/20 border border-warning/40 text-warning'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star size={11} className={ratingFilter === f ? 'fill-warning' : ''} />
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results or Sections */}
      {isFiltering ? (
        <section className="space-y-4">
          {/* Professor results */}
          {matchedProfessors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                <GraduationCap size={16} className="text-primary" /> Instructors
              </h3>
              {matchedProfessors.map(p => (
                <ProfessorCard key={p.id} professor={p} onView={() => setViewingProfessor(p)} />
              ))}
              <div className="border-t border-border/50 my-2" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold tracking-tight">
              {search ? `Courses for "${search}"` : selectedCategory}
            </h3>
            <span className="glass-card px-2 py-1 rounded-lg text-xs font-bold text-muted-foreground">
              {filtered.length} courses
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
          {filtered.length === 0 && matchedProfessors.length === 0 && (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-muted-foreground/20 mb-4" />
              <p className="font-bold text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-8">
          <CourseRow title="Featured Courses" icon={TrendingUp} courses={POPULAR_COURSES} />
          <div className="border-t border-border/50" />
          <CourseRow title="Free Courses" icon={Gift} courses={FREE_COURSES} />
          <div className="border-t border-border/50" />
          <CourseRow title="Paid Courses" icon={Star} courses={ALL_COURSES.filter(c => c.price > 0)} />
          <div className="border-t border-border/50" />
          <CourseRow title="Newest Courses" icon={Zap} courses={NEWEST_COURSES} />
        </div>
      )}
    </div>
  );
}
