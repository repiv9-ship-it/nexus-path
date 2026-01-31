import { useState } from 'react';
import { Building2, Users, BookOpen, TrendingUp, GraduationCap, Award, ChevronRight, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XPBar } from '@/components/ui/xp-bar';
import { FIELDS, LEVELS, MOCK_STUDENTS } from '@/lib/constants';

interface Department {
  id: string;
  name: string;
  students: number;
  professors: number;
  courses: number;
  avgCompletion: number;
}

const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science', students: 450, professors: 12, courses: 28, avgCompletion: 78 },
  { id: '2', name: 'Mathematics', students: 280, professors: 8, courses: 18, avgCompletion: 82 },
  { id: '3', name: 'Engineering', students: 520, professors: 15, courses: 35, avgCompletion: 71 },
  { id: '4', name: 'Business', students: 380, professors: 10, courses: 22, avgCompletion: 85 },
];

const mockProfessors = [
  { id: '1', name: 'Dr. Alan Turing', department: 'Computer Science', courses: 3, students: 245, rating: 4.9 },
  { id: '2', name: 'Prof. Ada Lovelace', department: 'Computer Science', courses: 2, students: 189, rating: 4.8 },
  { id: '3', name: 'Dr. Isaac Newton', department: 'Mathematics', courses: 4, students: 312, rating: 4.7 },
];

export function UniversityDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'professors' | 'students'>('overview');

  const totalStudents = mockDepartments.reduce((acc, d) => acc + d.students, 0);
  const totalProfessors = mockDepartments.reduce((acc, d) => acc + d.professors, 0);
  const totalCourses = mockDepartments.reduce((acc, d) => acc + d.courses, 0);
  const avgCompletion = Math.round(mockDepartments.reduce((acc, d) => acc + d.avgCompletion, 0) / mockDepartments.length);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none">CONTROL TOWER</h2>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-2">
            University Administration
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold">
            <Settings size={18} className="mr-2" /> Settings
          </Button>
          <Button className="gradient-primary font-black rounded-xl px-6 shadow-xl">
            <Plus size={18} className="mr-2" /> Invite Staff
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-2xl w-fit">
        {['overview', 'departments', 'professors', 'students'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-6 py-3 rounded-xl font-black uppercase text-sm transition-all ${
              activeTab === tab 
                ? 'gradient-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-primary', change: '+156' },
              { label: 'Total Professors', value: totalProfessors, icon: GraduationCap, color: 'text-secondary', change: '+3' },
              { label: 'Active Courses', value: totalCourses, icon: BookOpen, color: 'text-success', change: '+8' },
              { label: 'Avg. Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: 'text-warning', change: '+4%' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center">
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <span className="text-xs font-black text-success">{stat.change}</span>
                </div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-muted-foreground font-bold text-xs uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Performance by Level */}
          <div className="glass-card p-8 rounded-4xl">
            <h3 className="text-2xl font-black italic mb-6">Performance by Level</h3>
            <div className="grid grid-cols-6 gap-6">
              {LEVELS.map((level, i) => {
                const completion = 90 - (i * 10);
                return (
                  <div key={level} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${completion * 2.51} 251`}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--secondary))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black">{completion}%</span>
                      </div>
                    </div>
                    <p className="font-black">{level}</p>
                    <p className="text-xs text-muted-foreground font-bold">{Math.round(totalStudents / 6)} students</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departments Quick View */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-black italic">Departments</h3>
              <Button variant="ghost" onClick={() => setActiveTab('departments')} className="font-bold">
                View All <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-black text-xs uppercase tracking-widest text-muted-foreground">
              <span>Department</span>
              <span>Students</span>
              <span>Courses</span>
              <span>Completion</span>
            </div>
            {mockDepartments.slice(0, 3).map((dept) => (
              <div key={dept.id} className="grid grid-cols-4 gap-4 p-4 border-t border-border items-center hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">
                    {dept.name.charAt(0)}
                  </div>
                  <span className="font-black">{dept.name}</span>
                </div>
                <span className="font-bold">{dept.students}</span>
                <span className="font-bold">{dept.courses}</span>
                <div className="flex items-center gap-2">
                  <XPBar progress={dept.avgCompletion} size="sm" className="flex-1" />
                  <span className="font-black text-primary">{dept.avgCompletion}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic">All Departments</h3>
            <Button className="gradient-primary font-black rounded-xl">
              <Plus size={18} className="mr-2" /> Add Department
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDepartments.map((dept) => (
              <div key={dept.id} className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl">
                    {dept.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic">{dept.name}</h4>
                    <p className="text-muted-foreground font-bold text-sm">{dept.professors} Professors</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-xl">
                    <p className="text-2xl font-black text-primary">{dept.students}</p>
                    <p className="text-xs font-bold text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-xl">
                    <p className="text-2xl font-black text-secondary">{dept.courses}</p>
                    <p className="text-xs font-bold text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-xl">
                    <p className="text-2xl font-black text-success">{dept.avgCompletion}%</p>
                    <p className="text-xs font-bold text-muted-foreground">Completion</p>
                  </div>
                </div>

                <XPBar progress={dept.avgCompletion} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'professors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic">Professors</h3>
            <Button className="gradient-primary font-black rounded-xl">
              <Plus size={18} className="mr-2" /> Invite Professor
            </Button>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-black text-xs uppercase tracking-widest text-muted-foreground">
              <span className="col-span-2">Professor</span>
              <span>Courses</span>
              <span>Students</span>
              <span>Rating</span>
            </div>
            {mockProfessors.map((prof) => (
              <div key={prof.id} className="grid grid-cols-5 gap-4 p-4 border-t border-border items-center hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black">
                    {prof.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-black">{prof.name}</p>
                    <p className="text-xs text-muted-foreground font-bold">{prof.department}</p>
                  </div>
                </div>
                <span className="font-black text-primary">{prof.courses}</span>
                <span className="font-bold">{prof.students}</span>
                <div className="flex items-center gap-1 font-black text-warning">
                  ⭐ {prof.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic">Students</h3>
            <div className="flex gap-3">
              <select className="h-10 px-4 rounded-xl border border-input bg-background font-bold text-sm">
                <option>All Levels</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select className="h-10 px-4 rounded-xl border border-input bg-background font-bold text-sm">
                <option>All Fields</option>
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-black text-xs uppercase tracking-widest text-muted-foreground">
              <span className="col-span-2">Student</span>
              <span>Level</span>
              <span>XP</span>
              <span>Progress</span>
              <span>Streak</span>
            </div>
            {MOCK_STUDENTS.map((student) => (
              <div key={student.id} className="grid grid-cols-6 gap-4 p-4 border-t border-border items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
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
        </div>
      )}
    </div>
  );
}
