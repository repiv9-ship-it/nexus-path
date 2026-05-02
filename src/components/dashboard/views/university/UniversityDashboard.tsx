import { useState } from 'react';
import { Building2, Users, BookOpen, GraduationCap, Plus, Settings, Calendar, DollarSign, FileText, Bell, BarChart3, CheckCircle, Mail, Send, Trash2, Award, Briefcase, Layout, UserPlus, ClipboardList, CreditCard, QrCode, Download, ArrowLeft, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  useProfiles, useSubjects, useSemesters, useAcademicYears, useAllDocumentRequests,
  useAllCertificationRequests, useScheduleEntries, useProfessors, useClasses,
  useUniversityInvitations, useAnnouncements, useAllSalaries, useUniversityModules,
  useStudentPayments, useExamSchedule, useInternships, useClassRoster, useClassSubjects,
} from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UniversityDashboardProps {
  activeSection?: string;
}

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
  approuve: 'bg-success/10 text-success border-success/30',
  pending: 'bg-warning/10 text-warning border-warning/30',
  accepted: 'bg-success/10 text-success border-success/30',
  declined: 'bg-destructive/10 text-destructive border-destructive/30',
  paid: 'bg-success/10 text-success border-success/30',
};

const MODULE_KEYS = [
  { key: 'certifications', label: 'Certifications' },
  { key: 'exams', label: 'Exams & QR' },
  { key: 'internships', label: 'Internships' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'finance', label: 'Student Payments' },
  { key: 'salaries', label: 'Salaries' },
];

export function UniversityDashboard({ activeSection = 'overview' }: UniversityDashboardProps) {
  const { user } = useAuth();
  const uniId = user?.universityId;

  const { data: profiles, refetch: refetchProfiles } = useProfiles(uniId);
  const { data: subjects, refetch: refetchSubjects } = useSubjects(undefined, uniId);
  const { data: semesters, refetch: refetchSemesters } = useSemesters();
  const { data: academicYears, refetch: refetchYears } = useAcademicYears();
  const { data: docRequests, refetch: refetchDocs } = useAllDocumentRequests();
  const { data: certRequests, refetch: refetchCerts } = useAllCertificationRequests();
  const { data: professors, refetch: refetchProfs } = useProfessors(uniId);
  const { data: classes, refetch: refetchClasses } = useClasses(uniId);
  const { data: invitations, refetch: refetchInvites } = useUniversityInvitations(uniId);
  const { data: announcements, refetch: refetchAnn } = useAnnouncements(uniId);
  const { data: salaries, refetch: refetchSalaries } = useAllSalaries(uniId);
  const { data: modules, refetch: refetchModules } = useUniversityModules(uniId);
  const { data: payments, refetch: refetchPayments } = useStudentPayments(undefined, uniId);
  const { data: exams, refetch: refetchExams } = useExamSchedule(undefined, uniId);
  const { data: internships, refetch: refetchInt } = useInternships(uniId);
  const { data: scheduleEntries, refetch: refetchSched } = useScheduleEntries(undefined, uniId);

  // ─── OVERVIEW ───
  if (activeSection === 'overview' || activeSection === 'university') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Administration</h2>
          <p className="text-muted-foreground text-sm mt-1">{user?.university || 'University'} overview</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: (profiles || []).length, icon: Users, color: 'text-primary' },
            { label: 'Professors', value: (professors || []).length, icon: GraduationCap, color: 'text-secondary' },
            { label: 'Classes', value: (classes || []).length, icon: Building2, color: 'text-success' },
            { label: 'Pending Requests', value: (docRequests || []).filter((d: any) => d.status === 'en_attente').length, icon: FileText, color: 'text-warning' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><s.icon size={18} className={s.color} /></div>
                <div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase">Latest Invitations</h3>
            {(invitations || []).slice(0, 5).map((i: any) => (
              <div key={i.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <Mail size={14} className="text-primary" />
                <div className="flex-1 text-xs"><p className="font-bold">{i.invited_email}</p><p className="text-muted-foreground">{i.role}</p></div>
                <Badge variant="outline" className={STATUS_COLORS[i.status]}>{i.status}</Badge>
              </div>
            ))}
            {(invitations || []).length === 0 && <p className="text-muted-foreground text-xs text-center py-4">No invitations sent yet</p>}
          </div>
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase">Recent Announcements</h3>
            {(announcements || []).slice(0, 5).map((a: any) => (
              <div key={a.id} className="p-2 rounded-lg bg-muted/30">
                <p className="font-bold text-xs">{a.title}</p>
                <p className="text-muted-foreground text-xs line-clamp-1">{a.content}</p>
              </div>
            ))}
            {(announcements || []).length === 0 && <p className="text-muted-foreground text-xs text-center py-4">No announcements yet</p>}
          </div>
        </div>
      </div>
    );
  }

  // ─── CLASSES ───
  if (activeSection === 'uni_classes') {
    return <ClassesSection classes={classes || []} uniId={uniId} academicYears={academicYears || []} subjects={subjects || []} semesters={semesters || []} refetch={() => { refetchClasses(); refetchSubjects(); }} refetchYears={refetchYears} refetchSemesters={refetchSemesters} />;
  }

  // ─── STUDENTS ───
  if (activeSection === 'uni_students') {
    return <StudentsSection profiles={profiles || []} classes={classes || []} uniId={uniId} refetch={refetchProfiles} refetchInvites={refetchInvites} invitations={invitations || []} />;
  }

  // ─── PROFESSORS ───
  if (activeSection === 'uni_professors') {
    return <ProfessorsSection professors={professors || []} classes={classes || []} uniId={uniId} refetch={refetchProfs} refetchInvites={refetchInvites} />;
  }

  // ─── ANNOUNCEMENTS ───
  if (activeSection === 'uni_announcements') {
    return <AnnouncementsSection announcements={announcements || []} classes={classes || []} uniId={uniId} userId={user?.id} refetch={refetchAnn} />;
  }

  // ─── EXAMS ───
  if (activeSection === 'uni_exams') {
    return <ExamsSection exams={exams || []} subjects={subjects || []} semesters={semesters || []} refetch={refetchExams} />;
  }

  // ─── INTERNSHIPS ───
  if (activeSection === 'uni_stages') {
    return <InternshipsSection internships={internships || []} refetch={refetchInt} />;
  }

  // ─── DOCUMENTS ───
  if (activeSection === 'uni_documents') {
    return <DocumentsSection docs={docRequests || []} refetch={refetchDocs} />;
  }

  // ─── CERTIFICATIONS ───
  if (activeSection === 'uni_certifications') {
    return <CertificationsSection certs={certRequests || []} refetch={refetchCerts} />;
  }

  // ─── FINANCE ───
  if (activeSection === 'uni_finance') {
    return <FinanceSection payments={payments || []} students={profiles || []} userId={user?.id} refetch={refetchPayments} />;
  }

  // ─── SALARIES ───
  if (activeSection === 'uni_salaries') {
    return <SalariesSection salaries={salaries || []} professors={professors || []} uniId={uniId} refetch={refetchSalaries} />;
  }

  // ─── MODULES ───
  if (activeSection === 'uni_modules') {
    return <ModulesSection modules={modules || []} uniId={uniId} refetch={refetchModules} />;
  }

  // ─── EMPLOYEES ───
  if (activeSection === 'uni_employees') {
    return <EmployeesSection profiles={profiles || []} refetch={refetchProfiles} />;
  }

  // ─── REPORTS ───
  if (activeSection === 'uni_reports') {
    return <ReportsSection profiles={profiles || []} professors={professors || []} classes={classes || []} subjects={subjects || []} payments={payments || []} salaries={salaries || []} />;
  }

  // ─── SCHEDULE EDITOR ───
  if (activeSection === 'uni_schedule') {
    return <ScheduleEditorSection entries={scheduleEntries || []} subjects={subjects || []} semesters={semesters || []} classes={classes || []} professors={professors || []} uniId={uniId} refetch={refetchSched} />;
  }

  return null;
}

function NoUniversityBanner() {
  return (
    <div className="glass-card p-8 rounded-2xl text-center">
      <Building2 size={36} className="mx-auto text-muted-foreground/30 mb-3" />
      <p className="font-bold">No university linked to your account</p>
      <p className="text-xs text-muted-foreground mt-1">Ask the platform super admin to attach you to a university workspace.</p>
    </div>
  );
}

// ════════════════ CLASSES SECTION ════════════════
function ClassesSection({ classes, uniId, academicYears, subjects, semesters, refetch, refetchYears, refetchSemesters }: any) {
  const [showCreate, setShowCreate] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [showSemester, setShowSemester] = useState(false);
  const [showSubject, setShowSubject] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [form, setForm] = useState({ name: '', level: 'L1', department: '', capacity: 50, academic_year_id: '' });
  const [yearForm, setYearForm] = useState({ name: '', is_current: false });
  const [semForm, setSemForm] = useState({ name: '', number: 1, academic_year_id: '' });
  const [subForm, setSubForm] = useState({ name: '', code: '', credits: 3, semester_id: '', module_group: '' });

  const create = async () => {
    if (!form.name) return toast.error('Name required');
    const { error } = await supabase.from('classes').insert({ ...form, university_id: uniId });
    if (error) return toast.error(error.message);
    toast.success('Class created');
    setShowCreate(false);
    setForm({ name: '', level: 'L1', department: '', capacity: 50, academic_year_id: '' });
    refetch();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this class?')) return;
    await supabase.from('classes').delete().eq('id', id);
    toast.success('Class deleted');
    refetch();
  };

  const createYear = async () => {
    if (!yearForm.name) return toast.error('Name required');
    const { error } = await supabase.from('academic_years').insert(yearForm);
    if (error) return toast.error(error.message);
    toast.success('Academic year added');
    setShowYear(false);
    setYearForm({ name: '', is_current: false });
    refetchYears();
  };

  const createSemester = async () => {
    if (!semForm.name || !semForm.academic_year_id) return toast.error('Name and year required');
    const { error } = await supabase.from('semesters').insert(semForm);
    if (error) return toast.error(error.message);
    toast.success('Semester added');
    setShowSemester(false);
    setSemForm({ name: '', number: 1, academic_year_id: '' });
    refetchSemesters();
  };

  const createSubject = async () => {
    if (!subForm.name || !subForm.semester_id) return toast.error('Name and semester required');
    const { error } = await supabase.from('subjects').insert({ ...subForm, class_id: selectedClass?.id });
    if (error) return toast.error(error.message);
    toast.success('Subject added');
    setShowSubject(false);
    setSubForm({ name: '', code: '', credits: 3, semester_id: '', module_group: '' });
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-black tracking-tight">Academic Structure</h2>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setShowYear(true)}><Plus size={14} className="mr-1" /> Year</Button>
          <Button size="sm" variant="outline" onClick={() => setShowSemester(true)}><Plus size={14} className="mr-1" /> Semester</Button>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> Class</Button>
        </div>
      </div>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes ({classes.length})</TabsTrigger>
          <TabsTrigger value="years">Years ({academicYears.length})</TabsTrigger>
          <TabsTrigger value="subjects">Subjects ({subjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-4 space-y-2">
          {classes.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl">
              <Building2 size={36} className="mx-auto text-muted-foreground/20 mb-3" />
              <p className="font-bold text-muted-foreground text-sm">No classes yet</p>
            </div>
          ) : classes.map((c: any) => (
            <div key={c.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{c.name} <span className="text-xs text-muted-foreground ml-2">{c.level} · {c.department || '—'}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">Capacity: {c.capacity} · Subjects: {subjects.filter((s: any) => s.class_id === c.id).length}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setSelectedClass(c); setShowSubject(true); }}><Plus size={12} className="mr-1" /> Subject</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(c.id)}><Trash2 size={14} className="text-destructive" /></Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="years" className="mt-4 space-y-2">
          {academicYears.map((y: any) => (
            <div key={y.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{y.name}{y.is_current && <Badge variant="outline" className="ml-2">Current</Badge>}</p>
                <p className="text-xs text-muted-foreground">{semesters.filter((s: any) => s.academic_year_id === y.id).length} semesters</p>
              </div>
              <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('academic_years').delete().eq('id', y.id); refetchYears(); }}><Trash2 size={14} className="text-destructive" /></Button>
            </div>
          ))}
          {academicYears.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No academic years</p>}
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 space-y-2">
          {subjects.map((s: any) => (
            <div key={s.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{s.name} {s.code && <span className="text-xs text-muted-foreground">({s.code})</span>}</p>
                <p className="text-xs text-muted-foreground">{s.credits} credits · {s.module_group || '—'}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('subjects').delete().eq('id', s.id); refetch(); }}><Trash2 size={14} className="text-destructive" /></Button>
            </div>
          ))}
          {subjects.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No subjects</p>}
        </TabsContent>
      </Tabs>

      {/* Create class dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Class</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Class name (e.g. ING2-A)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Level (L1, L2, ING2...)" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
            <Input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            <Input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 50 })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.academic_year_id} onChange={e => setForm({ ...form, academic_year_id: e.target.value })}>
              <option value="">Academic year (optional)</option>
              {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </div>
          <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create year dialog */}
      <Dialog open={showYear} onOpenChange={setShowYear}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Academic Year</DialogTitle></DialogHeader>
          <Input placeholder="2025-2026" value={yearForm.name} onChange={e => setYearForm({ ...yearForm, name: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={yearForm.is_current} onChange={e => setYearForm({ ...yearForm, is_current: e.target.checked })} /> Current year</label>
          <DialogFooter><Button onClick={createYear}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create semester dialog */}
      <Dialog open={showSemester} onOpenChange={setShowSemester}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Semester</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name (e.g. S1)" value={semForm.name} onChange={e => setSemForm({ ...semForm, name: e.target.value })} />
            <Input type="number" placeholder="Number" value={semForm.number} onChange={e => setSemForm({ ...semForm, number: parseInt(e.target.value) || 1 })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={semForm.academic_year_id} onChange={e => setSemForm({ ...semForm, academic_year_id: e.target.value })}>
              <option value="">Academic year</option>
              {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </div>
          <DialogFooter><Button onClick={createSemester}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create subject dialog */}
      <Dialog open={showSubject} onOpenChange={setShowSubject}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Subject{selectedClass && ` to ${selectedClass.name}`}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Subject name" value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} />
            <Input placeholder="Code" value={subForm.code} onChange={e => setSubForm({ ...subForm, code: e.target.value })} />
            <Input type="number" placeholder="Credits" value={subForm.credits} onChange={e => setSubForm({ ...subForm, credits: parseInt(e.target.value) || 3 })} />
            <Input placeholder="Module group (Panier)" value={subForm.module_group} onChange={e => setSubForm({ ...subForm, module_group: e.target.value })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={subForm.semester_id} onChange={e => setSubForm({ ...subForm, semester_id: e.target.value })}>
              <option value="">Semester</option>
              {semesters.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <DialogFooter><Button onClick={createSubject}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ STUDENTS SECTION ════════════════
function StudentsSection({ profiles, classes, uniId, refetch, refetchInvites, invitations }: any) {
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ invited_email: '', class_id: '', message: '' });

  const sendInvite = async () => {
    if (!form.invited_email) return toast.error('Email required');
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { error } = await supabase.from('university_invitations').insert({
      university_id: uniId,
      class_id: form.class_id || null,
      invited_email: form.invited_email.toLowerCase().trim(),
      role: 'student',
      message: form.message || null,
      invited_by: authUser?.id,
    });
    if (error) return toast.error(error.message);
    toast.success('Invitation sent');
    setShowInvite(false);
    setForm({ invited_email: '', class_id: '', message: '' });
    refetchInvites();
  };

  const filtered = profiles.filter((p: any) =>
    `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );
  const pendingInvites = invitations.filter((i: any) => i.status === 'pending' && i.role === 'student');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-black tracking-tight">Students</h2>
        <Button onClick={() => setShowInvite(true)} className="gradient-primary"><UserPlus size={14} className="mr-1" /> Invite Student</Button>
      </div>

      <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      {pendingInvites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-muted-foreground">Pending Invitations ({pendingInvites.length})</h3>
          {pendingInvites.map((i: any) => (
            <div key={i.id} className="glass-card p-3 rounded-xl flex items-center justify-between">
              <div className="text-sm"><p className="font-semibold">{i.invited_email}</p><p className="text-xs text-muted-foreground">{i.classes?.name || 'No class'}</p></div>
              <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('university_invitations').delete().eq('id', i.id); refetchInvites(); }}><Trash2 size={14} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-black uppercase">Name</th>
            <th className="text-left px-4 py-3 text-xs font-black uppercase">Email</th>
            <th className="text-left px-4 py-3 text-xs font-black uppercase">Level</th>
            <th className="text-left px-4 py-3 text-xs font-black uppercase">Joined</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No students</td></tr>
            ) : filtered.map((p: any) => (
              <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                <td className="px-4 py-3 font-bold">{p.first_name} {p.last_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3"><Badge variant="outline">{p.level || 'L1'}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Student</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Student email" type="email" value={form.invited_email} onChange={e => setForm({ ...form, invited_email: e.target.value })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}>
              <option value="">Assign to class (optional)</option>
              {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Textarea placeholder="Optional message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={sendInvite}><Send size={14} className="mr-1" /> Send Invite</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ PROFESSORS SECTION ════════════════
function ProfessorsSection({ professors, classes, uniId, refetch, refetchInvites }: any) {
  const [showInvite, setShowInvite] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ invited_email: '', message: '' });
  const [profForm, setProfForm] = useState({ name: '', email: '', department: '', bio: '', office_hours: '', office_location: '' });

  const sendInvite = async () => {
    if (!form.invited_email) return toast.error('Email required');
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { error } = await supabase.from('university_invitations').insert({
      university_id: uniId, invited_email: form.invited_email.toLowerCase().trim(),
      role: 'professor', message: form.message || null, invited_by: authUser?.id,
    });
    if (error) return toast.error(error.message);
    toast.success('Invitation sent');
    setShowInvite(false);
    setForm({ invited_email: '', message: '' });
    refetchInvites();
  };

  const createProf = async () => {
    if (!profForm.name) return toast.error('Name required');
    const { error } = await supabase.from('professors').insert(profForm);
    if (error) return toast.error(error.message);
    toast.success('Professor added');
    setShowCreate(false);
    setProfForm({ name: '', email: '', department: '', bio: '', office_hours: '', office_location: '' });
    refetch();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this professor?')) return;
    await supabase.from('professors').delete().eq('id', id);
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-black tracking-tight">Professors</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreate(true)}><Plus size={14} className="mr-1" /> Add</Button>
          <Button onClick={() => setShowInvite(true)} className="gradient-primary"><Mail size={14} className="mr-1" /> Invite</Button>
        </div>
      </div>

      {professors.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <GraduationCap size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground">No professors</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {professors.map((p: any) => (
            <div key={p.id} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black">{p.name?.slice(0, 2).toUpperCase()}</div>
                <div className="flex-1"><p className="font-black text-sm">{p.name}</p>{p.department && <p className="text-muted-foreground text-xs">{p.department}</p>}</div>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 size={14} className="text-destructive" /></Button>
              </div>
              {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
              {p.office_hours && <p className="text-xs text-muted-foreground mt-1">📅 {p.office_hours}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Professor</DialogTitle></DialogHeader>
          <Input placeholder="Professor email" type="email" value={form.invited_email} onChange={e => setForm({ ...form, invited_email: e.target.value })} />
          <Textarea placeholder="Optional message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <DialogFooter><Button onClick={sendInvite}><Send size={14} className="mr-1" /> Send</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Professor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={profForm.name} onChange={e => setProfForm({ ...profForm, name: e.target.value })} />
            <Input placeholder="Email" value={profForm.email} onChange={e => setProfForm({ ...profForm, email: e.target.value })} />
            <Input placeholder="Department" value={profForm.department} onChange={e => setProfForm({ ...profForm, department: e.target.value })} />
            <Input placeholder="Office hours" value={profForm.office_hours} onChange={e => setProfForm({ ...profForm, office_hours: e.target.value })} />
            <Input placeholder="Office location" value={profForm.office_location} onChange={e => setProfForm({ ...profForm, office_location: e.target.value })} />
            <Textarea placeholder="Bio" value={profForm.bio} onChange={e => setProfForm({ ...profForm, bio: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={createProf}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ ANNOUNCEMENTS ════════════════
function AnnouncementsSection({ announcements, classes, uniId, userId, refetch }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', audience: 'all', priority: 'normal', class_id: '' });

  const create = async () => {
    if (!form.title || !form.content) return toast.error('Title and content required');
    const { error } = await supabase.from('announcements').insert({
      ...form, university_id: uniId, author_id: userId, class_id: form.class_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success('Announcement posted');
    setShow(false);
    setForm({ title: '', content: '', audience: 'all', priority: 'normal', class_id: '' });
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Announcements</h2>
        <Button onClick={() => setShow(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> New</Button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Bell size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a: any) => (
            <div key={a.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm">{a.title}</p>
                  {a.priority !== 'normal' && <Badge variant="outline" className={a.priority === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}>{a.priority}</Badge>}
                </div>
                <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('announcements').delete().eq('id', a.id); refetch(); }}><Trash2 size={14} className="text-destructive" /></Button>
              </div>
              <p className="text-sm text-muted-foreground">{a.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{a.audience} · {a.classes?.name || 'all classes'} · {new Date(a.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="professors">Professors</option>
              <option value="staff">Staff</option>
              <option value="class">Specific class</option>
            </select>
            {form.audience === 'class' && (
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}>
                <option value="">Select class</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <DialogFooter><Button onClick={create}>Post</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ EXAMS ════════════════
function ExamsSection({ exams, subjects, semesters, refetch }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ subject_id: '', semester_id: '', exam_date: '', duration_minutes: 120, room: '', exam_type: 'exam' });

  const create = async () => {
    if (!form.subject_id || !form.exam_date || !form.semester_id) return toast.error('Required fields missing');
    const { error } = await supabase.from('exam_schedule').insert(form);
    if (error) return toast.error(error.message);
    toast.success('Exam scheduled');
    setShow(false);
    setForm({ subject_id: '', semester_id: '', exam_date: '', duration_minutes: 120, room: '', exam_type: 'exam' });
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Exams Schedule</h2>
        <Button onClick={() => setShow(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> Schedule</Button>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <QrCode size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground">No exams scheduled</p>
        </div>
      ) : (
        <div className="space-y-2">
          {exams.map((e: any) => (
            <div key={e.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{e.subjects?.name || 'Exam'} <Badge variant="outline" className="ml-2">{e.exam_type}</Badge></p>
                <p className="text-xs text-muted-foreground">{new Date(e.exam_date).toLocaleString()} · {e.duration_minutes}min · {e.room || 'TBA'}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('exam_schedule').delete().eq('id', e.id); refetch(); }}><Trash2 size={14} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Exam</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
              <option value="">Subject</option>
              {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.semester_id} onChange={e => setForm({ ...form, semester_id: e.target.value })}>
              <option value="">Semester</option>
              {semesters.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Input type="datetime-local" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} />
            <Input type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 120 })} />
            <Input placeholder="Room" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })}>
              <option value="exam">Exam</option>
              <option value="rattrapage">Rattrapage</option>
              <option value="td">TD</option>
            </select>
          </div>
          <DialogFooter><Button onClick={create}>Schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ INTERNSHIPS ════════════════
function InternshipsSection({ internships, refetch }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', duration: '', deadline: '' });

  const create = async () => {
    if (!form.title || !form.company) return toast.error('Title and company required');
    const { error } = await supabase.from('internships').insert({ ...form, deadline: form.deadline || null, is_published: true });
    if (error) return toast.error(error.message);
    toast.success('Internship posted');
    setShow(false);
    setForm({ title: '', company: '', description: '', location: '', duration: '', deadline: '' });
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Internships</h2>
        <Button onClick={() => setShow(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> New</Button>
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Briefcase size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground">No internships posted</p>
        </div>
      ) : (
        <div className="space-y-3">
          {internships.map((i: any) => (
            <div key={i.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{i.title} · <span className="text-muted-foreground">{i.company}</span></p>
                <p className="text-xs text-muted-foreground">{i.location} · {i.duration}{i.deadline && ` · Deadline ${new Date(i.deadline).toLocaleDateString()}`}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('internships').delete().eq('id', i.id); refetch(); }}><Trash2 size={14} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader><DialogTitle>Post Internship</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Duration (e.g. 6 months)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
            <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={create}>Post</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ DOCUMENTS ════════════════
function DocumentsSection({ docs, refetch }: any) {
  const update = async (id: string, status: string) => {
    await supabase.from('document_requests').update({ status }).eq('id', id);
    toast.success('Updated');
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black">Document Requests</h2>
      {docs.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl"><FileText size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No requests</p></div>
      ) : (
        <div className="space-y-3">
          {docs.map((d: any) => (
            <div key={d.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-black text-sm">{d.request_type.replace(/_/g, ' ')}</p>
                {d.subjects?.name && <p className="text-muted-foreground text-xs">{d.subjects.name}</p>}
                <p className="text-muted-foreground text-[10px]">{new Date(d.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className={STATUS_COLORS[d.status]}>{d.status}</Badge>
              {d.status === 'en_attente' && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => update(d.id, 'traite')}><CheckCircle size={12} /></Button>
                  <Button size="sm" variant="outline" onClick={() => update(d.id, 'rejete')}>✕</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════ CERTIFICATIONS ════════════════
function CertificationsSection({ certs, refetch }: any) {
  const update = async (id: string, status: string) => {
    await supabase.from('certification_requests').update({ status }).eq('id', id);
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black">Certification Requests</h2>
      {certs.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl"><Award size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No requests</p></div>
      ) : certs.map((c: any) => (
        <div key={c.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="font-black text-sm">{c.certification_name}</p>
            <p className="text-xs text-muted-foreground">{c.request_type} · {new Date(c.created_at).toLocaleDateString()}</p>
          </div>
          <Badge variant="outline" className={STATUS_COLORS[c.status]}>{c.status}</Badge>
          {c.status === 'en_attente' && (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => update(c.id, 'approuve')}><CheckCircle size={12} /></Button>
              <Button size="sm" variant="outline" onClick={() => update(c.id, 'rejete')}>✕</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ════════════════ FINANCE ════════════════
function FinanceSection({ payments, students, userId, refetch }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ student_id: '', amount: 0, total_due: 7000, payment_method: 'cash', note: '' });

  const create = async () => {
    if (!form.student_id || !form.amount) return toast.error('Required fields');
    const { error } = await supabase.from('student_payments').insert({ ...form, recorded_by: userId });
    if (error) return toast.error(error.message);
    toast.success('Payment recorded');
    setShow(false);
    setForm({ student_id: '', amount: 0, total_due: 7000, payment_method: 'cash', note: '' });
    refetch();
  };

  const totalCollected = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Student Payments</h2>
        <Button onClick={() => setShow(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> Record</Button>
      </div>
      <div className="glass-card p-4 rounded-2xl"><p className="text-xs uppercase text-muted-foreground">Total Collected</p><p className="text-2xl font-black">{totalCollected.toFixed(2)} TND</p></div>
      {payments.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl"><CreditCard size={36} className="mx-auto text-muted-foreground/20 mb-3" /><p className="font-bold text-muted-foreground text-sm">No payments yet</p></div>
      ) : (
        <div className="space-y-2">
          {payments.map((p: any) => {
            const student = students.find((s: any) => s.user_id === p.student_id);
            return (
              <div key={p.id} className="glass-card p-3 rounded-xl flex items-center justify-between">
                <div><p className="font-bold text-sm">{student ? `${student.first_name} ${student.last_name}` : p.student_id.slice(0, 8)}</p><p className="text-xs text-muted-foreground">{p.receipt_number} · {p.payment_method}</p></div>
                <div className="text-right"><p className="font-black text-sm">{Number(p.amount).toFixed(2)} TND</p><p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p></div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}>
              <option value="">Student</option>
              {students.map((s: any) => <option key={s.user_id} value={s.user_id}>{s.first_name} {s.last_name}</option>)}
            </select>
            <Input type="number" placeholder="Amount (TND)" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
            <Input type="number" placeholder="Total due" value={form.total_due} onChange={e => setForm({ ...form, total_due: parseFloat(e.target.value) || 0 })} />
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="check">Check</option>
              <option value="card">Card</option>
            </select>
            <Textarea placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={create}>Record</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ SALARIES ════════════════
function SalariesSection({ salaries, professors, uniId, refetch }: any) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ professor_id: '', period: '', amount: 0, note: '' });

  const create = async () => {
    if (!form.professor_id || !form.period) return toast.error('Required fields');
    const prof = professors.find((p: any) => p.id === form.professor_id);
    const { error } = await supabase.from('professor_salaries').insert({
      professor_id: form.professor_id, user_id: prof?.user_id || null,
      university_id: uniId, period: form.period, amount: form.amount, note: form.note,
    });
    if (error) return toast.error(error.message);
    toast.success('Salary recorded');
    setShow(false);
    setForm({ professor_id: '', period: '', amount: 0, note: '' });
    refetch();
  };

  const markPaid = async (id: string) => {
    await supabase.from('professor_salaries').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id);
    refetch();
  };

  const totalPaid = salaries.filter((s: any) => s.status === 'paid').reduce((sum: number, s: any) => sum + Number(s.amount), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Professor Salaries</h2>
        <Button onClick={() => setShow(true)} className="gradient-primary"><Plus size={14} className="mr-1" /> Add</Button>
      </div>
      <div className="glass-card p-4 rounded-2xl"><p className="text-xs uppercase text-muted-foreground">Total Paid</p><p className="text-2xl font-black">{totalPaid.toFixed(2)} TND</p></div>

      {salaries.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl"><DollarSign size={36} className="mx-auto text-muted-foreground/20 mb-3" /><p className="font-bold text-muted-foreground text-sm">No salaries recorded</p></div>
      ) : (
        <div className="space-y-2">
          {salaries.map((s: any) => (
            <div key={s.id} className="glass-card p-3 rounded-xl flex items-center justify-between">
              <div><p className="font-bold text-sm">{s.professors?.name || '—'}</p><p className="text-xs text-muted-foreground">{s.period} · {Number(s.amount).toFixed(2)} {s.currency}</p></div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={STATUS_COLORS[s.status]}>{s.status}</Badge>
                {s.status !== 'paid' && <Button size="sm" variant="outline" onClick={() => markPaid(s.id)}>Mark Paid</Button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Salary</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.professor_id} onChange={e => setForm({ ...form, professor_id: e.target.value })}>
              <option value="">Professor</option>
              {professors.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Input placeholder="Period (e.g. 2026-04)" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
            <Input type="number" placeholder="Amount (TND)" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
            <Textarea placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          </div>
          <DialogFooter><Button onClick={create}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ════════════════ MODULES VISIBILITY ════════════════
function ModulesSection({ modules, uniId, refetch }: any) {
  const toggle = async (key: string, current: boolean) => {
    if (!uniId) return toast.error('No university selected');
    const existing = modules.find((m: any) => m.module_key === key);
    if (existing) {
      await supabase.from('university_modules').update({ is_enabled: !current, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('university_modules').insert({ university_id: uniId, module_key: key, is_enabled: !current });
    }
    refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black">Module Visibility</h2>
      <p className="text-muted-foreground text-sm">Toggle which platform features are visible to your university users.</p>
      <div className="space-y-2">
        {MODULE_KEYS.map(({ key, label }) => {
          const m = modules.find((x: any) => x.module_key === key);
          const enabled = m ? m.is_enabled : true;
          return (
            <div key={key} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div><p className="font-bold text-sm">{label}</p><p className="text-xs text-muted-foreground">{enabled ? 'Visible to all' : 'Hidden'}</p></div>
              <Button variant={enabled ? 'outline' : 'default'} size="sm" onClick={() => toggle(key, enabled)}>{enabled ? 'Disable' : 'Enable'}</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════ EMPLOYEES ════════════════
function EmployeesSection({ profiles, refetch }: any) {
  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black">Employees & Roles</h2>
      <p className="text-muted-foreground text-sm">All users with profiles linked to your university.</p>
      {profiles.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl"><Users size={36} className="mx-auto text-muted-foreground/20 mb-3" /><p className="font-bold text-muted-foreground text-sm">No users</p></div>
      ) : (
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left px-4 py-3 text-xs font-black uppercase">Name</th><th className="text-left px-4 py-3 text-xs font-black uppercase">Email</th><th className="text-left px-4 py-3 text-xs font-black uppercase">Roles</th><th className="text-left px-4 py-3 text-xs font-black uppercase">Department</th></tr></thead>
            <tbody>
              {profiles.map((p: any) => (
                <tr key={p.id} className="border-b border-border/30">
                  <td className="px-4 py-3 font-bold">{p.first_name} {p.last_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">{(p.user_roles || []).map((r: any, i: number) => <Badge key={i} variant="outline">{r.role}</Badge>)}</div></td>
                  <td className="px-4 py-3 text-xs">{p.department || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ════════════════ REPORTS ════════════════
function ReportsSection({ profiles, professors, classes, subjects, payments, salaries }: any) {
  const totalRevenue = payments.reduce((s: number, p: any) => s + Number(p.amount), 0);
  const totalSalaries = salaries.filter((s: any) => s.status === 'paid').reduce((s: number, x: any) => s + Number(x.amount), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black">Reports</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: profiles.length },
          { label: 'Total Professors', value: professors.length },
          { label: 'Total Classes', value: classes.length },
          { label: 'Total Subjects', value: subjects.length },
          { label: 'Revenue', value: `${totalRevenue.toFixed(0)} TND` },
          { label: 'Salaries Paid', value: `${totalSalaries.toFixed(0)} TND` },
          { label: 'Net', value: `${(totalRevenue - totalSalaries).toFixed(0)} TND` },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl">
            <p className="text-xs uppercase text-muted-foreground font-bold">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
