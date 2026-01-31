import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function CTASection({ onSignUp, onLogin }: CTASectionProps) {
  return (
    <section className="py-24 px-6 bg-sidebar text-sidebar-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[100%] bg-primary/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[60%] h-[100%] bg-secondary/20 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 glow-primary animate-bounce-subtle">
          <Zap className="text-primary-foreground fill-primary-foreground" size={36} />
        </div>

        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6">
          Ready to Level Up?
        </h2>
        <p className="text-xl text-sidebar-muted max-w-2xl mx-auto mb-12">
          Join thousands of students already mastering their skills through gamified learning.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onSignUp}
            size="lg"
            className="gradient-primary text-primary-foreground font-black text-lg px-10 py-6 rounded-2xl shadow-xl glow-primary hover:scale-105 transition-all"
          >
            Sign Up Now
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button 
            onClick={onLogin}
            variant="outline"
            size="lg"
            className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground font-black text-lg px-10 py-6 rounded-2xl hover:bg-sidebar-accent/80 transition-all"
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </section>
  );
}
