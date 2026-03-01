import { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Video, FileText, Package, Megaphone, Search, Clock, Users, Sparkles, CheckSquare, Square, Brain, Zap, BookMarked, Target, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'slides' | 'exercise';
  date: string;
  isNew?: boolean;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  professor: string;
  credits: number;
  hasNew?: boolean;
  materials: {
    lectures: Material[];
    td: Material[];
    exams: Material[];
    materials: Material[];
    announcements: { id: string; title: string; message: string; date: string; isNew?: boolean }[];
  };
}

interface Semester {
  id: string;
  name: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  subjects: Subject[];
}

interface AcademicYear {
  id: string;
  name: string;
  label: string;
  status: 'completed' | 'current';
  semesters: Semester[];
}

const ACADEMIC_DATA: AcademicYear[] = [
  {
    id: 'y1', name: 'Year 1', label: 'L1', status: 'completed',
    semesters: [
      {
        id: 's1', name: 'Semester 1', label: 'S1', status: 'completed',
        subjects: [
          { id: 'y1s1m1', name: 'Mathematics 1', code: 'MATH101', professor: 'Dr. Euler', credits: 4, materials: { lectures: [{ id: '1', title: 'Lecture 1 - Introduction', type: 'pdf', date: '2024-09-10' }, { id: '2', title: 'Lecture 2 - Functions', type: 'slides', date: '2024-09-17' }], td: [{ id: '3', title: 'TD 1 - Exercises', type: 'pdf', date: '2024-09-12' }], exams: [{ id: '4', title: 'Midterm Exam 2024', type: 'pdf', date: '2024-11-15' }], materials: [{ id: '5', title: 'Formula Sheet', type: 'pdf', date: '2024-09-01' }], announcements: [{ id: '1', title: 'Exam postponed', message: 'The midterm has been moved to Nov 15.', date: '2024-11-01' }] } },
          { id: 'y1s1m2', name: 'Physics 1', code: 'PHY101', professor: 'Dr. Curie', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y1s1m3', name: 'Intro to Programming', code: 'CS101', professor: 'Prof. Knuth', credits: 4, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y1s1m4', name: 'English Communication', code: 'ENG101', professor: 'Ms. Austen', credits: 2, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
        ],
      },
      {
        id: 's2', name: 'Semester 2', label: 'S2', status: 'completed',
        subjects: [
          { id: 'y1s2m1', name: 'Data Structures', code: 'CS201', professor: 'Dr. Dijkstra', credits: 4, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y1s2m2', name: 'Mathematics 2', code: 'MATH201', professor: 'Dr. Euler', credits: 4, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y1s2m3', name: 'Probability & Statistics', code: 'STAT201', professor: 'Prof. Bayes', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y1s2m4', name: 'Web Development Basics', code: 'WEB201', professor: 'Prof. Berners', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
        ],
      },
    ],
  },
  {
    id: 'y2', name: 'Year 2', label: 'L2', status: 'current',
    semesters: [
      {
        id: 's3', name: 'Semester 3', label: 'S3', status: 'current',
        subjects: [
          {
            id: 'y2s3m1', name: 'Advanced Algorithms', code: 'CS301', professor: 'Dr. Turing', credits: 4, hasNew: true,
            materials: {
              lectures: [
                { id: 'l1', title: 'Chapter 1 - Complexity Analysis', type: 'slides', date: '2025-09-09' },
                { id: 'l2', title: 'Chapter 2 - Sorting Algorithms', type: 'slides', date: '2025-09-16' },
                { id: 'l3', title: 'Chapter 3 - Graph Theory', type: 'slides', date: '2025-09-23', isNew: true },
                { id: 'l4', title: 'Chapter 3 - Recording', type: 'video', date: '2025-09-23', isNew: true },
              ],
              td: [
                { id: 'td1', title: 'TD 1 - Big-O Notation', type: 'exercise', date: '2025-09-11' },
                { id: 'td2', title: 'TD 2 - Sorting Problems', type: 'exercise', date: '2025-09-18' },
                { id: 'td3', title: 'TD 3 - Graph Traversal', type: 'exercise', date: '2025-09-25', isNew: true },
              ],
              exams: [
                { id: 'e1', title: 'Midterm Exam - Nov 2025', type: 'pdf', date: '2025-11-20' },
              ],
              materials: [
                { id: 'm1', title: 'Algorithm Cheat Sheet', type: 'pdf', date: '2025-09-01' },
                { id: 'm2', title: 'CLRS Reference', type: 'pdf', date: '2025-09-01' },
              ],
              announcements: [
                { id: 'a1', title: 'Final Exam Date Confirmed', message: 'The final exam is scheduled for February 25, 2026, in Room A101 at 09:00.', date: '2026-01-15', isNew: true },
              ],
            },
          },
          {
            id: 'y2s3m2', name: 'Neural Networks', code: 'AI301', professor: 'Prof. Lovelace', credits: 4, hasNew: true,
            materials: {
              lectures: [
                { id: 'l1', title: 'Chapter 1 - Perceptrons', type: 'slides', date: '2025-09-10' },
                { id: 'l2', title: 'Chapter 2 - Backpropagation', type: 'slides', date: '2025-09-17' },
                { id: 'l3', title: 'Chapter 8 - CNNs', type: 'slides', date: '2026-01-20', isNew: true },
              ],
              td: [{ id: 'td1', title: 'TD 1 - XOR Problem', type: 'exercise', date: '2025-09-12' }],
              exams: [],
              materials: [{ id: 'm1', title: 'Python ML Environment Setup', type: 'pdf', date: '2025-09-01' }],
              announcements: [{ id: 'a1', title: 'New slides uploaded', message: 'Chapter 8 slides on CNNs are now available.', date: '2026-01-20', isNew: true }],
            },
          },
          { id: 'y2s3m3', name: 'Digital Ethics', code: 'ETH301', professor: 'Master Sokrates', credits: 2, materials: { lectures: [{ id: 'l1', title: 'Lecture 1 - AI & Society', type: 'pdf', date: '2025-09-09' }], td: [], exams: [{ id: 'e1', title: 'Final Exam - Feb 2026', type: 'pdf', date: '2026-02-10' }], materials: [], announcements: [] } },
          { id: 'y2s3m4', name: 'Operating Systems', code: 'CS302', professor: 'Prof. GNU', credits: 4, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y2s3m5', name: 'Software Engineering', code: 'CS303', professor: 'Dr. Brooks', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
        ],
      },
      {
        id: 's4', name: 'Semester 4', label: 'S4', status: 'upcoming',
        subjects: [
          { id: 'y2s4m1', name: 'Machine Learning', code: 'AI401', professor: 'Prof. Hinton', credits: 4, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y2s4m2', name: 'Computer Networks', code: 'NET401', professor: 'Dr. Cerf', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y2s4m3', name: 'Database Systems', code: 'DB401', professor: 'Prof. Codd', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
          { id: 'y2s4m4', name: 'Mobile Development', code: 'MOB401', professor: 'Prof. Swift', credits: 3, materials: { lectures: [], td: [], exams: [], materials: [], announcements: [] } },
        ],
      },
    ],
  },
];

const TAB_CONFIG = [
  { id: 'lectures', label: 'Lectures', icon: Video },
  { id: 'td', label: 'TD / Tutorials', icon: BookOpen },
  { id: 'exams', label: 'Exams', icon: FileText },
  { id: 'materials', label: 'Materials', icon: Package },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'summarize', label: 'Summarize ✨', icon: Sparkles },
] as const;

type SubjectTab = typeof TAB_CONFIG[number]['id'];

const FILE_TYPE_ICONS = {
  pdf: FileText,
  video: Video,
  slides: Package,
  exercise: BookOpen,
};

function TypeBadge({ type }: { type: Material['type'] }) {
  const colors: Record<string, string> = {
    pdf: 'bg-destructive/10 text-destructive border-destructive/20',
    video: 'bg-primary/10 text-primary border-primary/20',
    slides: 'bg-secondary/10 text-secondary border-secondary/20',
    exercise: 'bg-success/10 text-success border-success/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${colors[type]}`}>{type}</span>
  );
}

// ===================== SUMMARIZE TAB =====================

type LearningGoal = 'exam_prep' | 'understand' | 'quick_review' | 'deep_dive';

const GOAL_CONFIG: Record<LearningGoal, { label: string; description: string; icon: typeof Brain; color: string }> = {
  exam_prep:    { label: 'Préparer l\'examen', description: 'Résumés ciblés + exercices type examen', icon: Target, color: 'text-destructive' },
  understand:   { label: 'Comprendre le cours', description: 'Explications détaillées + exemples', icon: Brain, color: 'text-primary' },
  quick_review: { label: 'Révision rapide', description: 'Points clés et flashcards essentiels', icon: Zap, color: 'text-warning' },
  deep_dive:    { label: 'Approfondir', description: 'Contenu étendu + ressources avancées', icon: BookMarked, color: 'text-success' },
};

interface Chapter {
  id: string;
  title: string;
}

interface GeneratedNode {
  type: 'summary' | 'quiz' | 'flashcard' | 'exercise';
  title: string;
  content: string;
  done?: boolean;
}

function SummarizeTab({ subject }: { subject: Subject }) {
  const chapters: Chapter[] = subject.materials.lectures.map((l, i) => ({ id: l.id, title: l.title }));

  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [goal, setGoal] = useState<LearningGoal>('exam_prep');
  const [includeQuiz, setIncludeQuiz] = useState(true);
  const [generated, setGenerated] = useState(false);
  const [nodes, setNodes] = useState<GeneratedNode[]>([]);
  const [doneNodes, setDoneNodes] = useState<Set<number>>(new Set());

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = chapters.length > 0 && selectedChapters.size === chapters.length;
  const toggleAll = () => setSelectedChapters(allSelected ? new Set() : new Set(chapters.map(c => c.id)));

  const handleGenerate = () => {
    const selected = chapters.filter(c => selectedChapters.has(c.id));
    const path: GeneratedNode[] = [];
    selected.forEach((ch, i) => {
      path.push({ type: 'summary', title: `Summary — ${ch.title}`, content: `Key concepts from "${ch.title}" will be summarized here with the main ideas, formulas, and examples.` });
      if (includeQuiz && (goal === 'exam_prep' || goal === 'understand' || i % 2 === 0)) {
        path.push({ type: 'quiz', title: `Quiz — ${ch.title}`, content: 'Test your understanding with 5 multiple-choice questions based on this chapter.' });
      }
      if (goal === 'deep_dive') {
        path.push({ type: 'flashcard', title: `Flashcards — ${ch.title}`, content: '10 flashcards covering key terms and definitions from this chapter.' });
      }
      if (goal === 'exam_prep') {
        path.push({ type: 'exercise', title: `Exam Exercises — ${ch.title}`, content: 'Practice problems in the style of past exam questions for this chapter.' });
      }
    });
    setNodes(path);
    setGenerated(true);
    setDoneNodes(new Set());
  };

  const toggleDone = (i: number) => setDoneNodes(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  const NODE_TYPE_CONFIG: Record<GeneratedNode['type'], { icon: typeof Brain; color: string; bg: string; label: string }> = {
    summary:   { icon: BookMarked, color: 'text-primary',    bg: 'bg-primary/10 border-primary/20',    label: 'Summary' },
    quiz:      { icon: Brain,      color: 'text-warning',    bg: 'bg-warning/10 border-warning/20',    label: 'Quiz' },
    flashcard: { icon: Zap,        color: 'text-success',    bg: 'bg-success/10 border-success/20',    label: 'Flashcards' },
    exercise:  { icon: Target,     color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'Exercises' },
  };

  if (generated) {
    const progress = doneNodes.size;
    const total = nodes.length;
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <p className="font-black text-sm flex items-center gap-2"><Sparkles size={14} className="text-primary" /> AI Learning Path</p>
            <p className="text-muted-foreground text-xs font-bold mt-0.5">{progress}/{total} completed · {selectedChapters.size} chapter{selectedChapters.size > 1 ? 's' : ''} · {GOAL_CONFIG[goal].label}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }} />
            </div>
            <button
              onClick={() => setGenerated(false)}
              className="text-xs font-black text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 glass-card rounded-lg"
            >
              ← Edit
            </button>
          </div>
        </div>

        {/* Duolingo-style path */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-border" />
          <div className="space-y-4">
            {nodes.map((node, i) => {
              const cfg = NODE_TYPE_CONFIG[node.type];
              const Icon = cfg.icon;
              const isDone = doneNodes.has(i);
              const isUnlocked = i === 0 || doneNodes.has(i - 1);
              return (
                <div key={i} className={`flex gap-4 items-start transition-all ${!isUnlocked ? 'opacity-40' : ''}`}>
                  {/* Icon circle */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    isDone ? 'bg-success/20 border-success' : isUnlocked ? `${cfg.bg} border-transparent` : 'glass-card border-border'
                  }`}>
                    {isDone ? <CheckSquare size={22} className="text-success" /> : <Icon size={22} className={cfg.color} />}
                  </div>
                  {/* Card */}
                  <div className={`flex-1 glass-card p-4 rounded-xl ${isDone ? 'border-success/30 bg-success/5' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                          <p className="font-black text-sm">{node.title}</p>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1.5">{node.content}</p>
                      </div>
                      <button
                        onClick={() => isUnlocked && toggleDone(i)}
                        disabled={!isUnlocked}
                        className={`shrink-0 px-3 py-1.5 rounded-lg font-black text-xs transition-all ${
                          isDone
                            ? 'bg-success/20 text-success border border-success/30'
                            : isUnlocked
                            ? 'gradient-primary text-primary-foreground shadow-sm hover:opacity-90'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {isDone ? '✓ Done' : isUnlocked ? 'Start' : '🔒'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {progress === total && total > 0 && (
          <div className="glass-card p-6 rounded-2xl text-center border-success/30 bg-success/5">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-black text-lg text-success">Path Complete!</p>
            <p className="text-muted-foreground text-sm mt-1">You've completed all modules. Great job!</p>
          </div>
        )}
      </div>
    );
  }

  // Configuration screen
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="glass-card p-5 rounded-2xl border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-sm text-primary">AI Learning Path Generator</p>
            <p className="text-muted-foreground text-xs mt-1">
              Sélectionnez les chapitres, votre objectif et l'IA générera un parcours d'apprentissage Duolingo-style avec résumés, quiz et exercices.
            </p>
          </div>
        </div>
      </div>

      {/* Chapter selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-sm uppercase tracking-wider text-muted-foreground">1. Chapitres</p>
          <button onClick={toggleAll} className="text-xs font-black text-primary hover:underline">
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        </div>
        {chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground glass-card rounded-xl">
            <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
            <p className="font-bold text-sm">No lectures available for this subject</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {chapters.map(ch => {
              const sel = selectedChapters.has(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => toggleChapter(ch.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                    sel ? 'border-primary bg-primary/10' : 'glass-card hover:border-primary/30'
                  }`}
                >
                  {sel ? <CheckSquare size={16} className="text-primary shrink-0" /> : <Square size={16} className="text-muted-foreground shrink-0" />}
                  <span className={`text-sm font-bold ${sel ? 'text-primary' : ''} truncate`}>{ch.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal selection */}
      <div>
        <p className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-3">2. Objectif</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(GOAL_CONFIG) as [LearningGoal, typeof GOAL_CONFIG[LearningGoal]][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setGoal(key)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  goal === key ? 'border-primary bg-primary/10' : 'glass-card hover:border-primary/30'
                }`}
              >
                <Icon size={18} className={`mb-2 ${goal === key ? 'text-primary' : cfg.color}`} />
                <p className={`font-black text-xs ${goal === key ? 'text-primary' : ''}`}>{cfg.label}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{cfg.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz toggle */}
      <div>
        <p className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-3">3. Options</p>
        <button
          onClick={() => setIncludeQuiz(v => !v)}
          className={`flex items-center gap-3 p-4 rounded-xl transition-all border w-full text-left ${
            includeQuiz ? 'border-primary bg-primary/10' : 'glass-card hover:border-primary/30'
          }`}
        >
          {includeQuiz ? <CheckSquare size={18} className="text-primary shrink-0" /> : <Square size={18} className="text-muted-foreground shrink-0" />}
          <div>
            <p className={`font-black text-sm ${includeQuiz ? 'text-primary' : ''}`}>Inclure des Quiz</p>
            <p className="text-muted-foreground text-xs">Des questions interactives après chaque section</p>
          </div>
        </button>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={selectedChapters.size === 0}
        className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
          selectedChapters.size > 0
            ? 'gradient-primary text-primary-foreground shadow-lg hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Sparkles size={16} />
        Générer mon parcours ({selectedChapters.size} chapitre{selectedChapters.size > 1 ? 's' : ''})
      </button>
    </div>
  );
}

function SubjectPage({ subject, onBack }: { subject: Subject; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<SubjectTab>('lectures');
  const [search, setSearch] = useState('');

  const currentMaterials = activeTab !== 'summarize' && activeTab !== 'announcements'
    ? (subject.materials as any)[activeTab] || []
    : [];
  const filtered = search
    ? currentMaterials.filter((m: any) => m.title?.toLowerCase().includes(search.toLowerCase()))
    : currentMaterials;

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-sm">
        <ChevronLeft size={16} /> Back to Courses
      </button>

      {/* Header */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-black bg-primary/10 text-primary border border-primary/20 rounded">{subject.code}</span>
              {subject.hasNew && <span className="px-2 py-0.5 text-[10px] font-black bg-success/10 text-success border border-success/20 rounded uppercase">New Content</span>}
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter">{subject.name}</h2>
            <p className="text-muted-foreground font-bold text-sm mt-1">{subject.professor}</p>
          </div>
          <div className="flex gap-3">
            <div className="glass-card px-3 py-2 rounded-xl text-center">
              <p className="font-black text-lg">{subject.credits}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — responsive grid that never overflows */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {TAB_CONFIG.map(tab => {
          const Icon = tab.icon;
          const count = (subject.materials as any)[tab.id]?.length || 0;
          const hasNew = tab.id !== 'announcements'
            ? ((subject.materials as any)[tab.id] || []).some((m: any) => m.isNew)
            : subject.materials.announcements.some(a => a.isNew);
          const isSummarize = tab.id === 'summarize';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl font-black text-[11px] transition-all relative ${
                activeTab === tab.id
                  ? isSummarize
                    ? 'bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'gradient-primary text-primary-foreground shadow-md'
                  : isSummarize
                    ? 'glass-card text-primary border-primary/30 border-dashed hover:border-primary/60'
                    : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={15} />
              <span className="whitespace-nowrap leading-none">{tab.label}</span>
              {count > 0 && !isSummarize && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>{count}</span>
              )}
              {hasNew && <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Search — hide for summarize & announcements */}
      {activeTab !== 'announcements' && activeTab !== 'summarize' && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search in this section..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl text-sm" />
        </div>
      )}

      {/* Content */}
      {activeTab === 'summarize' ? (
        <SummarizeTab subject={subject} />
      ) : (
        <div className="space-y-2">
          {activeTab === 'announcements' ? (
            subject.materials.announcements.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Megaphone size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">No announcements</p>
              </div>
            ) : (
              subject.materials.announcements.map(a => (
                <div key={a.id} className={`glass-card p-4 rounded-xl border-l-4 ${a.isNew ? 'border-l-primary' : 'border-l-border'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-sm">{a.title}</p>
                    {a.isNew && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded">NEW</span>}
                  </div>
                  <p className="text-muted-foreground text-sm">{a.message}</p>
                  <p className="text-muted-foreground text-[10px] font-bold mt-2">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              ))
            )
          ) : (
            (filtered as Material[]).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">No content available</p>
              </div>
            ) : (
              (filtered as Material[]).map(item => {
                const Icon = FILE_TYPE_ICONS[item.type] || FileText;
                return (
                  <button key={item.id} className="w-full glass-card p-4 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-all text-left group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm truncate">{item.title}</p>
                        {item.isNew && <span className="px-1.5 py-0.5 bg-success/10 text-success text-[10px] font-black rounded shrink-0">NEW</span>}
                      </div>
                      <p className="text-muted-foreground text-xs font-bold mt-0.5">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <TypeBadge type={item.type} />
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </button>
                );
              })
            )
          )}
        </div>
      )}
    </div>
  );
}

export function UniCoursesView() {
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(ACADEMIC_DATA[1]); // Year 2 by default
  const [selectedSemester, setSelectedSemester] = useState<Semester>(ACADEMIC_DATA[1].semesters[0]); // S3 by default
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleYearChange = (year: AcademicYear) => {
    setSelectedYear(year);
    setSelectedSemester(year.semesters[0]);
    setSelectedSubject(null);
  };

  const handleSemesterChange = (semester: Semester) => {
    setSelectedSemester(semester);
    setSelectedSubject(null);
  };

  if (selectedSubject) {
    return (
      <div className="animate-fade-in">
        <SubjectPage subject={selectedSubject} onBack={() => setSelectedSubject(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">UNIVERSITY COURSES</h2>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">Your academic curriculum</p>
      </div>

      {/* Academic Year Tabs */}
      <div className="flex gap-2 flex-wrap">
        {ACADEMIC_DATA.map(year => (
          <button
            key={year.id}
            onClick={() => handleYearChange(year)}
            className={`px-5 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              selectedYear.id === year.id
                ? 'gradient-primary text-primary-foreground shadow-lg'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {year.name}
            <span className={`px-1.5 py-0.5 text-[10px] rounded font-black ${
              year.status === 'current'
                ? selectedYear.id === year.id ? 'bg-primary-foreground/20' : 'bg-success/20 text-success'
                : selectedYear.id === year.id ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground'
            }`}>
              {year.status === 'current' ? 'Current' : 'Completed'}
            </span>
          </button>
        ))}
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-2 flex-wrap">
        {selectedYear.semesters.map(sem => (
          <button
            key={sem.id}
            onClick={() => handleSemesterChange(sem)}
            className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              selectedSemester.id === sem.id
                ? 'bg-card border-2 border-primary text-primary'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {sem.name}
            <span className={`w-2 h-2 rounded-full ${
              sem.status === 'current' ? 'bg-success' :
              sem.status === 'upcoming' ? 'bg-warning' : 'bg-muted-foreground'
            }`} />
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${
          selectedSemester.status === 'current' ? 'bg-success animate-pulse' :
          selectedSemester.status === 'upcoming' ? 'bg-warning' : 'bg-muted-foreground'
        }`} />
        <span className="font-bold text-sm">
          {selectedSemester.status === 'current' ? 'Currently enrolled — semester in progress' :
           selectedSemester.status === 'upcoming' ? 'Upcoming — semester starts next term' :
           'Completed semester'}
        </span>
        <span className="ml-auto text-muted-foreground font-bold text-xs">{selectedSemester.subjects.length} subjects</span>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedSemester.subjects.map(subject => (
          <button
            key={subject.id}
            onClick={() => selectedSemester.status !== 'upcoming' ? setSelectedSubject(subject) : undefined}
            className={`glass-card p-5 rounded-2xl text-left transition-all relative overflow-hidden ${
              selectedSemester.status !== 'upcoming'
                ? 'hover:scale-[1.02] hover:border-primary/30 cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            {subject.hasNew && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-success/10 border border-success/30 text-success text-[10px] font-black rounded uppercase">
                New
              </span>
            )}
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-3">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <h4 className="font-black text-base leading-tight mb-1 pr-12">{subject.name}</h4>
            <p className="text-muted-foreground text-xs font-bold mb-3">{subject.code} · {subject.professor}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users size={12} /> {subject.credits} credits
              </span>
              {selectedSemester.status !== 'upcoming' && (
                <span className="flex items-center gap-1 text-primary font-black">
                  Open <ChevronRight size={14} />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
