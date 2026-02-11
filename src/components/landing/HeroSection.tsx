import { useState } from 'react';
import { Search, Zap, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreCourses: () => void;
  onSearch?: (query: string) => void;
}

export function HeroSection({ onGetStarted, onExploreCourses, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <section className="relative px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />
      <div className="absolute top-0 left-[-15%] w-[50%] h-[60%] bg-primary/8 dark:bg-primary/15 blur-[120px] rounded-full" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[50%] bg-secondary/6 dark:bg-secondary/12 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <Zap size={14} className="fill-primary" />
          The Academic Nexus — Learn. Level Up. Lead.
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
          Learn without limits,{' '}
          <span className="gradient-text">advance your career</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Access thousands of courses from world-class universities and instructors. Start learning today — for free.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-muted-foreground" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses, topics, or instructors..."
              className="h-12 sm:h-14 pl-12 pr-28 sm:pr-32 text-sm sm:text-base rounded-2xl border-border bg-card shadow-lg focus-visible:ring-primary"
            />
            <Button
              type="submit"
              className="absolute right-1.5 gradient-primary text-primary-foreground font-bold rounded-xl h-9 sm:h-11 px-4 sm:px-6"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {CATEGORIES.slice(1, 6).map((cat) => (
            <button
              key={cat}
              onClick={onExploreCourses}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-6 border-t border-border/50 mt-6">
          {[
            { icon: BookOpen, value: '500+', label: 'Courses' },
            { icon: TrendingUp, value: '50K+', label: 'Students' },
            { icon: Award, value: '120', label: 'Universities' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 text-muted-foreground">
              <stat.icon size={18} className="text-primary" />
              <span className="text-sm font-black text-foreground">{stat.value}</span>
              <span className="text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
