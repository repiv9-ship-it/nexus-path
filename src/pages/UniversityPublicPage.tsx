import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Mail, Phone, GraduationCap, ArrowLeft, Users, BookOpen } from 'lucide-react';
import { useUniversityBySlug } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function UniversityPublicPage() {
  const { slug } = useParams();
  const { data: uni, loading } = useUniversityBySlug(slug);
  const [stats, setStats] = useState({ profs: 0, classes: 0 });

  useEffect(() => {
    if (!uni?.id) return;
    (async () => {
      const [{ count: profs }, { count: classes }] = await Promise.all([
        supabase.from('professors').select('*', { count: 'exact', head: true }).eq('university_id', uni.id),
        supabase.from('classes').select('*', { count: 'exact', head: true }).eq('university_id', uni.id),
      ]);
      setStats({ profs: profs || 0, classes: classes || 0 });
    })();
  }, [uni?.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!uni) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Building2 size={48} className="text-muted-foreground/30" />
        <p className="font-bold">University not found</p>
        <Link to="/" className="text-sm text-primary underline">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/15 via-background to-secondary/10 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={14} /> Back to Unilingo
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground shadow-xl">
              {uni.logo_url ? <img src={uni.logo_url} alt={uni.name} className="w-full h-full rounded-2xl object-cover" /> : <Building2 size={36} />}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{uni.name}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <MapPin size={14} /> {[uni.city, uni.country].filter(Boolean).join(', ') || 'Tunisia'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl"><Users className="text-primary mb-2" size={20} /><p className="text-2xl font-black">{uni.active_seats || 0}</p><p className="text-xs text-muted-foreground font-bold uppercase">Active students</p></div>
          <div className="glass-card p-5 rounded-2xl"><GraduationCap className="text-secondary mb-2" size={20} /><p className="text-2xl font-black">{stats.profs}</p><p className="text-xs text-muted-foreground font-bold uppercase">Professors</p></div>
          <div className="glass-card p-5 rounded-2xl"><BookOpen className="text-success mb-2" size={20} /><p className="text-2xl font-black">{stats.classes}</p><p className="text-xs text-muted-foreground font-bold uppercase">Classes</p></div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <h2 className="font-black text-lg">Get in touch</h2>
          {uni.contact_email && <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-primary" /> {uni.contact_email}</p>}
          {uni.contact_phone && <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-primary" /> {uni.contact_phone}</p>}
        </div>

        <div className="glass-card p-6 rounded-2xl text-center">
          <h3 className="font-black text-lg mb-2">Want to join {uni.name}?</h3>
          <p className="text-sm text-muted-foreground mb-4">Sign up on Unilingo, then ask an administrator to invite you.</p>
          <Button asChild><Link to="/">Sign up on Unilingo</Link></Button>
        </div>
      </div>
    </div>
  );
}
