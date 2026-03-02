import { useState } from 'react';
import { 
  Plus, Users, BookOpen, TrendingUp, ChevronRight, BarChart3, 
  Calendar, Clock, CheckSquare, DollarSign, MessageSquare, Upload, 
  FileText, Bell, MapPin, User, Eye, Send, Briefcase,
  ClipboardList, GraduationCap, Filter, Phone, Mail, AlertCircle,
  CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  { id: 's1', subject: 'Data Structures', code: 'CS201', type: 'Lecture', date: '2026-03-02', startTime: '08:00', endTime: '10:00', room: 'A101', group: 'L2-CS-A', level: 'L2' },
  { id: 's2', subject: 'Machine Learning', code: 'AI301', type: 'TD', date: '2026-03-02', startTime: '14:00', endTime: '16:00', room: 'Lab 3', group: 'L3-CS-A', level: 'L3' },
  { id: 's3', subject: 'Data Structures', code: 'CS201', type: 'TD', date: '2026-03-03', startTime: '10:00', endTime: '12:00', room: 'Lab 1', group: 'L2-CS-A', level: 'L2' },
  { id: 's4', subject: 'Web Development', code: 'CS102', type: 'Lecture', date: '2026-03-04', startTime: '08:00', endTime: '10:00', room: 'B205', group: 'L1-CS', level: 'L1' },
  { id: 's5', subject: 'Machine Learning', code: 'AI301', type: 'Lecture', date: '2026-03-05', startTime: '08:00', endTime: '10:00', room: 'Amphi A', group: 'L3-All', level: 'L3' },
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
];

const SALARY_HISTORY = [
  { id: 'p1', month: 'Février 2026', base: 4500, bonus: 500, deductions: 350, net: 4650, status: 'paid' as const, date: '2026-02-28' },
  { id: 'p2', month: 'Janvier 2026', base: 4500, bonus: 300, deductions: 350, net: 4450, status: 'paid' as const, date: '2026-01-31' },
  { id: 'p3', month: 'Décembre 2025', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'paid' as const, date: '2025-12-31' },
  { id: 'p4', month: 'Mars 2026', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'pending' as const, date: '2026-03-31' },
];

const EXAM_SCHEDULE = [
  { id: 'ex1', subject: 'Data Structures', type: 'Final Exam', date: '2026-02-25', startTime: '09:00', room: 'Amphi A', duration: '2h', level: 'L2' },
  { id: 'ex2', subject: 'Machine Learning', type: 'Midterm', date: '2026-03-10', startTime: '14:00', room: 'B205', duration: '1h30', level: 'L3' },
  { id: 'ex3', subject: 'Web Development', type: 'Final Exam', date: '2026-03-15', startTime: '09:00', room: 'Amphi B', duration: '2h', level: 'L1' },
];

const MEETINGS = [
  { id: 'mt1', title: 'Réunion de département', date: '2026-03-05', time: '10:00', location: 'Salle de conférence', organizer: 'Doyen' },
  { id: 'mt2', title: 'Soutenance - Alice Chen', date: '2026-03-12', time: '14:00', location: 'Salle 302', organizer: 'Département CS' },
];

const STUDENT_MESSAGES = [
  { id: 'msg1', student: 'Alice Chen', subject: 'Question sur le TP 3', message: 'Professeur, j\'ai une question sur l\'exercice de parcours de graphe. Puis-je passer pendant les heures de bureau ?', date: '2026-02-28', read: false },
  { id: 'msg2', student: 'David Lee', subject: 'Justification d\'absence', message: 'Je n\'ai pas pu assister au TD du 27 février pour raisons médicales. J\'ai le certificat.', date: '2026-02-27', read: false },
  { id: 'msg3', student: 'Carol Davis', subject: 'Lettre de recommandation', message: 'Pourriez-vous rédiger une lettre de recommandation pour ma candidature de stage ?', date: '2026-02-25', read: true },
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
  { id: 'ac1', subject: 'Report de séance', message: 'Demande de report de la séance du 05/03 pour raison personnelle.', date: '2026-02-28', status: 'pending' as const },
  { id: 'ac2', subject: 'Demande de salle', message: 'Besoin d\'une salle informatique pour un TP le 10/03.', date: '2026-02-20', status: 'approved' as const },
];

export function ProfessorDashboard({ activeSection = 'overview' }: ProfessorDashboardProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const unreadMessages = STUDENT_MESSAGES.filter(m => !m.read).length;
  const totalStudents = MY_CLASSES.filter(c => c.type === 'Lecture').reduce((a, c) => a + c.students, 0);
  const uniqueSubjects = [...new Set(MY_CLASSES.map(c => c.subject))];

  const filteredClasses = MY_CLASSES.filter(c => {
    if (filterLevel !== 'all' && c.level !== filterLevel) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

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

        {/* Next sessions + My classes */}
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

  // ═══════════ SESSIONS ═══════════
  if (activeSection === 'prof_sessions') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Séances</h2>
          <p className="text-muted-foreground text-sm mt-1">Vos prochaines séances programmées</p>
        </div>
        <div className="space-y-2">
          {UPCOMING_SESSIONS.map(s => (
            <div key={s.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
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
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Users size={11} />{s.group}</span>
                </div>
              </div>
              <Button size="sm" className="gradient-primary font-black rounded-lg text-xs shrink-0" onClick={() => setSelectedSession(s.id)}>
                <CheckSquare size={14} className="mr-1" /> Présence
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ ATTENDANCE ═══════════
  if (activeSection === 'prof_attendance') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion de présence</h2>
            <p className="text-muted-foreground text-sm mt-1">Data Structures — TD · L2-CS-A · 01 Mars 2026</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs"><Send size={14} className="mr-1" /> Soumettre</Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ATTENDANCE_STUDENTS.map(student => {
            const status = attendanceData[student.id] || student.status;
            return (
              <div key={student.id} className={`glass-card p-3 rounded-xl border-2 transition-all ${
                status === 'present' ? 'border-success/30' : status === 'absent' ? 'border-destructive/30' : status === 'late' ? 'border-warning/30' : 'border-transparent'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground">{student.matricule}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['present', 'absent', 'late'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setAttendanceData(prev => ({ ...prev, [student.id]: s }))}
                      className={`py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
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

  // ═══════════ MY COURSES ═══════════
  if (activeSection === 'prof_courses') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Mes cours</h2>
            <p className="text-muted-foreground text-sm mt-1">Gérer les supports pédagogiques</p>
          </div>
          <div className="flex gap-2">
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option value="all">Tous niveaux</option>
              <option value="L1">L1</option><option value="L2">L2</option><option value="L3">L3</option>
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option value="all">Tous types</option>
              <option value="cours">Cours</option><option value="td">TD</option><option value="tp">TP</option>
            </select>
            <Button className="gradient-primary font-black rounded-xl text-xs h-8"><Upload size={14} className="mr-1" /> Ajouter</Button>
          </div>
        </div>

        {MY_COURSES_MATERIALS.map(course => (
          <div key={course.id} className="glass-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm flex items-center gap-2">
                <BookOpen size={14} className="text-primary" /> {course.subject}
                <span className="text-muted-foreground font-normal text-xs">({course.code} · {course.level})</span>
              </h4>
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

        {/* Exams */}
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

        {/* Meetings */}
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
          <p className="text-muted-foreground text-sm mt-1">Historique de rémunération</p>
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

  // ═══════════ MESSAGES ═══════════
  if (activeSection === 'prof_messages') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Messages</h2>
          <p className="text-muted-foreground text-sm mt-1">Messages des étudiants</p>
        </div>

        <div className="space-y-2">
          {STUDENT_MESSAGES.map(msg => (
            <div key={msg.id} className={`glass-card p-4 rounded-xl space-y-2 ${!msg.read ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
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

        {/* Admin contact section */}
        <div className="glass-card p-4 rounded-2xl space-y-3 border-2 border-dashed border-primary/20">
          <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <Mail size={14} className="text-primary" /> Contacter l'administration
          </h3>
          <p className="text-muted-foreground text-xs">Reporter une séance, demander une salle, signaler un problème...</p>
          <Input placeholder="Objet du message..." className="text-xs h-8 rounded-lg" />
          <textarea placeholder="Décrivez votre demande..." className="w-full p-3 rounded-lg border border-input bg-background text-xs min-h-[60px] resize-none" />
          <div className="flex items-center justify-between">
            <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option>Report de séance</option>
              <option>Demande de salle</option>
              <option>Problème technique</option>
              <option>Autre</option>
            </select>
            <Button className="gradient-primary font-black rounded-lg text-xs h-8"><Send size={12} className="mr-1" /> Envoyer</Button>
          </div>

          {/* Previous admin messages */}
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

  return null;
}
