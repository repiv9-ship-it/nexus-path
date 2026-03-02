import { useState } from 'react';
import { 
  Building2, Users, BookOpen, TrendingUp, GraduationCap, ChevronRight, Plus, Settings,
  Calendar, DollarSign, ClipboardList, UserCheck, FileText, Bell, MapPin, Clock,
  BarChart3, Eye, AlertTriangle, CheckCircle, Search, Mail, Shield, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FIELDS, LEVELS } from '@/lib/constants';

interface UniversityDashboardProps {
  activeSection?: string;
}

// ── Mock Data ──
const DEPARTMENTS = [
  { id: '1', name: 'Informatique', students: 450, professors: 12, courses: 28 },
  { id: '2', name: 'Mathématiques', students: 280, professors: 8, courses: 18 },
  { id: '3', name: 'Génie civil', students: 520, professors: 15, courses: 35 },
  { id: '4', name: 'Commerce', students: 380, professors: 10, courses: 22 },
];

const ALL_PROFESSORS = [
  { id: '1', name: 'Dr. Alan Turing', department: 'Informatique', courses: 3, students: 245, salary: 5200, status: 'active' as const, phone: '+216 xx xxx xxx' },
  { id: '2', name: 'Prof. Ada Lovelace', department: 'Informatique', courses: 2, students: 189, salary: 4800, status: 'active' as const, phone: '+216 xx xxx xxx' },
  { id: '3', name: 'Dr. Isaac Newton', department: 'Mathématiques', courses: 4, students: 312, salary: 5500, status: 'active' as const, phone: '+216 xx xxx xxx' },
  { id: '4', name: 'Prof. Marie Curie', department: 'Génie civil', courses: 3, students: 278, salary: 5000, status: 'active' as const, phone: '+216 xx xxx xxx' },
  { id: '5', name: 'Dr. Albert Einstein', department: 'Mathématiques', courses: 2, students: 156, salary: 6000, status: 'on_leave' as const, phone: '+216 xx xxx xxx' },
];

const ALL_STUDENTS = [
  { id: '1', name: 'Alice Chen', email: 'alice@uni.edu', level: 'L2', department: 'Informatique', absences: 2, avg: 14.5, matricule: '2024CS001' },
  { id: '2', name: 'Bob Smith', email: 'bob@uni.edu', level: 'L1', department: 'Informatique', absences: 5, avg: 11.2, matricule: '2024CS002' },
  { id: '3', name: 'Carol Davis', email: 'carol@uni.edu', level: 'L3', department: 'Mathématiques', absences: 0, avg: 16.8, matricule: '2023MA001' },
  { id: '4', name: 'David Lee', email: 'david@uni.edu', level: 'M1', department: 'Génie civil', absences: 3, avg: 13.1, matricule: '2022GC001' },
  { id: '5', name: 'Emma Wilson', email: 'emma@uni.edu', level: 'L2', department: 'Commerce', absences: 1, avg: 15.3, matricule: '2024CO001' },
];

const SUBJECTS_DATA = [
  { id: 's1', name: 'Structures de données', code: 'CS201', department: 'Informatique', semester: 'S3', professor: 'Dr. Turing', students: 156, level: 'L2' },
  { id: 's2', name: 'Machine Learning', code: 'AI301', department: 'Informatique', semester: 'S5', professor: 'Prof. Lovelace', students: 89, level: 'L3' },
  { id: 's3', name: 'Algèbre linéaire', code: 'MATH201', department: 'Mathématiques', semester: 'S3', professor: 'Dr. Newton', students: 280, level: 'L2' },
  { id: 's4', name: 'Thermodynamique', code: 'ENG301', department: 'Génie civil', semester: 'S5', professor: 'Prof. Curie', students: 134, level: 'L3' },
  { id: 's5', name: 'Comptabilité', code: 'BUS101', department: 'Commerce', semester: 'S1', professor: 'Dr. Keynes', students: 220, level: 'L1' },
];

const SCHEDULE_DATA = [
  { id: 'sc1', subject: 'Structures de données', professor: 'Dr. Turing', day: 'Lundi', time: '08:00-10:00', room: 'A101', type: 'Cours', group: 'L2-CS-A' },
  { id: 'sc2', subject: 'Machine Learning', professor: 'Prof. Lovelace', day: 'Lundi', time: '14:00-16:00', room: 'Lab 3', type: 'TD', group: 'L3-CS-B' },
  { id: 'sc3', subject: 'Algèbre linéaire', professor: 'Dr. Newton', day: 'Mardi', time: '08:00-10:00', room: 'Amphi B', type: 'Cours', group: 'L2-All' },
  { id: 'sc4', subject: 'Thermodynamique', professor: 'Prof. Curie', day: 'Mardi', time: '14:00-16:00', room: 'C302', type: 'TD', group: 'L3-ENG' },
  { id: 'sc5', subject: 'Structures de données', professor: 'Dr. Turing', day: 'Mercredi', time: '10:00-12:00', room: 'Lab 1', type: 'TD', group: 'L2-CS-A' },
];

const SALARY_SUMMARY = [
  { month: 'Mars 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'pending' as const },
  { month: 'Février 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'paid' as const },
  { month: 'Janvier 2026', totalGross: 25000, totalNet: 22500, professors: 5, status: 'paid' as const },
];

const PENDING_DOCUMENTS = [
  { id: 'd1', student: 'Alice Chen', type: 'Attestation de présence', date: '2026-02-28', status: 'en_attente' as const },
  { id: 'd2', student: 'Bob Smith', type: 'Demande de recorrection', date: '2026-02-27', status: 'en_cours' as const },
  { id: 'd3', student: 'Carol Davis', type: "Attestation d'inscription", date: '2026-02-25', status: 'en_attente' as const },
  { id: 'd4', student: 'David Lee', type: 'Demande de recorrection', date: '2026-02-20', status: 'traite' as const },
];

const ANNOUNCEMENTS_DATA = [
  { id: 'an1', title: 'Planning des examens publié', content: 'Les examens finaux du S3 sont confirmés.', date: '2026-02-18', category: 'exam', author: 'Admin' },
  { id: 'an2', title: 'Période d\'inscription', content: 'L\'inscription au S4 est ouverte jusqu\'au 10 mars.', date: '2026-02-15', category: 'admin', author: 'Admin' },
];

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function UniversityDashboard({ activeSection = 'overview' }: UniversityDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const totalStudents = DEPARTMENTS.reduce((a, d) => a + d.students, 0);
  const totalProfessors = DEPARTMENTS.reduce((a, d) => a + d.professors, 0);
  const totalCourses = DEPARTMENTS.reduce((a, d) => a + d.courses, 0);
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
            <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Inviter</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Étudiants', value: totalStudents.toLocaleString(), icon: Users, color: 'text-primary' },
            { label: 'Professeurs', value: totalProfessors, icon: GraduationCap, color: 'text-secondary' },
            { label: 'Matières', value: totalCourses, icon: BookOpen, color: 'text-success' },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Departments */}
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Building2 size={14} className="text-primary" /> Départements</h3>
            {DEPARTMENTS.map(dept => (
              <div key={dept.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">{dept.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs">{dept.name}</p>
                  <p className="text-muted-foreground text-[10px]">{dept.students} étudiants · {dept.professors} profs · {dept.courses} matières</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pending requests */}
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

        {/* Today schedule */}
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-primary" /> Cours aujourd'hui</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SCHEDULE_DATA.slice(0, 3).map(s => (
              <div key={s.id} className="glass-card p-3 rounded-xl">
                <p className="font-black text-xs">{s.subject}</p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${s.type === 'Cours' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{s.type}</span>
                  <span className="text-muted-foreground text-[10px]">{s.time} · {s.room}</span>
                </div>
                <p className="text-muted-foreground text-[10px] mt-1">{s.professor} · {s.group}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ CLASSES ═══════════
  if (activeSection === 'uni_classes') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion des classes</h2>
            <p className="text-muted-foreground text-sm mt-1">Matières, emplois du temps et groupes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold text-xs h-9"><Calendar size={14} className="mr-1" /> Emploi du temps</Button>
            <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Ajouter matière</Button>
          </div>
        </div>

        {/* Subjects */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 bg-muted/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher une matière..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-8 rounded-lg text-xs" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Code</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Matière</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Département</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Professeur</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiants</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Niveau</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS_DATA.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(sub => (
                  <tr key={sub.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-black text-primary">{sub.code}</td>
                    <td className="p-3 font-bold">{sub.name}</td>
                    <td className="p-3 text-muted-foreground">{sub.department}</td>
                    <td className="p-3 font-bold">{sub.professor}</td>
                    <td className="p-3 font-black">{sub.students}</td>
                    <td className="p-3"><span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{sub.level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly */}
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider">Emploi du temps hebdomadaire</h4>
          <div className="space-y-2">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => {
              const entries = SCHEDULE_DATA.filter(s => s.day === day);
              return (
                <div key={day} className="flex gap-3 items-start">
                  <div className="w-20 shrink-0 pt-2"><p className="font-black text-xs">{day}</p></div>
                  <div className="flex-1 flex gap-2 flex-wrap">
                    {entries.length === 0 ? (
                      <p className="text-muted-foreground text-[10px] pt-2">Pas de cours</p>
                    ) : entries.map(e => (
                      <div key={e.id} className="glass-card px-3 py-2 rounded-lg text-xs">
                        <p className="font-black">{e.subject}</p>
                        <p className="text-muted-foreground text-[10px]">{e.time} · {e.room} · {e.type} · {e.professor}</p>
                      </div>
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

  // ═══════════ STUDENTS ═══════════
  if (activeSection === 'uni_students') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion des étudiants</h2>
            <p className="text-muted-foreground text-sm mt-1">{totalStudents} étudiants inscrits</p>
          </div>
          <div className="flex gap-2">
            <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option>Tous niveaux</option>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <Button className="gradient-primary font-black rounded-xl text-xs h-8"><Plus size={14} className="mr-1" /> Ajouter</Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Matricule</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Niveau</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Département</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Moyenne</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Absences</th>
              </tr>
            </thead>
            <tbody>
              {ALL_STUDENTS.map(student => (
                <tr key={student.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-black text-primary text-[10px]">{student.matricule}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[9px]">{student.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p className="font-black text-xs">{student.name}</p>
                        <p className="text-muted-foreground text-[10px]">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{student.level}</span></td>
                  <td className="p-3 text-muted-foreground">{student.department}</td>
                  <td className="p-3 font-black">{student.avg}/20</td>
                  <td className="p-3">
                    <span className={`font-black text-xs ${student.absences > 3 ? 'text-destructive' : 'text-foreground'}`}>{student.absences}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ PROFESSORS ═══════════
  if (activeSection === 'uni_professors') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion des professeurs</h2>
            <p className="text-muted-foreground text-sm mt-1">{totalProfessors} professeurs actifs</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Ajouter professeur</Button>
        </div>

        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Professeur</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Département</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Matières</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Salaire</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PROFESSORS.map(prof => (
                <tr key={prof.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[10px]">{prof.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p className="font-black">{prof.name}</p>
                        <p className="text-muted-foreground text-[10px]">{prof.students} étudiants</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{prof.department}</td>
                  <td className="p-3 font-black text-primary">{prof.courses}</td>
                  <td className="p-3 font-bold">{prof.salary.toLocaleString()} TND</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      prof.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                    }`}>{prof.status === 'active' ? 'Actif' : 'En congé'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ SALARIES ═══════════
  if (activeSection === 'uni_salaries') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Gestion des salaires</h2>
          <p className="text-muted-foreground text-sm mt-1">Suivi de la masse salariale</p>
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
          <h4 className="font-black text-sm uppercase tracking-wider">Par professeur — Ce mois</h4>
          {ALL_PROFESSORS.map(prof => (
            <div key={prof.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[10px]">{prof.name.split(' ').map(n => n[0]).join('')}</div>
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

  // ═══════════ ANNOUNCEMENTS ═══════════
  if (activeSection === 'uni_announcements') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Annonces</h2>
            <p className="text-muted-foreground text-sm mt-1">Diffuser des annonces aux étudiants</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Nouvelle annonce</Button>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 border-dashed border-2 border-primary/20">
          <p className="font-black text-sm text-primary">Publication rapide</p>
          <Input placeholder="Titre de l'annonce..." className="rounded-lg text-sm h-9" />
          <textarea placeholder="Rédigez votre annonce..." className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-none" />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
              <option>Tous les étudiants</option>
              <option>L1 seulement</option>
              <option>L2 seulement</option>
              <option>L3 seulement</option>
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
            <p className="text-muted-foreground text-[10px] mt-1">Publié par {ann.author}</p>
          </div>
        ))}
      </div>
    );
  }

  // ═══════════ DOCUMENTS ═══════════
  if (activeSection === 'uni_documents') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Demandes étudiantes</h2>
          <p className="text-muted-foreground text-sm mt-1">Traitement des attestations et recorrections</p>
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

  // ═══════════ REPORTS ═══════════
  if (activeSection === 'uni_reports') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Rapports & Statistiques</h2>
          <p className="text-muted-foreground text-sm mt-1">Indicateurs de performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Performance étudiante', desc: 'Moyenne par département', icon: TrendingUp, value: '13.2/20' },
            { title: 'Taux de présence', desc: 'Présence globale', icon: UserCheck, value: '92%' },
            { title: 'Réussite', desc: 'Étudiants validant le semestre', icon: CheckCircle, value: '85%' },
            { title: 'Abandon', desc: 'Étudiants ayant quitté', icon: AlertTriangle, value: '3.2%' },
            { title: 'Stages', desc: 'Placements en entreprise', icon: BookOpen, value: '67%' },
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

        {/* Department breakdown */}
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider">Performance par département</h4>
          {DEPARTMENTS.map(dept => (
            <div key={dept.id} className="flex items-center gap-3">
              <span className="font-bold text-xs w-32 shrink-0">{dept.name}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full" style={{ width: `${70 + Math.random() * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
