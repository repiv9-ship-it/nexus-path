
-- 1) Add university_id columns where missing
ALTER TABLE public.subjects          ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.schedule_entries  ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.schedule_entries  ADD COLUMN IF NOT EXISTS class_id uuid;
ALTER TABLE public.exam_schedule     ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.professors        ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.internships       ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.student_payments  ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.marks             ADD COLUMN IF NOT EXISTS university_id uuid;
ALTER TABLE public.attendance        ADD COLUMN IF NOT EXISTS university_id uuid;

-- 2) Backfill from related rows
UPDATE public.subjects s
SET university_id = c.university_id
FROM public.classes c
WHERE s.class_id = c.id AND s.university_id IS NULL;

UPDATE public.schedule_entries se
SET university_id = sub.university_id
FROM public.subjects sub
WHERE se.subject_id = sub.id AND se.university_id IS NULL;

UPDATE public.exam_schedule e
SET university_id = sub.university_id
FROM public.subjects sub
WHERE e.subject_id = sub.id AND e.university_id IS NULL;

UPDATE public.marks m
SET university_id = sub.university_id
FROM public.subjects sub
WHERE m.subject_id = sub.id AND m.university_id IS NULL;

UPDATE public.attendance a
SET university_id = sub.university_id
FROM public.subjects sub
WHERE a.subject_id = sub.id AND a.university_id IS NULL;

UPDATE public.student_payments sp
SET university_id = p.university_id
FROM public.profiles p
WHERE sp.student_id = p.user_id AND sp.university_id IS NULL;

-- If only one active university exists, default unattributed rows to it
DO $$
DECLARE
  uni uuid;
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.universities;
  IF cnt = 1 THEN
    SELECT id INTO uni FROM public.universities LIMIT 1;
    UPDATE public.subjects         SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.schedule_entries SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.exam_schedule    SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.professors       SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.internships      SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.student_payments SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.marks            SET university_id = uni WHERE university_id IS NULL;
    UPDATE public.attendance       SET university_id = uni WHERE university_id IS NULL;
  END IF;
END $$;

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_subjects_university          ON public.subjects(university_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_university  ON public.schedule_entries(university_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_class       ON public.schedule_entries(class_id);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_university     ON public.exam_schedule(university_id);
CREATE INDEX IF NOT EXISTS idx_professors_university        ON public.professors(university_id);
CREATE INDEX IF NOT EXISTS idx_internships_university       ON public.internships(university_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_university  ON public.student_payments(university_id);
CREATE INDEX IF NOT EXISTS idx_marks_university             ON public.marks(university_id);
CREATE INDEX IF NOT EXISTS idx_attendance_university        ON public.attendance(university_id);

-- 4) Helper function: is user member of given university?
CREATE OR REPLACE FUNCTION public.is_university_member(_uni uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND university_id = _uni
  );
$$;

-- 5) Allow university admins to see profiles of their own university, super admins to see all
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage own university profiles"
  ON public.profiles FOR ALL
  USING (
    (has_role(auth.uid(), 'admin') AND public.is_university_member(university_id))
    OR has_role(auth.uid(), 'super_admin')
  );

-- 6) Tighten universities: admins see only their own
DROP POLICY IF EXISTS "Admins view own university" ON public.universities;
CREATE POLICY "Admins view own university"
  ON public.universities FOR SELECT
  USING (
    has_role(auth.uid(), 'admin') AND public.is_university_member(id)
  );

-- 7) Allow admins to update their own university record
CREATE POLICY "Admins update own university"
  ON public.universities FOR UPDATE
  USING (has_role(auth.uid(), 'admin') AND public.is_university_member(id));

-- 8) Allow university members to insert announcements only for their university (admins/professors)
DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements"
  ON public.announcements FOR ALL
  USING (
    has_role(auth.uid(), 'super_admin') OR
    ((has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'professor'))
      AND (university_id IS NULL OR public.is_university_member(university_id)))
  );

-- 9) RPC: bulk invite by emails
CREATE OR REPLACE FUNCTION public.bulk_invite_to_university(
  _university_id uuid, _emails text[], _role text DEFAULT 'student',
  _class_id uuid DEFAULT NULL, _message text DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted int := 0;
  e text;
BEGIN
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  FOREACH e IN ARRAY _emails LOOP
    IF e IS NULL OR length(trim(e)) = 0 THEN CONTINUE; END IF;
    INSERT INTO public.university_invitations
      (university_id, invited_email, role, class_id, message, invited_by)
    VALUES (_university_id, lower(trim(e)), _role, _class_id, _message, auth.uid());
    inserted := inserted + 1;
  END LOOP;
  RETURN inserted;
END;
$$;

-- 10) RPC: admin grants/revokes role within their university
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  _target_user uuid, _role app_role, _grant boolean DEFAULT true
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_uni uuid;
  target_uni uuid;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT university_id INTO caller_uni FROM public.profiles WHERE user_id = auth.uid();
  SELECT university_id INTO target_uni FROM public.profiles WHERE user_id = _target_user;

  IF NOT has_role(auth.uid(), 'super_admin') THEN
    IF caller_uni IS NULL OR caller_uni IS DISTINCT FROM target_uni THEN
      RAISE EXCEPTION 'Target user not in your university';
    END IF;
    -- Admins cannot grant super_admin
    IF _role = 'super_admin' THEN
      RAISE EXCEPTION 'Cannot grant super_admin';
    END IF;
  END IF;

  IF _grant THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_target_user, _role)
    ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _target_user AND role = _role;
  END IF;
END;
$$;
