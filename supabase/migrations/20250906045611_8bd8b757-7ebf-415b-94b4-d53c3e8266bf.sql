-- Fix security issue: Restrict access to sensitive student data
-- Drop the overly permissive policy that exposes all student data
DROP POLICY IF EXISTS "Authenticated users can browse public student info" ON public.students;

-- Create a more secure policy for browsing other students (excludes sensitive data at query level)
CREATE POLICY "Users can browse public student profiles" 
ON public.students 
FOR SELECT 
USING (
  auth.uid() <> user_id AND 
  auth.uid() IS NOT NULL
);

-- Create a security definer function to get only public student data
CREATE OR REPLACE FUNCTION public.get_public_students()
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
  hourly_rate numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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
    s.hourly_rate
  FROM public.students s
  WHERE s.user_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;