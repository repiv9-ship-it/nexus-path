import { useState } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Download } from 'lucide-react';

interface ClassEntry {
  id: string;
  day: number; // 0=Mon, 4=Fri
  startTime: string;
  endTime: string;
  subject: string;
  type: 'lecture' | 'td' | 'lab';
  room: string;
  professor: string;
  color: string;
}

interface ExamEntry {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  type: string;
  duration: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const WEEKLY_SCHEDULE: ClassEntry[] = [
  { id: 'w1', day: 0, startTime: '08:00', endTime: '10:00', subject: 'Advanced Algorithms', type: 'lecture', room: 'A101', professor: 'Dr. Turing', color: 'from-primary/20 to-primary/10 border-primary/30 text-primary' },
  { id: 'w2', day: 0, startTime: '14:00', endTime: '16:00', subject: 'Neural Networks', type: 'td', room: 'Lab 2', professor: 'Prof. Lovelace', color: 'from-secondary/20 to-secondary/10 border-secondary/30 text-secondary' },
  { id: 'w3', day: 1, startTime: '10:00', endTime: '12:00', subject: 'Digital Ethics', type: 'lecture', room: 'B204', professor: 'Master Sokrates', color: 'from-success/20 to-success/10 border-success/30 text-success' },
  { id: 'w4', day: 1, startTime: '13:00', endTime: '15:00', subject: 'Operating Systems', type: 'td', room: 'Lab 1', professor: 'Prof. GNU', color: 'from-warning/20 to-warning/10 border-warning/30 text-warning' },
  { id: 'w5', day: 2, startTime: '08:00', endTime: '10:00', subject: 'Advanced Algorithms', type: 'td', room: 'C305', professor: 'Dr. Turing', color: 'from-primary/20 to-primary/10 border-primary/30 text-primary' },
  { id: 'w6', day: 2, startTime: '14:00', endTime: '16:00', subject: 'Software Engineering', type: 'lecture', room: 'D101', professor: 'Dr. Brooks', color: 'from-destructive/20 to-destructive/10 border-destructive/30 text-destructive' },
  { id: 'w7', day: 3, startTime: '09:00', endTime: '11:00', subject: 'Neural Networks', type: 'lecture', room: 'A201', professor: 'Prof. Lovelace', color: 'from-secondary/20 to-secondary/10 border-secondary/30 text-secondary' },
  { id: 'w8', day: 4, startTime: '10:00', endTime: '12:00', subject: 'Operating Systems', type: 'lecture', room: 'B101', professor: 'Prof. GNU', color: 'from-warning/20 to-warning/10 border-warning/30 text-warning' },
  { id: 'w9', day: 4, startTime: '14:00', endTime: '16:00', subject: 'Software Engineering', type: 'lab', room: 'Lab 3', professor: 'Dr. Brooks', color: 'from-destructive/20 to-destructive/10 border-destructive/30 text-destructive' },
];

const EXAM_SCHEDULE: ExamEntry[] = [
  { id: 'e1', subject: 'Advanced Algorithms', date: '2026-02-25', startTime: '09:00', endTime: '12:00', room: 'A101', type: 'Final Exam', duration: 180 },
  { id: 'e2', subject: 'Neural Networks', date: '2026-03-03', startTime: '14:00', endTime: '17:00', room: 'B205', type: 'Final Exam', duration: 180 },
  { id: 'e3', subject: 'Digital Ethics', date: '2026-03-08', startTime: '09:00', endTime: '11:00', room: 'C301', type: 'Final Exam', duration: 120 },
  { id: 'e4', subject: 'Operating Systems', date: '2026-03-15', startTime: '09:00', endTime: '12:00', room: 'A201', type: 'Final Exam', duration: 180 },
  { id: 'e5', subject: 'Software Engineering', date: '2026-03-20', startTime: '14:00', endTime: '17:00', room: 'D101', type: 'Final Exam', duration: 180 },
];

function getCountdown(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date('2026-02-17');
  const diff = target.getTime() - now.getTime();
  if (diff < 0) return 'Past';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

function getCountdownColor(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date('2026-02-17');
  const diff = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'text-muted-foreground';
  if (diff <= 3) return 'text-destructive';
  if (diff <= 7) return 'text-warning';
  return 'text-success';
}

const TYPE_LABELS: Record<string, string> = {
  lecture: 'Lecture',
  td: 'Tutorial',
  lab: 'Lab',
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  lecture: 'bg-primary/10 text-primary',
  td: 'bg-secondary/10 text-secondary',
  lab: 'bg-success/10 text-success',
};

const TODAY_DAY = 0; // Monday = today for demo

function WeeklyView() {
  const getEntriesForSlot = (day: number, time: string) => {
    return WEEKLY_SCHEDULE.filter(e => {
      const start = parseInt(e.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return e.day === day && start === slotHour;
    });
  };

  const getDurationSlots = (entry: ClassEntry) => {
    const start = parseInt(entry.startTime.split(':')[0]);
    const end = parseInt(entry.endTime.split(':')[0]);
    return end - start;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
        <AlertCircle size={12} className="text-primary" />
        Today is Monday — highlighted in blue
      </div>

      {/* Mobile: list per day */}
      <div className="block lg:hidden space-y-4">
        {DAYS.map((day, dayIdx) => {
          const dayEntries = WEEKLY_SCHEDULE.filter(e => e.day === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime));
          if (dayEntries.length === 0) return null;
          return (
            <div key={day} className={`glass-card p-4 rounded-2xl ${dayIdx === TODAY_DAY ? 'border-primary/40' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className={`font-black text-base ${dayIdx === TODAY_DAY ? 'text-primary' : ''}`}>{day}</h4>
                {dayIdx === TODAY_DAY && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded">Today</span>}
              </div>
              <div className="space-y-2">
                {dayEntries.map(entry => (
                  <div key={entry.id} className={`p-3 rounded-xl bg-gradient-to-r border ${entry.color}`}>
                    <p className="font-black text-sm">{entry.subject}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-bold flex items-center gap-1"><Clock size={10} /> {entry.startTime}–{entry.endTime}</span>
                      <span className="text-xs font-bold flex items-center gap-1"><MapPin size={10} /> {entry.room}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${TYPE_BADGE_COLORS[entry.type]}`}>{TYPE_LABELS[entry.type]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: grid */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-[10px] font-black uppercase text-muted-foreground text-right pr-2">Time</div>
            {DAYS.map((day, i) => (
              <div key={day} className={`text-center text-xs font-black py-2 rounded-xl ${i === TODAY_DAY ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                {day}
                {i === TODAY_DAY && <span className="block text-[10px] opacity-75">Today</span>}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid grid-cols-6 gap-2 mb-1 min-h-[3rem]">
              <div className="text-[10px] font-bold text-muted-foreground text-right pr-2 pt-2">{time}</div>
              {DAYS.map((_, dayIdx) => {
                const entries = getEntriesForSlot(dayIdx, time);
                return (
                  <div key={dayIdx} className={`relative rounded-lg min-h-[3rem] ${dayIdx === TODAY_DAY ? 'bg-primary/3' : ''}`}>
                    {entries.map(entry => {
                      const slots = getDurationSlots(entry);
                      return (
                        <div
                          key={entry.id}
                          className={`absolute inset-x-0 top-0 p-2 rounded-xl bg-gradient-to-b border ${entry.color} z-10`}
                          style={{ height: `${slots * 3.25}rem` }}
                        >
                          <p className="font-black text-[11px] leading-tight">{entry.subject}</p>
                          <p className="text-[10px] font-bold opacity-75 mt-0.5">{entry.room}</p>
                          <span className={`inline-block mt-1 px-1 py-0.5 rounded text-[9px] font-black ${TYPE_BADGE_COLORS[entry.type]}`}>
                            {TYPE_LABELS[entry.type]}
                          </span>
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
}

function ExamView() {
  const nextExam = EXAM_SCHEDULE.find(e => new Date(e.date) >= new Date('2026-02-17'));
  return (
    <div className="space-y-4">
      {nextExam && (
        <div className="glass-card p-5 rounded-2xl border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-primary" />
            <p className="font-black text-sm text-primary">Next Exam</p>
          </div>
          <h4 className="font-black text-xl">{nextExam.subject}</h4>
          <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-muted-foreground font-bold">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(nextExam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {nextExam.startTime} – {nextExam.endTime}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {nextExam.room}</span>
          </div>
          <p className={`mt-2 font-black text-lg ${getCountdownColor(nextExam.date)}`}>
            ⏳ {getCountdown(nextExam.date)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {EXAM_SCHEDULE.map(exam => {
          const isPast = new Date(exam.date) < new Date('2026-02-17');
          const countdown = getCountdown(exam.date);
          return (
            <div key={exam.id} className={`glass-card p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isPast ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-primary rounded-xl flex flex-col items-center justify-center text-primary-foreground shrink-0">
                  <p className="font-black text-sm">{new Date(exam.date).getDate()}</p>
                  <p className="text-[9px] font-bold">
                    {new Date(exam.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="font-black text-base">{exam.subject}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Clock size={11} /> {exam.startTime}–{exam.endTime}</span>
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {exam.room}</span>
                    <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-black">{exam.duration} min</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                {isPast ? (
                  <span className="text-muted-foreground text-xs font-bold">Completed</span>
                ) : (
                  <span className={`font-black text-sm ${getCountdownColor(exam.date)}`}>{countdown}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ScheduleView() {
  const [activeView, setActiveView] = useState<'weekly' | 'exams'>('weekly');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">SCHEDULE</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Semester 3 · 2025-2026
          </p>
        </div>
        <button className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl font-black text-sm hover:border-primary/50 transition-all">
          <Download size={14} className="text-primary" /> Export PDF
        </button>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 glass-card p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveView('weekly')}
          className={`px-5 py-2.5 rounded-lg font-black text-sm transition-all flex items-center gap-2 ${
            activeView === 'weekly' ? 'gradient-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar size={14} /> Weekly
        </button>
        <button
          onClick={() => setActiveView('exams')}
          className={`px-5 py-2.5 rounded-lg font-black text-sm transition-all flex items-center gap-2 ${
            activeView === 'exams' ? 'gradient-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock size={14} /> Exams
        </button>
      </div>

      {activeView === 'weekly' ? <WeeklyView /> : <ExamView />}
    </div>
  );
}
