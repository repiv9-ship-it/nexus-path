
-- ════════ CLASSES (cohorts within a university) ════════
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL,
  academic_year_id UUID,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'L1',
  department TEXT,
  capacity INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admins manage classes" ON public.classes FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_classes_updated BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Class membership for students (via profile)
CREATE TABLE public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- student | professor
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (class_id, user_id, role)
);
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view own membership" ON public.class_members FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'professor'));
CREATE POLICY "Admins manage memberships" ON public.class_members FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- Link subjects → class (optional, currently subjects are per semester)
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS class_id UUID;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS class_code TEXT;

-- ════════ UNIVERSITY INVITATIONS ════════
CREATE TABLE public.university_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL,
  class_id UUID,
  invited_email TEXT NOT NULL,
  invited_user_id UUID,
  role TEXT NOT NULL DEFAULT 'student', -- student | professor | staff
  status TEXT NOT NULL DEFAULT 'pending', -- pending | accepted | declined | expired
  invited_by UUID,
  message TEXT,
  expires_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.university_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invitee can view own invitations" ON public.university_invitations FOR SELECT
  USING (auth.uid() = invited_user_id OR lower(invited_email) = lower(coalesce((auth.jwt()->>'email')::text, '')));
CREATE POLICY "Invitee can respond" ON public.university_invitations FOR UPDATE
  USING (auth.uid() = invited_user_id OR lower(invited_email) = lower(coalesce((auth.jwt()->>'email')::text, '')));
CREATE POLICY "Admins manage invitations" ON public.university_invitations FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_invitations_email ON public.university_invitations (lower(invited_email));
CREATE INDEX idx_invitations_user ON public.university_invitations (invited_user_id);

-- ════════ ANNOUNCEMENTS ════════
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID,
  class_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all', -- all | students | professors | staff | class
  priority TEXT NOT NULL DEFAULT 'normal', -- normal | high | urgent
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view announcements" ON public.announcements FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'professor'));

-- ════════ PROFESSOR SALARIES ════════
CREATE TABLE public.professor_salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID,
  user_id UUID,
  university_id UUID,
  period TEXT NOT NULL, -- '2026-04'
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'TND',
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid
  paid_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.professor_salaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professors view own salary" ON public.professor_salaries FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins manage salaries" ON public.professor_salaries FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- ════════ MODULE VISIBILITY (per university) ════════
CREATE TABLE public.university_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL,
  module_key TEXT NOT NULL, -- certifications | exams | internships | ...
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (university_id, module_key)
);
ALTER TABLE public.university_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view modules" ON public.university_modules FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage modules" ON public.university_modules FOR ALL
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- ════════ SEARCH EVENTS (for ranking) ════════
CREATE TABLE public.search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  query TEXT,
  category TEXT,
  course_id UUID,
  event_type TEXT NOT NULL DEFAULT 'search', -- search | click | enroll
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own events" ON public.search_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users view own events" ON public.search_events FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Super admins view all events" ON public.search_events FOR SELECT
  USING (has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_search_events_user ON public.search_events (user_id, created_at DESC);

-- ════════ Helper: link a profile to a university (for invitation accept) ════════
CREATE OR REPLACE FUNCTION public.accept_university_invitation(_invitation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv RECORD;
  current_email TEXT;
BEGIN
  SELECT * INTO inv FROM public.university_invitations WHERE id = _invitation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  current_email := lower(coalesce((auth.jwt()->>'email')::text, ''));
  IF inv.invited_user_id IS DISTINCT FROM auth.uid() AND lower(inv.invited_email) <> current_email THEN
    RAISE EXCEPTION 'Not authorized for this invitation';
  END IF;
  IF inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Invitation already %', inv.status;
  END IF;

  -- Update profile
  UPDATE public.profiles
    SET university_id = inv.university_id
    WHERE user_id = auth.uid();

  -- Add membership
  IF inv.class_id IS NOT NULL THEN
    INSERT INTO public.class_members (class_id, user_id, role)
    VALUES (inv.class_id, auth.uid(), inv.role)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Grant role if professor
  IF inv.role = 'professor' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'professor')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Mark invitation accepted
  UPDATE public.university_invitations
    SET status = 'accepted', responded_at = now(), invited_user_id = auth.uid()
    WHERE id = _invitation_id;

  -- Notify
  INSERT INTO public.notifications (user_id, title, message, category)
  VALUES (auth.uid(), 'Invitation accepted', 'You have joined the university workspace.', 'Announcements');
END;
$$;

-- Auto-link invitation to user_id when a user signs up with the invited email
CREATE OR REPLACE FUNCTION public.link_invitations_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.university_invitations
    SET invited_user_id = NEW.id
  WHERE invited_user_id IS NULL
    AND lower(invited_email) = lower(NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_link_invitations ON auth.users;
CREATE TRIGGER on_auth_user_created_link_invitations
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_invitations_on_signup();
