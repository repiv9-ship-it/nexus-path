import { useState } from 'react';
import { Bell, BarChart3, Calendar, BookOpen, UserX, ChevronRight, AlertTriangle, CheckCircle, Clock, TrendingUp, Megaphone, Zap, MapPin, User } from 'lucide-react';
import type { ViewType } from '../../Sidebar';

interface UniHomeViewProps {
  onNavigate: (view: ViewType) => void;
}

// ── Mock data ──────────────────────────────────────────────

const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Exam schedule published', message: 'Final exams for Semester 3 have been confirmed. Please check the schedule section for dates and rooms.', date: '2026-02-18', category: 'exam', isNew: true },
  { id: 'a2', title: 'Registration period open', message: 'Academic re-registration for S4 is open until March 10. Visit the Academic Center to submit your documents.', date: '2026-02-15', category: 'admin', isNew: true },
  { id: 'a3', title: 'Library extended hours', message: 'The university library will be open until 22:00 during exam period (Feb 20 – Mar 25).', date: '2026-02-12', category: 'general', isNew: false },
  { id: 'a4', title: 'Internship fair – March 5', message: 'Annual internship & career fair will be held in the main hall. 40+ companies attending.', date: '2026-02-10', category: 'career', isNew: false },
];

const RECENT_MARKS = [
  { id: 'm1', subject: 'Neural Networks', code: 'AI301', type: 'Final Exam', score: 15, max: 20, date: '2026-02-10', status: 'passed' as const },
  { id: 'm2', subject: 'Digital Ethics', code: 'ETH301', type: 'Midterm', score: 15, max: 20, date: '2026-02-08', status: 'passed' as const },
  { id: 'm3', subject: 'Operating Systems', code: 'CS302', type: 'TD', score: 11, max: 20, date: '2026-02-05', status: 'passed' as const },
  { id: 'm4', subject: 'Advanced Algorithms', code: 'CS301', type: 'TD', score: 16, max: 20, date: '2026-01-28', status: 'passed' as const },
  { id: 'm5', subject: 'Software Engineering', code: 'CS303', type: 'Project', score: 18, max: 20, date: '2026-01-20', status: 'passed' as const },
  { id: 'm6', subject: 'Mathematics 2', code: 'MATH201', type: 'Exam', score: 12.5, max: 20, date: '2026-01-10', status: 'passed' as const },
];

const TODAY_SCHEDULE = [
  { id: 's1', subject: 'Advanced Algorithms', type: 'Lecture', startTime: '08:00', endTime: '10:00', room: 'A101', professor: 'Dr. Turing' },
  { id: 's2', subject: 'Neural Networks', type: 'TD', startTime: '14:00', endTime: '16:00', room: 'Lab 2', professor: 'Prof. Lovelace' },
];

const UPCOMING_EXAMS = [
  { id: 'e1', subject: 'Advanced Algorithms', date: '2026-02-25', startTime: '09:00', room: 'A101', daysLeft: 5 },
  { id: 'e2', subject: 'Neural Networks', date: '2026-03-03', startTime: '14:00', room: 'B205', daysLeft: 11 },
];

const NEW_COURSES = [
  { id: 'c1', name: 'Machine Learning', code: 'AI401', professor: 'Prof. Hinton', credits: 4, semester: 'S4' },
  { id: 'c2', name: 'Computer Networks', code: 'NET401', professor: 'Dr. Cerf', credits: 3, semester: 'S4' },
  { id: 'c3', name: 'Database Systems', code: 'DB401', professor: 'Prof. Codd', credits: 3, semester: 'S4' },
];

const ABSENCES = [
  { id: 'ab1', subject: 'Advanced Algorithms', date: '2026-02-04', type: 'Lecture', justified: false },
  { id: 'ab2', subject: 'Operating Systems', date: '2026-01-21', type: 'TD', justified: true },
  { id: 'ab3', subject: 'Advanced Algorithms', date: '2025-12-10', type: 'Lecture', justified: false },
];
const ABSENCE_LIMIT = 3;

const ANNOUNCEMENT_COLORS: Record<string, string> = {
  exam: 'border-l-destructive bg-destructive/5',
  admin: 'border-l-primary bg-primary/5',
  career: 'border-l-success bg-success/5',
  general: 'border-l-muted-foreground',
};

const ANNOUNCEMENT_ICONS: Record<string, typeof Bell> = {
  exam: AlertTriangle,
  admin: Bell,
  career: TrendingUp,
  general: Megaphone,
};

// ── Sub-components ─────────────────────────────────────────

function SectionHeader({ title, icon: Icon, action, onAction }: { title: string; icon: typeof Bell; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
        <Icon size={15} className="text-primary" />
        {title}
      </h3>
      {action && onAction && (
        <button onClick={onAction} className="flex items-center gap-1 text-xs font-black text-primary hover:underline">
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 50 ? 'bg-success' : 'bg-destructive';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[11px] font-black ${pct >= 50 ? 'text-success' : 'text-destructive'}`}>{score}/{max}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

export function UniHomeView({ onNavigate }: UniHomeViewProps) {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  const unjustifiedAbsences = ABSENCES.filter(a => !a.justified).length;
  const absenceWarning = unjustifiedAbsences >= ABSENCE_LIMIT;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">UNIVERSITY HOME</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Semester 3 · Year 2 · L2
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="glass-card px-3 py-2 rounded-xl flex items-center gap-2">
            <Zap size={13} className="text-success animate-pulse" />
            <span className="font-black text-xs">Semester in progress</span>
          </div>
          {absenceWarning && (
            <div className="px-3 py-2 rounded-xl flex items-center gap-2 bg-destructive/10 border border-destructive/30">
              <AlertTriangle size={13} className="text-destructive" />
              <span className="font-black text-xs text-destructive">Absence warning</span>
            </div>
          )}
        </div>
      </div>

      {/* Top row: Announcements + Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Announcements */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Announcements" icon={Megaphone} />
          <div className="space-y-2">
            {ANNOUNCEMENTS.map(ann => {
              const Icon = ANNOUNCEMENT_ICONS[ann.category] || Bell;
              const isExpanded = expandedAnnouncement === ann.id;
              return (
                <button
                  key={ann.id}
                  onClick={() => setExpandedAnnouncement(isExpanded ? null : ann.id)}
                  className={`w-full text-left glass-card p-3 rounded-xl border-l-4 transition-all ${ANNOUNCEMENT_COLORS[ann.category] || 'border-l-border'}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-xs">{ann.title}</p>
                        {ann.isNew && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded shrink-0">NEW</span>}
                      </div>
                      {isExpanded && (
                        <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">{ann.message}</p>
                      )}
                      <p className="text-muted-foreground text-[10px] font-bold mt-1">
                        {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Today's Schedule" icon={Calendar} action="Full schedule" onAction={() => onNavigate('schedule')} />
          {TODAY_SCHEDULE.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar size={28} className="mx-auto mb-2 opacity-30" />
              <p className="font-bold text-sm">No classes today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {TODAY_SCHEDULE.map(entry => (
                <div key={entry.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0">
                    <p className="font-black text-xs">{entry.startTime}</p>
                    <div className="w-px h-4 bg-border mx-auto my-0.5" />
                    <p className="text-muted-foreground text-[10px] font-bold">{entry.endTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{entry.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{entry.type}</span>
                      <span className="flex items-center gap-1 text-muted-foreground text-[10px]"><MapPin size={9} />{entry.room}</span>
                      <span className="flex items-center gap-1 text-muted-foreground text-[10px]"><User size={9} />{entry.professor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming exams */}
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Upcoming Exams</p>
            <div className="space-y-2">
              {UPCOMING_EXAMS.map(exam => (
                <div key={exam.id} className="flex items-center justify-between glass-card px-3 py-2 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-black text-xs truncate">{exam.subject}</p>
                    <p className="text-muted-foreground text-[10px]">{exam.startTime} · {exam.room}</p>
                  </div>
                  <div className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-black border ${
                    exam.daysLeft <= 7
                      ? 'bg-destructive/10 text-destructive border-destructive/30'
                      : 'bg-warning/10 text-warning border-warning/30'
                  }`}>
                    {exam.daysLeft}d
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Recent Marks + Absences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Marks */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Recent Marks" icon={BarChart3} action="View all" onAction={() => onNavigate('uni_marks')} />
          <div className="space-y-2">
            {RECENT_MARKS.map(mark => (
              <div key={mark.id} className="glass-card p-3 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{mark.subject}</p>
                    <p className="text-muted-foreground text-[10px] font-bold">{mark.type} · {new Date(mark.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {mark.score >= mark.max * 0.5
                      ? <CheckCircle size={14} className="text-success ml-auto" />
                      : <AlertTriangle size={14} className="text-destructive ml-auto" />
                    }
                  </div>
                </div>
                <ScoreBar score={mark.score} max={mark.max} />
              </div>
            ))}
          </div>
        </div>

        {/* Absences */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Absences" icon={UserX} action="Full view" onAction={() => onNavigate('academic_center')} />

          {/* Absence counter */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            absenceWarning
              ? 'bg-destructive/10 border-destructive/30'
              : 'glass-card border-border'
          }`}>
            <div className={`text-3xl font-black ${absenceWarning ? 'text-destructive' : 'text-foreground'}`}>
              {unjustifiedAbsences}
            </div>
            <div className="flex-1">
              <p className="font-black text-sm">Unjustified absences</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${absenceWarning ? 'bg-destructive' : 'bg-warning'}`}
                    style={{ width: `${Math.min((unjustifiedAbsences / ABSENCE_LIMIT) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-muted-foreground">{ABSENCE_LIMIT} max</span>
              </div>
              {absenceWarning && (
                <p className="text-destructive text-[10px] font-black mt-1 flex items-center gap-1">
                  <AlertTriangle size={9} /> Threshold reached — justify or contact admin
                </p>
              )}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            {ABSENCES.map(ab => (
              <div key={ab.id} className="glass-card px-3 py-2.5 rounded-xl flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ab.justified ? 'bg-success' : 'bg-destructive'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs truncate">{ab.subject}</p>
                  <p className="text-muted-foreground text-[10px]">{ab.type} · {new Date(ab.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                  ab.justified
                    ? 'bg-success/10 text-success border-success/30'
                    : 'bg-destructive/10 text-destructive border-destructive/30'
                }`}>
                  {ab.justified ? 'Justified' : 'Unjustified'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New courses */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
        <SectionHeader title="Upcoming Courses (S4)" icon={BookOpen} action="View curriculum" onAction={() => onNavigate('uni_courses')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NEW_COURSES.map(course => (
            <div key={course.id} className="glass-card p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs truncate">{course.name}</p>
                <p className="text-muted-foreground text-[10px] font-bold">{course.code} · {course.professor}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded">{course.semester}</span>
                  <span className="text-muted-foreground text-[10px]">{course.credits} credits</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
