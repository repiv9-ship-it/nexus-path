import { useState } from 'react';
import { 
  Building2, Users, BookOpen, TrendingUp, GraduationCap, ChevronRight, Plus, Settings,
  Calendar, DollarSign, ClipboardList, UserCheck, FileText, Bell, MapPin, Clock,
  BarChart3, Eye, AlertTriangle, CheckCircle, Search, Mail, Shield, Send,
  ChevronLeft, Briefcase, Award, ArrowLeft, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UniversityDashboardProps {
  activeSection?: string;
}

// ── Generate ING classes ──
const YEAR_GROUPS = ['A', 'B', 'C', 'D', 'E'];
const ING_CLASSES = Array.from({ length: 5 }, (_, y) => 
  YEAR_GROUPS.map(g => ({
    id: `ing${y+1}${g.toLowerCase()}`,
    name: `ING${y+1}-${g}`,
    year: y + 1,
    group: g,
    students: Math.floor(25 + Math.random() * 15),
    subjects: Math.floor(6 + Math.random() * 4),
  }))
).flat();

// ── Mock data per class ──
const CLASS_STUDENTS = [
  { id: '1', name: 'Ines Bouaziz', matricule: '2024ING001', avg: 14.5, absences: 1 },
  { id: '2', name: 'Karim Ferjani', matricule: '2024ING002', avg: 12.8, absences: 3 },
  { id: '3', name: 'Lina Mansour', matricule: '2024ING003', avg: 16.2, absences: 0 },
  { id: '4', name: 'Ahmed Trabelsi', matricule: '2024ING004', avg: 11.1, absences: 5 },
  { id: '5', name: 'Sara Ben Ali', matricule: '2024ING005', avg: 15.7, absences: 0 },
  { id: '6', name: 'Youssef Haddad', matricule: '2024ING006', avg: 13.4, absences: 2 },
  { id: '7', name: 'Amira Jelassi', matricule: '2024ING007', avg: 17.1, absences: 0 },
  { id: '8', name: 'Omar Nasri', matricule: '2024ING008', avg: 10.3, absences: 4 },
];

const CLASS_PROFESSORS = [
  { id: '1', name: 'Dr. Alan Turing', subject: 'Structures de données', type: 'Cours + TD' },
  { id: '2', name: 'Prof. Ada Lovelace', subject: 'Machine Learning', type: 'Cours' },
  { id: '3', name: 'Dr. Isaac Newton', subject: 'Algèbre linéaire', type: 'Cours + TD' },
];

const CLASS_EXAMS = [
  { id: '1', subject: 'Structures de données', date: '2026-03-25', type: 'Final', room: 'Amphi A' },
  { id: '2', subject: 'Machine Learning', date: '2026-04-10', type: 'DS', room: 'B205' },
  { id: '3', subject: 'Algèbre linéaire', date: '2026-04-15', type: 'Final', room: 'Amphi B' },
];

const CLASS_SCHEDULE = [
  { day: 'Lundi', entries: [{ time: '08:00-10:00', subject: 'Structures de données', prof: 'Dr. Turing', type: 'Cours', room: 'A101' }] },
  { day: 'Mardi', entries: [{ time: '08:00-10:00', subject: 'Algèbre linéaire', prof: 'Dr. Newton', type: 'Cours', room: 'Amphi B' }, { time: '14:00-16:00', subject: 'Machine Learning', prof: 'Prof. Lovelace', type: 'TD', room: 'Lab 3' }] },
  { day: 'Mercredi', entries: [{ time: '10:00-12:00', subject: 'Structures de données', prof: 'Dr. Turing', type: 'TD', room: 'Lab 1' }] },
  { day: 'Jeudi', entries: [{ time: '08:00-10:00', subject: 'Algèbre linéaire', prof: 'Dr. Newton', type: 'TD', room: 'C302' }] },
  { day: 'Vendredi', entries: [] },
];

// ── Management mock data ──
const ALL_PROFESSORS = [
  { id: '1', name: 'Dr. Alan Turing', department: 'Informatique', courses: 3, salary: 5200, status: 'active' as const },
  { id: '2', name: 'Prof. Ada Lovelace', department: 'Informatique', courses: 2, salary: 4800, status: 'active' as const },
  { id: '3', name: 'Dr. Isaac Newton', department: 'Mathématiques', courses: 4, salary: 5500, status: 'active' as const },
  { id: '4', name: 'Prof. Marie Curie', department: 'Génie civil', courses: 3, salary: 5000, status: 'active' as const },
  { id: '5', name: 'Dr. Albert Einstein', department: 'Mathématiques', courses: 2, salary: 6000, status: 'on_leave' as const },
];

const SALARY_SUMMARY = [
  { month: 'Mars 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'pending' as const },
  { month: 'Février 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'paid' as const },
  { month: 'Janvier 2026', totalGross: 25000, totalNet: 22500, professors: 5, status: 'paid' as const },
];

const ANNOUNCEMENTS_DATA = [
  { id: 'an1', title: 'Planning des examens publié', content: 'Les examens finaux du S3 sont confirmés.', date: '2026-02-18', category: 'exam', target: 'Tous' },
  { id: 'an2', title: 'Période d\'inscription', content: 'L\'inscription au S4 est ouverte jusqu\'au 10 mars.', date: '2026-02-15', category: 'admin', target: 'ING1-ING3' },
];

const PENDING_DOCUMENTS = [
  { id: 'd1', student: 'Alice Chen', type: 'Attestation de présence', date: '2026-02-28', status: 'en_attente' as const },
  { id: 'd2', student: 'Bob Smith', type: 'Demande de recorrection', date: '2026-02-27', status: 'en_cours' as const },
  { id: 'd3', student: 'Carol Davis', type: "Attestation d'inscription", date: '2026-02-25', status: 'en_attente' as const },
  { id: 'd4', student: 'David Lee', type: 'Demande de recorrection', date: '2026-02-20', status: 'traite' as const },
];

const INTERNSHIPS_DATA = [
  { id: 'st1', title: 'Stage PFE - Développement Web', company: 'TechCorp Tunisia', duration: '4 mois', deadline: '2026-04-01', applications: 12, status: 'active' },
  { id: 'st2', title: 'Stage d\'été - Data Science', company: 'DataLab', duration: '2 mois', deadline: '2026-05-15', applications: 8, status: 'active' },
  { id: 'st3', title: 'Stage industriel - Génie civil', company: 'BuildCo', duration: '3 mois', deadline: '2026-03-20', applications: 5, status: 'closed' },
];

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
};

type ClassTab = 'students' | 'professors' | 'schedule' | 'exams' | 'announcements';

export function UniversityDashboard({ activeSection = 'overview' }: UniversityDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classTab, setClassTab] = useState<ClassTab>('students');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const selectedClass = ING_CLASSES.find(c => c.id === selectedClassId);
  const totalStudents = ING_CLASSES.reduce((a, c) => a + c.students, 0);
  const pendingDocs = PENDING_DOCUMENTS.filter(d => d.status === 'en_attente').length;

  // ═══════════ OVERVIEW ═══════════
  if (activeSection === 'overview' || activeSection === 'university') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Administration</h2>
            <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'université</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold text-xs h-9"><Settings size={14} className="mr-1" /> Paramètres</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Étudiants', value: totalStudents, icon: Users, color: 'text-primary' },
            { label: 'Professeurs', value: ALL_PROFESSORS.length, icon: GraduationCap, color: 'text-secondary' },
            { label: 'Classes', value: ING_CLASSES.length, icon: Building2, color: 'text-success' },
            { label: 'Demandes', value: pendingDocs, icon: FileText, color: 'text-warning' },
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

        {/* Quick overview by year */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Building2 size={14} className="text-primary" /> Classes par année</h3>
            {[1,2,3,4,5].map(year => {
              const classes = ING_CLASSES.filter(c => c.year === year);
              const totalSt = classes.reduce((a, c) => a + c.students, 0);
              return (
                <div key={year} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">{year}</div>
                  <div className="flex-1">
                    <p className="font-black text-xs">ING{year} — {classes.length} groupes</p>
                    <p className="text-muted-foreground text-[10px]">{totalSt} étudiants</p>
                  </div>
                  <div className="flex gap-1">
                    {classes.map(c => (
                      <span key={c.id} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{c.group}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><FileText size={14} className="text-warning" /> Demandes en attente</h3>
            {PENDING_DOCUMENTS.filter(d => d.status !== 'traite').map(doc => (
              <div key={doc.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs">{doc.student}</p>
                  <p className="text-muted-foreground text-[10px]">{doc.type}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status]}`}>{doc.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ CLASSES ═══════════
  if (activeSection === 'uni_classes') {
    // If a class is selected, show detail view
    if (selectedClass) {
      const CLASS_TABS: { id: ClassTab; label: string; icon: typeof Users }[] = [
        { id: 'students', label: 'Étudiants', icon: Users },
        { id: 'professors', label: 'Professeurs', icon: GraduationCap },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
        { id: 'exams', label: 'Examens', icon: ClipboardList },
        { id: 'announcements', label: 'Annonces', icon: Bell },
      ];

      return (
        <div className="space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedClassId(null)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Classe {selectedClass.name}</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{selectedClass.students} étudiants · {selectedClass.subjects} matières · Année {selectedClass.year}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
            {CLASS_TABS.map(tab => (
              <button key={tab.id} onClick={() => setClassTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all ${
                  classTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}>
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {classTab === 'students' && (
            <div className="glass-card rounded-2xl overflow-x-auto">
              <div className="p-3 flex items-center justify-between gap-2 bg-muted/30">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher un étudiant..." className="pl-9 h-8 rounded-lg text-xs" />
                </div>
                <Button size="sm" className="gradient-primary font-black rounded-lg text-[10px] h-7"><Plus size={10} className="mr-1" /> Ajouter</Button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Matricule</th>
                    <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
                    <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Moyenne</th>
                    <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Absences</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASS_STUDENTS.map(s => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-black text-primary text-[10px]">{s.matricule}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-[9px]">{s.name.split(' ').map(n => n[0]).join('')}</div>
                          <span className="font-black text-xs">{s.name}</span>
                        </div>
                      </td>
                      <td className="p-3"><span className={`font-black ${s.avg >= 14 ? 'text-success' : s.avg >= 10 ? 'text-foreground' : 'text-destructive'}`}>{s.avg}/20</span></td>
                      <td className="p-3"><span className={`font-black ${s.absences > 3 ? 'text-destructive' : 'text-foreground'}`}>{s.absences}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {classTab === 'professors' && (
            <div className="space-y-2">
              {CLASS_PROFESSORS.map(p => (
                <div key={p.id} className="glass-card p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-xs">{p.name.split(' ').map(n => n[0]).join('')}</div>
                  <div className="flex-1">
                    <p className="font-black text-sm">{p.name}</p>
                    <p className="text-muted-foreground text-xs">{p.subject}</p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded bg-primary/10 text-primary">{p.type}</span>
                </div>
              ))}
            </div>
          )}

          {classTab === 'schedule' && (
            <div className="glass-card p-4 rounded-2xl space-y-2">
              {CLASS_SCHEDULE.map(day => (
                <div key={day.day} className="flex gap-3 items-start">
                  <div className="w-20 shrink-0 pt-2"><p className="font-black text-xs">{day.day}</p></div>
                  <div className="flex-1 flex gap-2 flex-wrap">
                    {day.entries.length === 0 ? (
                      <p className="text-muted-foreground text-[10px] pt-2">—</p>
                    ) : day.entries.map((e, i) => (
                      <div key={i} className="glass-card px-3 py-2 rounded-lg text-xs flex-1 min-w-[200px]">
                        <p className="font-black">{e.subject}</p>
                        <p className="text-muted-foreground text-[10px]">{e.time} · {e.room} · {e.type} · {e.prof}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {classTab === 'exams' && (
            <div className="space-y-2">
              {CLASS_EXAMS.map(exam => (
                <div key={exam.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
                  <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                    <p className="font-black text-lg text-primary">{new Date(exam.date).getDate()}</p>
                    <p className="text-muted-foreground text-[10px] font-bold">{new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm">{exam.subject}</p>
                    <p className="text-muted-foreground text-xs">{exam.room} · {exam.type}</p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-destructive/10 text-destructive rounded">{exam.type}</span>
                </div>
              ))}
            </div>
          )}

          {classTab === 'announcements' && (
            <div className="space-y-3">
              <div className="glass-card p-4 rounded-xl border-2 border-dashed border-primary/20">
                <Input placeholder="Nouvelle annonce pour cette classe..." className="rounded-lg text-xs h-8 mb-2" />
                <Button size="sm" className="gradient-primary font-black rounded-lg text-[10px] h-7"><Send size={10} className="mr-1" /> Publier</Button>
              </div>
              {ANNOUNCEMENTS_DATA.map(a => (
                <div key={a.id} className="glass-card p-3 rounded-xl">
                  <p className="font-black text-xs">{a.title}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{a.content}</p>
                  <p className="text-muted-foreground text-[9px] mt-1">{new Date(a.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Classes grid
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Classes</h2>
            <p className="text-muted-foreground text-sm mt-1">{ING_CLASSES.length} classes · ING1 à ING5</p>
          </div>
          <div className="flex gap-2">
            <select value={selectedYear ?? ''} onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
              className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option value="">Toutes les années</option>
              {[1,2,3,4,5].map(y => <option key={y} value={y}>ING{y}</option>)}
            </select>
          </div>
        </div>

        {[1,2,3,4,5].filter(y => !selectedYear || y === selectedYear).map(year => (
          <div key={year} className="space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={14} className="text-primary" /> ING{year} — {year === 1 ? '1ère' : `${year}ème`} année
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ING_CLASSES.filter(c => c.year === year).map(cls => (
                <button key={cls.id} onClick={() => { setSelectedClassId(cls.id); setClassTab('students'); }}
                  className="glass-card p-4 rounded-xl hover:border-primary/40 transition-all text-left group">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm mb-3 group-hover:scale-110 transition-transform">
                    {cls.group}
                  </div>
                  <p className="font-black text-sm">{cls.name}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{cls.students} étudiants · {cls.subjects} matières</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ═══════════ MANAGEMENT: FINANCE ═══════════
  if (activeSection === 'uni_finance') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Finance & Salaires</h2>
          <p className="text-muted-foreground text-sm mt-1">Suivi de la masse salariale en TND</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Masse salariale', value: '26 500 TND', color: 'text-foreground' },
            { label: 'Net total', value: '23 800 TND', color: 'text-primary' },
            { label: 'Personnel actif', value: ALL_PROFESSORS.filter(p => p.status === 'active').length, color: 'text-success' },
            { label: 'En congé', value: ALL_PROFESSORS.filter(p => p.status === 'on_leave').length, color: 'text-warning' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly summary */}
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Mois</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Brut</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Net</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Effectif</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {SALARY_SUMMARY.map((s, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3 font-bold">{s.month}</td>
                  <td className="p-3 font-bold">{s.totalGross.toLocaleString()} TND</td>
                  <td className="p-3 font-black text-primary">{s.totalNet.toLocaleString()} TND</td>
                  <td className="p-3 font-bold">{s.professors}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      s.status === 'paid' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                    }`}>{s.status === 'paid' ? 'Payé' : 'En attente'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Per professor */}
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider">Détail par professeur — Ce mois</h4>
          {ALL_PROFESSORS.map(prof => (
            <div key={prof.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-[10px]">{prof.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs">{prof.name}</p>
                <p className="text-muted-foreground text-[10px]">{prof.department}</p>
              </div>
              <span className="font-black text-primary text-sm">{prof.salary.toLocaleString()} TND</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                prof.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
              }`}>{prof.status === 'active' ? 'Payé' : 'En congé'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ MANAGEMENT: ANNOUNCEMENTS ═══════════
  if (activeSection === 'uni_announcements') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Annonces</h2>
            <p className="text-muted-foreground text-sm mt-1">Diffuser des annonces aux étudiants</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 border-dashed border-2 border-primary/20">
          <p className="font-black text-sm text-primary">Publication rapide</p>
          <Input placeholder="Titre de l'annonce..." className="rounded-lg text-sm h-9" />
          <textarea placeholder="Rédigez votre annonce..." className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-none" />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option>Tous les étudiants</option>
              {[1,2,3,4,5].map(y => <option key={y}>ING{y} seulement</option>)}
            </select>
            <Button className="gradient-primary font-black rounded-lg text-xs h-8"><Send size={12} className="mr-1" /> Publier</Button>
          </div>
        </div>

        {ANNOUNCEMENTS_DATA.map(ann => (
          <div key={ann.id} className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <p className="font-black text-sm">{ann.title}</p>
              <span className="text-muted-foreground text-[10px] font-bold">{new Date(ann.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span>
            </div>
            <p className="text-muted-foreground text-xs">{ann.content}</p>
            <p className="text-muted-foreground text-[10px] mt-1">Cible: {ann.target}</p>
          </div>
        ))}
      </div>
    );
  }

  // ═══════════ MANAGEMENT: EXAMS ═══════════
  if (activeSection === 'uni_exams') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Examens</h2>
            <p className="text-muted-foreground text-sm mt-1">Planning et gestion des examens</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Programmer un examen</Button>
        </div>

        <div className="space-y-2">
          {CLASS_EXAMS.concat([
            { id: '4', subject: 'Physique', date: '2026-04-20', type: 'Final', room: 'Amphi C' },
            { id: '5', subject: 'Programmation C', date: '2026-04-22', type: 'DS', room: 'Lab 2' },
          ]).map(exam => (
            <div key={exam.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
              <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                <p className="font-black text-lg text-primary">{new Date(exam.date).getDate()}</p>
                <p className="text-muted-foreground text-[10px] font-bold">{new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
              </div>
              <div className="flex-1">
                <p className="font-black text-sm">{exam.subject}</p>
                <p className="text-muted-foreground text-xs flex items-center gap-2"><MapPin size={11} />{exam.room}</p>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-destructive/10 text-destructive rounded">{exam.type}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ MANAGEMENT: STAGES ═══════════
  if (activeSection === 'uni_stages') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Stages</h2>
            <p className="text-muted-foreground text-sm mt-1">Offres de stages et candidatures</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Ajouter une offre</Button>
        </div>

        <div className="space-y-2">
          {INTERNSHIPS_DATA.map(stage => (
            <div key={stage.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-sm">{stage.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{stage.company} · {stage.duration}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded">{stage.applications} candidatures</span>
                    <span className="text-muted-foreground text-[10px]">Date limite: {new Date(stage.deadline).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${
                  stage.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground border-border'
                }`}>{stage.status === 'active' ? 'Actif' : 'Clôturé'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════ MANAGEMENT: REQUESTS ═══════════
  if (activeSection === 'uni_documents') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Demandes étudiantes</h2>
          <p className="text-muted-foreground text-sm mt-1">Attestations et recorrections</p>
        </div>

        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Demande</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_DOCUMENTS.map(doc => (
                <tr key={doc.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-black">{doc.student}</td>
                  <td className="p-3 font-bold">{doc.type}</td>
                  <td className="p-3 text-muted-foreground">{new Date(doc.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</td>
                  <td className="p-3"><span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status]}`}>{doc.status.replace('_', ' ')}</span></td>
                  <td className="p-3">
                    {doc.status === 'en_attente' && (
                      <div className="flex gap-1">
                        <button className="w-6 h-6 rounded bg-success/20 flex items-center justify-center hover:bg-success/30"><CheckCircle size={12} className="text-success" /></button>
                        <button className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center hover:bg-destructive/30"><AlertTriangle size={12} className="text-destructive" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ MANAGEMENT: REPORTS ═══════════
  if (activeSection === 'uni_reports') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Rapports & Statistiques</h2>
          <p className="text-muted-foreground text-sm mt-1">Indicateurs de performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Performance étudiante', desc: 'Moyenne générale', icon: TrendingUp, value: '13.2/20' },
            { title: 'Taux de présence', desc: 'Présence globale', icon: UserCheck, value: '92%' },
            { title: 'Réussite', desc: 'Étudiants validant', icon: CheckCircle, value: '85%' },
            { title: 'Abandon', desc: 'Étudiants ayant quitté', icon: AlertTriangle, value: '3.2%' },
            { title: 'Stages placés', desc: 'Placements en entreprise', icon: Briefcase, value: '67%' },
            { title: 'Satisfaction', desc: 'Enquêtes étudiantes', icon: BarChart3, value: '4.2/5' },
          ].map((report, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
              <report.icon size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-black text-2xl text-primary">{report.value}</p>
              <p className="font-black text-xs mt-1">{report.title}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">{report.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
