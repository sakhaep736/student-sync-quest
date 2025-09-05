-- Update RLS policy to restrict student data access to authenticated users only
-- This prevents unauthorized access to sensitive student information

-- Drop the existing overly permissive policy
DROP POLICY "Anyone can view students" ON public.students;

-- Create a new policy that only allows authenticated users to view students
CREATE POLICY "Authenticated users can view students" 
ON public.students 
FOR SELECT 
TO authenticated
USING (true);

-- Also update other policies to be more secure
-- Drop and recreate insert policy for authenticated users only
DROP POLICY "Anyone can insert students" ON public.students;
CREATE POLICY "Authenticated users can insert students" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Drop and recreate update policy for authenticated users only  
DROP POLICY "Anyone can update students" ON public.students;
CREATE POLICY "Authenticated users can update students" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (true);