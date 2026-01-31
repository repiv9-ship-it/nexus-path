import { useState } from 'react';
import { X, ArrowLeft, Play, Heart, Scroll, CheckCircle } from 'lucide-react';
import { XPBar } from '@/components/ui/xp-bar';
import { Button } from '@/components/ui/button';

interface Level {
  id: number;
  title: string;
  type: 'text' | 'video' | 'quiz';
  xp: number;
  status: string;
}

interface LevelContentProps {
  level: Level;
  onBack: () => void;
}

export function LevelContent({ level, onBack }: LevelContentProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [health, setHealth] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (level.type === 'quiz') {
    const questions = [
      { q: 'Which data structure is best for a LIFO approach?', options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'], correct: 1 },
      { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
      { q: 'Which algorithm is used for finding shortest paths?', options: ['Merge Sort', 'Quick Sort', 'Dijkstra', 'DFS'], correct: 2 },
    ];

    const handleAnswer = (index: number) => {
      setSelectedAnswer(index);
      setTimeout(() => {
        if (index !== questions[quizStep].correct) {
          setHealth((h) => Math.max(0, h - 1));
        }
        setQuizStep((s) => Math.min(s + 1, questions.length));
        setSelectedAnswer(null);
      }, 1000);
    };

    if (quizStep >= questions.length) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-center py-20">
          <div className="w-24 h-24 mx-auto gradient-primary rounded-3xl flex items-center justify-center glow-primary">
            <CheckCircle size={48} className="text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-black italic">Quest Complete!</h2>
          <p className="text-muted-foreground font-bold">You earned {level.xp} XP</p>
          <Button onClick={onBack} className="gradient-primary font-black rounded-2xl px-8 py-6">
            Continue
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-12">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X size={24} />
          </button>
          <div className="flex-1 mx-8">
            <XPBar progress={(quizStep / questions.length) * 100} color="from-warning to-destructive" />
          </div>
          <div className="flex gap-1 text-destructive">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={20} fill={i < health ? 'currentColor' : 'none'} />
            ))}
          </div>
        </div>

        <div className="glass-card p-10 rounded-4xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-destructive to-warning" />
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-2xl flex items-center justify-center animate-bounce-subtle">
            <span className="text-4xl">👹</span>
          </div>
          <h2 className="text-2xl font-black italic">BOSS QUESTION #{quizStep + 1}</h2>
          <p className="text-xl text-foreground font-medium italic">{questions[quizStep].q}</p>

          <div className="grid gap-4 mt-8">
            {questions[quizStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-2xl border-2 font-bold text-left transition-all active:scale-95 ${
                  selectedAnswer === i
                    ? i === questions[quizStep].correct
                      ? 'border-success bg-success/10'
                      : 'border-destructive bg-destructive/10'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <span className="inline-block w-8 h-8 bg-muted rounded-lg text-center leading-8 mr-4">
                  {i + 1}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Video or Text Content
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-black text-muted-foreground hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={20} /> EXIT LESSON
      </button>

      {level.type === 'video' ? (
        <div className="space-y-6">
          <div className="aspect-video bg-sidebar rounded-4xl shadow-2xl flex items-center justify-center relative group overflow-hidden border-8 border-card">
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent" />
            <Play size={80} className="text-sidebar-foreground fill-sidebar-foreground cursor-pointer hover:scale-110 transition-transform z-10" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div>
                <p className="text-primary font-black text-xs uppercase tracking-widest">Video Oracle</p>
                <h3 className="text-sidebar-foreground text-2xl font-black italic">{level.title}</h3>
              </div>
              <div className="bg-sidebar-foreground/20 backdrop-blur-md px-4 py-2 rounded-xl text-sidebar-foreground font-bold">
                12:45
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 rounded-4xl space-y-8 relative">
          <div className="absolute top-10 right-10 text-primary/10">
            <Scroll size={120} />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">{level.title}</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p className="text-xl font-bold text-primary">Chapter 1: The Foundation</p>
            <p>
              Algorithms are the spells of the modern world. To master the art of the Architect, 
              one must first understand the flow of data through the circuits of logic...
            </p>
            <div className="bg-primary/5 p-6 rounded-2xl border-l-8 border-primary font-medium italic">
              "Efficiency is not just about speed; it's about the elegance of the resource path."
            </div>
            <p>
              Every algorithm tells a story. Some are tales of conquest—divide and conquer. 
              Others are journeys of exploration—depth-first search through the unknown.
            </p>
          </div>
          <Button
            onClick={onBack}
            className="w-full gradient-primary text-primary-foreground py-6 rounded-2xl font-black text-xl shadow-xl"
          >
            COMPLETE SCROLL
          </Button>
        </div>
      )}
    </div>
  );
}
