import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Award, Download, CheckCircle, XCircle, Clock, Eye, FileText, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface SubjectMark {
  id: string;
  name: string;
  code: string;
  moduleGroup: string;
  credits: number;
  tdGrade?: number;
  examGrade?: number;
  average?: number;
  maxGrade: number;
  status: 'passed' | 'failed' | 'pending';
}

interface SemesterData {
  id: string;
  name: string;
  subjects: SubjectMark[];
  semesterAverage?: number;
}

interface YearData {
  id: string;
  name: string;
  label: string;
  status: 'completed' | 'current';
  semesters: SemesterData[];
  yearAverage?: number;
  totalCredits: number;
  validatedCredits: number;
}

const MARKS_DATA: YearData[] = [
  {
    id: 'y1', name: 'Year 1', label: 'L1', status: 'completed',
    yearAverage: 14.8, totalCredits: 60, validatedCredits: 60,
    semesters: [
      {
        id: 's1', name: 'Semester 1', semesterAverage: 15.1,
        subjects: [
          { id: 'm1', name: 'Mathematics 1', code: 'MATH101', moduleGroup: 'Core Sciences', credits: 4, tdGrade: 14, examGrade: 15, average: 14.67, maxGrade: 20, status: 'passed' },
          { id: 'm2', name: 'Physics 1', code: 'PHY101', moduleGroup: 'Core Sciences', credits: 3, tdGrade: 12, examGrade: 11, average: 11.5, maxGrade: 20, status: 'passed' },
          { id: 'm3', name: 'Intro to Programming', code: 'CS101', moduleGroup: 'Computer Science', credits: 4, tdGrade: 17, examGrade: 16, average: 16.5, maxGrade: 20, status: 'passed' },
          { id: 'm4', name: 'English Communication', code: 'ENG101', moduleGroup: 'Languages', credits: 2, tdGrade: 16, examGrade: undefined, average: 16, maxGrade: 20, status: 'passed' },
          { id: 'm5', name: 'Logic & Discrete Math', code: 'MATH102', moduleGroup: 'Core Sciences', credits: 3, tdGrade: 13, examGrade: 14, average: 13.67, maxGrade: 20, status: 'passed' },
        ],
      },
      {
        id: 's2', name: 'Semester 2', semesterAverage: 14.5,
        subjects: [
          { id: 'm6', name: 'Data Structures', code: 'CS201', moduleGroup: 'Computer Science', credits: 4, tdGrade: 15, examGrade: 14, average: 14.5, maxGrade: 20, status: 'passed' },
          { id: 'm7', name: 'Mathematics 2', code: 'MATH201', moduleGroup: 'Core Sciences', credits: 4, tdGrade: 13, examGrade: 12, average: 12.5, maxGrade: 20, status: 'passed' },
          { id: 'm8', name: 'Probability & Statistics', code: 'STAT201', moduleGroup: 'Core Sciences', credits: 3, tdGrade: 16, examGrade: 15, average: 15.5, maxGrade: 20, status: 'passed' },
          { id: 'm9', name: 'Web Development Basics', code: 'WEB201', moduleGroup: 'Computer Science', credits: 3, tdGrade: 18, examGrade: 17, average: 17.5, maxGrade: 20, status: 'passed' },
          { id: 'm10', name: 'French B1', code: 'FR201', moduleGroup: 'Languages', credits: 2, tdGrade: 14, examGrade: undefined, average: 14, maxGrade: 20, status: 'passed' },
        ],
      },
    ],
  },
  {
    id: 'y2', name: 'Year 2', label: 'L2', status: 'current',
    yearAverage: undefined, totalCredits: 60, validatedCredits: 0,
    semesters: [
      {
        id: 's3', name: 'Semester 3 (Current)', semesterAverage: undefined,
        subjects: [
          { id: 'c1', name: 'Advanced Algorithms', code: 'CS301', moduleGroup: 'Computer Science', credits: 4, tdGrade: 16, examGrade: undefined, average: undefined, maxGrade: 20, status: 'pending' },
          { id: 'c2', name: 'Neural Networks', code: 'AI301', moduleGroup: 'AI & Machine Learning', credits: 4, tdGrade: 14, examGrade: 15, average: 14.5, maxGrade: 20, status: 'passed' },
          { id: 'c3', name: 'Digital Ethics', code: 'ETH301', moduleGroup: 'Humanities', credits: 2, tdGrade: undefined, examGrade: 15, average: 15, maxGrade: 20, status: 'passed' },
          { id: 'c4', name: 'Operating Systems', code: 'CS302', moduleGroup: 'Computer Science', credits: 4, tdGrade: 11, examGrade: 13, average: 12.33, maxGrade: 20, status: 'passed' },
          { id: 'c5', name: 'Software Engineering', code: 'CS303', moduleGroup: 'Computer Science', credits: 3, tdGrade: 18, examGrade: undefined, average: undefined, maxGrade: 20, status: 'pending' },
        ],
      },
    ],
  },
];

function getGradeColor(grade: number, max: number = 20) {
  const pct = (grade / max) * 100;
  if (pct >= 75) return 'text-success';
  if (pct >= 60) return 'text-primary';
  if (pct >= 50) return 'text-warning';
  return 'text-destructive';
}

function GradeCell({ value, max }: { value?: number; max: number }) {
  if (value === undefined) return <span className="text-muted-foreground text-xs font-bold">—</span>;
  return (
    <span className={`font-black text-sm ${getGradeColor(value, max)}`}>
      {value.toFixed(2)}
    </span>
  );
}

function StatusBadge({ status }: { status: SubjectMark['status'] }) {
  if (status === 'passed') return (
    <span className="flex items-center gap-1 text-success text-xs font-black">
      <CheckCircle size={12} /> Passed
    </span>
  );
  if (status === 'failed') return (
    <span className="flex items-center gap-1 text-destructive text-xs font-black">
      <XCircle size={12} /> Failed
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-warning text-xs font-black">
      <Clock size={12} /> Pending
    </span>
  );
}

function SemesterSection({ semester, isExpanded, onToggle, viewingPaperId, onViewPaper }: {
  semester: SemesterData;
  isExpanded: boolean;
  onToggle: () => void;
  viewingPaperId: string | null;
  onViewPaper: (id: string | null) => void;
}) {
  const groupedSubjects = semester.subjects.reduce((acc, s) => {
    if (!acc[s.moduleGroup]) acc[s.moduleGroup] = [];
    acc[s.moduleGroup].push(s);
    return acc;
  }, {} as Record<string, SubjectMark[]>);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Award size={18} className="text-primary-foreground" />
          </div>
          <div className="text-left">
            <h4 className="font-black text-base">{semester.name}</h4>
            <p className="text-muted-foreground text-xs font-bold">{semester.subjects.length} subjects</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {semester.semesterAverage !== undefined ? (
            <div className="text-right">
              <p className={`font-black text-xl ${getGradeColor(semester.semesterAverage)}`}>
                {semester.semesterAverage.toFixed(2)}
              </p>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">/ 20 avg</p>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs font-bold italic">In progress</span>
          )}
          {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          {Object.entries(groupedSubjects).map(([group, subjects]) => (
            <div key={group}>
              <div className="px-4 sm:px-5 py-2 bg-muted/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{group}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left px-4 sm:px-5 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Subject</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">TD</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Exam</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Average</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Credits</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="text-center px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Paper</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map(s => (
                      <>
                        <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="px-4 sm:px-5 py-3">
                            <p className="font-black text-sm">{s.name}</p>
                            <p className="text-muted-foreground text-[10px] font-bold">{s.code}</p>
                          </td>
                          <td className="text-center px-3 py-3"><GradeCell value={s.tdGrade} max={s.maxGrade} /></td>
                          <td className="text-center px-3 py-3"><GradeCell value={s.examGrade} max={s.maxGrade} /></td>
                          <td className="text-center px-3 py-3">
                            {s.average !== undefined ? (
                              <div>
                                <GradeCell value={s.average} max={s.maxGrade} />
                                <span className="text-muted-foreground text-[10px]">/20</span>
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                          <td className="text-center px-3 py-3 font-bold text-sm">{s.credits}</td>
                          <td className="text-center px-3 py-3"><StatusBadge status={s.status} /></td>
                          <td className="text-center px-3 py-3">
                            {s.examGrade !== undefined ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs font-black text-primary hover:text-primary"
                                onClick={() => onViewPaper(s.id === viewingPaperId ? null : s.id)}
                              >
                                <Eye size={13} className="mr-1" />
                                {s.id === viewingPaperId ? 'Close' : 'View'}
                              </Button>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                        </tr>
                        {s.id === viewingPaperId && (
                          <tr key={`paper-${s.id}`}>
                            <td colSpan={7} className="px-4 sm:px-5 pb-4 pt-2">
                              <div className="glass-card rounded-xl p-5 border-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-primary" />
                                    <span className="font-black text-sm">Exam Paper — {s.name}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-xs font-black">
                                      <Download size={12} className="mr-1" /> PDF
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onViewPaper(null)}>
                                      <X size={12} />
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-muted/30 rounded-xl p-8 min-h-[180px] flex flex-col items-center justify-center text-center border border-dashed border-border">
                                  <FileText size={40} className="text-muted-foreground/30 mb-3" />
                                  <p className="font-bold text-sm text-muted-foreground">Exam paper preview</p>
                                  <p className="text-muted-foreground text-xs mt-1">PDF viewer integration coming soon</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UniMarksView() {
  const [selectedYear, setSelectedYear] = useState<YearData>(MARKS_DATA[1]); // Year 2 by default
  const [expandedSems, setExpandedSems] = useState<Set<string>>(new Set(['s3']));
  const [viewingPaperId, setViewingPaperId] = useState<string | null>(null);

  const toggleSem = (id: string) => {
    setExpandedSems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Overall GPA
  const completedYears = MARKS_DATA.filter(y => y.yearAverage !== undefined);
  const overallGPA = completedYears.length > 0
    ? completedYears.reduce((sum, y) => sum + (y.yearAverage || 0), 0) / completedYears.length
    : undefined;

  const gpaPct = overallGPA ? (overallGPA / 20) * 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">ACADEMIC MARKS</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
            Full academic history
          </p>
        </div>
        <button className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl font-black text-sm hover:border-primary/50 transition-all">
          <Download size={14} className="text-primary" /> Transcript (PDF)
        </button>
      </div>

      {/* GPA Overview */}
      {overallGPA && (
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
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold mt-1">
                <span>0 / 20</span>
                <span className={gpaPct >= 70 ? 'text-success' : gpaPct >= 50 ? 'text-primary' : 'text-warning'}>
                  {gpaPct >= 75 ? '🎉 Excellent' : gpaPct >= 60 ? '👍 Good' : gpaPct >= 50 ? '⚡ Passing' : '⚠️ Below average'}
                </span>
                <span>20 / 20</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="font-black text-2xl text-success">60</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Credits Validated</p>
              </div>
              <div className="text-center">
                <p className="font-black text-2xl text-foreground">120</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Credits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <TrendingUp size={16} className="text-muted-foreground shrink-0" />
        {MARKS_DATA.map(year => (
          <button
            key={year.id}
            onClick={() => { setSelectedYear(year); setExpandedSems(new Set([year.semesters[0].id])); }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              selectedYear.id === year.id
                ? 'gradient-primary text-primary-foreground shadow-md'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {year.name}
            {year.yearAverage && (
              <span className={`text-[11px] font-black ${selectedYear.id === year.id ? 'text-primary-foreground/80' : getGradeColor(year.yearAverage)}`}>
                {year.yearAverage.toFixed(1)}
              </span>
            )}
            {year.status === 'current' && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded font-black ${selectedYear.id === year.id ? 'bg-primary-foreground/20' : 'bg-success/20 text-success'}`}>
                Current
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Year summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <p className={`text-2xl font-black ${selectedYear.yearAverage ? getGradeColor(selectedYear.yearAverage) : 'text-muted-foreground'}`}>
            {selectedYear.yearAverage?.toFixed(2) ?? '—'}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Year Average</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-2xl font-black text-success">{selectedYear.validatedCredits}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Validated Credits</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-2xl font-black text-foreground">
            {selectedYear.semesters.flatMap(s => s.subjects).filter(s => s.status === 'passed').length}
            /{selectedYear.semesters.flatMap(s => s.subjects).length}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Subjects Passed</p>
        </div>
      </div>

      {/* Semester breakdown */}
      <div className="space-y-4">
        {selectedYear.semesters.map(sem => (
          <SemesterSection
            key={sem.id}
            semester={sem}
            isExpanded={expandedSems.has(sem.id)}
            onToggle={() => toggleSem(sem.id)}
            viewingPaperId={viewingPaperId}
            onViewPaper={setViewingPaperId}
          />
        ))}
      </div>
    </div>
  );
}
