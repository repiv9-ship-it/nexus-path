import { useRef, useEffect, useState } from "react";
import { ArrowLeft, Play, FileText, Skull, Gem } from "lucide-react";

interface Level {
  id: number;
  title: string;
  type: 'text' | 'video' | 'quiz';
  xp: number;
  status: 'completed' | 'active' | 'locked';
  boss?: boolean;
}

interface Course {
  id: string;
  title: string;
  progress: number;
}

interface CoursePathProps {
  course: Course;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const levels: Level[] = [
  { id: 1, title: "The First Scroll", type: "text", xp: 100, status: "completed" },
  { id: 2, title: "Binary Oracles", type: "video", xp: 150, status: "active" },
  { id: 3, title: "The Mid-Term Boss", type: "quiz", xp: 1000, status: "active", boss: true },
  { id: 4, title: "Graph Secrets", type: "text", xp: 200, status: "locked" },
  { id: 5, title: "Recursive Loops", type: "video", xp: 250, status: "locked" },
];

const iconByType = {
  text: FileText,
  video: Play,
  quiz: Skull,
};

// Generate random particles for background
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 4,
}));

export function CoursePath({ course, onSelectLevel, onBack }: CoursePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<{ d: string; isLit: boolean }[]>([]);

  // Find the last unlocked level index (completed or active)
  const lastUnlockedIndex = levels.reduce((lastIdx, lvl, idx) => {
    return lvl.status !== 'locked' ? idx : lastIdx;
  }, 0);

  useEffect(() => {
    const calculatePaths = () => {
      if (!containerRef.current) return;

      const newPaths: { d: string; isLit: boolean }[] = [];

      // Draw ALL paths, but mark which ones are lit
      for (let i = 0; i < levels.length - 1; i++) {
        const a = nodeRefs.current[i];
        const b = nodeRefs.current[i + 1];
        if (!a || !b) continue;

        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x1 = rectA.left + rectA.width / 2 - containerRect.left;
        const y1 = rectA.top + rectA.height / 2 - containerRect.top;
        const x2 = rectB.left + rectB.width / 2 - containerRect.left;
        const y2 = rectB.top + rectB.height / 2 - containerRect.top;

        const dx = Math.abs(x2 - x1) * 0.6;

        const d = `
          M ${x1} ${y1}
          C ${x1} ${y1 + dx},
            ${x2} ${y2 - dx},
            ${x2} ${y2}
        `;

        // Path is lit only if it connects two unlocked levels
        const isLit = i < lastUnlockedIndex;
        newPaths.push({ d, isLit });
      }

      setPaths(newPaths);
    };

    // Calculate after a brief delay to ensure DOM is ready
    const timer = setTimeout(calculatePaths, 100);
    window.addEventListener('resize', calculatePaths);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePaths);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen py-8 sm:py-12 overflow-hidden -mx-4 sm:-mx-8 lg:-mx-12 -mt-4 sm:-mt-8 lg:-mt-12 px-2 sm:px-4
                 bg-gradient-to-b from-[#1B1E3C] via-[#24285A] to-[#2F3470] dark:from-[#0f1029] dark:via-[#151838] dark:to-[#1a1f4a]"
    >
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between mb-8 sm:mb-12 lg:mb-16 max-w-sm mx-auto px-2">
        <button
          onClick={onBack}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-black uppercase tracking-tight text-sm sm:text-lg text-white text-center flex-1 mx-2">
          {course.title}
        </h2>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-amber-400">
          <Gem size={16} fill="currentColor" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="pathGradientLit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C83FF" />
            <stop offset="100%" stopColor="#A5B4FF" />
          </linearGradient>
          <linearGradient id="pathGradientDim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4B4F6A" />
            <stop offset="100%" stopColor="#3D405C" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((path, i) => (
          <g key={i}>
            {path.isLit ? (
              <>
                {/* Base glow path - lit */}
                <path
                  d={path.d}
                  fill="none"
                  stroke="url(#pathGradientLit)"
                  strokeWidth="4"
                  filter="url(#glow)"
                  opacity="0.5"
                />
                {/* Animated flowing path - lit */}
                <path
                  d={path.d}
                  fill="none"
                  stroke="url(#pathGradientLit)"
                  strokeWidth="3"
                  strokeDasharray="12 8"
                  filter="url(#glow)"
                  style={{
                    animation: `flowPath 2s linear infinite`,
                  }}
                />
              </>
            ) : (
              /* Dimmed path for locked sections */
              <path
                d={path.d}
                fill="none"
                stroke="url(#pathGradientDim)"
                strokeWidth="3"
                strokeDasharray="8 6"
                opacity="0.4"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Nodes */}
      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 lg:gap-28 pb-8 sm:pb-12">
        {levels.map((lvl, i) => {
          const Icon = iconByType[lvl.type];
          // Smaller offset on mobile
          const side = i % 2 === 0 
            ? "-translate-x-12 sm:-translate-x-20 lg:-translate-x-32" 
            : "translate-x-12 sm:translate-x-20 lg:translate-x-32";

          return (
            <div
              key={lvl.id}
              ref={(el) => (nodeRefs.current[i] = el)}
              className={`relative ${side}`}
            >
              {/* Boss badge */}
              {lvl.boss && (
                <span className="absolute -top-7 sm:-top-9 left-1/2 -translate-x-1/2
                                 bg-red-500 text-white text-[9px] sm:text-[10px]
                                 font-black px-2 sm:px-3 py-1 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                  BOSS!
                </span>
              )}

              {/* Node button */}
              <button
                onClick={() => onSelectLevel(lvl)}
                disabled={lvl.status === "locked"}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center
                  shadow-xl backdrop-blur transition-all duration-300 active:scale-90 border-b-4 sm:border-b-[6px]
                  ${
                    lvl.status === "completed"
                      ? "bg-indigo-500 border-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/60 hover:shadow-2xl hover:scale-105"
                      : lvl.status === "active"
                      ? "bg-white border-gray-200 text-indigo-600 shadow-white/20 hover:shadow-indigo-400/50 hover:shadow-2xl hover:scale-105"
                      : "bg-gray-600/50 border-gray-700 text-gray-400 opacity-60 cursor-not-allowed"
                  }
                `}
                style={{
                  transition: 'all 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>

              {/* Title */}
              <p className={`mt-2 sm:mt-3 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-tight max-w-[80px] sm:max-w-[100px] ${
                lvl.status === "locked" ? "text-indigo-300/50" : "text-indigo-100"
              }`}>
                {lvl.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
