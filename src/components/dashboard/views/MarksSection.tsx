import { useState } from 'react';
import { FileText, TrendingUp, Award, ChevronDown, ChevronUp, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarks } from '@/hooks/useSupabaseData';

function getGradeColor(percentage: number) {
  if (percentage >= 80) return 'text-success';
  if (percentage >= 60) return 'text-primary';
  if (percentage >= 50) return 'text-warning';
  return 'text-destructive';
}

function getGradeBg(percentage: number) {
  if (percentage >= 80) return 'bg-success/10 border-success/20';
  if (percentage >= 60) return 'bg-primary/10 border-primary/20';
  if (percentage >= 50) return 'bg-warning/10 border-warning/20';
  return 'bg-destructive/10 border-destructive/20';
}

export function MarksSection() {
  const { data: marks, loading } = useMarks();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading marks...</p>
      </div>
    );
  }

  const marksList = marks || [];

  // Group by subject
  const grouped: Record<string, { subjectName: string; results: typeof marksList }> = {};
  marksList.forEach(m => {
    const subjectName = (m as any).subjects?.name || 'Unknown';
    if (!grouped[subjectName]) grouped[subjectName] = { subjectName, results: [] };
    grouped[subjectName].results.push(m);
  });

  const subjectAverages = Object.entries(grouped).map(([subject, { results }]) => {
    const totalWeighted = results.reduce((sum, r) => sum + (r.score / r.max_score) * 20 * r.coefficient, 0);
    const totalCoeff = results.reduce((sum, r) => sum + r.coefficient, 0);
    return { subject, average: totalCoeff > 0 ? totalWeighted / totalCoeff : 0, results, totalCoeff };
  });

  const overallWeighted = subjectAverages.reduce((sum, s) => sum + s.average * s.totalCoeff, 0);
  const overallCoeff = subjectAverages.reduce((sum, s) => sum + s.totalCoeff, 0);
  const overallAverage = overallCoeff > 0 ? overallWeighted / overallCoeff : 0;

  if (marksList.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">MARKS & GRADES</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Your academic performance</p>
        </div>
        <div className="text-center py-16 glass-card rounded-2xl">
          <BarChart3 size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground text-lg">No marks recorded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Your grades will appear here once published by your professors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">MARKS & GRADES</h2>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Your academic performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <BarChart3 size={20} className="text-primary mx-auto mb-2" />
          <p className={`text-2xl sm:text-3xl font-black ${getGradeColor((overallAverage / 20) * 100)}`}>{overallAverage.toFixed(2)}</p>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mt-1">Overall Avg /20</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <Award size={20} className="text-success mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-success">{subjectAverages.filter(s => s.average >= 10).length}</p>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mt-1">Passed</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <FileText size={20} className="text-secondary mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-foreground">{marksList.length}</p>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mt-1">Total Exams</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <TrendingUp size={20} className="text-primary mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {subjectAverages.length > 0 ? Math.max(...subjectAverages.map(s => s.average)).toFixed(1) : '—'}
          </p>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mt-1">Best Subject</p>
        </div>
      </div>

      <div className="space-y-3">
        {subjectAverages.map(({ subject, average, results }) => {
          const isExpanded = expandedSubject === subject;
          const pct = (average / 20) * 100;
          return (
            <div key={subject} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedSubject(isExpanded ? null : subject)} className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${getGradeBg(pct)}`}>
                    <span className={`font-black text-sm sm:text-base ${getGradeColor(pct)}`}>{average.toFixed(1)}</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm sm:text-base">{subject}</h4>
                    <p className="text-muted-foreground text-xs font-bold">{results.length} exam{results.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 50 ? 'bg-primary' : 'bg-destructive'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  <span className={`font-black text-sm ${getGradeColor(pct)}`}>{average.toFixed(2)}/20</span>
                  {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-border px-4 sm:px-5 pb-4 sm:pb-5">
                  <div className="divide-y divide-border/50">
                    {results.map(exam => {
                      const examPct = (exam.score / exam.max_score) * 100;
                      return (
                        <div key={exam.id} className="py-3 sm:py-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase border bg-muted border-border text-muted-foreground">
                              {exam.exam_type}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {exam.date ? new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </span>
                            <span className="text-muted-foreground text-xs">×{exam.coefficient}</span>
                          </div>
                          <span className={`font-black text-sm ${getGradeColor(examPct)}`}>{exam.score}/{exam.max_score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
