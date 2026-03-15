import { useState } from 'react';
import { 
  Building2, Users, BookOpen, TrendingUp, GraduationCap, ChevronRight, Plus, Settings,
  Calendar, DollarSign, ClipboardList, UserCheck, FileText, Bell, MapPin, Clock,
  BarChart3, Eye, AlertTriangle, CheckCircle, Search, Mail, Shield, Send,
  ChevronLeft, Briefcase, Award, ArrowLeft, X, QrCode, Receipt, CreditCard,
  Printer, Download, ScanLine, Hash, BadgeCheck, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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

// ── Student Payments mock data ──
const STUDENT_PAYMENT_LIST = [
  { id: 'sp1', studentName: 'Ines Bouaziz', matricule: '2024ING001', class: 'ING1-A', totalDue: 7000, totalPaid: 4000, payments: [
    { id: 'p1', amount: 2000, date: '2025-09-15', method: 'Espèces', receipt: 'REC-20250915-A1B2', period: 'S1 - Tranche 1' },
    { id: 'p2', amount: 2000, date: '2025-12-10', method: 'Virement', receipt: 'REC-20251210-C3D4', period: 'S1 - Tranche 2' },
  ]},
  { id: 'sp2', studentName: 'Karim Ferjani', matricule: '2024ING002', class: 'ING1-A', totalDue: 7000, totalPaid: 7000, payments: [
    { id: 'p3', amount: 7000, date: '2025-09-01', method: 'Chèque', receipt: 'REC-20250901-E5F6', period: 'Année complète' },
  ]},
  { id: 'sp3', studentName: 'Lina Mansour', matricule: '2024ING003', class: 'ING2-B', totalDue: 7000, totalPaid: 1000, payments: [
    { id: 'p4', amount: 1000, date: '2025-10-05', method: 'Espèces', receipt: 'REC-20251005-G7H8', period: 'S1 - Tranche 1' },
  ]},
  { id: 'sp4', studentName: 'Ahmed Trabelsi', matricule: '2024ING004', class: 'ING3-C', totalDue: 7000, totalPaid: 3500, payments: [
    { id: 'p5', amount: 3500, date: '2025-09-20', method: 'Virement', receipt: 'REC-20250920-I9J0', period: 'S1' },
  ]},
  { id: 'sp5', studentName: 'Sara Ben Ali', matricule: '2024ING005', class: 'ING1-A', totalDue: 7000, totalPaid: 0, payments: [] },
];

// ── QR Exam mock data ──
const QR_EXAMS = [
  { id: 'qe1', subject: 'Structures de données', class: 'ING1-A', date: '2026-03-10', type: 'DS', totalCopies: 35, scannedCopies: 28, gradedCopies: 20 },
  { id: 'qe2', subject: 'Machine Learning', class: 'ING2-B', date: '2026-03-12', type: 'Final', totalCopies: 30, scannedCopies: 30, gradedCopies: 30 },
  { id: 'qe3', subject: 'Algèbre linéaire', class: 'ING1-C', date: '2026-03-15', type: 'DS', totalCopies: 32, scannedCopies: 0, gradedCopies: 0 },
];

const QR_EXAM_COPIES = [
  { id: 'c1', studentName: 'Ines Bouaziz', matricule: '2024ING001', qrCode: 'QR-A1B2C3D4', score: 15.5, maxScore: 20, scanned: true },
  { id: 'c2', studentName: 'Karim Ferjani', matricule: '2024ING002', qrCode: 'QR-E5F6G7H8', score: 12, maxScore: 20, scanned: true },
  { id: 'c3', studentName: 'Lina Mansour', matricule: '2024ING003', qrCode: 'QR-I9J0K1L2', score: null, maxScore: 20, scanned: true },
  { id: 'c4', studentName: 'Ahmed Trabelsi', matricule: '2024ING004', qrCode: 'QR-M3N4O5P6', score: null, maxScore: 20, scanned: false },
  { id: 'c5', studentName: 'Sara Ben Ali', matricule: '2024ING005', qrCode: 'QR-Q7R8S9T0', score: 17, maxScore: 20, scanned: true },
];

// ── Certification requests mock data ──
const CERT_REQUESTS = [
  { id: 'cr1', studentName: 'Ines Bouaziz', certification: 'AWS Cloud Practitioner', type: 'voucher', status: 'en_attente', date: '2026-03-01', voucherCode: null, passed: null },
  { id: 'cr2', studentName: 'Karim Ferjani', certification: 'Cisco CCNA', type: 'white_test', status: 'approuve', date: '2026-02-15', voucherCode: null, passed: null },
  { id: 'cr3', studentName: 'Lina Mansour', certification: 'Oracle Java SE', type: 'voucher', status: 'envoye', date: '2026-02-10', voucherCode: 'ORACLE-VCH-2026-LM', passed: true },
  { id: 'cr4', studentName: 'Ahmed Trabelsi', certification: 'AWS Solutions Architect', type: 'white_test', status: 'en_attente', date: '2026-03-05', voucherCode: null, passed: null },
  { id: 'cr5', studentName: 'Sara Ben Ali', certification: 'Google Cloud Associate', type: 'voucher', status: 'rejete', date: '2026-01-20', voucherCode: null, passed: null },
];

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
  approuve: 'bg-success/10 text-success border-success/30',
  envoye: 'bg-primary/10 text-primary border-primary/30',
};

const STATUS_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  traite: 'Traité',
  rejete: 'Rejeté',
  approuve: 'Approuvé',
  envoye: 'Voucher envoyé',
};

type ClassTab = 'students' | 'professors' | 'schedule' | 'exams' | 'announcements';

export function UniversityDashboard({ activeSection = 'overview' }: UniversityDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classTab, setClassTab] = useState<ClassTab>('students');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Finance state
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENT_PAYMENT_LIST[0] | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Espèces');
  const [paymentPeriod, setPaymentPeriod] = useState('');
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // QR Exam state
  const [selectedExam, setSelectedExam] = useState<typeof QR_EXAMS[0] | null>(null);
  const [scanMode, setScanMode] = useState(false);
  const [gradingCopyId, setGradingCopyId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');

  // Cert state
  const [certVoucherInput, setCertVoucherInput] = useState('');
  const [certActionId, setCertActionId] = useState<string | null>(null);

  const selectedClass = ING_CLASSES.find(c => c.id === selectedClassId);
  const totalStudents = ING_CLASSES.reduce((a, c) => a + c.students, 0);
  const pendingDocs = PENDING_DOCUMENTS.filter(d => d.status === 'en_attente').length;

  const handleLogPayment = () => {
    if (!selectedStudent || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const receipt = `REC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    setReceiptData({
      studentName: selectedStudent.studentName,
      matricule: selectedStudent.matricule,
      amount,
      method: paymentMethod,
      period: paymentPeriod,
      receipt,
      date: new Date().toLocaleDateString('fr-FR'),
      remaining: selectedStudent.totalDue - selectedStudent.totalPaid - amount,
    });
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    setPaymentAmount('');
    setPaymentPeriod('');
  };

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
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedClassId(null)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Classe {selectedClass.name}</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{selectedClass.students} étudiants · {selectedClass.subjects} matières</p>
            </div>
          </div>

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

          {classTab === 'students' && (
            <div className="glass-card rounded-2xl overflow-x-auto">
              <div className="p-3 flex items-center justify-between gap-2 bg-muted/30">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9 h-8 rounded-lg text-xs" />
                </div>
                <Button size="sm" className="gradient-primary font-black rounded-lg text-[10px] h-7"><Plus size={10} className="mr-1" /> Ajouter</Button>
              </div>
              <table className="w-full text-xs">
                <thead><tr className="bg-muted/30">
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Matricule</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Moyenne</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Absences</th>
                </tr></thead>
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
          <select value={selectedYear ?? ''} onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
            <option value="">Toutes les années</option>
            {[1,2,3,4,5].map(y => <option key={y} value={y}>ING{y}</option>)}
          </select>
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

  // ═══════════ FINANCE: STUDENT PAYMENTS ═══════════
  if (activeSection === 'uni_finance') {
    // Detail view for a specific student
    if (selectedStudent) {
      const remaining = selectedStudent.totalDue - selectedStudent.totalPaid;
      const paidPercent = (selectedStudent.totalPaid / selectedStudent.totalDue) * 100;

      return (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedStudent(null)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight">{selectedStudent.studentName}</h2>
              <p className="text-muted-foreground text-xs">{selectedStudent.matricule} · {selectedStudent.class}</p>
            </div>
            <Button onClick={() => setShowPaymentDialog(true)} className="gradient-primary font-black rounded-xl text-xs h-9">
              <Plus size={14} className="mr-1" /> Enregistrer un paiement
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-foreground">{selectedStudent.totalDue.toLocaleString()} DT</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Montant total</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-success">{selectedStudent.totalPaid.toLocaleString()} DT</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Payé</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className={`font-black text-lg ${remaining > 0 ? 'text-destructive' : 'text-success'}`}>{remaining.toLocaleString()} DT</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Restant</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-primary">{paidPercent.toFixed(0)}%</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Progression</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-muted-foreground">Progression du paiement</span>
              <span className={paidPercent >= 100 ? 'text-success' : 'text-primary'}>{selectedStudent.totalPaid.toLocaleString()} / {selectedStudent.totalDue.toLocaleString()} DT</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${paidPercent >= 100 ? 'bg-success' : paidPercent >= 50 ? 'bg-primary' : 'bg-warning'}`}
                style={{ width: `${Math.min(paidPercent, 100)}%` }} />
            </div>
          </div>

          {/* Payments history */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 bg-muted/30">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Receipt size={14} className="text-primary" /> Historique des paiements</h3>
            </div>
            {selectedStudent.payments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-bold text-sm">Aucun paiement enregistré</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead><tr className="bg-muted/20">
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Montant</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Méthode</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Période</th>
                  <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Reçu</th>
                </tr></thead>
                <tbody>
                  {selectedStudent.payments.map(p => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                      <td className="p-3 font-black text-success">{p.amount.toLocaleString()} DT</td>
                      <td className="p-3 font-bold">{p.method}</td>
                      <td className="p-3 font-bold text-muted-foreground">{p.period}</td>
                      <td className="p-3">
                        <button className="flex items-center gap-1 text-primary hover:underline font-black text-[10px]">
                          <Printer size={10} /> {p.receipt}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Payment Dialog */}
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-black">Enregistrer un paiement</DialogTitle>
                <DialogDescription>{selectedStudent.studentName} — Restant: {remaining.toLocaleString()} DT</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1 block">Montant (DT) *</label>
                  <Input type="number" placeholder="ex: 2000" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1 block">Méthode de paiement</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background font-bold text-sm">
                    <option>Espèces</option>
                    <option>Virement</option>
                    <option>Chèque</option>
                    <option>Carte bancaire</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1 block">Période</label>
                  <Input placeholder="ex: S1 - Tranche 3" value={paymentPeriod} onChange={e => setPaymentPeriod(e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowPaymentDialog(false)} className="font-bold">Annuler</Button>
                <Button onClick={handleLogPayment} className="gradient-primary font-black" disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}>
                  Confirmer & Générer Reçu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Receipt Dialog */}
          <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-black flex items-center gap-2"><Receipt size={18} className="text-success" /> Reçu de paiement</DialogTitle>
              </DialogHeader>
              {receiptData && (
                <div className="glass-card p-5 rounded-xl border-2 border-dashed border-success/30 space-y-3">
                  <div className="text-center border-b border-border pb-3">
                    <p className="font-black text-lg">UNILINGO</p>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Reçu de paiement</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-muted-foreground text-[10px]">Étudiant</p><p className="font-black">{receiptData.studentName}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Matricule</p><p className="font-black">{receiptData.matricule}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Montant</p><p className="font-black text-success text-lg">{receiptData.amount.toLocaleString()} DT</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Méthode</p><p className="font-black">{receiptData.method}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Période</p><p className="font-black">{receiptData.period || '—'}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Date</p><p className="font-black">{receiptData.date}</p></div>
                  </div>
                  <div className="text-center border-t border-border pt-3">
                    <p className="text-muted-foreground text-[10px]">N° Reçu</p>
                    <p className="font-black text-primary text-xs">{receiptData.receipt}</p>
                    <p className="text-muted-foreground text-[10px] mt-1">Restant après paiement: <span className={`font-black ${receiptData.remaining <= 0 ? 'text-success' : 'text-destructive'}`}>{Math.max(0, receiptData.remaining).toLocaleString()} DT</span></p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" className="font-bold" onClick={() => setShowReceiptDialog(false)}>Fermer</Button>
                <Button className="gradient-primary font-black"><Printer size={14} className="mr-1" /> Imprimer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    // Student payments list
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Finance — Paiements étudiants</h2>
            <p className="text-muted-foreground text-sm mt-1">Suivi des frais de scolarité et génération de reçus</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total attendu', value: `${(STUDENT_PAYMENT_LIST.length * 7000).toLocaleString()} DT`, color: 'text-foreground' },
            { label: 'Total encaissé', value: `${STUDENT_PAYMENT_LIST.reduce((a, s) => a + s.totalPaid, 0).toLocaleString()} DT`, color: 'text-success' },
            { label: 'Restant', value: `${STUDENT_PAYMENT_LIST.reduce((a, s) => a + (s.totalDue - s.totalPaid), 0).toLocaleString()} DT`, color: 'text-destructive' },
            { label: 'Étudiants soldés', value: `${STUDENT_PAYMENT_LIST.filter(s => s.totalPaid >= s.totalDue).length}/${STUDENT_PAYMENT_LIST.length}`, color: 'text-primary' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un étudiant par nom ou matricule..." className="pl-9 rounded-xl text-xs h-9"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {/* Students table */}
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Classe</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Total dû</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Payé</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Restant</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
            </tr></thead>
            <tbody>
              {STUDENT_PAYMENT_LIST
                .filter(s => !searchQuery || s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || s.matricule.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(student => {
                const remaining = student.totalDue - student.totalPaid;
                const pct = (student.totalPaid / student.totalDue) * 100;
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)}
                    className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-[9px]">
                          {student.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black">{student.studentName}</p>
                          <p className="text-muted-foreground text-[10px]">{student.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-bold">{student.class}</td>
                    <td className="p-3 font-bold">{student.totalDue.toLocaleString()} DT</td>
                    <td className="p-3 font-black text-success">{student.totalPaid.toLocaleString()} DT</td>
                    <td className="p-3 font-black text-destructive">{remaining > 0 ? `${remaining.toLocaleString()} DT` : '—'}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        pct >= 100 ? 'bg-success/10 text-success border-success/30' : pct >= 50 ? 'bg-warning/10 text-warning border-warning/30' : 'bg-destructive/10 text-destructive border-destructive/30'
                      }`}>{pct >= 100 ? 'Soldé' : pct > 0 ? `${pct.toFixed(0)}%` : 'Non payé'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ EXAMS: QR SCANNING & GRADING ═══════════
  if (activeSection === 'uni_exams') {
    if (selectedExam) {
      const scanProgress = (selectedExam.scannedCopies / selectedExam.totalCopies) * 100;
      const gradeProgress = (selectedExam.gradedCopies / selectedExam.totalCopies) * 100;

      return (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedExam(null); setScanMode(false); }} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight">{selectedExam.subject}</h2>
              <p className="text-muted-foreground text-xs">{selectedExam.class} · {selectedExam.type} · {new Date(selectedExam.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <Button onClick={() => setScanMode(!scanMode)} variant={scanMode ? 'default' : 'outline'} className={`font-black rounded-xl text-xs h-9 ${scanMode ? 'gradient-primary' : ''}`}>
              <ScanLine size={14} className="mr-1" /> {scanMode ? 'Mode Scan Actif' : 'Scanner QR'}
            </Button>
          </div>

          {/* Progress cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-foreground">{selectedExam.totalCopies}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Total copies</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-primary">{selectedExam.scannedCopies}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Scannées</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="font-black text-lg text-success">{selectedExam.gradedCopies}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">Notées</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${gradeProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Scan mode */}
          {scanMode && (
            <div className="glass-card p-6 rounded-2xl border-2 border-dashed border-primary/30 text-center space-y-3">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <QrCode size={40} className="text-primary" />
              </div>
              <p className="font-black text-sm">Scanner un QR Code</p>
              <p className="text-muted-foreground text-xs">Scannez le QR code sur la copie d'examen pour l'identifier</p>
              <div className="flex items-center gap-2 max-w-xs mx-auto">
                <Input placeholder="QR-XXXXXXXX" className="rounded-xl text-center font-mono font-black text-sm" />
                <Button className="gradient-primary font-black rounded-xl"><ScanLine size={14} /></Button>
              </div>
            </div>
          )}

          {/* Copies table */}
          <div className="glass-card rounded-2xl overflow-x-auto">
            <div className="p-3 bg-muted/30">
              <h3 className="font-black text-xs uppercase tracking-wider">Copies d'examen</h3>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/20">
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">QR Code</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut Scan</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Note</th>
                <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {QR_EXAM_COPIES.map(copy => (
                  <tr key={copy.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <QrCode size={14} className={copy.scanned ? 'text-success' : 'text-muted-foreground'} />
                        <span className="font-mono font-black text-[10px]">{copy.qrCode}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-[8px]">
                          {copy.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black">{copy.studentName}</p>
                          <p className="text-muted-foreground text-[10px]">{copy.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        copy.scanned ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground border-border'
                      }`}>{copy.scanned ? '✓ Scanné' : 'Non scanné'}</span>
                    </td>
                    <td className="p-3">
                      {gradingCopyId === copy.id ? (
                        <div className="flex items-center gap-1">
                          <Input type="number" placeholder="0" className="w-16 h-7 rounded-lg text-xs text-center" value={gradeInput} onChange={e => setGradeInput(e.target.value)} />
                          <span className="text-muted-foreground font-bold">/{copy.maxScore}</span>
                          <Button size="sm" className="h-7 px-2 gradient-primary" onClick={() => { setGradingCopyId(null); setGradeInput(''); }}>
                            <CheckCircle size={12} />
                          </Button>
                        </div>
                      ) : (
                        <span className={`font-black ${copy.score !== null ? (copy.score >= 10 ? 'text-success' : 'text-destructive') : 'text-muted-foreground'}`}>
                          {copy.score !== null ? `${copy.score}/${copy.maxScore}` : '—'}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {copy.scanned && copy.score === null && gradingCopyId !== copy.id && (
                        <Button size="sm" variant="outline" className="h-7 font-black text-[10px] rounded-lg" onClick={() => setGradingCopyId(copy.id)}>
                          Noter
                        </Button>
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

    // Exams list
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion des Examens</h2>
            <p className="text-muted-foreground text-sm mt-1">Scan QR, correction et saisie des notes</p>
          </div>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Nouvel examen</Button>
        </div>

        <div className="space-y-3">
          {QR_EXAMS.map(exam => {
            const scanPct = (exam.scannedCopies / exam.totalCopies) * 100;
            const gradePct = (exam.gradedCopies / exam.totalCopies) * 100;
            return (
              <button key={exam.id} onClick={() => setSelectedExam(exam)}
                className="w-full glass-card p-5 rounded-xl hover:border-primary/40 transition-all text-left">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <QrCode size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-sm">{exam.subject}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{exam.class} · {exam.type} · {new Date(exam.date).toLocaleDateString('fr-FR')}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <ScanLine size={11} className="text-primary" />
                          <span className="text-[10px] font-black text-primary">{exam.scannedCopies}/{exam.totalCopies} scannées</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={11} className="text-success" />
                          <span className="text-[10px] font-black text-success">{exam.gradedCopies}/{exam.totalCopies} notées</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      gradePct >= 100 ? 'bg-success/10 text-success border-success/30' : scanPct > 0 ? 'bg-warning/10 text-warning border-warning/30' : 'bg-muted text-muted-foreground border-border'
                    }`}>{gradePct >= 100 ? 'Terminé' : scanPct > 0 ? 'En cours' : 'Non commencé'}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════ MANAGEMENT: SALARIES (PROFESSORS) ═══════════
  if (activeSection === 'uni_salaries') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Salaires des professeurs</h2>
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

        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Mois</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Brut</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Net</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Effectif</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
            </tr></thead>
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

  // ═══════════ MANAGEMENT: CERTIFICATIONS ═══════════
  if (activeSection === 'uni_certifications') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Certifications</h2>
            <p className="text-muted-foreground text-sm mt-1">Gérer les demandes de white tests et vouchers</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total demandes', value: CERT_REQUESTS.length, color: 'text-foreground' },
            { label: 'En attente', value: CERT_REQUESTS.filter(r => r.status === 'en_attente').length, color: 'text-warning' },
            { label: 'Approuvées', value: CERT_REQUESTS.filter(r => r.status === 'approuve' || r.status === 'envoye').length, color: 'text-success' },
            { label: 'Certifiés', value: CERT_REQUESTS.filter(r => r.passed).length, color: 'text-primary' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Requests table */}
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Certification</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Type</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Résultat</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {CERT_REQUESTS.map(req => (
                <tr key={req.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-black">{req.studentName}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck size={12} className="text-primary" />
                      <span className="font-bold">{req.certification}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      req.type === 'voucher' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary/10 text-secondary border-secondary/30'
                    }`}>{req.type === 'voucher' ? 'Voucher' : 'White Test'}</span>
                  </td>
                  <td className="p-3 text-muted-foreground font-bold">{new Date(req.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[req.status] || 'bg-muted text-muted-foreground border-border'}`}>
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {req.passed !== null ? (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${req.passed ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>
                        {req.passed ? '✓ Réussi' : '✗ Échoué'}
                      </span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3">
                    {req.status === 'en_attente' && (
                      <div className="flex gap-1">
                        <button className="w-6 h-6 rounded bg-success/20 flex items-center justify-center hover:bg-success/30" title="Approuver">
                          <CheckCircle size={12} className="text-success" />
                        </button>
                        <button className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center hover:bg-destructive/30" title="Rejeter">
                          <X size={12} className="text-destructive" />
                        </button>
                      </div>
                    )}
                    {req.status === 'approuve' && req.type === 'voucher' && (
                      <div className="flex items-center gap-1">
                        {certActionId === req.id ? (
                          <>
                            <Input placeholder="Code voucher" className="w-32 h-6 text-[10px] rounded" value={certVoucherInput} onChange={e => setCertVoucherInput(e.target.value)} />
                            <Button size="sm" className="h-6 px-2 gradient-primary text-[10px]" onClick={() => { setCertActionId(null); setCertVoucherInput(''); }}>
                              <Send size={10} />
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" className="h-6 font-black text-[10px] rounded" onClick={() => setCertActionId(req.id)}>
                            Envoyer voucher
                          </Button>
                        )}
                      </div>
                    )}
                    {req.voucherCode && (
                      <span className="font-mono text-[10px] text-primary font-black">{req.voucherCode}</span>
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
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Étudiant</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Demande</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Statut</th>
              <th className="text-left p-3 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr></thead>
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
