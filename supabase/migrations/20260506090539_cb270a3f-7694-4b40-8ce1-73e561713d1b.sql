
-- ═══ Foreign keys for PostgREST joins ═══
DO $$ BEGIN
  ALTER TABLE public.university_invitations
    ADD CONSTRAINT university_invitations_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.university_invitations
    ADD CONSTRAINT university_invitations_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.university_members
    ADD CONSTRAINT university_members_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.class_members
    ADD CONSTRAINT class_members_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.classes
    ADD CONSTRAINT classes_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.classes
    ADD CONSTRAINT classes_academic_year_id_fkey
    FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.semesters
    ADD CONSTRAINT semesters_academic_year_id_fkey
    FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.subjects
    ADD CONSTRAINT subjects_semester_id_fkey
    FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.subjects
    ADD CONSTRAINT subjects_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.subjects
    ADD CONSTRAINT subjects_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.schedule_entries
    ADD CONSTRAINT schedule_entries_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.schedule_entries
    ADD CONSTRAINT schedule_entries_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.schedule_entries
    ADD CONSTRAINT schedule_entries_semester_id_fkey
    FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.exam_schedule
    ADD CONSTRAINT exam_schedule_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.exam_schedule
    ADD CONSTRAINT exam_schedule_semester_id_fkey
    FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.marks
    ADD CONSTRAINT marks_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.attendance
    ADD CONSTRAINT attendance_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.announcements
    ADD CONSTRAINT announcements_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.announcements
    ADD CONSTRAINT announcements_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.course_materials
    ADD CONSTRAINT course_materials_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.course_materials
    ADD CONSTRAINT course_materials_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.meetings
    ADD CONSTRAINT meetings_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.professor_salaries
    ADD CONSTRAINT professor_salaries_professor_id_fkey
    FOREIGN KEY (professor_id) REFERENCES public.professors(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.professors
    ADD CONSTRAINT professors_university_id_fkey
    FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══ Auto-link invitations to existing user on insert ═══
CREATE OR REPLACE FUNCTION public.autolink_invitation_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.invited_user_id IS NULL AND NEW.invited_email IS NOT NULL THEN
    SELECT user_id INTO NEW.invited_user_id
    FROM public.profiles
    WHERE lower(email) = lower(NEW.invited_email)
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_autolink_invitation_user ON public.university_invitations;
CREATE TRIGGER trg_autolink_invitation_user
  BEFORE INSERT ON public.university_invitations
  FOR EACH ROW EXECUTE FUNCTION public.autolink_invitation_user();

DROP TRIGGER IF EXISTS trg_notify_invitation ON public.university_invitations;
CREATE TRIGGER trg_notify_invitation
  AFTER INSERT ON public.university_invitations
  FOR EACH ROW EXECUTE FUNCTION public.notify_invitation();

-- handle_new_user: attach to existing invitations on signup
DROP TRIGGER IF EXISTS trg_link_invitations_on_signup ON public.profiles;
CREATE TRIGGER trg_link_invitations_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.link_invitations_on_signup();

-- ═══ RLS: Super admin can manage user_roles & profiles platform-wide ═══
DROP POLICY IF EXISTS "Super admins manage all roles" ON public.user_roles;
CREATE POLICY "Super admins manage all roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins view all profiles" ON public.profiles;
CREATE POLICY "Super admins view all profiles" ON public.profiles
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- Allow professors and admins to view profiles of users in their university
DROP POLICY IF EXISTS "Workspace members view own university profiles" ON public.profiles;
CREATE POLICY "Workspace members view own university profiles" ON public.profiles
  FOR SELECT USING (
    university_id IS NOT NULL AND is_university_member(university_id)
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'professor'))
  );

-- Allow super admin to view all university memberships
DROP POLICY IF EXISTS "Super admin views all memberships" ON public.university_members;
CREATE POLICY "Super admin views all memberships" ON public.university_members
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'));
