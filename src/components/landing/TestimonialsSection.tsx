import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote: "UNILINGO transformed how I study. The gamification keeps me motivated every day!",
    author: "Sarah Chen",
    role: "Computer Science Student",
    university: "MIT",
    avatar: "SC",
  },
  {
    quote: "As a professor, I've seen incredible engagement since we adopted this platform.",
    author: "Dr. James Wilson",
    role: "Professor of Mathematics",
    university: "Stanford",
    avatar: "JW",
  },
  {
    quote: "The XP system and badges make learning addictive. I've completed 15 courses!",
    author: "Marcus Rodriguez",
    role: "Business Student",
    university: "Harvard",
    avatar: "MR",
  },
  {
    quote: "Managing our entire department on UNILINGO has streamlined everything.",
    author: "Prof. Lisa Park",
    role: "Department Head",
    university: "Oxford",
    avatar: "LP",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[active];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            What Students Say
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs sm:text-sm">
            Real experiences from our community
          </p>
        </div>

        <div className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-12 relative">
          <Quote className="absolute top-6 sm:top-8 left-6 sm:left-8 text-primary/10" size={48} />
          
          <div className="text-center space-y-6 sm:space-y-8">
            <p className="text-lg sm:text-2xl md:text-3xl font-bold italic text-foreground leading-relaxed">
              "{testimonial.quote}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-primary-foreground font-black text-lg sm:text-xl">
                {testimonial.avatar}
              </div>
              <div className="text-left">
                <p className="font-black text-base sm:text-lg">{testimonial.author}</p>
                <p className="text-muted-foreground font-bold text-xs sm:text-sm">
                  {testimonial.role} • {testimonial.university}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-xl w-10 h-10"
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-xl w-10 h-10"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
