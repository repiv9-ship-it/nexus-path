import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// ═══════════ Generic fetch hook ═══════════
function useQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ═══════════ Notifications ═══════════
export function useNotifications() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

export function useMarkNotificationRead() {
  return async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };
}

// ═══════════ Academic Structure ═══════════
export function useAcademicYears() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  });
}

export function useSemesters(academicYearId?: string) {
  return useQuery(async () => {
    let q = supabase.from('semesters').select('*').order('number', { ascending: true });
    if (academicYearId) q = q.eq('academic_year_id', academicYearId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [academicYearId]);
}

export function useSubjects(semesterId?: string) {
  return useQuery(async () => {
    let q = supabase.from('subjects').select('*').order('name', { ascending: true });
    if (semesterId) q = q.eq('semester_id', semesterId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [semesterId]);
}

// ═══════════ Marks ═══════════
export function useMarks() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('marks')
      .select('*, subjects(name, code, module_group, credits, semester_id)')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Attendance ═══════════
export function useAttendance() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('attendance')
      .select('*, subjects(name, code)')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Schedule ═══════════
export function useScheduleEntries(semesterId?: string) {
  return useQuery(async () => {
    let q = supabase.from('schedule_entries').select('*, subjects(name, code)').order('day_of_week').order('start_time');
    if (semesterId) q = q.eq('semester_id', semesterId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [semesterId]);
}

export function useExamSchedule(semesterId?: string) {
  return useQuery(async () => {
    let q = supabase.from('exam_schedule').select('*, subjects(name, code)').order('exam_date');
    if (semesterId) q = q.eq('semester_id', semesterId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [semesterId]);
}

// ═══════════ Professors ═══════════
export function useProfessors() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  });
}

// ═══════════ Universities ═══════════
export function useUniversities() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  });
}

export function useUniversity(id?: string) {
  return useQuery(async () => {
    if (!id) return null;
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }, [id]);
}

// ═══════════ Internships ═══════════
export function useInternships() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export function useInternshipApplications() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('internship_applications')
      .select('*, internships(*)')
      .eq('user_id', user.id);
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Document Requests ═══════════
export function useDocumentRequests() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('document_requests')
      .select('*, subjects(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Certification Requests ═══════════
export function useCertificationRequests() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('certification_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Support Tickets ═══════════
export function useSupportTickets() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ Student Payments ═══════════
export function useStudentPayments(studentId?: string) {
  return useQuery(async () => {
    let q = supabase.from('student_payments').select('*').order('created_at', { ascending: false });
    if (studentId) q = q.eq('student_id', studentId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [studentId]);
}

// ═══════════ Course Submissions ═══════════
export function useCourseSubmissions(status?: string) {
  return useQuery(async () => {
    let q = supabase.from('course_submissions').select('*, universities(name)').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [status]);
}

// ═══════════ Platform CMS ═══════════
export function usePlatformBanners() {
  return useQuery(async () => {
    const { data, error } = await supabase.from('platform_banners').select('*').order('position');
    if (error) throw error;
    return data || [];
  });
}

export function usePlatformDiscounts() {
  return useQuery(async () => {
    const { data, error } = await supabase.from('platform_discounts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export function usePlatformPayouts() {
  return useQuery(async () => {
    const { data, error } = await supabase.from('platform_payouts').select('*, universities(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

// ═══════════ All Support Tickets (Admin) ═══════════
export function useAllSupportTickets() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*, universities(name), ticket_replies(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

// ═══════════ Profiles (Admin) ═══════════
export function useProfiles(universityId?: string) {
  return useQuery(async () => {
    let q = supabase.from('profiles').select('*, user_roles(role)').order('first_name');
    if (universityId) q = q.eq('university_id', universityId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

// ═══════════ Exam Results (Admin) ═══════════
export function useExamResults(examId?: string) {
  return useQuery(async () => {
    let q = supabase.from('exam_results').select('*').order('created_at', { ascending: false });
    if (examId) q = q.eq('exam_id', examId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [examId]);
}

// ═══════════ All Document Requests (Admin) ═══════════
export function useAllDocumentRequests() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('document_requests')
      .select('*, subjects(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

// ═══════════ All Certification Requests (Admin) ═══════════
export function useAllCertificationRequests() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('certification_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

// ═══════════ All Attendance (Admin/Prof) ═══════════ 
export function useAllAttendance(subjectId?: string) {
  return useQuery(async () => {
    let q = supabase.from('attendance').select('*, subjects(name, code)').order('session_date', { ascending: false });
    if (subjectId) q = q.eq('subject_id', subjectId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [subjectId]);
}

// ═══════════ All Marks (Admin/Prof) ═══════════
export function useAllMarks(subjectId?: string) {
  return useQuery(async () => {
    let q = supabase.from('marks').select('*, subjects(name, code)').order('date', { ascending: false });
    if (subjectId) q = q.eq('subject_id', subjectId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [subjectId]);
}

// ═══════════ Classes ═══════════
export function useClasses(universityId?: string) {
  return useQuery(async () => {
    let q = supabase.from('classes').select('*').order('name');
    if (universityId) q = q.eq('university_id', universityId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

export function useClassMembers(classId?: string) {
  return useQuery(async () => {
    if (!classId) return [];
    const { data, error } = await supabase
      .from('class_members')
      .select('*')
      .eq('class_id', classId);
    if (error) throw error;
    return data || [];
  }, [classId]);
}

// ═══════════ University Invitations ═══════════
export function useMyInvitations() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('university_invitations')
      .select('*, universities(name, logo_url), classes(name, level)')
      .or(`invited_user_id.eq.${user.id},invited_email.eq.${user.email}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id, user?.email]);
}

export function useUniversityInvitations(universityId?: string) {
  return useQuery(async () => {
    let q = supabase.from('university_invitations').select('*, classes(name, level)').order('created_at', { ascending: false });
    if (universityId) q = q.eq('university_id', universityId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

// ═══════════ Announcements ═══════════
export function useAnnouncements(universityId?: string) {
  return useQuery(async () => {
    let q = supabase.from('announcements').select('*, classes(name)').order('created_at', { ascending: false }).limit(50);
    if (universityId) q = q.eq('university_id', universityId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

// ═══════════ Professor Salaries ═══════════
export function useMySalaries() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('professor_salaries')
      .select('*')
      .eq('user_id', user.id)
      .order('period', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

export function useAllSalaries(universityId?: string) {
  return useQuery(async () => {
    let q = supabase.from('professor_salaries').select('*, professors(name, email)').order('period', { ascending: false });
    if (universityId) q = q.eq('university_id', universityId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

// ═══════════ University Modules ═══════════
export function useUniversityModules(universityId?: string) {
  return useQuery(async () => {
    if (!universityId) return [];
    const { data, error } = await supabase
      .from('university_modules')
      .select('*')
      .eq('university_id', universityId);
    if (error) throw error;
    return data || [];
  }, [universityId]);
}

// ═══════════ Search Events ═══════════
export async function logSearchEvent(opts: { query?: string; category?: string; courseId?: string; eventType?: 'search' | 'click' | 'enroll' }) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('search_events').insert({
    user_id: user?.id || null,
    query: opts.query || null,
    category: opts.category || null,
    course_id: opts.courseId || null,
    event_type: opts.eventType || 'search',
  });
}

export function useMySearchHistory() {
  const { user } = useAuth();
  return useQuery(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('search_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return data || [];
  }, [user?.id]);
}

// ═══════════ All Profiles with roles (Super Admin) ═══════════
export function useAllUsers() {
  return useQuery(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}
