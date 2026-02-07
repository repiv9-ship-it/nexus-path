import { Zap, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreCourses: () => void;
}

export function HeroSection({ onGetStarted, onExploreCourses }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 pt-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] sm:w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[100px] sm:blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] sm:w-[50%] h-[50%] bg-secondary/10 dark:bg-secondary/20 blur-[100px] sm:blur-[150px] rounded-full" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 gradient-primary rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-2xl glow-primary rotate-12 animate-float">
            <Zap className="text-primary-foreground fill-primary-foreground" size={32} />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter text-foreground leading-none">
            UNILINGO
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">
            The Academic Nexus
          </p>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Revolutionize your university learning with gamified, interactive courses 
            tailored for students and universities.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="gradient-primary text-primary-foreground font-black text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl glow-primary hover:scale-105 transition-all w-full sm:w-auto"
          >
            Get Started for Free
            <ChevronRight className="ml-2" size={20} />
          </Button>
          <Button 
            onClick={onExploreCourses}
            variant="outline"
            size="lg"
            className="border-border bg-card/50 text-foreground font-black text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-card transition-all w-full sm:w-auto"
          >
            <Play className="mr-2" size={20} />
            Explore Free Courses
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-8 sm:pt-12">
          {[
            { value: '50K+', label: 'Students' },
            { value: '500+', label: 'Courses' },
            { value: '120', label: 'Universities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
