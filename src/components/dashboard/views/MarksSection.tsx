import { useState } from 'react';
import { FileText, TrendingUp, Award, ChevronDown, ChevronUp, Eye, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamResult {
  id: string;
  subject: string;
  examType: 'Midterm' | 'Final' | 'Quiz' | 'Assignment';
  score: number;
  maxScore: number;
  date: string;
  coefficient: number;
  examPaperAvailable: boolean;
}

const MOCK_RESULTS: ExamResult[] = [
  { id: '1', subject: 'Advanced Algorithms', examType: 'Midterm', score: 16, maxScore: 20, date: '2026-01-15', coefficient: 2, examPaperAvailable: true },
  { id: '2', subject: 'Advanced Algorithms', examType: 'Quiz', score: 8, maxScore: 10, date: '2026-01-28', coefficient: 1, examPaperAvailable: false },
  { id: '3', subject: 'Neural Networks', examType: 'Midterm', score: 14, maxScore: 20, date: '2026-01-18', coefficient: 2, examPaperAvailable: true },
  { id: '4', subject: 'Neural Networks', examType: 'Assignment', score: 18, maxScore: 20, date: '2026-02-01', coefficient: 1, examPaperAvailable: false },
  { id: '5', subject: 'Digital Ethics', examType: 'Final', score: 15, maxScore: 20, date: '2026-02-10', coefficient: 3, examPaperAvailable: true },
  { id: '6', subject: 'Data Structures', examType: 'Midterm', score: 17, maxScore: 20, date: '2026-01-20', coefficient: 2, examPaperAvailable: true },
  { id: '7', subject: 'Data Structures', examType: 'Quiz', score: 9, maxScore: 10, date: '2026-02-05', coefficient: 1, examPaperAvailable: false },
  { id: '8', subject: 'Web Development', examType: 'Assignment', score: 19, maxScore: 20, date: '2026-02-08', coefficient: 1, examPaperAvailable: false },
];

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
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [viewingPaper, setViewingPaper] = useState<string | null>(null);

  // Group results by subject
  const grouped = MOCK_RESULTS.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = [];
    acc[r.subject].push(r);
    return acc;
  }, {} as Record<string, ExamResult[]>);

  // Calculate weighted average per subject
  const subjectAverages = Object.entries(grouped).map(([subject, results]) => {
    const totalWeighted = results.reduce((sum, r) => sum + (r.score / r.maxScore) * 20 * r.coefficient, 0);
    const totalCoeff = results.reduce((sum, r) => sum + r.coefficient, 0);
    return { subject, average: totalWeighted / totalCoeff, results, totalCoeff };
  });

  // Overall average
  const overallWeighted = subjectAverages.reduce((sum, s) => sum + s.average * s.totalCoeff, 0);
  const overallCoeff = subjectAverages.reduce((sum, s) => sum + s.totalCoeff, 0);
  const overallAverage = overallWeighted / overallCoeff;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">MARKS & GRADES</h2>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
          Your academic performance at a glance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <BarChart3 size={20} className="text-primary mx-auto mb-2" />
          <p className={`text-2xl sm:text-3xl font-black ${getGradeColor((overallAverage / 20) * 100)}`}>
            {overallAverage.toFixed(2)}
          </p>
          <p className="text-muted-foreground font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1">Overall Avg /20</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <Award size={20} className="text-success mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-success">
            {subjectAverages.filter(s => s.average >= 10).length}
          </p>
          <p className="text-muted-foreground font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1">Subjects Passed</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <FileText size={20} className="text-secondary mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-foreground">{MOCK_RESULTS.length}</p>
          <p className="text-muted-foreground font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1">Total Exams</p>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
          <TrendingUp size={20} className="text-primary mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {Math.max(...subjectAverages.map(s => s.average)).toFixed(1)}
          </p>
          <p className="text-muted-foreground font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1">Best Subject</p>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="space-y-3">
        {subjectAverages.map(({ subject, average, results }) => {
          const isExpanded = expandedSubject === subject;
          const pct = (average / 20) * 100;

          return (
            <div key={subject} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
              {/* Subject Header */}
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${getGradeBg(pct)}`}>
                    <span className={`font-black text-sm sm:text-base ${getGradeColor(pct)}`}>
                      {average.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm sm:text-base">{subject}</h4>
                    <p className="text-muted-foreground text-xs font-bold">{results.length} exam{results.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mini progress bar */}
                  <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 50 ? 'bg-primary' : 'bg-destructive'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <span className={`font-black text-sm ${getGradeColor(pct)}`}>{average.toFixed(2)}/20</span>
                  {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border px-4 sm:px-5 pb-4 sm:pb-5">
                  <div className="divide-y divide-border/50">
                    {results.map((exam) => {
                      const examPct = (exam.score / exam.maxScore) * 100;
                      return (
                        <div key={exam.id} className="py-3 sm:py-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black uppercase border ${
                              exam.examType === 'Final' ? 'bg-primary/10 border-primary/20 text-primary' :
                              exam.examType === 'Midterm' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                              exam.examType === 'Quiz' ? 'bg-warning/10 border-warning/20 text-warning' :
                              'bg-muted border-border text-muted-foreground'
                            }`}>
                              {exam.examType}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-muted-foreground">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <span className="text-muted-foreground text-xs">×{exam.coefficient}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <span className={`font-black text-sm ${getGradeColor(examPct)}`}>
                              {exam.score}/{exam.maxScore}
                            </span>
                            {exam.examPaperAvailable && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingPaper(viewingPaper === exam.id ? null : exam.id);
                                }}
                              >
                                <Eye size={14} className="mr-1" /> View Paper
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exam Paper Viewer */}
              {results.some(r => viewingPaper === r.id) && (
                <div className="border-t border-border p-4 sm:p-6 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-black text-sm flex items-center gap-2">
                      <FileText size={16} className="text-primary" /> Exam Paper Preview
                    </h5>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-bold">
                        <Download size={14} className="mr-1" /> Download PDF
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setViewingPaper(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-6 sm:p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
                    <FileText size={48} className="text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-bold text-sm">Exam paper preview will appear here</p>
                    <p className="text-muted-foreground text-xs mt-1">PDF viewer integration coming soon</p>
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
