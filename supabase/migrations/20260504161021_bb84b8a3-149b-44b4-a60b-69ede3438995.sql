-- =============== application_requests ===============
CREATE TABLE IF NOT EXISTS public.application_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('professor','university')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  review_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.application_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicant can view own application"
  ON public.application_requests FOR SELECT
  USING (auth.uid() = applicant_id);
CREATE POLICY "Applicant can create own application"
  ON public.application_requests FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Super admins manage all applications"
  ON public.application_requests FOR ALL
  USING (has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_app_req_updated
BEFORE UPDATE ON public.application_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== university_members ===============
CREATE TABLE IF NOT EXISTS public.university_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  university_id uuid NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','professor','admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, university_id, role)
);
ALTER TABLE public.university_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User views own memberships"
  ON public.university_members FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE POLICY "Admins manage memberships in their uni"
  ON public.university_members FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR (has_role(auth.uid(),'admin') AND is_university_member(university_id)));

-- =============== course_materials ===============
CREATE TABLE IF NOT EXISTS public.course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text,
  link_url text,
  material_type text NOT NULL DEFAULT 'document',
  uploaded_by uuid NOT NULL,
  course_submission_id uuid REFERENCES public.course_submissions(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  university_id uuid REFERENCES public.universities(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uploader manages own materials"
  ON public.course_materials FOR ALL
  USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins manage materials in their uni"
  ON public.course_materials FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR (has_role(auth.uid(),'admin') AND university_id IS NOT NULL AND is_university_member(university_id)));
CREATE POLICY "Class members view materials"
  ON public.course_materials FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      class_id IS NULL OR EXISTS (
        SELECT 1 FROM public.class_members cm WHERE cm.class_id = course_materials.class_id AND cm.user_id = auth.uid()
      )
    )
  );

-- =============== meetings ===============
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  host_id uuid NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  with_user_id uuid,
  university_id uuid REFERENCES public.universities(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_minutes int DEFAULT 30,
  meeting_url text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Host manages own meetings"
  ON public.meetings FOR ALL
  USING (auth.uid() = host_id);
CREATE POLICY "Invitees view their meetings"
  ON public.meetings FOR SELECT
  USING (
    auth.uid() = with_user_id
    OR (class_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = meetings.class_id AND cm.user_id = auth.uid()))
    OR (university_id IS NOT NULL AND has_role(auth.uid(),'admin') AND is_university_member(university_id))
  );

-- =============== profile / professor enrichments ===============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS headline text;

ALTER TABLE public.professors
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_independent boolean DEFAULT false;

ALTER TABLE public.course_submissions
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS professor_user_id uuid,
  ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'public';

-- Allow professors to manage their own submissions
CREATE POLICY "Professors manage own submissions"
  ON public.course_submissions FOR ALL
  USING (auth.uid() = professor_user_id OR auth.uid() = submitted_by);

-- Universities: ensure unique slug
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'universities_slug_key'
  ) THEN
    BEGIN
      ALTER TABLE public.universities ADD CONSTRAINT universities_slug_key UNIQUE (slug);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;
  END IF;
END $$;

-- Public can view active universities (for /u/:slug page)
CREATE POLICY "Public can view active universities"
  ON public.universities FOR SELECT
  USING (status = 'active');

-- =============== RPCs ===============
CREATE OR REPLACE FUNCTION public.submit_application(_type text, _payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _type NOT IN ('professor','university') THEN RAISE EXCEPTION 'Invalid type'; END IF;
  INSERT INTO public.application_requests (applicant_id, type, payload)
  VALUES (auth.uid(), _type, COALESCE(_payload,'{}'::jsonb))
  RETURNING id INTO new_id;
  -- notify all super admins
  INSERT INTO public.notifications (user_id, title, message, category)
  SELECT user_id, 'New ' || _type || ' application', 'A user submitted a new application for review.', 'Requests'
  FROM public.user_roles WHERE role = 'super_admin';
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_application(_id uuid, _note text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app RECORD;
  new_uni uuid;
  raw_slug text;
  final_slug text;
  i int := 0;
BEGIN
  IF NOT has_role(auth.uid(),'super_admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO app FROM public.application_requests WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;
  IF app.status <> 'pending' THEN RAISE EXCEPTION 'Already %', app.status; END IF;

  IF app.type = 'professor' THEN
    -- Grant professor role
    INSERT INTO public.user_roles (user_id, role) VALUES (app.applicant_id, 'professor')
    ON CONFLICT DO NOTHING;
    -- Ensure a professors row exists
    INSERT INTO public.professors (user_id, name, email, bio, department, headline, is_independent)
    VALUES (
      app.applicant_id,
      COALESCE(app.payload->>'fullName','Instructor'),
      app.payload->>'email',
      app.payload->>'bio',
      COALESCE(app.payload->>'category','General'),
      app.payload->>'headline',
      true
    );
    INSERT INTO public.notifications (user_id, title, message, category)
    VALUES (app.applicant_id, 'Application approved', 'You are now an independent instructor and can publish courses.', 'Requests');

  ELSIF app.type = 'university' THEN
    raw_slug := lower(regexp_replace(coalesce(app.payload->>'slug', app.payload->>'name','uni'), '[^a-z0-9]+', '-', 'g'));
    raw_slug := trim(both '-' from raw_slug);
    final_slug := raw_slug;
    WHILE EXISTS (SELECT 1 FROM public.universities WHERE slug = final_slug) LOOP
      i := i + 1; final_slug := raw_slug || '-' || i::text;
    END LOOP;

    INSERT INTO public.universities (
      name, slug, status, activated_at, contact_email, contact_phone,
      city, country, subscription_plan, subscription_price, max_seats
    ) VALUES (
      COALESCE(app.payload->>'name','University'), final_slug, 'active', now(),
      app.payload->>'adminEmail', app.payload->>'adminPhone',
      app.payload->>'city', app.payload->>'country',
      COALESCE(app.payload->>'subscription_plan','basic'),
      COALESCE((app.payload->>'subscription_price')::numeric, 0),
      COALESCE((app.payload->>'studentCount')::int, 500)
    ) RETURNING id INTO new_uni;

    -- Grant admin role and link applicant
    INSERT INTO public.user_roles (user_id, role) VALUES (app.applicant_id, 'admin')
    ON CONFLICT DO NOTHING;
    UPDATE public.profiles SET university_id = new_uni WHERE user_id = app.applicant_id;
    INSERT INTO public.university_members (user_id, university_id, role)
    VALUES (app.applicant_id, new_uni, 'admin') ON CONFLICT DO NOTHING;

    INSERT INTO public.notifications (user_id, title, message, category)
    VALUES (app.applicant_id, 'University approved', 'Your institution workspace is now live.', 'Requests');
  END IF;

  UPDATE public.application_requests
    SET status='approved', reviewed_by=auth.uid(), reviewed_at=now(), review_note=_note
    WHERE id=_id;

  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_application(_id uuid, _note text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE app RECORD;
BEGIN
  IF NOT has_role(auth.uid(),'super_admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO app FROM public.application_requests WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;
  UPDATE public.application_requests
    SET status='rejected', reviewed_by=auth.uid(), reviewed_at=now(), review_note=_note
    WHERE id=_id;
  INSERT INTO public.notifications (user_id, title, message, category)
  VALUES (app.applicant_id, 'Application rejected', COALESCE(_note,'Your application was not approved.'), 'Requests');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_active_university(_uni uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.university_members WHERE user_id = auth.uid() AND university_id = _uni
  ) THEN RAISE EXCEPTION 'Not a member of this university'; END IF;
  UPDATE public.profiles SET university_id = _uni WHERE user_id = auth.uid();
END;
$$;

-- Backfill university_members for existing profiles (so role-switching works)
INSERT INTO public.university_members (user_id, university_id, role)
SELECT p.user_id, p.university_id,
  CASE WHEN ur.role = 'admin' THEN 'admin'
       WHEN ur.role = 'professor' THEN 'professor'
       ELSE 'student' END
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id
WHERE p.university_id IS NOT NULL
ON CONFLICT DO NOTHING;