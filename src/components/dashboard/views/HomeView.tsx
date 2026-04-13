import { useState } from 'react';
import { Search, Filter, Star, BookOpen, Award, Zap, X, GraduationCap, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCourseSubmissions, useProfessors } from '@/hooks/useSupabaseData';
import { CATEGORIES } from '@/lib/constants';
import type { ViewType } from '@/lib/navigation';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onApplyProfessor?: () => void;
  onApplyUniversity?: () => void;
}

export function HomeView({ onNavigate, onApplyProfessor, onApplyUniversity }: HomeViewProps) {
  const { user } = useAuth();
  const { data: courses, loading: coursesLoading } = useCourseSubmissions('approved');
  const { data: professors, loading: profsLoading } = useProfessors();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewingProfessor, setViewingProfessor] = useState<any | null>(null);

  const filteredCourses = (courses || []).filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || (c.instructor_name || '').toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    }
    return true;
  });

  const matchedProfessors = (professors || []).filter(p => {
    if (!search.trim()) return false;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.department || '').toLowerCase().includes(q);
  });

  const isFiltering = !!search.trim() || selectedCategory !== 'All';

  if (viewingProfessor) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setViewingProfessor(null)} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          ← Back to search
        </button>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shrink-0">
              {viewingProfessor.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight">{viewingProfessor.name}</h2>
              <p className="text-primary font-semibold text-sm mt-0.5">{viewingProfessor.department || 'Instructor'}</p>
              {viewingProfessor.bio && <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{viewingProfessor.bio}</p>}
              {viewingProfessor.office_hours && (
                <p className="text-muted-foreground text-xs mt-2">Office Hours: {viewingProfessor.office_hours}</p>
              )}
              {viewingProfessor.email && (
                <p className="text-muted-foreground text-xs mt-1">Contact: {viewingProfessor.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
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
            <button onClick={() => onNavigate('badges')} className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-bold hover:border-primary/50 transition-all">
              <Award size={15} className="text-warning" /> Badges
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {onApplyProfessor && (
            <button onClick={onApplyProfessor} className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/50 transition-all border border-dashed border-border">
              <GraduationCap size={15} className="text-primary" /> Become an Instructor
            </button>
          )}
          {onApplyUniversity && (
            <button onClick={onApplyUniversity} className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/50 transition-all border border-dashed border-border">
              <Building2 size={15} className="text-secondary" /> Register Institution
            </button>
          )}
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input placeholder="Search courses, instructors, professors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-12 rounded-xl font-semibold text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-muted-foreground shrink-0" />
          {CATEGORIES.slice(0, 6).map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat ? 'gradient-primary text-primary-foreground shadow-sm' : 'glass-card text-muted-foreground hover:text-foreground'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Professor results */}
      {matchedProfessors.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2">
            <GraduationCap size={16} className="text-primary" /> Instructors
          </h3>
          {matchedProfessors.map(prof => (
            <div key={prof.id} className="glass-card p-4 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer" onClick={() => setViewingProfessor(prof)}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg shrink-0">
                  {prof.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base">{prof.name}</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{prof.department || 'Instructor'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Courses */}
      <section className="space-y-4">
        {isFiltering && (
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold">{search ? `Results for "${search}"` : selectedCategory}</h3>
            <span className="glass-card px-2 py-1 rounded-lg text-xs font-bold text-muted-foreground">{filteredCourses.length} courses</span>
            <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="text-xs font-bold text-primary hover:underline">Clear</button>
          </div>
        )}

        {coursesLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No courses found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isFiltering ? 'Try adjusting your filters' : 'Courses will appear here once they are published'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredCourses.map(c => (
              <div key={c.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all border border-border hover:border-primary/30 flex flex-col">
                <div className="h-32 bg-gradient-to-br from-primary/15 to-secondary/15 relative flex items-center justify-center shrink-0">
                  <BookOpen size={28} className="text-primary/30" />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded ${
                    c.price === 0 ? 'bg-success/90 text-success-foreground' : 'bg-background/85 text-foreground'
                  }`}>
                    {c.price === 0 ? 'Free' : `${c.price} DT`}
                  </span>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="font-bold text-sm leading-tight mb-1.5 line-clamp-2 flex-1">{c.title}</h4>
                  <p className="text-muted-foreground text-xs font-semibold mb-2">{c.instructor_name || 'Unknown'}</p>
                  <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground font-semibold">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">{c.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
