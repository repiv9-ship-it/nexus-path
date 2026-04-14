import { useState } from 'react';
import { Bell, BarChart3, Calendar, BookOpen, UserX, ChevronRight, AlertTriangle, CheckCircle, Clock, TrendingUp, Megaphone, Zap, MapPin, User } from 'lucide-react';
import { useNotifications, useMarks, useScheduleEntries, useExamSchedule, useAttendance, useSubjects, useSemesters } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import type { ViewType } from '@/lib/navigation';

interface UniHomeViewProps {
  onNavigate: (view: ViewType) => void;
}

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

export function UniHomeView({ onNavigate }: UniHomeViewProps) {
  const { user } = useAuth();
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  const { data: notifications } = useNotifications();
  const { data: marks } = useMarks();
  const { data: attendance } = useAttendance();
  const { data: semesters } = useSemesters();
  const { data: subjects } = useSubjects();

  // Find current semester
  const currentSemester = semesters?.find((s: any) => s.is_current);
  const { data: scheduleEntries } = useScheduleEntries(currentSemester?.id);
  const { data: examSchedule } = useExamSchedule(currentSemester?.id);

  // Get today's schedule (day_of_week: 0=Sunday, 1=Monday... or 0=Monday depending on DB)
  const todayDow = new Date().getDay(); // 0=Sun
  const todayEntries = (scheduleEntries || []).filter((e: any) => e.day_of_week === todayDow);

  // Upcoming exams
  const now = new Date();
  const upcomingExams = (examSchedule || [])
    .filter((e: any) => new Date(e.exam_date) >= now)
    .slice(0, 3)
    .map((e: any) => {
      const daysLeft = Math.ceil((new Date(e.exam_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { ...e, daysLeft };
    });

  // Recent marks (last 6)
  const recentMarks = (marks || []).slice(0, 6);

  // Absences
  const absences = (attendance || []).filter((a: any) => a.status === 'absent');
  const unjustifiedAbsences = absences.filter((a: any) => !a.is_justified);
  const ABSENCE_LIMIT = 3;
  const absenceWarning = unjustifiedAbsences.length >= ABSENCE_LIMIT;

  // Announcements from notifications
  const announcements = (notifications || []).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">UNIVERSITY HOME</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            {currentSemester ? currentSemester.name : 'No active semester'}
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
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                <p className="font-bold text-sm">No announcements yet</p>
              </div>
            ) : (
              announcements.map((ann: any) => {
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
                          {!ann.is_read && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded shrink-0">NEW</span>}
                        </div>
                        {isExpanded && (
                          <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">{ann.message}</p>
                        )}
                        <p className="text-muted-foreground text-[10px] font-bold mt-1">
                          {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Today's Schedule" icon={Calendar} action="Full schedule" onAction={() => onNavigate('schedule')} />
          {todayEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar size={28} className="mx-auto mb-2 opacity-30" />
              <p className="font-bold text-sm">No classes today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEntries.map((entry: any) => (
                <div key={entry.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0">
                    <p className="font-black text-xs">{entry.start_time?.slice(0, 5)}</p>
                    <div className="w-px h-4 bg-border mx-auto my-0.5" />
                    <p className="text-muted-foreground text-[10px] font-bold">{entry.end_time?.slice(0, 5)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{entry.subjects?.name || 'Subject'}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded">{entry.entry_type}</span>
                      {entry.room && <span className="flex items-center gap-1 text-muted-foreground text-[10px]"><MapPin size={9} />{entry.room}</span>}
                      {entry.professor_name && <span className="flex items-center gap-1 text-muted-foreground text-[10px]"><User size={9} />{entry.professor_name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming exams */}
          {upcomingExams.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Upcoming Exams</p>
              <div className="space-y-2">
                {upcomingExams.map((exam: any) => (
                  <div key={exam.id} className="flex items-center justify-between glass-card px-3 py-2 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-black text-xs truncate">{exam.subjects?.name || 'Exam'}</p>
                      <p className="text-muted-foreground text-[10px]">{exam.room || 'TBD'}</p>
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
          )}
        </div>
      </div>

      {/* Second row: Recent Marks + Absences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Marks */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Recent Marks" icon={BarChart3} action="View all" onAction={() => onNavigate('uni_marks')} />
          <div className="space-y-2">
            {recentMarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 size={28} className="mx-auto mb-2 opacity-30" />
                <p className="font-bold text-sm">No marks recorded yet</p>
              </div>
            ) : (
              recentMarks.map((mark: any) => (
                <div key={mark.id} className="glass-card p-3 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs truncate">{mark.subjects?.name || 'Subject'}</p>
                      <p className="text-muted-foreground text-[10px] font-bold">
                        {mark.exam_type} · {mark.date ? new Date(mark.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {mark.score >= mark.max_score * 0.5
                        ? <CheckCircle size={14} className="text-success ml-auto" />
                        : <AlertTriangle size={14} className="text-destructive ml-auto" />
                      }
                    </div>
                  </div>
                  <ScoreBar score={mark.score} max={mark.max_score} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Absences */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <SectionHeader title="Absences" icon={UserX} action="Full view" onAction={() => onNavigate('academic_center')} />
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            absenceWarning ? 'bg-destructive/10 border-destructive/30' : 'glass-card border-border'
          }`}>
            <div className={`text-3xl font-black ${absenceWarning ? 'text-destructive' : 'text-foreground'}`}>
              {unjustifiedAbsences.length}
            </div>
            <div className="flex-1">
              <p className="font-black text-sm">Unjustified absences</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${absenceWarning ? 'bg-destructive' : 'bg-warning'}`}
                    style={{ width: `${Math.min((unjustifiedAbsences.length / ABSENCE_LIMIT) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-muted-foreground">{ABSENCE_LIMIT} max</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {absences.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">No absences recorded</p>
            ) : (
              absences.slice(0, 5).map((ab: any) => (
                <div key={ab.id} className="glass-card px-3 py-2.5 rounded-xl flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${ab.is_justified ? 'bg-success' : 'bg-destructive'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{ab.subjects?.name || 'Subject'}</p>
                    <p className="text-muted-foreground text-[10px]">{new Date(ab.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    ab.is_justified
                      ? 'bg-success/10 text-success border-success/30'
                      : 'bg-destructive/10 text-destructive border-destructive/30'
                  }`}>
                    {ab.is_justified ? 'Justified' : 'Unjustified'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming subjects */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
        <SectionHeader title="Subjects" icon={BookOpen} action="View all" onAction={() => onNavigate('uni_courses')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(subjects || []).length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-full text-center py-4">No subjects found</p>
          ) : (
            (subjects || []).slice(0, 6).map((sub: any) => (
              <div key={sub.id} className="glass-card p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs truncate">{sub.name}</p>
                  <p className="text-muted-foreground text-[10px] font-bold">{sub.code} · {sub.professor_name || 'TBD'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-[10px]">{sub.credits} credits</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
