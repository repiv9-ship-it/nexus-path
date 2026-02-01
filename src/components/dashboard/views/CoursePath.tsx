import { ArrowLeft, FileText, Play, Skull, Gem } from "lucide-react";

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

export function CoursePath({ course, onSelectLevel, onBack }: CoursePathProps) {
  return (
    <div className="relative min-h-screen py-12 bg-gradient-to-b from-[#F7F8FF] via-[#F2F4FF] to-[#ECEFFF] -mx-12 -mt-12 px-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-16 max-w-sm mx-auto">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black uppercase tracking-tight text-lg">
          {course.title}
        </h2>
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
          <Gem size={18} fill="currentColor" />
        </div>
      </div>

      {/* Single vertical path line - centered */}
      <div className="absolute left-1/2 top-32 bottom-12 w-[3px] bg-indigo-200/60 rounded-full -translate-x-1/2" />

      {/* Nodes */}
      <div className="relative flex flex-col items-center gap-20 pb-12">
        {levels.map((lvl, i) => {
          const Icon = iconByType[lvl.type];
          const offset = i % 2 === 0 ? "-translate-x-16" : "translate-x-16";

          return (
            <div key={lvl.id} className={`relative ${offset} z-10`}>
              
              {/* Boss badge */}
              {lvl.boss && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg">
                  BOSS!
                </span>
              )}

              {/* Node */}
              <button
                onClick={() => onSelectLevel(lvl)}
                disabled={lvl.status === "locked"}
                className={`
                  w-20 h-20 rounded-3xl flex items-center justify-center
                  shadow-lg transition-all active:scale-90 border-b-[6px]
                  ${
                    lvl.status === "completed"
                      ? "bg-indigo-600 border-indigo-800 text-white"
                      : lvl.status === "active"
                      ? "bg-white border-gray-200 text-indigo-600 shadow-xl"
                      : "bg-gray-200 border-gray-300 text-gray-400 opacity-60"
                  }
                `}
              >
                <Icon size={32} />
              </button>

              {/* Title */}
              <p className={`mt-3 text-center text-[10px] font-black uppercase tracking-tight max-w-[100px] ${
                lvl.status === "locked" ? "text-gray-400" : "text-gray-800"
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
