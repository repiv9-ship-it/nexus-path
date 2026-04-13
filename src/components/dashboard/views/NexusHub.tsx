import { useState } from 'react';
import { Search, Filter, BookOpen, Globe, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCourseSubmissions } from '@/hooks/useSupabaseData';
import { CATEGORIES } from '@/lib/constants';

export function NexusHub() {
  const { data: courses, loading } = useCourseSubmissions('approved');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = (courses || []).filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || (c.instructor_name || '').toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">EXPLORE</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Discover courses from top instructors</p>
        </div>
        <div className="glass-card px-3 py-2 rounded-xl flex items-center gap-2">
          <Globe size={13} className="text-primary" />
          <span className="font-bold text-xs">{(courses || []).length} courses</span>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input placeholder="Search courses, instructors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-12 rounded-xl font-semibold text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={16} /></button>}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter size={13} className="text-muted-foreground shrink-0" />
        {CATEGORIES.slice(0, 7).map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat ? 'gradient-primary text-primary-foreground shadow-sm' : 'glass-card text-muted-foreground hover:text-foreground'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading courses...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground">No courses found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(c => (
            <div key={c.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all border border-border hover:border-primary/30 flex flex-col">
              <div className="h-28 bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center shrink-0">
                <BookOpen size={24} className="text-primary/25" />
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded ${
                  c.price === 0 ? 'bg-success/90 text-success-foreground' : 'bg-background/90 text-foreground backdrop-blur-sm'
                }`}>
                  {c.price === 0 ? 'Free' : `${c.price} DT`}
                </span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h4 className="font-bold text-xs leading-tight mb-1 line-clamp-2 flex-1">{c.title}</h4>
                <p className="text-muted-foreground text-xs font-semibold mb-1.5">{c.instructor_name || 'Unknown'}</p>
                <span className="px-1.5 py-0.5 bg-muted rounded text-xs self-start">{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
