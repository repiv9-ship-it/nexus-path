import { useState } from 'react';
import { 
  Plus, Users, BookOpen, TrendingUp, ChevronRight, BarChart3, 
  Calendar, Clock, CheckSquare, DollarSign, MessageSquare, Upload, 
  FileText, Bell, MapPin, User, Eye, Send, Briefcase,
  ClipboardList, GraduationCap, Filter, Phone, Mail, AlertCircle,
  CheckCircle, XCircle, ChevronDown, ArrowLeft, X, ChevronLeft,
  Globe, Star, ShoppingCart, CreditCard, Award, Edit, Link, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';

interface ProfessorDashboardProps {
  activeSection?: string;
}

// ── Mock Data ──
const MY_CLASSES = [
  { id: 'c1', subject: 'Data Structures', code: 'CS201', level: 'L2', group: 'A', type: 'Lecture', students: 156 },
  { id: 'c2', subject: 'Data Structures', code: 'CS201', level: 'L2', group: 'A', type: 'TD', students: 32 },
  { id: 'c3', subject: 'Data Structures', code: 'CS201', level: 'L2', group: 'B', type: 'TD', students: 34 },
  { id: 'c4', subject: 'Machine Learning', code: 'AI301', level: 'L3', group: 'All', type: 'Lecture', students: 89 },
  { id: 'c5', subject: 'Machine Learning', code: 'AI301', level: 'L3', group: 'A', type: 'TD', students: 45 },
  { id: 'c6', subject: 'Web Development', code: 'CS102', level: 'L1', group: 'All', type: 'Lecture', students: 234 },
  { id: 'c7', subject: 'Web Development', code: 'CS102', level: 'L1', group: 'C', type: 'TD', students: 38 },
];

const UPCOMING_SESSIONS = [
  { id: 's1', subject: 'Data Structures', code: 'CS201', type: 'Lecture', date: '2026-03-15', startTime: '08:00', endTime: '10:00', room: 'A101', group: 'L2-CS-A', level: 'L2', studentCount: 156 },
  { id: 's2', subject: 'Machine Learning', code: 'AI301', type: 'TD', date: '2026-03-15', startTime: '14:00', endTime: '16:00', room: 'Lab 3', group: 'L3-CS-A', level: 'L3', studentCount: 45 },
  { id: 's3', subject: 'Data Structures', code: 'CS201', type: 'TD', date: '2026-03-16', startTime: '10:00', endTime: '12:00', room: 'Lab 1', group: 'L2-CS-A', level: 'L2', studentCount: 32 },
  { id: 's4', subject: 'Web Development', code: 'CS102', type: 'Lecture', date: '2026-03-17', startTime: '08:00', endTime: '10:00', room: 'B205', group: 'L1-CS', level: 'L1', studentCount: 234 },
  { id: 's5', subject: 'Machine Learning', code: 'AI301', type: 'Lecture', date: '2026-03-18', startTime: '08:00', endTime: '10:00', room: 'Amphi A', group: 'L3-All', level: 'L3', studentCount: 89 },
];

const ATTENDANCE_STUDENTS = [
  { id: '1', name: 'Alice Chen', avatar: '/placeholder.svg', matricule: '2024CS001', status: 'present' as const },
  { id: '2', name: 'Bob Smith', avatar: '/placeholder.svg', matricule: '2024CS002', status: 'absent' as const },
  { id: '3', name: 'Carol Davis', avatar: '/placeholder.svg', matricule: '2024CS003', status: 'present' as const },
  { id: '4', name: 'David Lee', avatar: '/placeholder.svg', matricule: '2024CS004', status: 'late' as const },
  { id: '5', name: 'Emma Wilson', avatar: '/placeholder.svg', matricule: '2024CS005', status: 'present' as const },
  { id: '6', name: 'Frank Miller', avatar: '/placeholder.svg', matricule: '2024CS006', status: 'present' as const },
  { id: '7', name: 'Grace Park', avatar: '/placeholder.svg', matricule: '2024CS007', status: 'absent' as const },
  { id: '8', name: 'Henry Zhang', avatar: '/placeholder.svg', matricule: '2024CS008', status: 'present' as const },
  { id: '9', name: 'Ines Bouaziz', avatar: '/placeholder.svg', matricule: '2024CS009', status: 'present' as const },
  { id: '10', name: 'Jamal Trabelsi', avatar: '/placeholder.svg', matricule: '2024CS010', status: 'present' as const },
  { id: '11', name: 'Karim Ferjani', avatar: '/placeholder.svg', matricule: '2024CS011', status: 'late' as const },
  { id: '12', name: 'Lina Mansour', avatar: '/placeholder.svg', matricule: '2024CS012', status: 'present' as const },
];

const SALARY_HISTORY = [
  { id: 'p1', month: 'Février 2026', base: 4500, bonus: 500, deductions: 350, net: 4650, status: 'paid' as const, date: '2026-02-28' },
  { id: 'p2', month: 'Janvier 2026', base: 4500, bonus: 300, deductions: 350, net: 4450, status: 'paid' as const, date: '2026-01-31' },
  { id: 'p3', month: 'Décembre 2025', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'paid' as const, date: '2025-12-31' },
  { id: 'p4', month: 'Mars 2026', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'pending' as const, date: '2026-03-31' },
];

const EXAM_SCHEDULE = [
  { id: 'ex1', subject: 'Data Structures', type: 'Final Exam', date: '2026-03-25', startTime: '09:00', room: 'Amphi A', duration: '2h', level: 'L2' },
  { id: 'ex2', subject: 'Machine Learning', type: 'Midterm', date: '2026-04-10', startTime: '14:00', room: 'B205', duration: '1h30', level: 'L3' },
  { id: 'ex3', subject: 'Web Development', type: 'Final Exam', date: '2026-04-15', startTime: '09:00', room: 'Amphi B', duration: '2h', level: 'L1' },
];

const MEETINGS = [
  { id: 'mt1', title: 'Réunion de département', date: '2026-03-20', time: '10:00', location: 'Salle de conférence', organizer: 'Doyen' },
  { id: 'mt2', title: 'Soutenance - Alice Chen', date: '2026-04-12', time: '14:00', location: 'Salle 302', organizer: 'Département CS' },
];

const STUDENT_MESSAGES = [
  { id: 'msg1', student: 'Alice Chen', subject: 'Question sur le TP 3', message: 'Professeur, j\'ai une question sur l\'exercice de parcours de graphe. Puis-je passer pendant les heures de bureau ?', date: '2026-03-12', read: false },
  { id: 'msg2', student: 'David Lee', subject: 'Justification d\'absence', message: 'Je n\'ai pas pu assister au TD du 10 mars pour raisons médicales. J\'ai le certificat.', date: '2026-03-11', read: false },
  { id: 'msg3', student: 'Carol Davis', subject: 'Lettre de recommandation', message: 'Pourriez-vous rédiger une lettre de recommandation pour ma candidature de stage ?', date: '2026-03-08', read: true },
];

const MY_COURSES_MATERIALS = [
  { id: 'mc1', subject: 'Data Structures', code: 'CS201', level: 'L2', chapters: [
    { id: 'ch1', title: 'Chapitre 1 - Tableaux & Listes', type: 'cours', date: '2025-09-10', downloads: 156 },
    { id: 'ch2', title: 'Chapitre 2 - Arbres', type: 'cours', date: '2025-09-20', downloads: 142 },
    { id: 'td1', title: 'TD 1 - Exercices sur les tableaux', type: 'td', date: '2025-09-15', downloads: 148 },
    { id: 'td2', title: 'TD 2 - Problèmes d\'arbres', type: 'td', date: '2025-09-25', downloads: 135 },
    { id: 'tp1', title: 'TP 1 - Implémentation des listes', type: 'tp', date: '2025-09-18', downloads: 130 },
  ]},
  { id: 'mc2', subject: 'Machine Learning', code: 'AI301', level: 'L3', chapters: [
    { id: 'ch1', title: 'Chapitre 1 - Régression linéaire', type: 'cours', date: '2025-09-12', downloads: 89 },
    { id: 'ch2', title: 'Chapitre 2 - Classification', type: 'cours', date: '2025-09-22', downloads: 85 },
  ]},
  { id: 'mc3', subject: 'Web Development', code: 'CS102', level: 'L1', chapters: [
    { id: 'ch1', title: 'Chapitre 1 - HTML & CSS', type: 'cours', date: '2025-09-14', downloads: 210 },
  ]},
];

const ADMIN_CONTACT_MESSAGES = [
  { id: 'ac1', subject: 'Report de séance', message: 'Demande de report de la séance du 05/03 pour raison personnelle.', date: '2026-03-10', status: 'pending' as const },
  { id: 'ac2', subject: 'Demande de salle', message: 'Besoin d\'une salle informatique pour un TP le 10/03.', date: '2026-02-20', status: 'approved' as const },
];

// Available classes for upload target
const UPLOAD_TARGET_CLASSES = [
  { id: 'ing1a', label: 'ING1-A', level: 'L1' },
  { id: 'ing1b', label: 'ING1-B', level: 'L1' },
  { id: 'ing2a', label: 'ING2-A', level: 'L2' },
  { id: 'ing2b', label: 'ING2-B', level: 'L2' },
  { id: 'ing3a', label: 'ING3-A', level: 'L3' },
  { id: 'ing3b', label: 'ING3-B', level: 'L3' },
  { id: 'all-l2', label: 'All L2', level: 'L2' },
  { id: 'all-l3', label: 'All L3', level: 'L3' },
];

export function ProfessorDashboard({ activeSection = 'overview' }: ProfessorDashboardProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', type: 'cours', subject: '', targetClasses: [] as string[] });

  const unreadMessages = STUDENT_MESSAGES.filter(m => !m.read).length;
  const totalStudents = MY_CLASSES.filter(c => c.type === 'Lecture').reduce((a, c) => a + c.students, 0);
  const uniqueSubjects = [...new Set(MY_CLASSES.map(c => c.subject))];

  const selectedSession = UPCOMING_SESSIONS.find(s => s.id === selectedSessionId);

  const toggleTargetClass = (id: string) => {
    setUploadData(prev => ({
      ...prev,
      targetClasses: prev.targetClasses.includes(id) 
        ? prev.targetClasses.filter(c => c !== id)
        : [...prev.targetClasses, id]
    }));
  };

  // ═══════════ OVERVIEW ═══════════
  if (activeSection === 'overview' || activeSection === 'professor') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground text-sm mt-1">Bienvenue, Professeur</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Étudiants', value: totalStudents, icon: Users, color: 'text-primary' },
            { label: 'Matières', value: uniqueSubjects.length, icon: BookOpen, color: 'text-success' },
            { label: 'Classes', value: MY_CLASSES.length, icon: Calendar, color: 'text-warning' },
            { label: 'Messages', value: unreadMessages, icon: MessageSquare, color: 'text-destructive' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next sessions + My subjects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-primary" /> Prochaines séances
            </h3>
            {UPCOMING_SESSIONS.slice(0, 4).map(s => (
              <div key={s.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="text-center shrink-0 min-w-[44px]">
                  <p className="font-black text-xs">{s.startTime}</p>
                  <p className="text-muted-foreground text-[10px]">{s.endTime}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs truncate">{s.subject}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${s.type === 'Lecture' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{s.type}</span>
                    <span className="text-muted-foreground text-[10px]">{s.room}</span>
                    <span className="text-muted-foreground text-[10px]">{s.group}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-primary" /> Mes matières
            </h3>
            {uniqueSubjects.map(sub => {
              const classes = MY_CLASSES.filter(c => c.subject === sub);
              const totalSt = classes.find(c => c.type === 'Lecture')?.students || 0;
              return (
                <div key={sub} className="glass-card p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-black text-xs">{sub}</p>
                    <span className="text-[10px] font-bold text-muted-foreground">{totalSt} étudiants</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {classes.map(c => (
                      <span key={c.id} className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        c.type === 'Lecture' ? 'bg-primary/10 text-primary' : c.type === 'TD' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>
                        {c.type} {c.level}-{c.group}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ SESSIONS (with inline attendance) ═══════════
  if (activeSection === 'prof_sessions') {
    // If a session is selected, show attendance for that session
    if (selectedSession) {
      return (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedSessionId(null)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Présence — {selectedSession.subject}</h2>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {selectedSession.type} · {selectedSession.group} · {selectedSession.room} · {new Date(selectedSession.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · {selectedSession.startTime}–{selectedSession.endTime}
                </p>
              </div>
            </div>
            <Button className="gradient-primary font-black rounded-xl text-xs"><Send size={14} className="mr-1" /> Soumettre la présence</Button>
          </div>

          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Présents', count: ATTENDANCE_STUDENTS.filter(s => (attendanceData[s.id] || s.status) === 'present').length, color: 'text-success', bg: 'bg-success/10' },
              { label: 'Absents', count: ATTENDANCE_STUDENTS.filter(s => (attendanceData[s.id] || s.status) === 'absent').length, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'En retard', count: ATTENDANCE_STUDENTS.filter(s => (attendanceData[s.id] || s.status) === 'late').length, color: 'text-warning', bg: 'bg-warning/10' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} p-3 rounded-xl text-center`}>
                <p className={`text-2xl font-black ${item.color}`}>{item.count}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Student grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {ATTENDANCE_STUDENTS.map(student => {
              const status = attendanceData[student.id] || student.status;
              return (
                <div key={student.id} className={`glass-card p-3 rounded-xl border-2 transition-all ${
                  status === 'present' ? 'border-success/40' : status === 'absent' ? 'border-destructive/40' : status === 'late' ? 'border-warning/40' : 'border-transparent'
                }`}>
                  <div className="flex flex-col items-center text-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center mb-2">
                      <User size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-black text-[11px] leading-tight">{student.name}</p>
                    <p className="text-[9px] text-muted-foreground">{student.matricule}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['present', 'absent', 'late'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setAttendanceData(prev => ({ ...prev, [student.id]: s }))}
                        className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                          status === s
                            ? s === 'present' ? 'bg-success text-success-foreground'
                            : s === 'absent' ? 'bg-destructive text-destructive-foreground'
                            : 'bg-warning text-warning-foreground'
                            : 'glass-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {s === 'present' ? 'P' : s === 'absent' ? 'A' : 'R'}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Sessions list
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Séances</h2>
          <p className="text-muted-foreground text-sm mt-1">Cliquez sur une séance pour gérer la présence</p>
        </div>
        <div className="space-y-2">
          {UPCOMING_SESSIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSessionId(s.id)}
              className="w-full glass-card p-4 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-all text-left group"
            >
              <div className="text-center shrink-0 min-w-[56px] glass-card p-2 rounded-lg">
                <p className="font-black text-xs">{new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                <p className="font-black text-lg text-primary">{new Date(s.date).getDate()}</p>
                <p className="text-muted-foreground text-[10px]">{new Date(s.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">{s.subject} <span className="text-muted-foreground font-normal text-xs">({s.code})</span></p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${s.type === 'Lecture' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{s.type}</span>
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={11} />{s.startTime} – {s.endTime}</span>
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={11} />{s.room}</span>
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Users size={11} />{s.group} · {s.studentCount}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center gap-1">
                  <CheckSquare size={12} /> Présence
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ MY COURSES ═══════════
  if (activeSection === 'prof_courses') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Mes cours</h2>
            <p className="text-muted-foreground text-sm mt-1">Gérer et publier les supports pédagogiques</p>
          </div>
          <div className="flex gap-2">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option value="all">Tous types</option>
              <option value="cours">Cours</option><option value="td">TD</option><option value="tp">TP</option>
            </select>
            <Button className="gradient-primary font-black rounded-xl text-xs h-8" onClick={() => { setUploadData({ title: '', type: 'cours', subject: '', targetClasses: [] }); setUploadDialogOpen(true); }}>
              <Upload size={14} className="mr-1" /> Publier un support
            </Button>
          </div>
        </div>

        {MY_COURSES_MATERIALS.map(course => (
          <div key={course.id} className="glass-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm flex items-center gap-2">
                <BookOpen size={14} className="text-primary" /> {course.subject}
                <span className="text-muted-foreground font-normal text-xs">({course.code} · {course.level})</span>
              </h4>
              <Button size="sm" variant="outline" className="text-[10px] font-black rounded-lg h-7" onClick={() => { setUploadData({ title: '', type: 'cours', subject: course.subject, targetClasses: [] }); setUploadDialogOpen(true); }}>
                <Plus size={10} className="mr-1" /> Ajouter
              </Button>
            </div>
            <div className="space-y-1.5">
              {course.chapters.filter(ch => filterType === 'all' || ch.type === filterType).map(ch => (
                <div key={ch.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <FileText size={16} className={`shrink-0 ${ch.type === 'cours' ? 'text-primary' : ch.type === 'td' ? 'text-warning' : 'text-success'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{ch.title}</p>
                    <p className="text-muted-foreground text-[10px]">{ch.type.toUpperCase()} · {new Date(ch.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px] shrink-0">
                    <Eye size={10} /> {ch.downloads}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-black text-lg">Publier un support</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">Ajoutez un cours, TD ou TP pour vos étudiants</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Title */}
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Titre du document</label>
                <Input placeholder="Ex: Chapitre 3 - Graphes" className="rounded-lg text-sm h-9" value={uploadData.title} onChange={e => setUploadData(prev => ({ ...prev, title: e.target.value }))} />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Matière</label>
                <select className="w-full h-9 px-3 rounded-lg border border-input bg-background font-bold text-sm" value={uploadData.subject} onChange={e => setUploadData(prev => ({ ...prev, subject: e.target.value }))}>
                  <option value="">Sélectionner une matière</option>
                  {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Type de support</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'cours', label: 'Cours', color: 'primary' },
                    { value: 'td', label: 'TD', color: 'warning' },
                    { value: 'tp', label: 'TP', color: 'success' },
                  ].map(t => (
                    <button key={t.value} onClick={() => setUploadData(prev => ({ ...prev, type: t.value }))}
                      className={`py-2 rounded-lg text-xs font-black transition-all ${
                        uploadData.type === t.value 
                          ? `bg-${t.color}/20 text-${t.color} border-2 border-${t.color}/50` 
                          : 'glass-card text-muted-foreground hover:text-foreground'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target classes */}
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Classes ciblées</label>
                <div className="grid grid-cols-4 gap-2">
                  {UPLOAD_TARGET_CLASSES.map(c => (
                    <button key={c.id} onClick={() => toggleTargetClass(c.id)}
                      className={`py-2 rounded-lg text-[11px] font-black transition-all ${
                        uploadData.targetClasses.includes(c.id) 
                          ? 'bg-primary/20 text-primary border-2 border-primary/50' 
                          : 'glass-card text-muted-foreground hover:text-foreground'
                      }`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload area */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="font-bold text-xs text-muted-foreground">Glissez votre fichier ici ou cliquez pour parcourir</p>
                <p className="text-[10px] text-muted-foreground mt-1">PDF, PPTX, DOCX — Max 50MB</p>
              </div>

              <Button className="w-full gradient-primary font-black rounded-xl text-sm" onClick={() => setUploadDialogOpen(false)}>
                <Upload size={14} className="mr-2" /> Publier le support
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══════════ SCHEDULE ═══════════
  if (activeSection === 'prof_schedule') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Emploi du temps & Examens</h2>
          <p className="text-muted-foreground text-sm mt-1">Planning des examens et réunions</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><GraduationCap size={14} className="text-primary" /> Examens</h4>
          <div className="space-y-2">
            {EXAM_SCHEDULE.map(exam => (
              <div key={exam.id} className="glass-card p-3 rounded-xl flex items-center gap-4">
                <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                  <p className="font-black text-lg text-primary">{new Date(exam.date).getDate()}</p>
                  <p className="text-muted-foreground text-[10px] font-bold">{new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">{exam.subject} <span className="text-muted-foreground text-xs">({exam.level})</span></p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">{exam.type}</span>
                    <span className="text-muted-foreground text-[10px]">{exam.startTime} · {exam.duration}</span>
                    <span className="text-muted-foreground text-[10px] flex items-center gap-0.5"><MapPin size={9} />{exam.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Briefcase size={14} className="text-primary" /> Réunions</h4>
          <div className="space-y-2">
            {MEETINGS.map(mt => (
              <div key={mt.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                  <p className="font-black text-lg text-primary">{new Date(mt.date).getDate()}</p>
                  <p className="text-muted-foreground text-[10px] font-bold">{new Date(mt.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">{mt.title}</p>
                  <p className="text-muted-foreground text-[10px]">{mt.time} · {mt.location} · par {mt.organizer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ PAYMENTS ═══════════
  if (activeSection === 'prof_payments') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Salaire & Paiements</h2>
          <p className="text-muted-foreground text-sm mt-1">Historique de rémunération en TND</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Salaire de base', value: '4 500 TND', color: 'text-foreground' },
            { label: 'Prime ce mois', value: '+500 TND', color: 'text-success' },
            { label: 'Retenues', value: '-350 TND', color: 'text-destructive' },
            { label: 'Net ce mois', value: '4 650 TND', color: 'text-primary' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Mois</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Base</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Prime</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Net</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {SALARY_HISTORY.map(entry => (
                <tr key={entry.id} className="border-t border-border">
                  <td className="p-3 font-bold">{entry.month}</td>
                  <td className="p-3 font-bold">{entry.base.toLocaleString()} TND</td>
                  <td className="p-3 font-bold text-success">+{entry.bonus} TND</td>
                  <td className="p-3 font-black text-primary">{entry.net.toLocaleString()} TND</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      entry.status === 'paid' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                    }`}>{entry.status === 'paid' ? 'Payé' : 'En attente'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ MESSAGES & ADMIN CONTACT ═══════════
  if (activeSection === 'prof_messages') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Messages</h2>
          <p className="text-muted-foreground text-sm mt-1">Messages des étudiants & contact administration</p>
        </div>

        {/* Student messages */}
        <div className="space-y-2">
          <h3 className="font-black text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MessageSquare size={12} /> Messages étudiants</h3>
          {STUDENT_MESSAGES.map(msg => (
            <div key={msg.id} className={`glass-card p-4 rounded-xl space-y-2 ${!msg.read ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-xs">
                    {msg.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-black text-xs">{msg.student}</p>
                    <p className="text-muted-foreground text-[10px]">{new Date(msg.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                {!msg.read && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded">NOUVEAU</span>}
              </div>
              <p className="font-black text-sm">{msg.subject}</p>
              <p className="text-muted-foreground text-xs">{msg.message}</p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="text-[10px] font-black rounded-lg h-7" onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}>
                  <Send size={10} className="mr-1" /> Répondre
                </Button>
              </div>
              {replyingTo === msg.id && (
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Votre réponse..." className="text-xs h-8 rounded-lg" />
                  <Button size="sm" className="gradient-primary font-black text-[10px] rounded-lg h-8 px-3">Envoyer</Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Admin contact */}
        <div className="glass-card p-4 rounded-2xl space-y-3 border-2 border-dashed border-primary/20">
          <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-2">
            <Mail size={12} className="text-primary" /> Contacter l'administration
          </h3>
          <p className="text-muted-foreground text-[11px]">Reporter une séance, demander une salle, signaler un problème...</p>
          <Input placeholder="Objet du message..." className="text-xs h-8 rounded-lg" />
          <textarea placeholder="Décrivez votre demande..." className="w-full p-3 rounded-lg border border-input bg-background text-xs min-h-[60px] resize-none" />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option>Report de séance</option>
              <option>Demande de salle</option>
              <option>Problème technique</option>
              <option>Autre</option>
            </select>
            <Button className="gradient-primary font-black rounded-lg text-xs h-8"><Send size={12} className="mr-1" /> Envoyer</Button>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase">Historique</p>
            {ADMIN_CONTACT_MESSAGES.map(m => (
              <div key={m.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs">{m.subject}</p>
                  <p className="text-muted-foreground text-[10px] truncate">{m.message}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${
                  m.status === 'approved' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                }`}>{m.status === 'approved' ? 'Approuvé' : 'En attente'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ PUBLIC PROFILE (Independent Professor) ═══════════
  if (activeSection === 'prof_public_profile') {
    const PROFILE_DATA = {
      name: 'Dr. Ahmed Benali',
      title: 'Machine Learning & AI Instructor',
      bio: 'PhD in Computer Science from INRIA. 10+ years of experience in AI research and teaching. Passionate about making complex concepts accessible to everyone.',
      avatar: null,
      rating: 4.8,
      totalStudents: 12450,
      totalCourses: 8,
      totalReviews: 1892,
      joinedDate: '2024-06-15',
      website: 'ahmedbenali.dev',
      linkedin: 'linkedin.com/in/ahmedbenali',
      specialties: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Python'],
    };

    const PUBLIC_COURSES = [
      { id: 'pc1', title: 'Machine Learning A-Z', students: 4250, rating: 4.9, reviews: 689, price: 24.99, revenue: 8120, status: 'published' as const, thumbnail: null },
      { id: 'pc2', title: 'Deep Learning with PyTorch', students: 3100, rating: 4.8, reviews: 512, price: 34.99, revenue: 12650, status: 'published' as const, thumbnail: null },
      { id: 'pc3', title: 'NLP Masterclass', students: 2800, rating: 4.7, reviews: 401, price: 29.99, revenue: 9800, status: 'published' as const, thumbnail: null },
      { id: 'pc4', title: 'Python for Data Science', students: 2300, rating: 4.6, reviews: 290, price: 0, revenue: 0, status: 'published' as const, thumbnail: null },
      { id: 'pc5', title: 'AI Ethics & Society', students: 0, rating: 0, reviews: 0, price: 19.99, revenue: 0, status: 'draft' as const, thumbnail: null },
    ];

    const RECENT_REVIEWS = [
      { id: 'r1', student: 'Sarah M.', course: 'Machine Learning A-Z', rating: 5, comment: 'Excellent course! Very clear explanations and great practical examples.', date: '2026-03-14' },
      { id: 'r2', student: 'Omar K.', course: 'Deep Learning with PyTorch', rating: 5, comment: 'The best DL course I\'ve taken. Dr. Benali makes complex topics easy to understand.', date: '2026-03-12' },
      { id: 'r3', student: 'Lina T.', course: 'NLP Masterclass', rating: 4, comment: 'Great content but some sections need updates for the latest transformer architectures.', date: '2026-03-08' },
      { id: 'r4', student: 'Karim F.', course: 'Machine Learning A-Z', rating: 5, comment: 'Changed my career path. Highly recommended for beginners!', date: '2026-03-05' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Public Profile</h2>
            <p className="text-muted-foreground text-sm mt-1">How students see you on the platform</p>
          </div>
          <Button variant="outline" className="font-black text-xs rounded-xl h-9">
            <ExternalLink size={14} className="mr-1" /> Preview Page
          </Button>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shrink-0">
              AB
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-xl">{PROFILE_DATA.name}</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs font-bold"><Edit size={12} className="mr-1" /> Edit</Button>
              </div>
              <p className="text-primary font-bold text-sm mt-0.5">{PROFILE_DATA.title}</p>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{PROFILE_DATA.bio}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1 text-warning">
                  <Star size={14} className="fill-warning" />
                  <span className="font-black text-sm">{PROFILE_DATA.rating}</span>
                  <span className="text-muted-foreground text-xs">({PROFILE_DATA.totalReviews} reviews)</span>
                </div>
                <span className="text-muted-foreground text-xs flex items-center gap-1"><Users size={12} /> {PROFILE_DATA.totalStudents.toLocaleString()} students</span>
                <span className="text-muted-foreground text-xs flex items-center gap-1"><BookOpen size={12} /> {PROFILE_DATA.totalCourses} courses</span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {PROFILE_DATA.specialties.map(s => (
                  <span key={s} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black">{s}</span>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                {PROFILE_DATA.website && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe size={11} /> {PROFILE_DATA.website}</span>
                )}
                {PROFILE_DATA.linkedin && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Link size={11} /> {PROFILE_DATA.linkedin}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Published Courses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={15} className="text-primary" /> My Published Courses
            </h3>
            <Button className="gradient-primary font-black rounded-xl text-xs h-8">
              <Plus size={13} className="mr-1" /> Submit New Course
            </Button>
          </div>
          {PUBLIC_COURSES.map(course => (
            <div key={course.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-16 h-12 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-primary/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm truncate">{course.title}</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    course.status === 'published' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                  }`}>{course.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={10} /> {course.students.toLocaleString()}</span>
                  {course.rating > 0 && (
                    <span className="text-xs text-warning flex items-center gap-1"><Star size={10} className="fill-warning" /> {course.rating}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{course.reviews} reviews</span>
                  <span className={`text-xs font-bold ${course.price > 0 ? 'text-primary' : 'text-success'}`}>
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-black rounded-lg">
                  <Edit size={10} className="mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-black rounded-lg">
                  <Eye size={10} className="mr-1" /> Preview
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reviews */}
        <div className="space-y-3">
          <h3 className="font-black text-base uppercase tracking-wider flex items-center gap-2">
            <Star size={15} className="text-warning" /> Recent Reviews
          </h3>
          {RECENT_REVIEWS.map(review => (
            <div key={review.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-xs">
                    {review.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-black text-xs">{review.student}</p>
                    <p className="text-muted-foreground text-[10px]">{review.course} · {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className={i < review.rating ? 'text-warning fill-warning' : 'text-muted-foreground'} />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ EARNINGS (Independent Professor) ═══════════
  if (activeSection === 'prof_earnings') {
    const EARNINGS_DATA = {
      totalRevenue: 30570,
      thisMonth: 4250,
      lastMonth: 3890,
      pendingPayout: 2100,
      totalSales: 1245,
      refunds: 12,
      conversionRate: 3.8,
    };

    const MONTHLY_REVENUE = [
      { month: 'Oct', revenue: 2100, sales: 85 },
      { month: 'Nov', revenue: 2800, sales: 112 },
      { month: 'Dec', revenue: 3500, sales: 140 },
      { month: 'Jan', revenue: 3200, sales: 128 },
      { month: 'Feb', revenue: 3890, sales: 155 },
      { month: 'Mar', revenue: 4250, sales: 170 },
    ];

    const COURSE_REVENUE = [
      { title: 'Deep Learning with PyTorch', revenue: 12650, sales: 362, price: 34.99 },
      { title: 'NLP Masterclass', revenue: 9800, sales: 327, price: 29.99 },
      { title: 'Machine Learning A-Z', revenue: 8120, sales: 325, price: 24.99 },
      { title: 'Python for Data Science', revenue: 0, sales: 2300, price: 0 },
    ];

    const RECENT_SALES = [
      { id: 't1', student: 'John D.', course: 'Machine Learning A-Z', amount: 24.99, date: '2026-03-15' },
      { id: 't2', student: 'Maria S.', course: 'Deep Learning with PyTorch', amount: 34.99, date: '2026-03-15' },
      { id: 't3', student: 'Ahmed K.', course: 'NLP Masterclass', amount: 29.99, date: '2026-03-14' },
      { id: 't4', student: 'Lisa W.', course: 'Machine Learning A-Z', amount: 24.99, date: '2026-03-14' },
      { id: 't5', student: 'Omar B.', course: 'Deep Learning with PyTorch', amount: 34.99, date: '2026-03-13' },
    ];

    const maxRevenue = Math.max(...MONTHLY_REVENUE.map(m => m.revenue));

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Earnings & Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Track your course revenue and sales performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Revenue', value: `$${(EARNINGS_DATA.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
            { label: 'This Month', value: `$${EARNINGS_DATA.thisMonth.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total Sales', value: EARNINGS_DATA.totalSales, icon: ShoppingCart, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Pending Payout', value: `$${EARNINGS_DATA.pendingPayout.toLocaleString()}`, icon: CreditCard, color: 'text-secondary', bg: 'bg-secondary/10' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-primary" /> Monthly Revenue
          </h3>
          <div className="grid grid-cols-6 gap-3 h-40 items-end">
            {MONTHLY_REVENUE.map(m => (
              <div key={m.month} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-success">${(m.revenue / 1000).toFixed(1)}K</span>
                <div className="w-full bg-primary/10 rounded-t-lg relative overflow-hidden" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">{m.month}</span>
                <span className="text-[10px] text-muted-foreground">{m.sales} sales</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Course + Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-primary" /> Revenue by Course
            </h3>
            {COURSE_REVENUE.map((course, i) => (
              <div key={i} className="glass-card p-3 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-black text-xs truncate flex-1">{course.title}</p>
                  <span className="font-black text-sm text-success ml-2">${course.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{course.sales} sales · {course.price > 0 ? `$${course.price}` : 'Free'}</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${maxRevenue > 0 ? (course.revenue / COURSE_REVENUE[0].revenue) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart size={14} className="text-warning" /> Recent Sales
            </h3>
            {RECENT_SALES.map(sale => (
              <div key={sale.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                  <DollarSign size={14} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{sale.course}</p>
                  <p className="text-muted-foreground text-[10px]">{sale.student} · {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span className="font-black text-sm text-success shrink-0">+${sale.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout section */}
        <div className="glass-card p-5 rounded-2xl border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm">Payout Information</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Payouts are processed monthly. Next payout: April 1, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">${EARNINGS_DATA.pendingPayout.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="text-xs font-black rounded-lg">
              <CreditCard size={12} className="mr-1" /> Payment Settings
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-black rounded-lg">
              <FileText size={12} className="mr-1" /> View Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
