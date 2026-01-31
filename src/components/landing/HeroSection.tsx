import { Zap, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreCourses: () => void;
}

export function HeroSection({ onGetStarted, onExploreCourses }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-sidebar" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 blur-[150px] rounded-full" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center">
          <div className="w-24 h-24 gradient-primary rounded-[2rem] flex items-center justify-center shadow-2xl glow-primary rotate-12 animate-float">
            <Zap className="text-primary-foreground fill-primary-foreground" size={48} />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-primary-foreground leading-none">
            UNILINGO
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.3em] text-primary/80">
            The Academic Nexus
          </p>
          <p className="text-lg md:text-xl text-sidebar-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Revolutionize your university learning with gamified, interactive courses 
            tailored for students and universities.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="gradient-primary text-primary-foreground font-black text-lg px-8 py-6 rounded-2xl shadow-xl glow-primary hover:scale-105 transition-all"
          >
            Get Started for Free
            <ChevronRight className="ml-2" size={20} />
          </Button>
          <Button 
            onClick={onExploreCourses}
            variant="outline"
            size="lg"
            className="bg-sidebar-foreground/5 border-sidebar-foreground/20 text-sidebar-foreground font-black text-lg px-8 py-6 rounded-2xl hover:bg-sidebar-foreground/10 transition-all"
          >
            <Play className="mr-2" size={20} />
            Explore Free Courses
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 pt-12">
          {[
            { value: '50K+', label: 'Students' },
            { value: '500+', label: 'Courses' },
            { value: '120', label: 'Universities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-sm font-bold text-sidebar-foreground/50 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-sidebar-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
