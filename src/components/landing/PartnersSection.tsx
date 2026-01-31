import { PARTNERS } from '@/lib/constants';

export function PartnersSection() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            Trusted By Leading Universities
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
            Partner institutions worldwide
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {PARTNERS.map((partner, i) => (
            <div 
              key={i}
              className="glass-card w-24 h-24 rounded-2xl flex items-center justify-center group cursor-pointer hover:scale-110 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-sidebar rounded-xl flex items-center justify-center text-sidebar-foreground font-black text-2xl group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                {partner.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsors */}
        <div className="mt-16 pt-16 border-t border-border">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">
            Our Sponsors
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {['TechCorp', 'EduFund', 'InnovateLab', 'FutureEd'].map((sponsor, i) => (
              <div 
                key={i}
                className="px-6 py-3 bg-muted rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
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
