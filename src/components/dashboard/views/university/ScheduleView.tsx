import { useState } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Download } from 'lucide-react';
import { useScheduleEntries, useExamSchedule, useSemesters } from '@/hooks/useSupabaseData';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS = [1, 2, 3, 4, 5]; // Mon-Fri
const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const TYPE_LABELS: Record<string, string> = { lecture: 'Lecture', td: 'Tutorial', lab: 'Lab', tp: 'Lab' };
const TYPE_BADGE_COLORS: Record<string, string> = { lecture: 'bg-primary/10 text-primary', td: 'bg-secondary/10 text-secondary', lab: 'bg-success/10 text-success', tp: 'bg-success/10 text-success' };

const ENTRY_COLORS: string[] = [
  'from-primary/20 to-primary/10 border-primary/30 text-primary',
  'from-secondary/20 to-secondary/10 border-secondary/30 text-secondary',
  'from-success/20 to-success/10 border-success/30 text-success',
  'from-warning/20 to-warning/10 border-warning/30 text-warning',
  'from-destructive/20 to-destructive/10 border-destructive/30 text-destructive',
];

function getCountdown(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff < 0) return 'Past';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

function getCountdownColor(dateStr: string): string {
  const diff = Math.floor((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'text-muted-foreground';
  if (diff <= 3) return 'text-destructive';
  if (diff <= 7) return 'text-warning';
  return 'text-success';
}

export function ScheduleView() {
  const [activeView, setActiveView] = useState<'weekly' | 'exams'>('weekly');
  const { data: semesters } = useSemesters();
  const currentSemester = semesters?.find((s: any) => s.is_current);
  const { data: scheduleEntries, loading: schedLoading } = useScheduleEntries(currentSemester?.id);
  const { data: examSchedule, loading: examLoading } = useExamSchedule(currentSemester?.id);

  const todayDow = new Date().getDay();
  const entries = scheduleEntries || [];
  const exams = examSchedule || [];

  // Assign colors by subject
  const subjectColorMap: Record<string, string> = {};
  let colorIdx = 0;
  entries.forEach((e: any) => {
    const key = e.subject_id;
    if (!subjectColorMap[key]) {
      subjectColorMap[key] = ENTRY_COLORS[colorIdx % ENTRY_COLORS.length];
      colorIdx++;
    }
  });

  const WeeklyView = () => (
    <div className="space-y-4">
      {/* Mobile list */}
      <div className="block lg:hidden space-y-4">
        {WEEKDAYS.map((dayIdx, i) => {
          const dayEntries = entries.filter((e: any) => e.day_of_week === dayIdx).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
          if (dayEntries.length === 0) return null;
          return (
            <div key={dayIdx} className={`glass-card p-4 rounded-2xl ${dayIdx === todayDow ? 'border-primary/40' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className={`font-black text-base ${dayIdx === todayDow ? 'text-primary' : ''}`}>{WEEKDAY_NAMES[i]}</h4>
                {dayIdx === todayDow && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded">Today</span>}
              </div>
              <div className="space-y-2">
                {dayEntries.map((entry: any) => (
                  <div key={entry.id} className={`p-3 rounded-xl bg-gradient-to-r border ${subjectColorMap[entry.subject_id] || ENTRY_COLORS[0]}`}>
                    <p className="font-black text-sm">{entry.subjects?.name || 'Subject'}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-bold flex items-center gap-1"><Clock size={10} /> {entry.start_time?.slice(0, 5)}–{entry.end_time?.slice(0, 5)}</span>
                      {entry.room && <span className="text-xs font-bold flex items-center gap-1"><MapPin size={10} /> {entry.room}</span>}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${TYPE_BADGE_COLORS[entry.entry_type] || ''}`}>{TYPE_LABELS[entry.entry_type] || entry.entry_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Calendar size={40} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="font-bold text-muted-foreground">No schedule entries found</p>
          </div>
        )}
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-[10px] font-black uppercase text-muted-foreground text-right pr-2">Time</div>
            {WEEKDAY_NAMES.map((day, i) => (
              <div key={day} className={`text-center text-xs font-black py-2 rounded-xl ${WEEKDAYS[i] === todayDow ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                {day}
              </div>
            ))}
          </div>
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid grid-cols-6 gap-2 mb-1 min-h-[3rem]">
              <div className="text-[10px] font-bold text-muted-foreground text-right pr-2 pt-2">{time}</div>
              {WEEKDAYS.map((dayIdx) => {
                const slotHour = parseInt(time.split(':')[0]);
                const slotEntries = entries.filter((e: any) => {
                  const start = parseInt(e.start_time?.split(':')[0] || '0');
                  return e.day_of_week === dayIdx && start === slotHour;
                });
                return (
                  <div key={dayIdx} className="relative rounded-lg min-h-[3rem]">
                    {slotEntries.map((entry: any) => {
                      const start = parseInt(entry.start_time?.split(':')[0] || '0');
                      const end = parseInt(entry.end_time?.split(':')[0] || '0');
                      const slots = end - start;
                      return (
                        <div key={entry.id} className={`absolute inset-x-0 top-0 p-2 rounded-xl bg-gradient-to-b border ${subjectColorMap[entry.subject_id] || ENTRY_COLORS[0]} z-10`}
                          style={{ height: `${slots * 3.25}rem` }}>
                          <p className="font-black text-[11px] leading-tight">{entry.subjects?.name || 'Subject'}</p>
                          {entry.room && <p className="text-[10px] font-bold opacity-75 mt-0.5">{entry.room}</p>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ExamView = () => {
    const now = new Date();
    const upcomingExams = exams.filter((e: any) => new Date(e.exam_date) >= now);
    const nextExam = upcomingExams[0];

    return (
      <div className="space-y-4">
        {nextExam && (
          <div className="glass-card p-5 rounded-2xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-primary" />
              <p className="font-black text-sm text-primary">Next Exam</p>
            </div>
            <h4 className="font-black text-xl">{nextExam.subjects?.name || 'Exam'}</h4>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-muted-foreground font-bold">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(nextExam.exam_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              {nextExam.room && <span className="flex items-center gap-1"><MapPin size={14} /> {nextExam.room}</span>}
            </div>
            <p className={`mt-2 font-black text-lg ${getCountdownColor(nextExam.exam_date)}`}>
              ⏳ {getCountdown(nextExam.exam_date)}
            </p>
          </div>
        )}

        {exams.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Clock size={40} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="font-bold text-muted-foreground">No exams scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam: any) => {
              const isPast = new Date(exam.exam_date) < now;
              return (
                <div key={exam.id} className={`glass-card p-4 sm:p-5 rounded-xl flex items-center justify-between gap-3 ${isPast ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex flex-col items-center justify-center text-primary-foreground shrink-0">
                      <p className="font-black text-sm">{new Date(exam.exam_date).getDate()}</p>
                      <p className="text-[9px] font-bold">{new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="font-black text-base">{exam.subjects?.name || 'Exam'}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {exam.room && <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {exam.room}</span>}
                        {exam.duration_minutes && <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-black">{exam.duration_minutes} min</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`font-black text-sm ${isPast ? 'text-muted-foreground' : getCountdownColor(exam.exam_date)}`}>
                    {isPast ? 'Completed' : getCountdown(exam.exam_date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (schedLoading || examLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">SCHEDULE</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            {currentSemester?.name || 'Schedule'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 glass-card p-1 rounded-xl w-fit">
        <button onClick={() => setActiveView('weekly')} className={`px-5 py-2.5 rounded-lg font-black text-sm transition-all flex items-center gap-2 ${activeView === 'weekly' ? 'gradient-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
          <Calendar size={14} /> Weekly
        </button>
        <button onClick={() => setActiveView('exams')} className={`px-5 py-2.5 rounded-lg font-black text-sm transition-all flex items-center gap-2 ${activeView === 'exams' ? 'gradient-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
          <Clock size={14} /> Exams
        </button>
      </div>

      {activeView === 'weekly' ? <WeeklyView /> : <ExamView />}
    </div>
  );
}
