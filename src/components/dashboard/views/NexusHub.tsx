import { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, BookOpen, Globe, TrendingUp, Sparkles, Users, ChevronRight, X, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALL_COURSES, CATEGORIES, POPULAR_COURSES, NEWEST_COURSES, FREE_COURSES } from '@/lib/constants';
import type { Course } from '@/lib/constants';

const PRICE_FILTERS = ['All', 'Free', 'Paid'] as const;
const LEVEL_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10} className={i < Math.round(rating) ? 'text-warning fill-warning' : 'text-muted-foreground/30'} />
      ))}
      <span className="text-[10px] font-black text-warning ml-0.5">{rating}</span>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all border border-border hover:border-primary/30 flex flex-col">
      <div className="h-28 bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center shrink-0">
        <BookOpen size={24} className="text-primary/25" />
        {course.bestseller && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-warning text-warning-foreground text-[10px] font-black rounded uppercase">Bestseller</span>
        )}
        {course.isNew && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-success text-success-foreground text-[10px] font-black rounded uppercase">New</span>
        )}
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-black rounded ${
          course.price === 0 ? 'bg-success/90 text-success-foreground' : 'bg-background/90 text-foreground backdrop-blur-sm'
        }`}>
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h4 className="font-black text-xs leading-tight mb-1 line-clamp-2 flex-1">{course.title}</h4>
        <p className="text-muted-foreground text-[11px] font-bold mb-1.5">{course.instructor}</p>
        <StarRating rating={course.rating} />
        <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground font-bold">
          <span className="flex items-center gap-1"><Users size={9} /> {course.students.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock size={9} /> {course.hours}h</span>
          <span className="px-1.5 py-0.5 bg-muted rounded text-[10px]">{course.level}</span>
        </div>
      </div>
    </div>
  );
}

function CourseRow({ title, icon: Icon, courses, onViewAll }: { title: string; icon: typeof BookOpen; courses: Course[]; onViewAll?: () => void }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
          <Icon size={16} className="text-primary" /> {title}
        </h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-black text-primary flex items-center gap-1 hover:underline">
            View all <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {courses.slice(0, 5).map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </section>
  );
}

export function NexusHub() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<typeof PRICE_FILTERS[number]>('All');
  const [levelFilter, setLevelFilter] = useState<typeof LEVEL_FILTERS[number]>('All');

  const filtered = useMemo(() => {
    let courses = ALL_COURSES;
    if (selectedCategory !== 'All') courses = courses.filter(c => c.category === selectedCategory);
    if (priceFilter === 'Free') courses = courses.filter(c => c.price === 0);
    if (priceFilter === 'Paid') courses = courses.filter(c => c.price > 0);
    if (levelFilter !== 'All') courses = courses.filter(c => c.level === levelFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return courses;
  }, [search, selectedCategory, priceFilter, levelFilter]);

  const isFiltering = !!search.trim() || selectedCategory !== 'All' || priceFilter !== 'All' || levelFilter !== 'All';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">EXPLORE</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Discover courses from top instructors worldwide
          </p>
        </div>
        <div className="glass-card px-3 py-2 rounded-xl flex items-center gap-2">
          <Globe size={13} className="text-primary" />
          <span className="font-black text-xs">{ALL_COURSES.length} courses available</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search courses, instructors, topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-11 h-12 rounded-xl font-bold text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-start gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <Filter size={13} className="text-muted-foreground shrink-0 mt-1" />
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.slice(0, 7).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
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
        <div className="flex gap-1 flex-wrap">
          {PRICE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setPriceFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                priceFilter === f
                  ? 'bg-success/20 border border-success/40 text-success'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {LEVEL_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setLevelFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                levelFilter === f
                  ? 'bg-primary/20 border border-primary/40 text-primary'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Sections */}
      {isFiltering ? (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-black tracking-tight">
              {search ? `Results for "${search}"` : selectedCategory}
            </h3>
            <span className="glass-card px-2 py-1 rounded-lg text-xs font-black text-muted-foreground">
              {filtered.length} courses
            </span>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setPriceFilter('All'); setLevelFilter('All'); }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-muted-foreground/20 mb-4" />
              <p className="font-black text-muted-foreground">No courses found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-8">
          <CourseRow title="Trending Now" icon={TrendingUp} courses={POPULAR_COURSES} />
          <div className="border-t border-border/50" />
          <CourseRow title="Just Launched" icon={Sparkles} courses={NEWEST_COURSES} />
          <div className="border-t border-border/50" />
          <CourseRow title="Free Courses" icon={Zap} courses={FREE_COURSES} />
          <div className="border-t border-border/50" />
          <CourseRow title="All Courses" icon={Globe} courses={ALL_COURSES} />
        </div>
      )}
    </div>
  );
}
