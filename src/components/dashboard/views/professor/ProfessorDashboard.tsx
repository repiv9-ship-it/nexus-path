import { useState } from 'react';
import { Plus, Users, BookOpen, TrendingUp, Award, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XPBar } from '@/components/ui/xp-bar';
import { MOCK_PROFESSOR_COURSES, MOCK_STUDENTS } from '@/lib/constants';
import { CourseCreationWizard } from './CourseCreationWizard';
import { StudentAnalytics } from './StudentAnalytics';

export function ProfessorDashboard() {
  const [showWizard, setShowWizard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (showWizard) {
    return <CourseCreationWizard onClose={() => setShowWizard(false)} />;
  }

  if (showAnalytics && selectedCourse) {
    return (
      <StudentAnalytics 
        courseId={selectedCourse} 
        onBack={() => { setShowAnalytics(false); setSelectedCourse(null); }} 
      />
    );
  }

  const totalStudents = MOCK_PROFESSOR_COURSES.reduce((acc, c) => acc + c.students, 0);
  const avgCompletion = Math.round(MOCK_PROFESSOR_COURSES.reduce((acc, c) => acc + c.completion, 0) / MOCK_PROFESSOR_COURSES.length);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none">COMMAND CENTER</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-2">
            Professor Dashboard
          </p>
        </div>
        <Button 
          onClick={() => setShowWizard(true)}
          className="gradient-primary font-black rounded-2xl px-6 py-6 shadow-xl"
        >
          <Plus size={20} className="mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-primary' },
          { label: 'Active Courses', value: MOCK_PROFESSOR_COURSES.filter(c => c.status === 'active').length, icon: BookOpen, color: 'text-success' },
          { label: 'Avg. Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: 'text-warning' },
          { label: 'Badges Awarded', value: 342, icon: Award, color: 'text-secondary' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-muted-foreground font-bold text-xs uppercase">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black italic flex items-center gap-2">
          <BookOpen className="text-primary" /> My Courses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PROFESSOR_COURSES.map((course) => (
            <div 
              key={course.id}
              className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all cursor-pointer group"
              onClick={() => { setSelectedCourse(course.id); setShowAnalytics(true); }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  course.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {course.status}
                </span>
                <BarChart3 size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h4 className="text-xl font-black italic mb-2">{course.title}</h4>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-bold">Students</span>
                  <span className="font-black">{course.students}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-bold">Avg. Score</span>
                  <span className="font-black text-success">{course.avgScore}%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-muted-foreground">Completion</span>
                  <span className="font-black">{course.completion}%</span>
                </div>
                <XPBar progress={course.completion} size="sm" />
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-primary font-black text-sm">
                View Analytics <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Student Activity */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black italic flex items-center gap-2">
          <Users className="text-primary" /> Recent Student Activity
        </h3>
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-black text-xs uppercase tracking-widest text-muted-foreground">
            <span>Student</span>
            <span>Level</span>
            <span>XP</span>
            <span>Progress</span>
            <span>Streak</span>
          </div>
          {MOCK_STUDENTS.slice(0, 5).map((student) => (
            <div key={student.id} className="grid grid-cols-5 gap-4 p-4 border-t border-border items-center hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">
                  {student.avatar}
                </div>
                <div>
                  <p className="font-black text-sm">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <span className="font-bold">{student.level}</span>
              <span className="font-black text-primary">{student.xp.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <XPBar progress={student.progress} size="sm" className="flex-1" />
                <span className="font-bold text-xs">{student.progress}%</span>
              </div>
              <div className="flex items-center gap-1 font-black text-warning">
                🔥 {student.streak}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
