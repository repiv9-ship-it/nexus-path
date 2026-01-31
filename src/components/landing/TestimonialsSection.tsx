import { useState } from 'react';
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
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[active];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            What Students Say
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
            Real experiences from our community
          </p>
        </div>

        <div className="glass-card rounded-4xl p-12 relative">
          <Quote className="absolute top-8 left-8 text-primary/20" size={60} />
          
          <div className="text-center space-y-8">
            <p className="text-2xl md:text-3xl font-bold italic text-foreground leading-relaxed">
              "{testimonial.quote}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-xl">
                {testimonial.avatar}
              </div>
              <div className="text-left">
                <p className="font-black text-lg">{testimonial.author}</p>
                <p className="text-muted-foreground font-bold text-sm">
                  {testimonial.role} • {testimonial.university}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-xl"
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === active ? 'w-8 bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-xl"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
