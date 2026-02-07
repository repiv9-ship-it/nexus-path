import { PARTNERS } from '@/lib/constants';

export function PartnersSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            Trusted By Leading Universities
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs sm:text-sm">
            Partner institutions worldwide
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {PARTNERS.map((partner, i) => (
            <div 
              key={i}
              className="glass-card w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center group cursor-pointer hover:scale-110 transition-all duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center text-foreground font-black text-xl sm:text-2xl group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                {partner.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsors */}
        <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-border">
          <p className="text-center text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 sm:mb-8">
            Our Sponsors
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {['TechCorp', 'EduFund', 'InnovateLab', 'FutureEd'].map((sponsor, i) => (
              <div 
                key={i}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-muted rounded-lg sm:rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {sponsor}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
