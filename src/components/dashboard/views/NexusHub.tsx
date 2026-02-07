import { Globe, Users, Star, ChevronRight, Sparkles, Rocket } from 'lucide-react';
import { GUILDS, GLOBAL_COURSES } from '@/lib/constants';

export function NexusHub() {
  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">THE GLOBAL NEXUS</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-2">
            Discover other guilds and knowledge
          </p>
        </div>
      </div>

      {/* Top Guilds */}
      <section className="space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl font-black italic flex items-center gap-2">
          <Globe className="text-primary" size={22} /> TOP RANKED GUILDS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {GUILDS.map((guild) => (
            <div 
              key={guild.id} 
              className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center text-foreground font-black text-xl sm:text-2xl group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                  {guild.icon}
                </div>
                <div>
                  <h4 className="font-black italic text-base sm:text-lg leading-tight">{guild.name}</h4>
                  <p className="text-xs text-muted-foreground font-bold uppercase">{guild.location}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-1 font-black text-primary text-sm">
                  <Users size={16} /> {guild.members}
                </div>
                <div className="flex items-center gap-1 font-black text-warning text-sm">
                  <Star size={16} fill="currentColor" /> {guild.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Challenges */}
      <section className="space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl font-black italic flex items-center gap-2">
          <Sparkles className="text-primary" size={22} /> GLOBAL CHALLENGES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {GLOBAL_COURSES.map((course) => (
            <div 
              key={course.id} 
              className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex items-center gap-4 sm:gap-6 group hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className={`${course.color} w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-primary-foreground shadow-xl group-hover:rotate-6 transition-transform shrink-0`}>
                <course.icon size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-primary font-black text-[10px] uppercase tracking-widest">{course.guild}</p>
                <h4 className="text-lg sm:text-2xl font-black italic tracking-tighter">{course.title}</h4>
                <p className="text-muted-foreground font-bold text-xs sm:text-sm">Earn {course.xp.toLocaleString()} XP • Advanced Level</p>
              </div>
              <ChevronRight className="text-muted-foreground shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
