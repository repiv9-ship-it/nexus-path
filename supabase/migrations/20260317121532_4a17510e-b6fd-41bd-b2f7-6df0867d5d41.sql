-- Create universities table for tenant management
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subscription_plan TEXT NOT NULL DEFAULT 'basic',
  subscription_price NUMERIC NOT NULL DEFAULT 0,
  max_seats INTEGER NOT NULL DEFAULT 500,
  active_seats INTEGER NOT NULL DEFAULT 0,
  storage_used_gb NUMERIC NOT NULL DEFAULT 0,
  storage_limit_gb NUMERIC NOT NULL DEFAULT 50,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE,
  suspended_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage universities" ON public.universities FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins view own university" ON public.universities FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Course submissions for marketplace governance
CREATE TABLE public.course_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  price NUMERIC NOT NULL DEFAULT 0,
  instructor_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  review_note TEXT,
  submitted_by UUID NOT NULL,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.course_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage course submissions" ON public.course_submissions FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins manage own submissions" ON public.course_submissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage all tickets" ON public.support_tickets FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins manage own tickets" ON public.support_tickets FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Ticket replies
CREATE TABLE public.ticket_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  author_id UUID NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage all replies" ON public.ticket_replies FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins manage own replies" ON public.ticket_replies FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Platform payouts
CREATE TABLE public.platform_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TND',
  period TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage payouts" ON public.platform_payouts FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins view own payouts" ON public.platform_payouts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Platform banners (CMS)
CREATE TABLE public.platform_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage banners" ON public.platform_banners FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Anyone can view active banners" ON public.platform_banners FOR SELECT USING (is_active = true);

-- Global discounts
CREATE TABLE public.platform_discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage discounts" ON public.platform_discounts FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Anyone can view active discounts" ON public.platform_discounts FOR SELECT USING (is_active = true);