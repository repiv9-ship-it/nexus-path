
-- Student payments table
CREATE TABLE public.student_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  total_due NUMERIC NOT NULL DEFAULT 7000,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_period TEXT NOT NULL DEFAULT 'manual',
  receipt_number TEXT NOT NULL DEFAULT ('REC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 4)),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recorded_by UUID
);

ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage student payments" ON public.student_payments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Students view own payments" ON public.student_payments FOR SELECT USING (auth.uid() = student_id);

-- Certification requests table
CREATE TABLE public.certification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  certification_name TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'white_test',
  status TEXT NOT NULL DEFAULT 'en_attente',
  result TEXT,
  score TEXT,
  passed BOOLEAN,
  admin_note TEXT,
  voucher_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage certification requests" ON public.certification_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create certification requests" ON public.certification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own certification requests" ON public.certification_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own certification requests" ON public.certification_requests FOR UPDATE USING (auth.uid() = user_id);

-- Exam results table (for QR-scanned exams)
CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exam_schedule(id) ON DELETE CASCADE NOT NULL,
  student_id UUID NOT NULL,
  score NUMERIC,
  max_score NUMERIC NOT NULL DEFAULT 20,
  qr_code TEXT NOT NULL DEFAULT ('QR-' || substr(gen_random_uuid()::text, 1, 8)),
  scanned_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage exam results" ON public.exam_results FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Professors view exam results" ON public.exam_results FOR SELECT USING (has_role(auth.uid(), 'professor'::app_role));
CREATE POLICY "Students view own exam results" ON public.exam_results FOR SELECT USING (auth.uid() = student_id);
