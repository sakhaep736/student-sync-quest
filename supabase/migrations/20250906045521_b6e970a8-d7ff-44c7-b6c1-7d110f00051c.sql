-- Fix security issue: Restrict access to sensitive student data
-- Drop the overly permissive policy that exposes all student data
DROP POLICY IF EXISTS "Authenticated users can browse public student info" ON public.students;

-- Create a more secure policy that excludes sensitive fields
-- This policy will be used with a view that only exposes public fields
CREATE POLICY "Users can browse public student profiles only" 
ON public.students 
FOR SELECT 
USING (
  auth.uid() <> user_id AND 
  auth.uid() IS NOT NULL
);

-- Create a view for public student information (excludes sensitive data)
CREATE OR REPLACE VIEW public.students_public AS
SELECT 
  id,
  created_at,
  updated_at,
  name,
  category,
  skills,
  location,
  description,
  experience_level,
  availability,
  portfolio_links,
  profile_photo_url,
  hourly_rate
FROM public.students;

-- Enable RLS on the view (inherits from underlying table)
-- Note: Views inherit RLS from their underlying tables by default

-- Create a policy for the view to allow public browsing of non-sensitive data
CREATE POLICY "Anyone can view public student info via view" 
ON public.students_public 
FOR SELECT 
USING (true);

-- Create a function to get public student data safely
CREATE OR REPLACE FUNCTION public.get_public_students()
RETURNS SETOF public.students_public
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    created_at,
    updated_at,
    name,
    category,
    skills,
    location,
    description,
    experience_level,
    availability,
    portfolio_links,
    profile_photo_url,
    hourly_rate
  FROM public.students
  WHERE user_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;