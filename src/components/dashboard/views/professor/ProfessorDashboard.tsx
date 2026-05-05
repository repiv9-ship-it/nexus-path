import { useState, useEffect, useMemo } from 'react';
import { Plus, Users, BookOpen, TrendingUp, Calendar, Clock, CheckSquare, DollarSign, MessageSquare, Upload, FileText, Bell, Send, Edit, Save, Trash2, Link as LinkIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSubjects, useScheduleEntries, useAllAttendance, useAllMarks, useSemesters, useMySalaries, useClasses, useClassRoster, useCourseMaterials, useMyMeetings, useAnnouncements } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/lib/upload';
import { toast } from 'sonner';

interface ProfessorDashboardProps {
  activeSection?: string;
}

export function ProfessorDashboard({ activeSection = 'overview' }: ProfessorDashboardProps) {
  const { user } = useAuth();
  const uniId = user?.universityId;
  const { data: subjects } = useSubjects(undefined, uniId);
  const { data: semesters } = useSemesters();
  const currentSemester = semesters?.find((s: any) => s.is_current);
  const { data: scheduleEntries } = useScheduleEntries(currentSemester?.id, uniId);
  const { data: allAttendance } = useAllAttendance();
  const { data: allMarks } = useAllMarks();
  const { data: classes } = useClasses(uniId);

  // ═══ OVERVIEW ═══
  if (activeSection === 'overview' || activeSection === 'professor') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Welcome, Professor {user?.name?.split(' ')[0] || ''}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Subjects', value: subjects?.length || 0, icon: BookOpen, color: 'text-success' },
            { label: 'Sessions Today', value: (scheduleEntries || []).filter((e: any) => e.day_of_week === new Date().getDay()).length, icon: Calendar, color: 'text-warning' },
            { label: 'My Classes', value: classes?.length || 0, icon: Users, color: 'text-primary' },
            { label: 'Marks Recorded', value: (allMarks || []).length, icon: TrendingUp, color: 'text-secondary' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><stat.icon size={18} className={stat.color} /></div>
                <div><p className={`text-xl font-black ${stat.color}`}>{stat.value}</p><p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Clock size={14} className="text-primary" /> Upcoming Sessions</h3>
            {(scheduleEntries || []).length === 0 ? <p className="text-muted-foreground text-sm text-center py-6">No sessions scheduled</p> :
              (scheduleEntries || []).slice(0, 5).map((s: any) => (
                <div key={s.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0 min-w-[44px]"><p className="font-black text-xs">{s.start_time?.slice(0, 5)}</p><p className="text-muted-foreground text-[10px]">{s.end_time?.slice(0, 5)}</p></div>
                  <div className="flex-1 min-w-0"><p className="font-black text-xs truncate">{s.subjects?.name || 'Subject'}</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5"><span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.entry_type}</span>{s.room && <span className="text-muted-foreground text-[10px]">{s.room}</span>}</div>
                  </div>
                </div>
              ))}
          </div>
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><BookOpen size={14} className="text-primary" /> My Subjects</h3>
            {(subjects || []).length === 0 ? <p className="text-muted-foreground text-sm text-center py-6">No subjects assigned</p> :
              (subjects || []).slice(0, 6).map((sub: any) => (
                <div key={sub.id} className="glass-card p-3 rounded-xl"><p className="font-black text-xs">{sub.name}</p><p className="text-muted-foreground text-[10px]">{sub.code} · {sub.credits} credits</p></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'prof_sessions') return <SessionsView scheduleEntries={scheduleEntries || []} />;
  if (activeSection === 'prof_attendance') return <AttendanceMarker classes={classes || []} subjects={subjects || []} uniId={uniId} />;
  if (activeSection === 'prof_courses' || activeSection === 'prof_my_courses') return <CoursesAndMaterials subjects={subjects || []} classes={classes || []} uniId={uniId} />;
  if (activeSection === 'prof_schedule') return <ScheduleView scheduleEntries={scheduleEntries || []} />;
  if (activeSection === 'prof_salary' || activeSection === 'prof_payments' || activeSection === 'prof_earnings') return <SalarySection />;
  if (activeSection === 'prof_messages') return <MessagesView uniId={uniId} classes={classes || []} />;
  if (activeSection === 'prof_meetings') return <MeetingsScheduler classes={classes || []} uniId={uniId} />;
  if (activeSection === 'prof_public_profile') return <PublicProfileSection />;

  return <div className="text-center py-16 glass-card rounded-2xl"><BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">Section not found</p></div>;
}

// ═══ SESSIONS ═══
function SessionsView({ scheduleEntries }: { scheduleEntries: any[] }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black tracking-tight">Sessions</h2>
      {scheduleEntries.length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No sessions scheduled</p></div> :
        <div className="space-y-3">{scheduleEntries.map((s: any) => (
          <div key={s.id} className="glass-card p-4 rounded-xl flex items-center gap-3">
            <div className="text-center shrink-0 min-w-[48px]"><p className="font-black text-xs">{s.start_time?.slice(0, 5)}</p><p className="text-muted-foreground text-[10px]">{s.end_time?.slice(0, 5)}</p></div>
            <div className="flex-1"><p className="font-black text-sm">{s.subjects?.name || 'Subject'}</p>
              <div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.entry_type}</span>{s.room && <span className="text-muted-foreground text-[10px]">{s.room}</span>}{s.classes?.name && <span className="text-muted-foreground text-[10px]">· {s.classes.name}</span>}</div>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ═══ ATTENDANCE MARKER ═══
function AttendanceMarker({ classes, subjects, uniId }: { classes: any[]; subjects: any[]; uniId?: string }) {
  const [classId, setClassId] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { data: roster } = useClassRoster(classId);
  const [marks, setMarks] = useState<Record<string, string>>({});

  const save = async () => {
    if (!classId || !subjectId) return toast.error('Select class and subject');
    const rows = Object.entries(marks).map(([user_id, status]) => ({
      user_id, subject_id: subjectId, university_id: uniId, session_date: date, status,
    }));
    if (rows.length === 0) return toast.error('Mark at least one student');
    const { error } = await supabase.from('attendance').insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Saved ${rows.length} attendance records`);
    setMarks({});
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black tracking-tight">Mark Attendance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={classId} onChange={e => setClassId(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm font-semibold">
          <option value="">Select class...</option>
          {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
        </select>
        <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm font-semibold">
          <option value="">Select subject...</option>
          {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      {classId && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {(roster || []).length === 0 ? <p className="p-8 text-center text-muted-foreground text-sm">No students in this class yet</p> :
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left px-4 py-3 text-xs font-black uppercase">Student</th><th className="text-center px-4 py-3 text-xs font-black uppercase">Status</th></tr></thead>
              <tbody>
                {(roster || []).map((m: any) => (
                  <tr key={m.user_id} className="border-b border-border/30">
                    <td className="px-4 py-2 font-semibold">{m.profile?.first_name} {m.profile?.last_name || ''}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="inline-flex gap-1">
                        {['present', 'absent', 'late'].map(st => (
                          <button key={st} onClick={() => setMarks({ ...marks, [m.user_id]: st })} className={`text-[10px] font-black px-2 py-1 rounded ${marks[m.user_id] === st ? (st === 'present' ? 'bg-success text-success-foreground' : st === 'absent' ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground') : 'bg-muted text-muted-foreground'}`}>
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}
      {classId && (roster || []).length > 0 && <Button onClick={save} className="w-full"><Save size={16} className="mr-1" /> Save Attendance</Button>}
    </div>
  );
}

// ═══ COURSES & MATERIALS ═══
function CoursesAndMaterials({ subjects, classes, uniId }: { subjects: any[]; classes: any[]; uniId?: string }) {
  const [showUpload, setShowUpload] = useState(false);
  const [showMarks, setShowMarks] = useState<any>(null);
  const { data: materials, refetch } = useCourseMaterials({});

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Courses & Materials</h2>
        <Button onClick={() => setShowUpload(true)}><Upload size={14} className="mr-1" /> Upload Material</Button>
      </div>

      <Tabs defaultValue="subjects">
        <TabsList><TabsTrigger value="subjects">My Subjects</TabsTrigger><TabsTrigger value="materials">Materials ({(materials || []).length})</TabsTrigger></TabsList>
        <TabsContent value="subjects" className="mt-4">
          {subjects.length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No subjects assigned</p></div> :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub: any) => (
                <div key={sub.id} className="glass-card p-5 rounded-2xl space-y-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center"><BookOpen size={18} className="text-primary-foreground" /></div>
                  <div><p className="font-black text-sm">{sub.name}</p><p className="text-muted-foreground text-xs">{sub.code} · {sub.credits} credits</p></div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setShowMarks(sub)}><Edit size={12} className="mr-1" /> Enter Marks</Button>
                </div>
              ))}
            </div>
          }
        </TabsContent>
        <TabsContent value="materials" className="mt-4 space-y-3">
          {(materials || []).length === 0 ? <p className="text-muted-foreground text-center py-8">No materials uploaded yet</p> :
            (materials || []).map((m: any) => (
              <div key={m.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <FileText size={18} className="text-primary" />
                <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{m.title}</p><p className="text-xs text-muted-foreground">{m.material_type} · {new Date(m.created_at).toLocaleDateString()}</p></div>
                {m.file_url && <a href={m.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary font-bold">Open</a>}
              </div>
            ))
          }
        </TabsContent>
      </Tabs>

      {showUpload && <UploadMaterialDialog onClose={() => { setShowUpload(false); refetch(); }} subjects={subjects} classes={classes} uniId={uniId} />}
      {showMarks && <MarksEntryDialog subject={showMarks} classes={classes} uniId={uniId} onClose={() => setShowMarks(null)} />}
    </div>
  );
}

function UploadMaterialDialog({ onClose, subjects, classes, uniId }: any) {
  const [form, setForm] = useState({ title: '', description: '', material_type: 'document', subject_id: '', class_id: '', link_url: '' });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    let file_url = null;
    if (file) {
      file_url = await uploadFile(file, 'materials');
      if (!file_url) { toast.error('Upload failed'); setSaving(false); return; }
    }
    const { error } = await supabase.from('course_materials').insert({
      title: form.title, description: form.description, material_type: form.material_type,
      subject_id: form.subject_id || null, class_id: form.class_id || null,
      university_id: uniId, file_url, link_url: form.link_url || null, uploaded_by: user.id,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Material uploaded');
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload Course Material</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <select value={form.material_type} onChange={e => setForm({ ...form, material_type: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
            <option value="document">Document</option><option value="video">Video</option><option value="link">Link</option><option value="slides">Slides</option>
          </select>
          <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
            <option value="">No subject</option>{subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
            <option value="">All classes</option>{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input placeholder="Link URL (optional)" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>
        <DialogFooter><Button onClick={submit} disabled={saving}>{saving ? 'Uploading...' : 'Upload'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarksEntryDialog({ subject, classes, uniId, onClose }: any) {
  const [classId, setClassId] = useState('');
  const [examType, setExamType] = useState('exam');
  const [maxScore, setMaxScore] = useState(20);
  const [coef, setCoef] = useState(1);
  const { data: roster } = useClassRoster(classId);
  const [scores, setScores] = useState<Record<string, string>>({});

  const save = async () => {
    const rows = Object.entries(scores).filter(([, v]) => v !== '').map(([user_id, score]) => ({
      user_id, subject_id: subject.id, university_id: uniId, exam_type: examType, score: Number(score), max_score: maxScore, coefficient: coef, date: new Date().toISOString().slice(0, 10),
    }));
    if (rows.length === 0) return toast.error('Enter at least one mark');
    const { error } = await supabase.from('marks').insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Saved ${rows.length} marks`);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Enter Marks · {subject.name}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <select value={classId} onChange={e => setClassId(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm col-span-2">
            <option value="">Select class...</option>{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={examType} onChange={e => setExamType(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm">
            <option value="exam">Exam</option><option value="td">TD</option><option value="tp">TP</option><option value="cc">CC</option>
          </select>
          <Input type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} placeholder="Max score" />
          <Input type="number" step="0.5" value={coef} onChange={e => setCoef(Number(e.target.value))} placeholder="Coefficient" className="col-span-2" />
        </div>
        {classId && (
          <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
            {(roster || []).map((m: any) => (
              <div key={m.user_id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <span className="flex-1 text-sm">{m.profile?.first_name} {m.profile?.last_name}</span>
                <Input type="number" step="0.25" placeholder="-" value={scores[m.user_id] || ''} onChange={e => setScores({ ...scores, [m.user_id]: e.target.value })} className="w-20 h-8" />
                <span className="text-xs text-muted-foreground">/{maxScore}</span>
              </div>
            ))}
          </div>
        )}
        <DialogFooter><Button onClick={save}>Save Marks</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleView({ scheduleEntries }: { scheduleEntries: any[] }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black tracking-tight">My Schedule</h2>
      {scheduleEntries.length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No schedule entries</p></div> :
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => {
            const dayEntries = scheduleEntries.filter((e: any) => e.day_of_week === i + 1);
            if (dayEntries.length === 0) return null;
            return (
              <div key={day} className="glass-card p-4 rounded-2xl">
                <h4 className="font-black text-sm mb-2">{day}</h4>
                <div className="space-y-2">{dayEntries.map((e: any) => (
                  <div key={e.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-xl">
                    <span className="font-black text-xs shrink-0">{e.start_time?.slice(0, 5)}–{e.end_time?.slice(0, 5)}</span>
                    <span className="font-bold text-xs">{e.subjects?.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-black">{e.entry_type}</span>
                    {e.room && <span className="text-[10px] text-muted-foreground">{e.room}</span>}
                  </div>
                ))}</div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

// ═══ MESSAGES (announcements + send notification) ═══
function MessagesView({ uniId, classes }: { uniId?: string; classes: any[] }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', class_id: '', priority: 'normal' });
  const { data: announcements, refetch } = useAnnouncements(uniId);

  const send = async () => {
    if (!form.title || !form.content) return toast.error('Title and content required');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('announcements').insert({
      title: form.title, content: form.content, university_id: uniId,
      class_id: form.class_id || null, priority: form.priority, audience: form.class_id ? 'class' : 'all', author_id: user.id,
    });
    if (error) return toast.error(error.message);
    toast.success('Announcement sent');
    setForm({ title: '', content: '', class_id: '', priority: 'normal' });
    setShow(false); refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Announcements</h2>
        <Button onClick={() => setShow(true)}><Bell size={14} className="mr-1" /> Send Notification</Button>
      </div>
      {(announcements || []).length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><MessageSquare size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No announcements</p></div> :
        <div className="space-y-3">{(announcements || []).map((a: any) => (
          <div key={a.id} className="glass-card p-4 rounded-xl">
            <div className="flex items-start justify-between gap-2"><p className="font-black text-sm">{a.title}</p><Badge variant="outline" className="text-[10px]">{a.priority}</Badge></div>
            <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{a.classes?.name || 'All'} · {new Date(a.created_at).toLocaleDateString()}</p>
          </div>
        ))}</div>
      }
      {show && (
        <Dialog open onOpenChange={setShow}>
          <DialogContent>
            <DialogHeader><DialogTitle>Send Announcement</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Message..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
                <option value="">Send to all university</option>{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
                <option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <DialogFooter><Button onClick={send}><Send size={14} className="mr-1" /> Send</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ═══ MEETINGS SCHEDULER ═══
function MeetingsScheduler({ classes, uniId }: { classes: any[]; uniId?: string }) {
  const { data: meetings, refetch } = useMyMeetings();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', scheduled_at: '', class_id: '', meeting_url: '', duration_minutes: 60 });

  const save = async () => {
    if (!form.title || !form.scheduled_at) return toast.error('Title and date required');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('meetings').insert({
      title: form.title, description: form.description, scheduled_at: form.scheduled_at,
      class_id: form.class_id || null, university_id: uniId, host_id: user.id,
      meeting_url: form.meeting_url || null, duration_minutes: form.duration_minutes,
    });
    if (error) return toast.error(error.message);
    toast.success('Meeting scheduled');
    setShow(false); setForm({ title: '', description: '', scheduled_at: '', class_id: '', meeting_url: '', duration_minutes: 60 }); refetch();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Meetings</h2>
        <Button onClick={() => setShow(true)}><Plus size={14} className="mr-1" /> Schedule</Button>
      </div>
      {(meetings || []).length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No meetings scheduled</p></div> :
        <div className="space-y-3">{(meetings || []).map((m: any) => (
          <div key={m.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-3">
            <div><p className="font-black text-sm">{m.title}</p>
              <p className="text-xs text-muted-foreground">{new Date(m.scheduled_at).toLocaleString()} · {m.duration_minutes}min{m.classes?.name && ` · ${m.classes.name}`}</p>
              {m.description && <p className="text-xs mt-1">{m.description}</p>}
            </div>
            {m.meeting_url && <a href={m.meeting_url} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><Video size={12} className="mr-1" /> Join</Button></a>}
          </div>
        ))}</div>
      }
      {show && (
        <Dialog open onOpenChange={setShow}>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule Meeting</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
              <Input type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
              <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm">
                <option value="">No specific class</option>{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Input placeholder="Meeting URL (Zoom, Meet...)" value={form.meeting_url} onChange={e => setForm({ ...form, meeting_url: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={save}>Schedule</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ═══ SALARY ═══
function SalarySection() {
  const { data: salaries, loading } = useMySalaries();
  const totalEarned = (salaries || []).reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
  const paid = (salaries || []).filter((s: any) => s.status === 'paid');
  const pending = (salaries || []).filter((s: any) => s.status !== 'paid');
  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black tracking-tight">Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl"><p className="text-[10px] uppercase font-black text-muted-foreground">Total earned</p><p className="text-2xl font-black text-success mt-1">{totalEarned.toFixed(0)} DT</p></div>
        <div className="glass-card p-4 rounded-2xl"><p className="text-[10px] uppercase font-black text-muted-foreground">Paid</p><p className="text-2xl font-black mt-1">{paid.length}</p></div>
        <div className="glass-card p-4 rounded-2xl"><p className="text-[10px] uppercase font-black text-muted-foreground">Pending</p><p className="text-2xl font-black text-warning mt-1">{pending.length}</p></div>
      </div>
      {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> :
        (salaries || []).length === 0 ? <div className="text-center py-16 glass-card rounded-2xl"><DollarSign size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground text-lg">No salary records</p></div> :
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Period</th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Paid</th>
            </tr></thead>
            <tbody>{salaries!.map((s: any) => (
              <tr key={s.id} className="border-b border-border/30">
                <td className="px-4 py-3 font-bold">{s.period}</td>
                <td className="px-4 py-3 font-black text-success">{Number(s.amount).toFixed(0)} DT</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-0.5 rounded ${s.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{s.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{s.paid_at ? new Date(s.paid_at).toLocaleDateString() : '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      }
    </div>
  );
}

// ═══ PUBLIC PROFILE (independent prof) ═══
function PublicProfileSection() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ headline: '', bio: '', avatar_url: '', banner_url: '' });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase.from('profiles').select('headline, bio, avatar_url, banner_url').eq('user_id', user.id).maybeSingle();
      if (prof) setForm({ headline: prof.headline || '', bio: prof.bio || '', avatar_url: prof.avatar_url || '', banner_url: prof.banner_url || '' });
      setLoaded(true);
    })();
  }, [user?.id]);

  const onUpload = async (file: File, kind: 'avatar' | 'banner') => {
    const url = await uploadFile(file, kind);
    if (!url) return toast.error('Upload failed');
    setForm({ ...form, [kind === 'avatar' ? 'avatar_url' : 'banner_url']: url });
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error: pErr } = await supabase.from('profiles').update(form).eq('user_id', user.id);
    // also sync to professors table if user is professor
    await supabase.from('professors').update({
      headline: form.headline, bio: form.bio, avatar_url: form.avatar_url, banner_url: form.banner_url,
    }).eq('user_id', user.id);
    setSaving(false);
    if (pErr) return toast.error(pErr.message);
    toast.success('Profile updated');
    refreshUser();
  };

  if (!loaded) return <p className="text-center text-muted-foreground py-8">Loading...</p>;

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-black tracking-tight">Public Profile</h2>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20" style={form.banner_url ? { backgroundImage: `url(${form.banner_url})`, backgroundSize: 'cover' } : {}}>
          <label className="absolute top-2 right-2 bg-background/80 text-xs font-bold px-2 py-1 rounded cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0], 'banner')} />
            <Upload size={12} className="inline mr-1" />Banner
          </label>
          <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-background bg-muted overflow-hidden">
            {form.avatar_url ? <img src={form.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-black text-xl">{user?.name?.[0]}</div>}
          </div>
        </div>
        <div className="pt-10 p-4 space-y-3">
          <label className="inline-block text-xs font-bold cursor-pointer text-primary">
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0], 'avatar')} />
            <Upload size={12} className="inline mr-1" />Change avatar
          </label>
          <Input placeholder="Headline (e.g. Senior Lecturer in CS)" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} />
          <Textarea rows={5} placeholder="Tell students about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save Profile'}</Button>
        </div>
      </div>

      {/* Course publishing wizard launcher */}
      <PublishCourseSection />
    </div>
  );
}

function PublishCourseSection() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', price: 0, cover_url: '' });
  const [saving, setSaving] = useState(false);

  const onCover = async (file: File) => {
    const url = await uploadFile(file, 'covers');
    if (url) setForm({ ...form, cover_url: url });
  };

  const submit = async () => {
    if (!user) return;
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    const { error } = await supabase.from('course_submissions').insert({
      title: form.title, description: form.description, category: form.category,
      price: form.price, cover_url: form.cover_url || null,
      professor_user_id: user.id, submitted_by: user.id,
      instructor_name: user.name, target_audience: 'public', status: 'pending',
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Course submitted for review');
    setShow(false);
    setForm({ title: '', description: '', category: 'general', price: 0, cover_url: '' });
  };

  return (
    <div className="glass-card p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black">Publish a new course</h3><p className="text-xs text-muted-foreground">Submit a course for super admin review</p></div>
        <Button onClick={() => setShow(true)}><Plus size={14} className="mr-1" /> New Course</Button>
      </div>
      {show && (
        <Dialog open onOpenChange={setShow}>
          <DialogContent>
            <DialogHeader><DialogTitle>Publish Course</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {form.cover_url && <img src={form.cover_url} alt="cover" className="w-full h-32 object-cover rounded-xl" />}
              <label className="inline-block text-xs font-bold cursor-pointer text-primary">
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onCover(e.target.files[0])} />
                <Upload size={12} className="inline mr-1" />Upload cover image
              </label>
              <Input placeholder="Course title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                <Input type="number" placeholder="Price (DT)" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter><Button onClick={submit} disabled={saving}>{saving ? 'Publishing...' : 'Submit for Review'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
