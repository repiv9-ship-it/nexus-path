import { Globe, Users, Star, ChevronRight, Sparkles, Rocket } from 'lucide-react';
import { GUILDS, GLOBAL_COURSES } from '@/lib/constants';

export function NexusHub() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none">THE GLOBAL NEXUS</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-2">
            Discover other guilds and forbidden knowledge
          </p>
        </div>
      </div>

      {/* Top Guilds */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black italic flex items-center gap-2">
          <Globe className="text-primary" /> TOP RANKED GUILDS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUILDS.map((guild) => (
            <div 
              key={guild.id} 
              className="glass-card p-6 rounded-3xl hover:scale-105 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-sidebar rounded-2xl flex items-center justify-center text-sidebar-foreground font-black text-2xl group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                  {guild.icon}
                </div>
                <div>
                  <h4 className="font-black italic text-lg leading-tight">{guild.name}</h4>
                  <p className="text-xs text-muted-foreground font-bold uppercase">{guild.location}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
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
      <section className="space-y-6">
        <h3 className="text-2xl font-black italic flex items-center gap-2">
          <Sparkles className="text-primary" /> GLOBAL CHALLENGES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GLOBAL_COURSES.map((course) => (
            <div 
              key={course.id} 
              className="glass-card p-8 rounded-4xl flex items-center gap-6 group hover:border-primary transition-all cursor-pointer"
            >
              <div className={`${course.color} w-20 h-20 rounded-3xl flex items-center justify-center text-primary-foreground shadow-xl group-hover:rotate-6 transition-transform`}>
                <course.icon size={36} />
              </div>
              <div className="flex-1">
                <p className="text-primary font-black text-[10px] uppercase tracking-widest">{course.guild}</p>
                <h4 className="text-2xl font-black italic tracking-tighter">{course.title}</h4>
                <p className="text-muted-foreground font-bold text-sm">Earn {course.xp.toLocaleString()} XP • Advanced Level</p>
              </div>
              <ChevronRight className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
