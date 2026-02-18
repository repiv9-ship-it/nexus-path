import { useState } from 'react';
import { Users, Briefcase, BookOpen, Mail, Clock, MapPin, MessageSquare, Upload, CheckCircle, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ===================== DATA =====================
interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  subjects: string[];
  officeHours: string;
  officeLocation: string;
  avatar: string;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  deadline: string;
  description: string;
  tags: string[];
  applied?: boolean;
  applicationStatus?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

interface AttendanceRecord {
  subject: string;
  total: number;
  present: number;
  justified: number;
  unjustified: number;
  threshold: number;
}

const PROFESSORS: Professor[] = [
  { id: 'p1', name: 'Dr. Alan Turing', title: 'Associate Professor', department: 'Computer Science', email: 'turing@university.edu', subjects: ['Advanced Algorithms', 'Computational Theory'], officeHours: 'Mon & Wed 14:00–16:00', officeLocation: 'Building B, Room 201', avatar: 'AT' },
  { id: 'p2', name: 'Prof. Ada Lovelace', title: 'Professor', department: 'AI & Machine Learning', email: 'lovelace@university.edu', subjects: ['Neural Networks', 'Deep Learning'], officeHours: 'Tue & Thu 10:00–12:00', officeLocation: 'Building A, Room 305', avatar: 'AL' },
  { id: 'p3', name: 'Master Sokrates', title: 'Lecturer', department: 'Humanities', email: 'sokrates@university.edu', subjects: ['Digital Ethics', 'Philosophy of Technology'], officeHours: 'Fri 09:00–12:00', officeLocation: 'Building C, Room 102', avatar: 'SK' },
  { id: 'p4', name: 'Prof. GNU Linux', title: 'Associate Professor', department: 'Systems Engineering', email: 'gnu@university.edu', subjects: ['Operating Systems', 'Systems Programming'], officeHours: 'Mon & Wed 16:00–18:00', officeLocation: 'Building B, Room 404', avatar: 'GL' },
  { id: 'p5', name: 'Dr. Fred Brooks', title: 'Senior Lecturer', department: 'Software Engineering', email: 'brooks@university.edu', subjects: ['Software Engineering', 'Project Management'], officeHours: 'Thu 13:00–15:00', officeLocation: 'Building D, Room 201', avatar: 'FB' },
];

const INTERNSHIPS: Internship[] = [
  {
    id: 'i1', title: 'Software Engineering Intern', company: 'TechCorp', location: 'Paris, France', duration: '6 months', deadline: '2026-03-15', description: 'Join our engineering team to work on scalable backend systems using Go and Kubernetes. Ideal for students with strong CS fundamentals.', tags: ['Backend', 'Go', 'Cloud'], applied: true, applicationStatus: 'pending',
  },
  {
    id: 'i2', title: 'Data Science Intern', company: 'StartupXYZ', location: 'Remote', duration: '3 months', deadline: '2026-02-28', description: 'Work on real-world ML projects, analyze large datasets, and build predictive models with Python and TensorFlow.', tags: ['Python', 'ML', 'Data'], applied: false,
  },
  {
    id: 'i3', title: 'Mobile Dev Intern', company: 'AppFactory', location: 'Lyon, France', duration: '4 months', deadline: '2026-03-01', description: 'Build cross-platform mobile apps using React Native and TypeScript. Great opportunity to launch a product used by thousands.', tags: ['React Native', 'TypeScript', 'Mobile'], applied: false,
  },
  {
    id: 'i4', title: 'Research Intern', company: 'CNRS Institute', location: 'Bordeaux, France', duration: '6 months', deadline: '2026-04-01', description: 'Contribute to cutting-edge research in computer vision and natural language processing. Co-authorship opportunity on publications.', tags: ['Research', 'CV', 'NLP'], applied: false,
  },
];

const ATTENDANCE: AttendanceRecord[] = [
  { subject: 'Advanced Algorithms', total: 12, present: 11, justified: 0, unjustified: 1, threshold: 3 },
  { subject: 'Neural Networks', total: 10, present: 9, justified: 1, unjustified: 0, threshold: 3 },
  { subject: 'Digital Ethics', total: 8, present: 8, justified: 0, unjustified: 0, threshold: 2 },
  { subject: 'Operating Systems', total: 12, present: 10, justified: 1, unjustified: 1, threshold: 3 },
  { subject: 'Software Engineering', total: 6, present: 6, justified: 0, unjustified: 0, threshold: 2 },
];

// ===================== SUB-COMPONENTS =====================

function ProfessorsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROFESSORS.map(prof => (
        <div key={prof.id} className="glass-card p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/30 transition-all">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black shrink-0">
              {prof.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm leading-tight truncate">{prof.name}</p>
              <p className="text-primary text-[11px] font-bold">{prof.title}</p>
              <p className="text-muted-foreground text-[11px] font-bold">{prof.department}</p>
            </div>
          </div>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1">
            {prof.subjects.map(s => (
              <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-black">{s}</span>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs text-muted-foreground font-bold">
            <div className="flex items-start gap-2">
              <Mail size={12} className="shrink-0 mt-0.5 text-primary" />
              <span className="truncate">{prof.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={12} className="shrink-0 mt-0.5 text-primary" />
              <span>{prof.officeHours}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={12} className="shrink-0 mt-0.5 text-primary" />
              <span>{prof.officeLocation}</span>
            </div>
          </div>

          {/* Action */}
          <Button variant="outline" size="sm" className="w-full font-black text-xs h-8 mt-auto">
            <MessageSquare size={12} className="mr-1.5" /> Message
          </Button>
        </div>
      ))}
    </div>
  );
}

function InternshipsTab() {
  const [applications, setApplications] = useState<Record<string, { applied: boolean; status: Internship['applicationStatus'] }>>(
    Object.fromEntries(INTERNSHIPS.map(i => [i.id, { applied: i.applied || false, status: i.applicationStatus }]))
  );

  const handleApply = (id: string) => {
    setApplications(prev => ({ ...prev, [id]: { applied: true, status: 'pending' } }));
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Under Review', color: 'text-warning bg-warning/10 border-warning/20' },
    reviewed: { label: 'Reviewed', color: 'text-primary bg-primary/10 border-primary/20' },
    accepted: { label: 'Accepted', color: 'text-success bg-success/10 border-success/20' },
    rejected: { label: 'Rejected', color: 'text-destructive bg-destructive/10 border-destructive/20' },
  };

  return (
    <div className="space-y-4">
      {INTERNSHIPS.map(offer => {
        const appState = applications[offer.id];
        const daysLeft = Math.floor((new Date(offer.deadline).getTime() - new Date('2026-02-17').getTime()) / (1000 * 60 * 60 * 24));

        return (
          <div key={offer.id} className="glass-card p-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-black text-base">{offer.title}</h4>
                  {appState.applied && appState.status && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${STATUS_CONFIG[appState.status].color}`}>
                      {STATUS_CONFIG[appState.status].label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs font-bold text-muted-foreground mb-3">
                  <span className="font-black text-foreground">{offer.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {offer.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {offer.duration}</span>
                </div>
                <p className="text-muted-foreground text-sm">{offer.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {offer.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-muted rounded text-[10px] font-black">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <p className={`text-xs font-bold ${daysLeft <= 3 ? 'text-destructive' : daysLeft <= 7 ? 'text-warning' : 'text-muted-foreground'}`}>
                    Deadline: {new Date(offer.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className={`text-[10px] font-black ${daysLeft <= 3 ? 'text-destructive' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                    {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                  </p>
                </div>
                {appState.applied ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-black">
                      <Upload size={12} className="mr-1" /> CV
                    </Button>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 rounded-lg">
                      <CheckCircle size={12} className="text-success" />
                      <span className="text-success text-xs font-black">Applied</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-black">
                      <Upload size={12} className="mr-1" /> CV
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs font-black gradient-primary"
                      onClick={() => handleApply(offer.id)}
                      disabled={daysLeft <= 0}
                    >
                      Apply <ExternalLink size={12} className="ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AttendanceTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {ATTENDANCE.map(record => {
        const absentPct = ((record.unjustified) / record.total) * 100;
        const isWarning = record.unjustified >= record.threshold;
        const isAlmostWarning = record.unjustified === record.threshold - 1;
        const presentPct = (record.present / record.total) * 100;

        return (
          <div key={record.subject} className={`glass-card rounded-xl overflow-hidden ${isWarning ? 'border-destructive/40' : ''}`}>
            <button
              onClick={() => setExpanded(expanded === record.subject ? null : record.subject)}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isWarning ? 'bg-destructive/10' : isAlmostWarning ? 'bg-warning/10' : 'bg-success/10'
                }`}>
                  {isWarning ? (
                    <AlertTriangle size={18} className="text-destructive" />
                  ) : (
                    <CheckCircle size={18} className={isAlmostWarning ? 'text-warning' : 'text-success'} />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-black text-sm">{record.subject}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isWarning && (
                      <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-black rounded">
                        ⚠️ Threshold reached
                      </span>
                    )}
                    {isAlmostWarning && !isWarning && (
                      <span className="px-1.5 py-0.5 bg-warning/10 text-warning border border-warning/20 text-[10px] font-black rounded">
                        Near limit
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-black text-sm">{record.present}/{record.total}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Sessions</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${isWarning ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {record.unjustified} unjust.
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold">/ {record.threshold} limit</p>
                </div>
                {expanded === record.subject ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </button>

            {expanded === record.subject && (
              <div className="border-t border-border px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="glass-card p-3 rounded-xl text-center">
                    <p className="font-black text-lg">{record.total}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Total</p>
                  </div>
                  <div className="glass-card p-3 rounded-xl text-center">
                    <p className="font-black text-lg text-success">{record.present}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Present</p>
                  </div>
                  <div className="glass-card p-3 rounded-xl text-center">
                    <p className="font-black text-lg text-warning">{record.justified}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Justified</p>
                  </div>
                  <div className={`glass-card p-3 rounded-xl text-center ${isWarning ? 'border-destructive/30' : ''}`}>
                    <p className={`font-black text-lg ${isWarning ? 'text-destructive' : 'text-muted-foreground'}`}>{record.unjustified}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Unjustified</p>
                  </div>
                </div>

                {/* Attendance bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className={presentPct >= 80 ? 'text-success' : presentPct >= 60 ? 'text-warning' : 'text-destructive'}>
                      {presentPct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${presentPct >= 80 ? 'bg-success' : presentPct >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                      style={{ width: `${presentPct}%` }}
                    />
                  </div>
                </div>

                {isWarning && (
                  <div className="mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-destructive text-xs font-black flex items-center gap-2">
                      <AlertTriangle size={12} /> Absence threshold exceeded — you may need to justify your absences
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===================== MAIN COMPONENT =====================

const TABS = [
  { id: 'professors', label: 'Professors Directory', icon: Users },
  { id: 'internships', label: 'Internships', icon: Briefcase },
  { id: 'attendance', label: 'Attendance', icon: BookOpen },
] as const;

type Tab = typeof TABS[number]['id'];

export function AcademicCenterView() {
  const [activeTab, setActiveTab] = useState<Tab>('professors');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">ACADEMIC CENTER</h2>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
          Faculty · Internships · Attendance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all ${
                activeTab === tab.id
                  ? 'gradient-primary text-primary-foreground shadow-lg'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'professors' && <ProfessorsTab />}
      {activeTab === 'internships' && <InternshipsTab />}
      {activeTab === 'attendance' && <AttendanceTab />}
    </div>
  );
}
