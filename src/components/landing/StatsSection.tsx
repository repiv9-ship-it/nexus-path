import { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, Building2, Sparkles } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Students Enrolled', value: 50000, suffix: '+', color: 'text-primary' },
  { icon: BookOpen, label: 'Courses Available', value: 500, suffix: '+', color: 'text-secondary' },
  { icon: Building2, label: 'Partner Universities', value: 120, suffix: '', color: 'text-success' },
  { icon: Sparkles, label: 'XP Awarded', value: 10, suffix: 'M+', color: 'text-warning' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            Platform Statistics
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs sm:text-sm">
            Join the fastest growing academic nexus
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl text-center group hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <stat.icon className="text-primary-foreground" size={24} />
              </div>
              <p className={`text-2xl sm:text-4xl md:text-5xl font-black ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
