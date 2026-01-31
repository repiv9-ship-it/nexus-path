import { ArrowLeft, Users, TrendingUp, Award, Clock, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XPBar } from '@/components/ui/xp-bar';
import { MOCK_STUDENTS } from '@/lib/constants';

interface StudentAnalyticsProps {
  courseId: string;
  onBack: () => void;
}

export function StudentAnalytics({ courseId, onBack }: StudentAnalyticsProps) {
  // Mock data for charts
  const weeklyProgress = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 62 },
    { day: 'Wed', value: 58 },
    { day: 'Thu', value: 75 },
    { day: 'Fri', value: 82 },
    { day: 'Sat', value: 40 },
    { day: 'Sun', value: 35 },
  ];

  const completionByModule = [
    { module: 'Intro', completion: 95 },
    { module: 'Basics', completion: 78 },
    { module: 'Advanced', completion: 45 },
    { module: 'Final', completion: 22 },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter">Data Structures</h2>
            <p className="text-muted-foreground font-bold">Student Analytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
          <Button variant="outline" className="rounded-xl font-bold">
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled', value: 156, change: '+12', icon: Users, color: 'text-primary' },
          { label: 'Completion Rate', value: '72%', change: '+5%', icon: TrendingUp, color: 'text-success' },
          { label: 'Avg. Score', value: '85%', change: '+3%', icon: Award, color: 'text-warning' },
          { label: 'Avg. Time', value: '4.2h', change: '-0.5h', icon: Clock, color: 'text-secondary' },
        ].map((metric, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                <metric.icon size={20} className={metric.color} />
              </div>
              <span className={`text-xs font-black ${metric.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {metric.change}
              </span>
            </div>
            <p className={`text-3xl font-black ${metric.color}`}>{metric.value}</p>
            <p className="text-muted-foreground font-bold text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-xl font-black italic mb-6">Weekly Activity</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyProgress.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-t-lg relative" style={{ height: `${day.value}%` }}>
                  <div 
                    className="absolute inset-0 gradient-primary rounded-t-lg opacity-80"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module Completion */}
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-xl font-black italic mb-6">Module Completion</h3>
          <div className="space-y-4">
            {completionByModule.map((module, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{module.module}</span>
                  <span className="font-black text-primary">{module.completion}%</span>
                </div>
                <XPBar progress={module.completion} size="md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Leaderboard */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-black italic">Student Leaderboard</h3>
          <span className="text-sm font-bold text-muted-foreground">Top performers this week</span>
        </div>
        <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-black text-xs uppercase tracking-widest text-muted-foreground">
          <span>Rank</span>
          <span className="col-span-2">Student</span>
          <span>XP Earned</span>
          <span>Progress</span>
          <span>Quiz Avg</span>
        </div>
        {MOCK_STUDENTS.map((student, i) => (
          <div key={student.id} className="grid grid-cols-6 gap-4 p-4 border-t border-border items-center hover:bg-muted/30 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
              i === 0 ? 'bg-warning/20 text-warning' :
              i === 1 ? 'bg-muted text-muted-foreground' :
              i === 2 ? 'bg-warning/10 text-warning/70' :
              'bg-muted/50 text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">
                {student.avatar}
              </div>
              <div>
                <p className="font-black text-sm">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.level}</p>
              </div>
            </div>
            <span className="font-black text-primary">{student.xp.toLocaleString()}</span>
            <div className="flex items-center gap-2">
              <XPBar progress={student.progress} size="sm" className="flex-1" />
              <span className="font-bold text-xs">{student.progress}%</span>
            </div>
            <span className="font-black text-success">
              {Math.round(75 + Math.random() * 20)}%
            </span>
          </div>
        ))}
      </div>

      {/* At-Risk Students Alert */}
      <div className="glass-card p-6 rounded-3xl border-l-8 border-warning">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-black text-lg">3 Students Need Attention</h4>
            <p className="text-muted-foreground font-bold text-sm">
              These students haven't been active in the last 7 days
            </p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
