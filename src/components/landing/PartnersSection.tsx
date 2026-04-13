import { useUniversities } from '@/hooks/useSupabaseData';

export function PartnersSection() {
  const { data: universities } = useUniversities();
  const partners = (universities || []).filter(u => u.status === 'active').slice(0, 6);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4">Trusted By Universities</h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs sm:text-sm">Partner institutions</p>
        </div>
        {partners.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {partners.map((uni) => (
              <div key={uni.id} className="glass-card w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center group cursor-pointer hover:scale-110 transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center text-foreground font-black text-xl sm:text-2xl group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                  {uni.name.charAt(0)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Partner universities will appear here</p>
          </div>
        )}
      </div>
    </section>
  );
}
