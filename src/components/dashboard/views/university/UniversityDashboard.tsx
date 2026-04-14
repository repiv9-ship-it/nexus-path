import { useState } from 'react';
import { Building2, Users, BookOpen, GraduationCap, ChevronRight, Plus, Settings, Calendar, DollarSign, ClipboardList, UserCheck, FileText, Bell, Clock, BarChart3, Eye, CheckCircle, Search, Mail, Send, ChevronLeft, Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useProfiles, useSubjects, useSemesters, useAcademicYears, useAllDocumentRequests, useAllCertificationRequests, useStudentPayments, useExamSchedule, useScheduleEntries, useAllAttendance, useAllMarks, useProfessors } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UniversityDashboardProps {
  activeSection?: string;
}

const STATUS_COLORS: Record<string, string> = {
  en_attente: 'bg-warning/10 text-warning border-warning/30',
  en_cours: 'bg-primary/10 text-primary border-primary/30',
  traite: 'bg-success/10 text-success border-success/30',
  rejete: 'bg-destructive/10 text-destructive border-destructive/30',
  approuve: 'bg-success/10 text-success border-success/30',
  envoye: 'bg-primary/10 text-primary border-primary/30',
};

export function UniversityDashboard({ activeSection = 'overview' }: UniversityDashboardProps) {
  const { user } = useAuth();
  const { data: profiles } = useProfiles(user?.university || undefined);
  const { data: subjects } = useSubjects();
  const { data: semesters } = useSemesters();
  const { data: academicYears } = useAcademicYears();
  const { data: docRequests } = useAllDocumentRequests();
  const { data: certRequests } = useAllCertificationRequests();
  const { data: professors } = useProfessors();
  const { data: allAttendance } = useAllAttendance();
  const { data: allMarks } = useAllMarks();

  const currentSemester = semesters?.find((s: any) => s.is_current);
  const { data: examSchedule } = useExamSchedule(currentSemester?.id);
  const { data: scheduleEntries } = useScheduleEntries(currentSemester?.id);

  const totalStudents = (profiles || []).length;
  const totalProfs = (professors || []).length;
  const pendingDocs = (docRequests || []).filter((d: any) => d.status === 'en_attente').length;

  // ═══════════ OVERVIEW ═══════════
  if (activeSection === 'overview' || activeSection === 'university') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Administration</h2>
          <p className="text-muted-foreground text-sm mt-1">University overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: totalStudents, icon: Users, color: 'text-primary' },
            { label: 'Professors', value: totalProfs, icon: GraduationCap, color: 'text-secondary' },
            { label: 'Subjects', value: (subjects || []).length, icon: BookOpen, color: 'text-success' },
            { label: 'Pending Requests', value: pendingDocs, icon: FileText, color: 'text-warning' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><Building2 size={14} className="text-primary" /> Academic Years</h3>
            {(academicYears || []).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No academic years configured</p>
            ) : (
              (academicYears || []).map((year: any) => (
                <div key={year.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">
                    {year.is_current ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-xs">{year.name}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {(semesters || []).filter((s: any) => s.academic_year_id === year.id).length} semesters
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2"><FileText size={14} className="text-warning" /> Pending Requests</h3>
            {(docRequests || []).filter((d: any) => d.status === 'en_attente').length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No pending requests</p>
            ) : (
              (docRequests || []).filter((d: any) => d.status === 'en_attente').slice(0, 5).map((doc: any) => (
                <div key={doc.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs">{doc.request_type.replace(/_/g, ' ')}</p>
                    <p className="text-muted-foreground text-[10px]">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status]}`}>{doc.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ STUDENTS ═══════════
  if (activeSection === 'uni_students') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Students</h2>
        {(profiles || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Users size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No students enrolled</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Level</th>
              </tr></thead>
              <tbody>
                {(profiles || []).map((p: any) => (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="px-4 py-3 font-bold">{p.first_name} {p.last_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3"><span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary">{p.level || 'L1'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ═══════════ PROFESSORS ═══════════
  if (activeSection === 'uni_professors') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Professors</h2>
        {(professors || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <GraduationCap size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">No professors registered</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(professors || []).map((prof: any) => (
              <div key={prof.id} className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black">{prof.name?.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="font-black text-sm">{prof.name}</p>
                    {prof.department && <p className="text-muted-foreground text-xs">{prof.department}</p>}
                  </div>
                </div>
                {prof.email && <p className="text-xs text-muted-foreground">{prof.email}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ DOCUMENTS ═══════════
  if (activeSection === 'uni_documents') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Document Requests</h2>
        {(docRequests || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><FileText size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No requests</p></div>
        ) : (
          <div className="space-y-3">
            {(docRequests || []).map((doc: any) => (
              <div key={doc.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">{doc.request_type.replace(/_/g, ' ')}</p>
                  {doc.subjects?.name && <p className="text-muted-foreground text-xs">{doc.subjects.name}</p>}
                  <p className="text-muted-foreground text-[10px]">{new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status] || ''}`}>{doc.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ CERTIFICATIONS ═══════════
  if (activeSection === 'uni_certifications') {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">Certification Requests</h2>
        {(certRequests || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><Award size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No certification requests</p></div>
        ) : (
          <div className="space-y-3">
            {(certRequests || []).map((cert: any) => (
              <div key={cert.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">{cert.certification_name}</p>
                  <p className="text-muted-foreground text-xs">{cert.request_type} · {new Date(cert.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLORS[cert.status] || ''}`}>{cert.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ GENERIC SECTIONS ═══════════
  const sectionConfig: Record<string, { title: string; icon: typeof Users }> = {
    uni_classes: { title: 'Classes', icon: Building2 },
    uni_finance: { title: 'Finance', icon: DollarSign },
    uni_announcements: { title: 'Announcements', icon: Bell },
    uni_exams: { title: 'Exams', icon: ClipboardList },
    uni_stages: { title: 'Internships', icon: Building2 },
    uni_reports: { title: 'Reports', icon: BarChart3 },
    uni_salaries: { title: 'Salaries', icon: DollarSign },
    uni_modules: { title: 'Module Settings', icon: Settings },
    uni_employees: { title: 'Staff', icon: Users },
  };

  const cfg = sectionConfig[activeSection || ''];
  if (cfg) {
    return (
      <div className="space-y-5 animate-fade-in">
        <h2 className="text-2xl font-black tracking-tight">{cfg.title}</h2>
        <div className="text-center py-16 glass-card rounded-2xl">
          <cfg.icon size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <p className="font-bold text-muted-foreground text-lg">Coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">Data will appear here once added to the system</p>
        </div>
      </div>
    );
  }

  return null;
}
