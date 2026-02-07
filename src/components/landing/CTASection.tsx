import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function CTASection({ onSignUp, onLogin }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[100%] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[60%] h-[100%] bg-secondary/5 dark:bg-secondary/10 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 glow-primary animate-bounce-subtle">
          <Zap className="text-primary-foreground fill-primary-foreground" size={32} />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter mb-4 sm:mb-6">
          Ready to Level Up?
        </h2>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12">
          Join thousands of students already mastering their skills through gamified learning.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            onClick={onSignUp}
            size="lg"
            className="gradient-primary text-primary-foreground font-black text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl glow-primary hover:scale-105 transition-all"
          >
            Sign Up Now
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button 
            onClick={onLogin}
            variant="outline"
            size="lg"
            className="border-border bg-background text-foreground font-black text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-muted transition-all"
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </section>
  );
}
