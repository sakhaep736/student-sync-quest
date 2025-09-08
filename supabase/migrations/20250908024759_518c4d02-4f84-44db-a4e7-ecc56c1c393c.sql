-- Remove the overly permissive RLS policy that exposes sensitive student data
DROP POLICY IF EXISTS "Users can browse public student profiles" ON public.students;

-- Update the secure function to remove potentially sensitive hourly rate data
-- and ensure no sensitive fields are exposed
CREATE OR REPLACE FUNCTION public.get_public_student_profiles()
RETURNS TABLE(
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  name text,
  category text,
  skills text[],
  location text,
  description text,
  experience_level text,
  availability text,
  portfolio_links text[],
  profile_photo_url text,
  rate_range text  -- Return rate range instead of exact hourly rate
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    s.id,
    s.created_at,
    s.updated_at,
    s.name,
    s.category,
    s.skills,
    s.location,
    s.description,
    s.experience_level,
    s.availability,
    s.portfolio_links,
    s.profile_photo_url,
    -- Convert exact hourly rate to a range for privacy
    CASE 
      WHEN s.hourly_rate IS NULL THEN 'Not specified'
      WHEN s.hourly_rate < 500 THEN '₹0-500/hr'
      WHEN s.hourly_rate < 1000 THEN '₹500-1000/hr' 
      WHEN s.hourly_rate < 2000 THEN '₹1000-2000/hr'
      WHEN s.hourly_rate < 5000 THEN '₹2000-5000/hr'
      ELSE '₹5000+/hr'
    END as rate_range
  FROM public.students s
  WHERE s.user_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;

-- Create a more restrictive policy that only allows students to view their own complete profile
CREATE POLICY "Students can view their own complete profile" ON public.students
FOR SELECT USING (auth.uid() = user_id);

-- Create a function for students to get contact info only for approved contact requests
CREATE OR REPLACE FUNCTION public.get_student_contact_info(student_id_param uuid)
RETURNS TABLE(
  contact_info jsonb,
  email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    s.contact_info,
    s.email
  FROM public.students s
  INNER JOIN public.contact_requests cr ON cr.student_id = s.id
  WHERE s.id = student_id_param 
    AND cr.student_id = auth.uid() 
    AND cr.status = 'approved';
$$;

-- Add a policy to prevent direct access to sensitive student data
CREATE POLICY "Prevent direct access to sensitive student data" ON public.students
FOR SELECT USING (false);

-- Update the existing policy to be more specific about what can be accessed
DROP POLICY IF EXISTS "Students can view their own profile" ON public.students;
CREATE POLICY "Students can manage their own profile data" ON public.students
FOR ALL USING (auth.uid() = user_id);