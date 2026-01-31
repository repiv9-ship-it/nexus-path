import { UserPlus, Target, Award, TrendingUp, Gamepad2 } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Join the Nexus',
    description: 'Create your account as a free user or get invited by your university.',
  },
  {
    icon: Target,
    title: 'Choose Your Path',
    description: 'Select courses that match your goals and interests.',
  },
  {
    icon: Gamepad2,
    title: 'Gamified Learning',
    description: 'Progress through levels, complete quizzes, and earn XP.',
  },
  {
    icon: Award,
    title: 'Earn Badges',
    description: 'Collect achievements and certificates as you master skills.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your performance and compete on leaderboards.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-sidebar text-sidebar-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            How It Works
          </h2>
          <p className="text-sidebar-muted font-bold uppercase tracking-widest text-sm">
            Your journey to mastery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="relative text-center group animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              {/* Step Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-sm z-10">
                {i + 1}
              </div>

              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-sidebar-accent rounded-3xl flex items-center justify-center group-hover:gradient-primary transition-all duration-300">
                <step.icon className="text-sidebar-foreground group-hover:text-primary-foreground transition-colors" size={36} />
              </div>

              <h3 className="text-lg font-black italic mb-2">{step.title}</h3>
              <p className="text-sm text-sidebar-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
