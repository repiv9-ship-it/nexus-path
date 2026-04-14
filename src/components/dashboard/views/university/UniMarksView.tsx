import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Award, Download, CheckCircle, XCircle, Clock, Eye, FileText, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useMarks, useSubjects, useSemesters, useAcademicYears } from '@/hooks/useSupabaseData';

function getGradeColor(grade: number, max: number = 20) {
  const pct = (grade / max) * 100;
  if (pct >= 75) return 'text-success';
  if (pct >= 60) return 'text-primary';
  if (pct >= 50) return 'text-warning';
  return 'text-destructive';
}

function GradeCell({ value, max }: { value?: number; max: number }) {
  if (value === undefined) return <span className="text-muted-foreground text-xs font-bold">—</span>;
  return <span className={`font-black text-sm ${getGradeColor(value, max)}`}>{Number(value).toFixed(2)}</span>;
}

function StatusBadge({ status }: { status: 'passed' | 'failed' | 'pending' }) {
  if (status === 'passed') return <span className="flex items-center gap-1 text-success text-xs font-black"><CheckCircle size={12} /> Passed</span>;
  if (status === 'failed') return <span className="flex items-center gap-1 text-destructive text-xs font-black"><XCircle size={12} /> Failed</span>;
  return <span className="flex items-center gap-1 text-warning text-xs font-black"><Clock size={12} /> Pending</span>;
}

export function UniMarksView() {
  const { data: marks, loading: marksLoading } = useMarks();
  const { data: subjects } = useSubjects();
  const { data: semesters } = useSemesters();
  const { data: academicYears } = useAcademicYears();

  const [expandedSems, setExpandedSems] = useState<Set<string>>(new Set());
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

  const toggleSem = (id: string) => {
    setExpandedSems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Group marks by subject
  const marksBySubject: Record<string, any[]> = {};
  (marks || []).forEach((m: any) => {
    const subId = m.subject_id;
    if (!marksBySubject[subId]) marksBySubject[subId] = [];
    marksBySubject[subId].push(m);
  });

  // Build semester structure
  const years = academicYears || [];
  const activeYearId = selectedYearId || years.find((y: any) => y.is_current)?.id || years[0]?.id;
  const yearSemesters = (semesters || []).filter((s: any) => s.academic_year_id === activeYearId);

  // Compute subject averages
  const getSubjectAvg = (subjectId: string) => {
    const subMarks = marksBySubject[subjectId] || [];
    if (subMarks.length === 0) return undefined;
    const totalWeight = subMarks.reduce((s: number, m: any) => s + Number(m.coefficient), 0);
    const weightedSum = subMarks.reduce((s: number, m: any) => s + Number(m.score) * Number(m.coefficient), 0);
    return totalWeight > 0 ? weightedSum / totalWeight : undefined;
  };

  // Overall stats
  const allAvgs = (subjects || []).map((s: any) => getSubjectAvg(s.id)).filter((v: any) => v !== undefined) as number[];
  const overallGPA = allAvgs.length > 0 ? allAvgs.reduce((a: number, b: number) => a + b, 0) / allAvgs.length : undefined;
  const gpaPct = overallGPA ? (overallGPA / 20) * 100 : 0;

  if (marksLoading) {
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
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">ACADEMIC MARKS</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Full academic history</p>
        </div>
      </div>

      {/* GPA Overview */}
      {overallGPA !== undefined && (
        <div className="glass-card p-5 sm:p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Cumulative GPA</p>
              <p className={`text-4xl sm:text-5xl font-black ${getGradeColor(overallGPA)}`}>{overallGPA.toFixed(2)}</p>
              <p className="text-muted-foreground text-sm font-bold">out of 20.00</p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-muted-foreground">GPA Progress</span>
                <span className="text-foreground">{gpaPct.toFixed(1)}%</span>
              </div>
              <Progress value={gpaPct} className="h-3" />
            </div>
          </div>
        </div>
      )}

      {/* Year selector */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <TrendingUp size={16} className="text-muted-foreground shrink-0" />
          {years.map((year: any) => (
            <button
              key={year.id}
              onClick={() => setSelectedYearId(year.id)}
              className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all ${
                activeYearId === year.id
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {year.name}
              {year.is_current && (
                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded font-black ${activeYearId === year.id ? 'bg-primary-foreground/20' : 'bg-success/20 text-success'}`}>Current</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Semesters */}
      <div className="space-y-4">
        {yearSemesters.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Award size={40} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="font-bold text-muted-foreground">No semesters found for this year</p>
          </div>
        ) : (
          yearSemesters.map((sem: any) => {
            const semSubjects = (subjects || []).filter((s: any) => s.semester_id === sem.id);
            const isExpanded = expandedSems.has(sem.id);

            // Group by module
            const grouped: Record<string, any[]> = {};
            semSubjects.forEach((s: any) => {
              const group = s.module_group || 'General';
              if (!grouped[group]) grouped[group] = [];
              grouped[group].push(s);
            });

            return (
              <div key={sem.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => toggleSem(sem.id)} className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                      <Award size={18} className="text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-base">{sem.name}</h4>
                      <p className="text-muted-foreground text-xs font-bold">{semSubjects.length} subjects</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {Object.entries(grouped).map(([group, subs]) => (
                      <div key={group}>
                        <div className="px-4 sm:px-5 py-2 bg-muted/30">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{group}</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border/50">
                                <th className="text-left px-4 sm:px-5 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Subject</th>
                                <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Average</th>
                                <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Credits</th>
                                <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subs.map((s: any) => {
                                const avg = getSubjectAvg(s.id);
                                const status = avg === undefined ? 'pending' : avg >= 10 ? 'passed' : 'failed';
                                return (
                                  <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                    <td className="px-4 sm:px-5 py-3">
                                      <p className="font-black text-sm">{s.name}</p>
                                      <p className="text-muted-foreground text-[10px] font-bold">{s.code}</p>
                                    </td>
                                    <td className="text-center px-3 py-3">
                                      <GradeCell value={avg} max={20} />
                                    </td>
                                    <td className="text-center px-3 py-3 font-bold text-sm">{s.credits}</td>
                                    <td className="text-center px-3 py-3"><StatusBadge status={status} /></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
