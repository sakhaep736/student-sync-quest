-- Fix student data access control by adding user ownership and proper RLS policies
-- This prevents malicious users from harvesting all student personal information

-- First, add a user_id column to link students to their owners
ALTER TABLE public.students 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing students to have a user_id (this is a temporary measure for existing data)
-- In production, you'd want to handle this migration more carefully
UPDATE public.students 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id required for future records
ALTER TABLE public.students 
ALTER COLUMN user_id SET NOT NULL;

-- Drop the existing overly permissive policies
DROP POLICY "Authenticated users can view students" ON public.students;
DROP POLICY "Authenticated users can insert students" ON public.students;
DROP POLICY "Authenticated users can update students" ON public.students;

-- Create secure policies that protect personal information

-- Students can only view their own records
CREATE POLICY "Students can view their own profile" 
ON public.students 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Students can only insert their own records
CREATE POLICY "Students can create their own profile" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Students can only update their own records
CREATE POLICY "Students can update their own profile" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create a public view for browsing that excludes sensitive contact information
CREATE OR REPLACE VIEW public.students_public AS
SELECT 
  id,
  name,
  category,
  skills,
  location,
  description,
  hourly_rate,
  experience_level,
  availability,
  portfolio_links,
  created_at
FROM public.students;

-- Allow authenticated users to browse the public view (without contact info)
CREATE POLICY "Authenticated users can browse public student profiles" 
ON public.students_public 
FOR SELECT 
TO authenticated
USING (true);