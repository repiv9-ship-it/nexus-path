import { useState } from 'react';
import { Users, Briefcase, BookOpen, Mail, Clock, MapPin, MessageSquare, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, FileText, Plus, X, ChevronRight, RefreshCw, BadgeCheck, Award, ShieldCheck, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProfessors, useInternships, useInternshipApplications, useAttendance, useDocumentRequests, useCertificationRequests, useSubjects } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AcademicTab = 'professors' | 'internships' | 'attendance' | 'documents' | 'certifications';

const TABS: { id: AcademicTab; label: string; icon: typeof Users }[] = [
  { id: 'professors', label: 'Faculty', icon: Users },
  { id: 'internships', label: 'Internships', icon: Briefcase },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle },
  { id: 'documents', label: 'Requests', icon: FileText },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

const DOC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  en_attente: { label: 'Pending', color: 'text-warning bg-warning/10 border-warning/30' },
  en_cours: { label: 'Processing', color: 'text-primary bg-primary/10 border-primary/30' },
  traite: { label: 'Completed', color: 'text-success bg-success/10 border-success/30' },
  rejete: { label: 'Rejected', color: 'text-destructive bg-destructive/10 border-destructive/30' },
  approuve: { label: 'Approved', color: 'text-success bg-success/10 border-success/30' },
  envoye: { label: 'Sent', color: 'text-primary bg-primary/10 border-primary/30' },
};

function ProfessorsTab() {
  const { data: professors, loading } = useProfessors();
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!professors?.length) return <div className="text-center py-12 text-muted-foreground"><Users size={40} className="mx-auto mb-3 opacity-20" /><p className="font-bold">No faculty members found</p></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {professors.map((prof: any) => (
        <div key={prof.id} className="glass-card p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black shrink-0">
              {prof.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm leading-tight truncate">{prof.name}</p>
              {prof.department && <p className="text-muted-foreground text-[11px] font-bold">{prof.department}</p>}
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground font-bold">
            {prof.email && <div className="flex items-start gap-2"><Mail size={12} className="shrink-0 mt-0.5 text-primary" /><span className="truncate">{prof.email}</span></div>}
            {prof.office_hours && <div className="flex items-start gap-2"><Clock size={12} className="shrink-0 mt-0.5 text-primary" /><span>{prof.office_hours}</span></div>}
            {prof.office_location && <div className="flex items-start gap-2"><MapPin size={12} className="shrink-0 mt-0.5 text-primary" /><span>{prof.office_location}</span></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function InternshipsTab() {
  const { data: internships, loading } = useInternships();
  const { data: applications } = useInternshipApplications();
  const { user } = useAuth();

  const appliedIds = new Set((applications || []).map((a: any) => a.internship_id));

  const handleApply = async (internshipId: string) => {
    if (!user) return;
    const { error } = await supabase.from('internship_applications').insert({ internship_id: internshipId, user_id: user.id });
    if (error) toast.error(error.message);
    else toast.success('Application submitted!');
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!internships?.length) return <div className="text-center py-12 text-muted-foreground"><Briefcase size={40} className="mx-auto mb-3 opacity-20" /><p className="font-bold">No internships available</p></div>;

  return (
    <div className="space-y-4">
      {internships.map((offer: any) => {
        const hasApplied = appliedIds.has(offer.id);
        const daysLeft = offer.deadline ? Math.floor((new Date(offer.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        return (
          <div key={offer.id} className="glass-card p-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-base">{offer.title}</h4>
                <div className="flex items-center gap-3 flex-wrap text-xs font-bold text-muted-foreground mb-3">
                  <span className="font-black text-foreground">{offer.company}</span>
                  {offer.location && <span className="flex items-center gap-1"><MapPin size={11} /> {offer.location}</span>}
                  {offer.duration && <span className="flex items-center gap-1"><Clock size={11} /> {offer.duration}</span>}
                </div>
                {offer.description && <p className="text-muted-foreground text-sm">{offer.description}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {offer.deadline && <p className={`text-xs font-bold ${daysLeft !== null && daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>{new Date(offer.deadline).toLocaleDateString()}</p>}
                {hasApplied ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 rounded-lg">
                    <CheckCircle size={12} className="text-success" /><span className="text-success text-xs font-black">Applied</span>
                  </div>
                ) : (
                  <Button size="sm" className="h-8 text-xs font-black gradient-primary" onClick={() => handleApply(offer.id)}>Apply</Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AttendanceTab() {
  const { data: attendance, loading } = useAttendance();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  // Group by subject
  const bySubject: Record<string, { name: string; records: any[] }> = {};
  (attendance || []).forEach((a: any) => {
    const subName = a.subjects?.name || 'Unknown';
    if (!bySubject[subName]) bySubject[subName] = { name: subName, records: [] };
    bySubject[subName].records.push(a);
  });

  if (Object.keys(bySubject).length === 0) return <div className="text-center py-12 text-muted-foreground"><CheckCircle size={40} className="mx-auto mb-3 opacity-20" /><p className="font-bold">No attendance records</p></div>;

  return (
    <div className="space-y-3">
      {Object.entries(bySubject).map(([subName, data]) => {
        const total = data.records.length;
        const present = data.records.filter((r: any) => r.status === 'present').length;
        const unjustified = data.records.filter((r: any) => r.status === 'absent' && !r.is_justified).length;
        const isWarning = unjustified >= 3;
        const presentPct = total > 0 ? (present / total) * 100 : 100;

        return (
          <div key={subName} className={`glass-card rounded-xl overflow-hidden ${isWarning ? 'border-destructive/40' : ''}`}>
            <button onClick={() => setExpanded(expanded === subName ? null : subName)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWarning ? 'bg-destructive/10' : 'bg-success/10'}`}>
                  {isWarning ? <AlertTriangle size={18} className="text-destructive" /> : <CheckCircle size={18} className="text-success" />}
                </div>
                <div className="text-left">
                  <p className="font-black text-sm">{subName}</p>
                  {isWarning && <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive text-[10px] font-black rounded">⚠️ Warning</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><p className="font-black text-sm">{present}/{total}</p><p className="text-[10px] text-muted-foreground font-bold">Sessions</p></div>
                {expanded === subName ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </button>
            {expanded === subName && (
              <div className="border-t border-border px-4 pb-4">
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className={presentPct >= 80 ? 'text-success' : 'text-destructive'}>{presentPct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${presentPct >= 80 ? 'bg-success' : 'bg-destructive'}`} style={{ width: `${presentPct}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DocumentRequestsTab() {
  const { user } = useAuth();
  const { data: requests, loading, refetch } = useDocumentRequests();
  const { data: subjects } = useSubjects();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('attestation_presence');
  const [formSubject, setFormSubject] = useState('');
  const [formComment, setFormComment] = useState('');

  const handleSubmit = async () => {
    if (!user) return;
    const { error } = await supabase.from('document_requests').insert({
      user_id: user.id,
      request_type: formType,
      subject_id: formType === 'recorrection_examen' ? formSubject || null : null,
      comment: formComment || null,
    });
    if (error) toast.error(error.message);
    else { toast.success('Request submitted'); setShowForm(false); setFormComment(''); refetch(); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground font-bold text-sm">{(requests || []).length} request(s)</p>
        <Button size="sm" className="gradient-primary font-black text-xs" onClick={() => setShowForm(true)}><Plus size={14} className="mr-1" /> New Request</Button>
      </div>

      {showForm && (
        <div className="glass-card p-5 rounded-2xl space-y-4 border-primary/20">
          <div className="flex justify-between items-center">
            <p className="font-black text-sm">New Request</p>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-muted-foreground" /></button>
          </div>
          <Select value={formType} onValueChange={setFormType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="attestation_presence">Attestation de Présence</SelectItem>
              <SelectItem value="attestation_inscription">Attestation d'Inscription</SelectItem>
              <SelectItem value="recorrection_examen">Recorrection d'Examen</SelectItem>
            </SelectContent>
          </Select>
          {formType === 'recorrection_examen' && subjects && (
            <Select value={formSubject} onValueChange={setFormSubject}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Textarea value={formComment} onChange={e => setFormComment(e.target.value)} placeholder="Comment (optional)" />
          <Button className="gradient-primary font-black text-xs w-full" onClick={handleSubmit}><Send size={14} className="mr-1" /> Submit</Button>
        </div>
      )}

      <div className="space-y-3">
        {(requests || []).map((req: any) => {
          const cfg = DOC_STATUS_CONFIG[req.status] || DOC_STATUS_CONFIG.en_attente;
          return (
            <div key={req.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-black text-sm">{req.request_type.replace(/_/g, ' ')}</p>
                {req.subjects?.name && <p className="text-muted-foreground text-xs">{req.subjects.name}</p>}
                <p className="text-muted-foreground text-[10px]">{new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${cfg.color}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CertificationsTab() {
  const { user } = useAuth();
  const { data: certRequests, loading, refetch } = useCertificationRequests();
  const [showForm, setShowForm] = useState(false);
  const [certName, setCertName] = useState('');
  const [certType, setCertType] = useState('white_test');

  const handleSubmit = async () => {
    if (!user || !certName) return;
    const { error } = await supabase.from('certification_requests').insert({
      user_id: user.id,
      certification_name: certName,
      request_type: certType,
    });
    if (error) toast.error(error.message);
    else { toast.success('Request submitted'); setShowForm(false); setCertName(''); refetch(); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground font-bold text-sm">{(certRequests || []).length} request(s)</p>
        <Button size="sm" className="gradient-primary font-black text-xs" onClick={() => setShowForm(true)}><Plus size={14} className="mr-1" /> New Request</Button>
      </div>

      {showForm && (
        <div className="glass-card p-5 rounded-2xl space-y-4 border-primary/20">
          <Input value={certName} onChange={e => setCertName(e.target.value)} placeholder="Certification name (e.g. AWS Cloud Practitioner)" />
          <Select value={certType} onValueChange={setCertType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="white_test">White Test</SelectItem>
              <SelectItem value="voucher">Voucher Request</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-primary font-black text-xs w-full" onClick={handleSubmit}><Send size={14} className="mr-1" /> Submit</Button>
        </div>
      )}

      <div className="space-y-3">
        {(certRequests || []).map((req: any) => {
          const cfg = DOC_STATUS_CONFIG[req.status] || DOC_STATUS_CONFIG.en_attente;
          return (
            <div key={req.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-sm">{req.certification_name}</p>
                  <p className="text-muted-foreground text-xs">{req.request_type === 'white_test' ? 'White Test' : 'Voucher'} · {new Date(req.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${cfg.color}`}>{cfg.label}</span>
              </div>
              {req.voucher_code && <p className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded">{req.voucher_code}</p>}
              {req.admin_note && <p className="mt-2 text-xs text-muted-foreground italic">{req.admin_note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AcademicCenterView() {
  const [activeTab, setActiveTab] = useState<AcademicTab>('professors');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">ACADEMIC CENTER</h2>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Faculty, internships, attendance & requests</p>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'professors' && <ProfessorsTab />}
      {activeTab === 'internships' && <InternshipsTab />}
      {activeTab === 'attendance' && <AttendanceTab />}
      {activeTab === 'documents' && <DocumentRequestsTab />}
      {activeTab === 'certifications' && <CertificationsTab />}
    </div>
  );
}
