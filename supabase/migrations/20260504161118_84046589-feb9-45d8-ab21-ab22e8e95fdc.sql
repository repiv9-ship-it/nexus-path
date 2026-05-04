CREATE OR REPLACE FUNCTION public.accept_university_invitation(_invitation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv RECORD;
  current_email TEXT;
BEGIN
  SELECT * INTO inv FROM public.university_invitations WHERE id = _invitation_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invitation not found'; END IF;

  current_email := lower(coalesce((auth.jwt()->>'email')::text, ''));
  IF inv.invited_user_id IS DISTINCT FROM auth.uid() AND lower(inv.invited_email) <> current_email THEN
    RAISE EXCEPTION 'Not authorized for this invitation';
  END IF;
  IF inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Invitation already %', inv.status;
  END IF;

  UPDATE public.profiles SET university_id = inv.university_id WHERE user_id = auth.uid();

  INSERT INTO public.university_members (user_id, university_id, role)
  VALUES (auth.uid(), inv.university_id, inv.role) ON CONFLICT DO NOTHING;

  IF inv.class_id IS NOT NULL THEN
    INSERT INTO public.class_members (class_id, user_id, role)
    VALUES (inv.class_id, auth.uid(), inv.role) ON CONFLICT DO NOTHING;
  END IF;

  IF inv.role = 'professor' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'professor') ON CONFLICT DO NOTHING;
  ELSIF inv.role = 'admin' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'university_student') ON CONFLICT DO NOTHING;
  END IF;

  UPDATE public.university_invitations
    SET status = 'accepted', responded_at = now(), invited_user_id = auth.uid()
    WHERE id = _invitation_id;

  INSERT INTO public.notifications (user_id, title, message, category)
  VALUES (auth.uid(), 'Invitation accepted', 'You have joined the university workspace.', 'Announcements');
END;
$$;

-- Notify invitee on insert (when user already exists)
CREATE OR REPLACE FUNCTION public.notify_invitation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE target_id uuid;
BEGIN
  IF NEW.invited_user_id IS NOT NULL THEN
    target_id := NEW.invited_user_id;
  ELSE
    SELECT user_id INTO target_id FROM public.profiles WHERE lower(email) = lower(NEW.invited_email) LIMIT 1;
  END IF;
  IF target_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, category)
    VALUES (target_id, 'New university invitation', 'You have been invited to join a university workspace.', 'Announcements');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_invitation ON public.university_invitations;
CREATE TRIGGER trg_notify_invitation
AFTER INSERT ON public.university_invitations
FOR EACH ROW EXECUTE FUNCTION public.notify_invitation();

-- Make sure app_role enum has 'university_student' (it already does per schema, but ensure)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='university_student' AND enumtypid='public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'university_student';
  END IF;
END $$;