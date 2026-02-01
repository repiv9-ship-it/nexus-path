import { useState } from 'react';
import { X, ArrowLeft, Play, Heart, Scroll, Check, AlertCircle, Trophy, Skull } from 'lucide-react';
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

const quizData = [
  {
    q: "Which data structure is best for a LIFO (Last-In, First-Out) approach?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correct: 1
  },
  {
    q: "What is the time complexity of a Binary Search on a sorted array?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correct: 2
  },
  {
    q: "Which of these is NOT a primitive data type in JavaScript?",
    options: ["String", "Boolean", "Object", "Number"],
    correct: 2
  }
];

export function LevelContent({ level, onBack }: LevelContentProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [health, setHealth] = useState(3);
  const [showFinished, setShowFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    if (selectedOption !== quizData[quizStep].correct) {
      setHealth(h => Math.max(0, h - 1));
    }
  };

  const nextQuestion = () => {
    if (quizStep < quizData.length - 1) {
      setQuizStep(s => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowFinished(true);
    }
  };

  if (level.type === 'quiz') {
    if (showFinished) {
      return (
        <div className="max-w-2xl mx-auto py-20 text-center animate-fade-in">
          <div className="w-32 h-32 bg-warning/20 rounded-4xl flex items-center justify-center text-warning mx-auto mb-8 shadow-2xl rotate-12">
            <Trophy size={64} fill="currentColor" />
          </div>
          <h2 className="text-5xl font-black italic tracking-tighter mb-4">PATH CONQUERED!</h2>
          <p className="text-muted-foreground font-bold text-xl uppercase tracking-widest mb-12">+{level.xp} XP EARNED</p>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-xs font-black text-muted-foreground uppercase">Accuracy</p>
              <p className="text-2xl font-black italic text-primary">100%</p>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-xs font-black text-muted-foreground uppercase">Time</p>
              <p className="text-2xl font-black italic text-primary">1:24s</p>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-xs font-black text-muted-foreground uppercase">Combo</p>
              <p className="text-2xl font-black italic text-primary">MAX</p>
            </div>
          </div>
          <Button onClick={onBack} className="w-full gradient-primary text-primary-foreground py-6 rounded-4xl font-black text-xl shadow-xl">
            RETURN TO MAP
          </Button>
        </div>
      );
    }

    const currentQ = quizData[quizStep];
    
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-12">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X size={24} />
          </button>
          <div className="flex-1 mx-8">
            <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mb-1">
              <span>Progress</span>
              <span>Question {quizStep + 1}/{quizData.length}</span>
            </div>
            <XPBar progress={(quizStep / quizData.length) * 100} color="from-warning to-destructive" />
          </div>
          <div className="flex gap-1 text-destructive">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={20} fill={i < health ? 'currentColor' : 'none'} className={health <= 1 && i === 0 ? 'animate-pulse' : ''} />
            ))}
          </div>
        </div>

        <div className={`glass-card p-10 rounded-4xl space-y-8 relative overflow-hidden transition-all duration-500 ${isAnswered ? (selectedOption === currentQ.correct ? 'border-success/50' : 'border-destructive/50') : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Skull size={20} />
            </div>
            <h2 className="text-xl font-black italic tracking-tight">BOSS CHALLENGE</h2>
          </div>
          
          <p className="text-2xl text-foreground font-black italic leading-tight">{currentQ.q}</p>
          
          <div className="grid gap-4 mt-8">
            {currentQ.options.map((opt, i) => {
              let btnClass = "border-border bg-card hover:border-primary/50 hover:bg-primary/5";
              if (isAnswered) {
                if (i === currentQ.correct) btnClass = "border-success bg-success/10 text-success shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                else if (i === selectedOption) btnClass = "border-destructive bg-destructive/10 text-destructive";
                else btnClass = "opacity-40 border-border";
              } else if (selectedOption === i) {
                btnClass = "border-primary bg-primary/10 shadow-lg";
              }
              return (
                <button 
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(i)}
                  className={`w-full p-6 rounded-2xl border-4 font-black text-left transition-all active:scale-[0.98] flex items-center justify-between ${btnClass}`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${selectedOption === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                  {isAnswered && i === currentQ.correct && <Check size={24} className="text-success" />}
                  {isAnswered && i === selectedOption && i !== currentQ.correct && <AlertCircle size={24} className="text-destructive" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-8">
          {!isAnswered ? (
            <button 
              disabled={selectedOption === null}
              onClick={checkAnswer}
              className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl ${selectedOption !== null ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            >
              CHECK RESPONSE
            </button>
          ) : (
            <div className={`p-6 rounded-3xl flex items-center justify-between animate-fade-in ${selectedOption === currentQ.correct ? 'bg-success/20' : 'bg-destructive/20'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedOption === currentQ.correct ? 'bg-success' : 'bg-destructive'} text-white`}>
                  {selectedOption === currentQ.correct ? <Check size={24} /> : <X size={24} />}
                </div>
                <div>
                  <p className={`font-black italic ${selectedOption === currentQ.correct ? 'text-success' : 'text-destructive'}`}>
                    {selectedOption === currentQ.correct ? 'LEGENDARY ACCURACY!' : 'SHIELD BROKEN!'}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {selectedOption === currentQ.correct ? 'You earned +50 XP' : 'The correct answer was ' + currentQ.options[currentQ.correct]}
                  </p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className={`px-8 py-4 rounded-2xl font-black text-white transition-all shadow-lg ${selectedOption === currentQ.correct ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}`}
              >
                {quizStep < quizData.length - 1 ? 'CONTINUE' : 'FINISH QUEST'}
              </button>
            </div>
          )}
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
