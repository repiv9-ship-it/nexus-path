import { useState } from 'react';
import { Plus, Users, BookOpen, TrendingUp, ChevronRight, Calendar, Clock, CheckSquare, DollarSign, MessageSquare, Upload, FileText, Bell, User, Send, Globe, Star, Edit, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSubjects, useScheduleEntries, useAllAttendance, useAllMarks, useSemesters } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfessorDashboardProps {
  activeSection?: string;
}

export function ProfessorDashboard({ activeSection = 'overview' }: ProfessorDashboardProps) {
  const { user } = useAuth();
  const { data: subjects, loading: subjectsLoading } = useSubjects();
  const { data: semesters } = useSemesters();
  const currentSemester = semesters?.find((s: any) => s.is_current);
  const { data: scheduleEntries } = useScheduleEntries(currentSemester?.id);
  const { data: allAttendance } = useAllAttendance();
  const { data: allMarks } = useAllMarks();

  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  const totalSubjects = subjects?.length || 0;

  // ═══════════ OVERVIEW ═══════════
  if (activeSection === 'overview' || activeSection === 'professor') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Welcome, Professor {user?.firstName}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Subjects', value: totalSubjects, icon: BookOpen, color: 'text-success' },
            { label: 'Sessions Today', value: (scheduleEntries || []).filter((e: any) => e.day_of_week === new Date().getDay()).length, icon: Calendar, color: 'text-warning' },
            { label: 'Attendance Records', value: (allAttendance || []).length, icon: CheckSquare, color: 'text-primary' },
            { label: 'Marks Recorded', value: (allMarks || []).length, icon: TrendingUp, color: 'text-secondary' },
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
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-primary" /> Upcoming Sessions
            </h3>
            {(scheduleEntries || []).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No sessions scheduled</p>
            ) : (
              (scheduleEntries || []).slice(0, 5).map((s: any) => (
                <div key={s.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="text-center shrink-0 min-w-[44px]">
                    <p className="font-black text-xs">{s.start_time?.slice(0, 5)}</p>
                    <p className="text-muted-foreground text-[10px]">{s.end_time?.slice(0, 5)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs truncate">{s.subjects?.name || 'Subject'}</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.entry_type}</span>
                      {s.room && <span className="text-muted-foreground text-[10px]">{s.room}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-primary" /> My Subjects
            </h3>
            {(subjects || []).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No subjects assigned</p>
            ) : (
              (subjects || []).slice(0, 6).map((sub: any) => (
                <div key={sub.id} className="glass-card p-3 rounded-xl">
                  <p className="font-black text-xs">{sub.name}</p>
                  <p className="text-muted-foreground text-[10px]">{sub.code} · {sub.credits} credits</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ SESSIONS ═══════════
  if (activeSection === 'prof_sessions') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Sessions</h2>
        {(scheduleEntries || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No sessions scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(scheduleEntries || []).map((s: any) => (
              <div key={s.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-center shrink-0 min-w-[44px]">
                    <p className="font-black text-xs">{s.start_time?.slice(0, 5)}</p>
                    <p className="text-muted-foreground text-[10px]">{s.end_time?.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="font-black text-sm">{s.subjects?.name || 'Subject'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.entry_type}</span>
                      {s.room && <span className="text-muted-foreground text-[10px]">{s.room}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ ATTENDANCE ═══════════
  if (activeSection === 'prof_attendance') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Attendance Records</h2>
        {(allAttendance || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <CheckSquare size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No attendance records yet</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Date</th>
                <th className="text-center px-4 py-3 text-xs font-black uppercase text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {(allAttendance || []).slice(0, 20).map((a: any) => (
                  <tr key={a.id} className="border-b border-border/30">
                    <td className="px-4 py-3 font-bold">{a.subjects?.name || 'Subject'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(a.session_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${a.status === 'present' ? 'bg-success/10 text-success' : a.status === 'absent' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ═══════════ COURSES / MARKS ═══════════
  if (activeSection === 'prof_courses' || activeSection === 'prof_my_courses') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Courses & Materials</h2>
        {(subjects || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No courses assigned</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(subjects || []).map((sub: any) => (
              <div key={sub.id} className="glass-card p-5 rounded-2xl hover:border-primary/30 transition-all">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-3">
                  <BookOpen size={18} className="text-primary-foreground" />
                </div>
                <p className="font-black text-sm">{sub.name}</p>
                <p className="text-muted-foreground text-xs">{sub.code} · {sub.credits} credits</p>
                <p className="text-muted-foreground text-[10px] mt-1">{sub.module_group || 'General'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ SCHEDULE ═══════════
  if (activeSection === 'prof_schedule') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">My Schedule</h2>
        {(scheduleEntries || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No schedule entries</p>
          </div>
        ) : (
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => {
              const dayEntries = (scheduleEntries || []).filter((e: any) => e.day_of_week === i + 1);
              if (dayEntries.length === 0) return null;
              return (
                <div key={day} className="glass-card p-4 rounded-2xl">
                  <h4 className="font-black text-sm mb-2">{day}</h4>
                  <div className="space-y-2">
                    {dayEntries.map((e: any) => (
                      <div key={e.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-xl">
                        <span className="font-black text-xs shrink-0">{e.start_time?.slice(0, 5)}–{e.end_time?.slice(0, 5)}</span>
                        <span className="font-bold text-xs">{e.subjects?.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-black">{e.entry_type}</span>
                        {e.room && <span className="text-[10px] text-muted-foreground">{e.room}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ SALARY / PAYMENTS / MESSAGES / PUBLIC PROFILE / MEETINGS ═══════════
  const sectionTitles: Record<string, { title: string; icon: typeof DollarSign }> = {
    prof_salary: { title: 'Salary', icon: DollarSign },
    prof_payments: { title: 'Earnings', icon: DollarSign },
    prof_earnings: { title: 'Earnings', icon: DollarSign },
    prof_messages: { title: 'Messages', icon: MessageSquare },
    prof_public_profile: { title: 'Public Profile', icon: Globe },
    prof_meetings: { title: 'Meetings', icon: Calendar },
  };

  const section = sectionTitles[activeSection || ''];
  if (section) {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
        <div className="text-center py-16 glass-card rounded-2xl">
          <section.icon size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground text-lg">Coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">This section will be available once data is added</p>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="text-center py-16 glass-card rounded-2xl">
      <BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" />
      <p className="font-bold text-muted-foreground">Section not found</p>
    </div>
  );
}
