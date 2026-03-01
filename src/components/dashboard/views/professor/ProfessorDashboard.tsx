import { useState } from 'react';
import { 
  Plus, Users, BookOpen, TrendingUp, Award, ChevronRight, BarChart3, 
  Calendar, Clock, CheckSquare, DollarSign, MessageSquare, Upload, 
  FileText, Bell, MapPin, User, AlertTriangle, Eye, Send, Briefcase,
  ClipboardList, GraduationCap, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XPBar } from '@/components/ui/xp-bar';
import { MOCK_PROFESSOR_COURSES, MOCK_STUDENTS } from '@/lib/constants';

type ProfTab = 'overview' | 'sessions' | 'attendance' | 'courses' | 'schedule' | 'payments' | 'messages';

// ── Mock Data ──
const UPCOMING_SESSIONS = [
  { id: 's1', subject: 'Data Structures', type: 'Lecture', date: '2026-03-02', startTime: '08:00', endTime: '10:00', room: 'A101', group: 'L2-CS-A' },
  { id: 's2', subject: 'Machine Learning', type: 'TD', date: '2026-03-02', startTime: '14:00', endTime: '16:00', room: 'Lab 3', group: 'L2-CS-B' },
  { id: 's3', subject: 'Data Structures', type: 'TD', date: '2026-03-03', startTime: '10:00', endTime: '12:00', room: 'Lab 1', group: 'L2-CS-A' },
  { id: 's4', subject: 'Web Development', type: 'Lecture', date: '2026-03-04', startTime: '08:00', endTime: '10:00', room: 'B205', group: 'L1-CS' },
];

const ATTENDANCE_SESSIONS = [
  { id: 'as1', subject: 'Data Structures', date: '2026-03-01', type: 'Lecture', group: 'L2-CS-A', students: [
    { id: '1', name: 'Alice Chen', status: 'present' as const },
    { id: '2', name: 'Bob Smith', status: 'absent' as const },
    { id: '3', name: 'Carol Davis', status: 'present' as const },
    { id: '4', name: 'David Lee', status: 'late' as const },
    { id: '5', name: 'Emma Wilson', status: 'present' as const },
  ]},
];

const SALARY_HISTORY = [
  { id: 'p1', month: 'February 2026', base: 4500, bonus: 500, deductions: 350, net: 4650, status: 'paid' as const, date: '2026-02-28' },
  { id: 'p2', month: 'January 2026', base: 4500, bonus: 300, deductions: 350, net: 4450, status: 'paid' as const, date: '2026-01-31' },
  { id: 'p3', month: 'December 2025', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'paid' as const, date: '2025-12-31' },
  { id: 'p4', month: 'March 2026', base: 4500, bonus: 0, deductions: 350, net: 4150, status: 'pending' as const, date: '2026-03-31' },
];

const EXAM_SCHEDULE = [
  { id: 'ex1', subject: 'Data Structures', type: 'Final Exam', date: '2026-02-25', startTime: '09:00', room: 'Amphi A', duration: '2h' },
  { id: 'ex2', subject: 'Machine Learning', type: 'Midterm', date: '2026-03-10', startTime: '14:00', room: 'B205', duration: '1h30' },
  { id: 'ex3', subject: 'Data Structures', type: 'Retake', date: '2026-04-15', startTime: '09:00', room: 'Amphi B', duration: '2h' },
];

const MEETINGS = [
  { id: 'mt1', title: 'Department Meeting', date: '2026-03-05', time: '10:00', location: 'Conference Room', organizer: 'Dean Office' },
  { id: 'mt2', title: 'Thesis Defense - Alice Chen', date: '2026-03-12', time: '14:00', location: 'Room 302', organizer: 'CS Department' },
];

const STUDENT_MESSAGES = [
  { id: 'msg1', student: 'Alice Chen', subject: 'Question about Assignment 3', message: 'Professor, I have a question about the graph traversal exercise. Can I visit during office hours?', date: '2026-02-28', read: false },
  { id: 'msg2', student: 'David Lee', subject: 'Absence justification', message: 'I was unable to attend the TD session on Feb 27 due to medical reasons. I have attached my certificate.', date: '2026-02-27', read: false },
  { id: 'msg3', student: 'Carol Davis', subject: 'Internship recommendation', message: 'Would you be willing to write a recommendation letter for my summer internship application?', date: '2026-02-25', read: true },
  { id: 'msg4', student: 'Bob Smith', subject: 'Grade inquiry', message: 'Could you please review my midterm exam? I believe there may be an error in question 4 grading.', date: '2026-02-20', read: true },
];

const MY_COURSES_MATERIALS = [
  { id: 'mc1', subject: 'Data Structures', chapters: [
    { id: 'ch1', title: 'Chapter 1 - Arrays & Lists', type: 'lecture', date: '2025-09-10', downloads: 156 },
    { id: 'ch2', title: 'Chapter 2 - Trees', type: 'lecture', date: '2025-09-20', downloads: 142 },
    { id: 'ch3', title: 'Chapter 3 - Graphs', type: 'lecture', date: '2025-10-05', downloads: 128 },
    { id: 'td1', title: 'TD 1 - Array exercises', type: 'td', date: '2025-09-15', downloads: 148 },
    { id: 'td2', title: 'TD 2 - Tree problems', type: 'td', date: '2025-09-25', downloads: 135 },
  ]},
  { id: 'mc2', subject: 'Machine Learning', chapters: [
    { id: 'ch1', title: 'Chapter 1 - Linear Regression', type: 'lecture', date: '2025-09-12', downloads: 89 },
    { id: 'ch2', title: 'Chapter 2 - Classification', type: 'lecture', date: '2025-09-22', downloads: 85 },
  ]},
];

// ── Tab config ──
const TABS: { id: ProfTab; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

export function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState<ProfTab>('overview');
  const [attendanceSession, setAttendanceSession] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const totalStudents = MOCK_PROFESSOR_COURSES.reduce((acc, c) => acc + c.students, 0);
  const avgCompletion = Math.round(MOCK_PROFESSOR_COURSES.reduce((acc, c) => acc + c.completion, 0) / MOCK_PROFESSOR_COURSES.length);
  const unreadMessages = STUDENT_MESSAGES.filter(m => !m.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">COMMAND CENTER</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Professor Dashboard</p>
        </div>
        {unreadMessages > 0 && (
          <button onClick={() => setActiveTab('messages')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all">
            <MessageSquare size={14} className="text-primary" />
            <span className="font-black text-xs text-primary">{unreadMessages} new message{unreadMessages > 1 ? 's' : ''}</span>
          </button>
        )}
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
              {tab.id === 'messages' && unreadMessages > 0 && (
                <span className="w-2 h-2 bg-destructive rounded-full absolute top-1 right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════ OVERVIEW ═══════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-primary' },
              { label: 'Active Courses', value: MOCK_PROFESSOR_COURSES.filter(c => c.status === 'active').length, icon: BookOpen, color: 'text-success' },
              { label: 'Avg. Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: 'text-warning' },
              { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'text-secondary' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 sm:p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl flex items-center justify-center">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <p className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Sessions + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Clock size={14} className="text-primary" /> Next Sessions</h3>
                <button onClick={() => setActiveTab('sessions')} className="text-xs font-black text-primary hover:underline flex items-center gap-1">All <ChevronRight size={12} /></button>
              </div>
              {UPCOMING_SESSIONS.slice(0, 3).map(s => (
                <div key={s.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0 min-w-[40px]">
                    <p className="font-black text-xs">{s.startTime}</p>
                    <p className="text-muted-foreground text-[10px]">{s.endTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{s.subject}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{s.type}</span>
                      <span className="text-muted-foreground text-[10px] flex items-center gap-0.5"><MapPin size={9} />{s.room}</span>
                      <span className="text-muted-foreground text-[10px]">{s.group}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 text-[10px] font-black rounded-lg h-7 px-2" onClick={() => { setAttendanceSession(s.id); setActiveTab('attendance'); }}>
                    <CheckSquare size={12} className="mr-1" /> Attendance
                  </Button>
                </div>
              ))}
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Bell size={14} className="text-primary" /> Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Upload Course', icon: Upload, action: () => setActiveTab('courses') },
                  { label: 'Take Attendance', icon: CheckSquare, action: () => setActiveTab('attendance') },
                  { label: 'View Schedule', icon: Calendar, action: () => setActiveTab('schedule') },
                  { label: 'Read Messages', icon: MessageSquare, action: () => setActiveTab('messages') },
                ].map((qa, i) => (
                  <button key={i} onClick={qa.action} className="glass-card p-3 rounded-xl flex flex-col items-center gap-2 hover:border-primary/30 transition-all group">
                    <qa.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-black text-[10px] text-muted-foreground group-hover:text-foreground">{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Courses overview */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><BookOpen size={14} className="text-primary" /> My Courses</h3>
              <button onClick={() => setActiveTab('courses')} className="text-xs font-black text-primary hover:underline flex items-center gap-1">Manage <ChevronRight size={12} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_PROFESSOR_COURSES.map(course => (
                <div key={course.id} className="glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${course.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{course.status}</span>
                    <span className="font-black text-xs text-primary">{course.students} students</span>
                  </div>
                  <h4 className="font-black text-sm mb-2">{course.title}</h4>
                  <XPBar progress={course.completion} size="sm" />
                  <p className="text-muted-foreground text-[10px] font-bold mt-1">{course.completion}% completion</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SESSIONS ═══════════ */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <h3 className="font-black text-lg italic">Upcoming Sessions</h3>
          <div className="space-y-2">
            {UPCOMING_SESSIONS.map(s => (
              <div key={s.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
                <div className="text-center shrink-0 min-w-[60px] glass-card p-2 rounded-lg">
                  <p className="font-black text-xs">{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="font-black text-lg text-primary">{new Date(s.date).getDate()}</p>
                  <p className="text-muted-foreground text-[10px]">{new Date(s.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">{s.subject}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded">{s.type}</span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={11} />{s.startTime} – {s.endTime}</span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={11} />{s.room}</span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1"><Users size={11} />{s.group}</span>
                  </div>
                </div>
                <Button size="sm" className="gradient-primary font-black rounded-lg text-xs" onClick={() => { setAttendanceSession(s.id); setActiveTab('attendance'); }}>
                  <CheckSquare size={14} className="mr-1" /> Start
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ ATTENDANCE ═══════════ */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg italic">Attendance Management</h3>
          </div>
          
          {ATTENDANCE_SESSIONS.map(session => (
            <div key={session.id} className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-black text-sm">{session.subject} — {session.type}</p>
                  <p className="text-muted-foreground text-xs font-bold">{session.group} · {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
                <Button size="sm" className="gradient-primary font-black text-xs rounded-lg">
                  <Send size={12} className="mr-1" /> Submit
                </Button>
              </div>
              <div className="space-y-1">
                {session.students.map(student => {
                  const status = attendanceData[student.id] || student.status;
                  return (
                    <div key={student.id} className="flex items-center gap-3 glass-card p-3 rounded-xl">
                      <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-sm flex-1">{student.name}</span>
                      <div className="flex gap-1">
                        {(['present', 'absent', 'late'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => setAttendanceData(prev => ({ ...prev, [student.id]: s }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border transition-all ${
                              status === s
                                ? s === 'present' ? 'bg-success/20 text-success border-success/30'
                                : s === 'absent' ? 'bg-destructive/20 text-destructive border-destructive/30'
                                : 'bg-warning/20 text-warning border-warning/30'
                                : 'glass-card text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════ MY COURSES (Upload) ═══════════ */}
      {activeTab === 'courses' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg italic">Course Materials</h3>
            <Button className="gradient-primary font-black rounded-xl text-xs">
              <Upload size={14} className="mr-1" /> Upload New
            </Button>
          </div>
          {MY_COURSES_MATERIALS.map(course => (
            <div key={course.id} className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
              <h4 className="font-black text-sm flex items-center gap-2">
                <BookOpen size={14} className="text-primary" /> {course.subject}
              </h4>
              <div className="space-y-1.5">
                {course.chapters.map(ch => (
                  <div key={ch.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                    <FileText size={16} className="text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{ch.title}</p>
                      <p className="text-muted-foreground text-[10px]">{ch.type.toUpperCase()} · {new Date(ch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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
      )}

      {/* ═══════════ SCHEDULE ═══════════ */}
      {activeTab === 'schedule' && (
        <div className="space-y-5">
          <h3 className="font-black text-lg italic">Exam & Meeting Schedule</h3>
          
          {/* Exams */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><GraduationCap size={14} className="text-primary" /> Exam Schedule</h4>
            <div className="space-y-2">
              {EXAM_SCHEDULE.map(exam => (
                <div key={exam.id} className="glass-card p-3 rounded-xl flex items-center gap-4">
                  <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                    <p className="font-black text-lg text-primary">{new Date(exam.date).getDate()}</p>
                    <p className="text-muted-foreground text-[10px] font-bold">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm">{exam.subject}</p>
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
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Briefcase size={14} className="text-primary" /> Meetings</h4>
            <div className="space-y-2">
              {MEETINGS.map(mt => (
                <div key={mt.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0 min-w-[50px] glass-card p-2 rounded-lg">
                    <p className="font-black text-lg text-primary">{new Date(mt.date).getDate()}</p>
                    <p className="text-muted-foreground text-[10px] font-bold">{new Date(mt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm">{mt.title}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-muted-foreground text-[10px]">{mt.time} · {mt.location}</span>
                      <span className="text-muted-foreground text-[10px]">by {mt.organizer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ PAYMENTS ═══════════ */}
      {activeTab === 'payments' && (
        <div className="space-y-5">
          <h3 className="font-black text-lg italic">Salary & Payments</h3>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Monthly Base', value: '4,500 DA', color: 'text-foreground' },
              { label: 'This Month Bonus', value: '+500 DA', color: 'text-success' },
              { label: 'Deductions', value: '-350 DA', color: 'text-destructive' },
              { label: 'Net This Month', value: '4,650 DA', color: 'text-primary' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 rounded-xl text-center">
                <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase">{item.label}</p>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Month</span>
              <span>Base</span>
              <span>Bonus</span>
              <span>Net</span>
              <span>Status</span>
            </div>
            {SALARY_HISTORY.map(entry => (
              <div key={entry.id} className="grid grid-cols-5 gap-2 p-3 border-t border-border items-center text-sm">
                <span className="font-bold text-xs">{entry.month}</span>
                <span className="font-bold text-xs">{entry.base.toLocaleString()} DA</span>
                <span className="font-bold text-xs text-success">+{entry.bonus} DA</span>
                <span className="font-black text-xs text-primary">{entry.net.toLocaleString()} DA</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit border ${
                  entry.status === 'paid' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'
                }`}>{entry.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ MESSAGES ═══════════ */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h3 className="font-black text-lg italic">Student Messages</h3>
          <div className="space-y-2">
            {STUDENT_MESSAGES.map(msg => (
              <div key={msg.id} className={`glass-card p-4 rounded-xl space-y-2 ${!msg.read ? 'border-l-4 border-l-primary' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xs">
                      {msg.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-black text-xs">{msg.student}</p>
                      <p className="text-muted-foreground text-[10px]">{new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  {!msg.read && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded shrink-0">NEW</span>}
                </div>
                <p className="font-black text-sm">{msg.subject}</p>
                <p className="text-muted-foreground text-xs">{msg.message}</p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="text-[10px] font-black rounded-lg h-7" onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}>
                    <Send size={10} className="mr-1" /> Reply
                  </Button>
                </div>
                {replyingTo === msg.id && (
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="Type your reply..." className="text-xs h-8 rounded-lg" />
                    <Button size="sm" className="gradient-primary font-black text-[10px] rounded-lg h-8 px-3">Send</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
