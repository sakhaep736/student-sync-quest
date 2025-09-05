-- Update RLS policies for jobs table to protect employer contact information
-- This prevents unauthorized access to employer email addresses and phone numbers

-- Drop the existing overly permissive policies
DROP POLICY "Anyone can view jobs" ON public.jobs;

-- Create a new policy that only allows authenticated users to view jobs
CREATE POLICY "Authenticated users can view jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (true);

-- Also update other policies to be more secure
-- Drop and recreate insert policy for authenticated users only
DROP POLICY "Anyone can insert jobs" ON public.jobs;
CREATE POLICY "Authenticated users can insert jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Drop and recreate update policy for authenticated users only  
DROP POLICY "Anyone can update jobs" ON public.jobs;
CREATE POLICY "Authenticated users can update jobs" 
ON public.jobs 
FOR UPDATE 
TO authenticated
USING (true);