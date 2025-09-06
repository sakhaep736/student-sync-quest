-- Create contact requests table for secure employer-student communication
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  student_id UUID NOT NULL,
  job_id UUID NOT NULL,
  employer_contact JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  message TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, job_id)
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own contact requests
CREATE POLICY "Students can view their own contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (auth.uid() = student_id);

-- Students can create contact requests
CREATE POLICY "Students can create contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Create trigger for timestamp updates
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Remove employer_contact from jobs table for security
ALTER TABLE public.jobs DROP COLUMN IF EXISTS employer_contact;

-- Add job poster identification
ALTER TABLE public.jobs ADD COLUMN posted_by UUID REFERENCES auth.users(id);

-- Update jobs RLS to allow job posters to manage their own jobs
CREATE POLICY "Job posters can manage their own jobs" 
ON public.jobs 
FOR ALL 
USING (auth.uid() = posted_by);

-- Create secure function to get job details without sensitive data
CREATE OR REPLACE FUNCTION public.get_public_jobs()
RETURNS TABLE(
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  title text,
  description text,
  category text,
  job_type text,
  location text,
  skills_required text[],
  employer_name text,
  status text,
  budget_min numeric,
  budget_max numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    j.id,
    j.created_at,
    j.updated_at,
    j.title,
    j.description,
    j.category,
    j.job_type,
    j.location,
    j.skills_required,
    j.employer_name,
    j.status,
    j.budget_min,
    j.budget_max
  FROM public.jobs j
  WHERE j.status = 'active';
$$;