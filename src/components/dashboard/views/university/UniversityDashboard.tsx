import { useState } from 'react';
import { 
  Building2, Users, BookOpen, TrendingUp, GraduationCap, ChevronRight, Plus, Settings,
  Calendar, DollarSign, ClipboardList, UserCheck, FileText, Bell, MapPin, Clock,
  BarChart3, Eye, AlertTriangle, CheckCircle, Search, Mail, Shield, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XPBar } from '@/components/ui/xp-bar';
import { FIELDS, LEVELS, MOCK_STUDENTS } from '@/lib/constants';

type AdminTab = 'overview' | 'classes' | 'students' | 'professors' | 'salaries' | 'announcements' | 'documents' | 'reports';

// ── Mock Data ──
const DEPARTMENTS = [
  { id: '1', name: 'Computer Science', students: 450, professors: 12, courses: 28, avgCompletion: 78 },
  { id: '2', name: 'Mathematics', students: 280, professors: 8, courses: 18, avgCompletion: 82 },
  { id: '3', name: 'Engineering', students: 520, professors: 15, courses: 35, avgCompletion: 71 },
  { id: '4', name: 'Business', students: 380, professors: 10, courses: 22, avgCompletion: 85 },
];

const ALL_PROFESSORS = [
  { id: '1', name: 'Dr. Alan Turing', department: 'Computer Science', courses: 3, students: 245, salary: 5200, status: 'active' as const },
  { id: '2', name: 'Prof. Ada Lovelace', department: 'Computer Science', courses: 2, students: 189, salary: 4800, status: 'active' as const },
  { id: '3', name: 'Dr. Isaac Newton', department: 'Mathematics', courses: 4, students: 312, salary: 5500, status: 'active' as const },
  { id: '4', name: 'Prof. Marie Curie', department: 'Engineering', courses: 3, students: 278, salary: 5000, status: 'active' as const },
  { id: '5', name: 'Dr. Albert Einstein', department: 'Mathematics', courses: 2, students: 156, salary: 6000, status: 'on_leave' as const },
];

const SUBJECTS_DATA = [
  { id: 's1', name: 'Data Structures', code: 'CS201', department: 'Computer Science', semester: 'S3', professor: 'Dr. Turing', students: 156, level: 'L2' },
  { id: 's2', name: 'Machine Learning', code: 'AI301', department: 'Computer Science', semester: 'S3', professor: 'Prof. Lovelace', students: 89, level: 'L2' },
  { id: 's3', name: 'Linear Algebra', code: 'MATH201', department: 'Mathematics', semester: 'S3', professor: 'Dr. Newton', students: 280, level: 'L2' },
  { id: 's4', name: 'Thermodynamics', code: 'ENG301', department: 'Engineering', semester: 'S3', professor: 'Prof. Curie', students: 134, level: 'L2' },
  { id: 's5', name: 'Financial Accounting', code: 'BUS101', department: 'Business', semester: 'S1', professor: 'Dr. Keynes', students: 220, level: 'L1' },
];

const SCHEDULE_DATA = [
  { id: 'sc1', subject: 'Data Structures', professor: 'Dr. Turing', day: 'Monday', time: '08:00-10:00', room: 'A101', type: 'Lecture', group: 'L2-CS-A' },
  { id: 'sc2', subject: 'Machine Learning', professor: 'Prof. Lovelace', day: 'Monday', time: '14:00-16:00', room: 'Lab 3', type: 'TD', group: 'L2-CS-B' },
  { id: 'sc3', subject: 'Linear Algebra', professor: 'Dr. Newton', day: 'Tuesday', time: '08:00-10:00', room: 'Amphi B', type: 'Lecture', group: 'L2-All' },
  { id: 'sc4', subject: 'Thermodynamics', professor: 'Prof. Curie', day: 'Tuesday', time: '14:00-16:00', room: 'C302', type: 'TD', group: 'L2-ENG' },
  { id: 'sc5', subject: 'Data Structures', professor: 'Dr. Turing', day: 'Wednesday', time: '10:00-12:00', room: 'Lab 1', type: 'TD', group: 'L2-CS-A' },
];

const SALARY_SUMMARY = [
  { month: 'March 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'pending' as const },
  { month: 'February 2026', totalGross: 26500, totalNet: 23800, professors: 5, status: 'paid' as const },
  { month: 'January 2026', totalGross: 25000, totalNet: 22500, professors: 5, status: 'paid' as const },
];

const PENDING_DOCUMENTS = [
  { id: 'd1', student: 'Alice Chen', type: 'Attestation de présence', date: '2026-02-28', status: 'en_attente' as const },
  { id: 'd2', student: 'Bob Smith', type: 'Demande de recorrection', date: '2026-02-27', status: 'en_cours' as const },
  { id: 'd3', student: 'Carol Davis', type: "Attestation d'inscription", date: '2026-02-25', status: 'en_attente' as const },
  { id: 'd4', student: 'David Lee', type: 'Demande de recorrection', date: '2026-02-20', status: 'traite' as const },
];

const ANNOUNCEMENTS_DATA = [
  { id: 'an1', title: 'Exam schedule published', content: 'Final exams for S3 confirmed.', date: '2026-02-18', category: 'exam', author: 'Admin' },
  { id: 'an2', title: 'Registration period', content: 'S4 registration open until March 10.', date: '2026-02-15', category: 'admin', author: 'Admin' },
];

// ── Tabs ──
const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'classes', label: 'Classes', icon: Calendar },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'professors', label: 'Professors', icon: GraduationCap },
  { id: 'salaries', label: 'Salaries', icon: DollarSign },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'documents', label: 'Requests', icon: FileText },
  { id: 'reports', label: 'Reports', icon: TrendingUp },
];

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function UniversityDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const totalStudents = DEPARTMENTS.reduce((a, d) => a + d.students, 0);
  const totalProfessors = DEPARTMENTS.reduce((a, d) => a + d.professors, 0);
  const totalCourses = DEPARTMENTS.reduce((a, d) => a + d.courses, 0);
  const pendingDocs = PENDING_DOCUMENTS.filter(d => d.status === 'en_attente').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">CONTROL TOWER</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">University Administration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold text-xs h-9"><Settings size={14} className="mr-1" /> Settings</Button>
          <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Invite Staff</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs shrink-0 transition-all relative ${
                activeTab === tab.id
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {tab.id === 'documents' && pendingDocs > 0 && (
                <span className="w-4 h-4 bg-destructive rounded-full text-destructive-foreground text-[9px] font-black flex items-center justify-center">{pendingDocs}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════ OVERVIEW ═══════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-primary', change: '+156' },
              { label: 'Professors', value: totalProfessors, icon: GraduationCap, color: 'text-secondary', change: '+3' },
              { label: 'Courses', value: totalCourses, icon: BookOpen, color: 'text-success', change: '+8' },
              { label: 'Pending Requests', value: pendingDocs, icon: FileText, color: 'text-warning', change: '' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><stat.icon size={18} className={stat.color} /></div>
                  {stat.change && <span className="text-[10px] font-black text-success">{stat.change}</span>}
                </div>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Departments + Pending */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Building2 size={14} className="text-primary" /> Departments</h3>
              </div>
              {DEPARTMENTS.map(dept => (
                <div key={dept.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">{dept.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs">{dept.name}</p>
                    <p className="text-muted-foreground text-[10px]">{dept.students} students · {dept.professors} professors · {dept.courses} courses</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <XPBar progress={dept.avgCompletion} size="sm" className="w-16" />
                    <span className="font-black text-xs text-primary">{dept.avgCompletion}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><FileText size={14} className="text-warning" /> Pending Requests</h3>
                <button onClick={() => setActiveTab('documents')} className="text-xs font-black text-primary hover:underline flex items-center gap-1">All <ChevronRight size={12} /></button>
              </div>
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

          {/* Today's Schedule preview */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-primary" /> Today's Classes</h3>
              <button onClick={() => setActiveTab('classes')} className="text-xs font-black text-primary hover:underline flex items-center gap-1">Full schedule <ChevronRight size={12} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SCHEDULE_DATA.slice(0, 3).map(s => (
                <div key={s.id} className="glass-card p-3 rounded-xl">
                  <p className="font-black text-xs">{s.subject}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{s.type}</span>
                    <span className="text-muted-foreground text-[10px]">{s.time}</span>
                    <span className="text-muted-foreground text-[10px]">{s.room}</span>
                  </div>
                  <p className="text-muted-foreground text-[10px] mt-1">{s.professor} · {s.group}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ CLASSES (Schedule + Subjects) ═══════════ */}
      {activeTab === 'classes' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg italic">Class Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl font-bold text-xs h-9"><Calendar size={14} className="mr-1" /> Edit Schedule</Button>
              <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Add Subject</Button>
            </div>
          </div>

          {/* Subjects table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-3 bg-muted/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search subjects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-8 rounded-lg text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 p-3 bg-muted/30 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Code</span><span className="col-span-2">Subject</span><span>Department</span><span>Professor</span><span>Students</span><span>Level</span>
            </div>
            {SUBJECTS_DATA.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase())).map(sub => (
              <div key={sub.id} className="grid grid-cols-7 gap-2 p-3 border-t border-border items-center text-xs hover:bg-muted/20 transition-colors">
                <span className="font-black text-primary">{sub.code}</span>
                <span className="col-span-2 font-bold">{sub.name}</span>
                <span className="text-muted-foreground">{sub.department}</span>
                <span className="font-bold">{sub.professor}</span>
                <span className="font-black">{sub.students}</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded w-fit">{sub.level}</span>
              </div>
            ))}
          </div>

          {/* Weekly Schedule */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider">Weekly Schedule</h4>
            <div className="space-y-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const entries = SCHEDULE_DATA.filter(s => s.day === day);
                return (
                  <div key={day} className="flex gap-3 items-start">
                    <div className="w-20 shrink-0 pt-2"><p className="font-black text-xs">{day}</p></div>
                    <div className="flex-1 flex gap-2 flex-wrap">
                      {entries.length === 0 ? (
                        <p className="text-muted-foreground text-[10px] pt-2">No classes</p>
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
      )}

      {/* ═══════════ STUDENTS ═══════════ */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-black text-lg italic">Student Management</h3>
            <div className="flex gap-2">
              <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
                <option>All Levels</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
                <option>All Departments</option>
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="col-span-2">Student</span><span>Level</span><span>XP</span><span>Progress</span><span>Streak</span>
            </div>
            {MOCK_STUDENTS.map(student => (
              <div key={student.id} className="grid grid-cols-6 gap-2 p-3 border-t border-border items-center text-xs hover:bg-muted/20 transition-colors">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[10px]">{student.avatar}</div>
                  <div>
                    <p className="font-black text-xs">{student.name}</p>
                    <p className="text-muted-foreground text-[10px]">{student.email}</p>
                  </div>
                </div>
                <span className="font-bold">{student.level}</span>
                <span className="font-black text-primary">{student.xp.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <XPBar progress={student.progress} size="sm" className="flex-1" />
                  <span className="font-bold text-[10px]">{student.progress}%</span>
                </div>
                <span className="font-black text-warning">🔥 {student.streak}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ PROFESSORS ═══════════ */}
      {activeTab === 'professors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg italic">Professor Management</h3>
            <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> Add Professor</Button>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="col-span-2">Professor</span><span>Department</span><span>Courses</span><span>Salary</span><span>Status</span>
            </div>
            {ALL_PROFESSORS.map(prof => (
              <div key={prof.id} className="grid grid-cols-6 gap-2 p-3 border-t border-border items-center text-xs hover:bg-muted/20 transition-colors">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[10px]">{prof.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p className="font-black">{prof.name}</p>
                    <p className="text-muted-foreground text-[10px]">{prof.students} students</p>
                  </div>
                </div>
                <span className="text-muted-foreground">{prof.department}</span>
                <span className="font-black text-primary">{prof.courses}</span>
                <span className="font-bold">{prof.salary.toLocaleString()} DA</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border w-fit ${
                  prof.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                }`}>{prof.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ SALARIES ═══════════ */}
      {activeTab === 'salaries' && (
        <div className="space-y-5">
          <h3 className="font-black text-lg italic">Salary Management</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Monthly Payroll', value: '26,500 DA', color: 'text-foreground' },
              { label: 'Total Net', value: '23,800 DA', color: 'text-primary' },
              { label: 'Active Staff', value: ALL_PROFESSORS.filter(p => p.status === 'active').length, color: 'text-success' },
              { label: 'On Leave', value: ALL_PROFESSORS.filter(p => p.status === 'on_leave').length, color: 'text-warning' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 rounded-xl text-center">
                <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Month</span><span>Gross</span><span>Net</span><span>Staff</span><span>Status</span>
            </div>
            {SALARY_SUMMARY.map((s, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 p-3 border-t border-border items-center text-xs">
                <span className="font-bold">{s.month}</span>
                <span className="font-bold">{s.totalGross.toLocaleString()} DA</span>
                <span className="font-black text-primary">{s.totalNet.toLocaleString()} DA</span>
                <span className="font-bold">{s.professors}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border w-fit ${
                  s.status === 'paid' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                }`}>{s.status}</span>
              </div>
            ))}
          </div>

          {/* Per professor */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider">Per Professor — This Month</h4>
            {ALL_PROFESSORS.map(prof => (
              <div key={prof.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-[10px]">{prof.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs">{prof.name}</p>
                  <p className="text-muted-foreground text-[10px]">{prof.department}</p>
                </div>
                <span className="font-black text-primary text-sm">{prof.salary.toLocaleString()} DA</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                  prof.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                }`}>{prof.status === 'active' ? 'Paid' : 'On leave'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ ANNOUNCEMENTS ═══════════ */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg italic">Announcements</h3>
            <Button className="gradient-primary font-black rounded-xl text-xs h-9"><Plus size={14} className="mr-1" /> New Announcement</Button>
          </div>
          <div className="glass-card p-5 rounded-2xl space-y-3 border-dashed border-2 border-primary/20">
            <p className="font-black text-sm text-primary">Quick Post</p>
            <Input placeholder="Announcement title..." className="rounded-lg text-sm h-9" />
            <textarea placeholder="Write your announcement..." className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-none" />
            <div className="flex items-center justify-between">
              <select className="h-8 px-3 rounded-lg border border-input bg-background font-bold text-xs">
                <option>All Students</option>
                <option>L1 Only</option>
                <option>L2 Only</option>
                <option>L3 Only</option>
              </select>
              <Button className="gradient-primary font-black rounded-lg text-xs h-8"><Send size={12} className="mr-1" /> Post</Button>
            </div>
          </div>
          {ANNOUNCEMENTS_DATA.map(ann => (
            <div key={ann.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <p className="font-black text-sm">{ann.title}</p>
                <span className="text-muted-foreground text-[10px] font-bold">{new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-muted-foreground text-xs">{ann.content}</p>
              <p className="text-muted-foreground text-[10px] mt-1">Posted by {ann.author}</p>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════ DOCUMENT REQUESTS ═══════════ */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <h3 className="font-black text-lg italic">Student Requests</h3>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Student</span><span className="col-span-2">Request</span><span>Date</span><span>Status</span>
            </div>
            {PENDING_DOCUMENTS.map(doc => (
              <div key={doc.id} className="grid grid-cols-5 gap-2 p-3 border-t border-border items-center text-xs hover:bg-muted/20 transition-colors">
                <span className="font-black">{doc.student}</span>
                <span className="col-span-2 font-bold">{doc.type}</span>
                <span className="text-muted-foreground">{new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status]}`}>{doc.status.replace('_', ' ')}</span>
                  {doc.status === 'en_attente' && (
                    <div className="flex gap-1">
                      <button className="w-5 h-5 rounded bg-success/20 flex items-center justify-center"><CheckCircle size={10} className="text-success" /></button>
                      <button className="w-5 h-5 rounded bg-destructive/20 flex items-center justify-center"><AlertTriangle size={10} className="text-destructive" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ REPORTS ═══════════ */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          <h3 className="font-black text-lg italic">Analytics & Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Student Performance', desc: 'Average scores by department and level', icon: TrendingUp, value: '78%', label: 'Avg Score' },
              { title: 'Attendance Rate', desc: 'Overall attendance across all departments', icon: UserCheck, value: '92%', label: 'Present' },
              { title: 'Course Completion', desc: 'Students completing their curriculum', icon: CheckCircle, value: '85%', label: 'Completed' },
              { title: 'Dropout Rate', desc: 'Students who withdrew this semester', icon: AlertTriangle, value: '3.2%', label: 'Dropped' },
              { title: 'Internship Placement', desc: 'Students placed in internships', icon: BookOpen, value: '67%', label: 'Placed' },
              { title: 'Satisfaction Score', desc: 'From student feedback surveys', icon: BarChart3, value: '4.2/5', label: 'Rating' },
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
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider">Department Performance</h4>
            {DEPARTMENTS.map(dept => (
              <div key={dept.id} className="flex items-center gap-3">
                <span className="font-bold text-xs w-32 shrink-0">{dept.name}</span>
                <XPBar progress={dept.avgCompletion} size="sm" className="flex-1" />
                <span className="font-black text-xs text-primary w-10 text-right">{dept.avgCompletion}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
