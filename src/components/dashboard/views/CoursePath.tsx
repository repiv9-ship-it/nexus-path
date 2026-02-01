import { ArrowLeft, Skull, Play, FileText } from "lucide-react";

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
];

const iconByType = {
  text: FileText,
  video: Play,
  quiz: Skull,
};

export function CoursePath({ course, onSelectLevel, onBack }: CoursePathProps) {
  return (
    <div className="max-w-sm mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black uppercase tracking-tight">
          {course.title}
        </h2>
        <div className="w-12 h-12" />
      </div>

      {/* Path */}
      <div className="relative flex flex-col items-center gap-14">
        {levels.map((lvl, i) => {
          const Icon = iconByType[lvl.type];
          const offset = i % 2 === 0 ? "-translate-x-14" : "translate-x-14";

          return (
            <div key={lvl.id} className={`relative ${offset}`}>
              {/* Connector */}
              {i !== levels.length - 1 && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 h-16 w-[2px] bg-gray-200 rounded-full" />
              )}

              {/* Boss label */}
              {lvl.boss && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse">
                  BOSS!
                </span>
              )}

              {/* Node */}
              <button
                disabled={lvl.status === "locked"}
                onClick={() => onSelectLevel(lvl)}
                className={`
                  w-20 h-20 rounded-3xl flex items-center justify-center
                  border-b-[8px] transition-all active:scale-90
                  ${
                    lvl.status === "completed"
                      ? "bg-indigo-600 border-indigo-800 text-white"
                      : lvl.status === "active"
                      ? "bg-white border-gray-300 text-indigo-600 shadow-xl"
                      : "bg-gray-200 border-gray-300 text-gray-400"
                  }
                `}
              >
                <Icon size={32} />
              </button>

              {/* Title */}
              <p className="mt-3 text-center text-[10px] font-black uppercase tracking-tight">
                {lvl.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
