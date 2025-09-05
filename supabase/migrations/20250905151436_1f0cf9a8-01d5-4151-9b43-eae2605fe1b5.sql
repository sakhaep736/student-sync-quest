-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true);

-- Add profile_photo_url column to students table
ALTER TABLE public.students 
ADD COLUMN profile_photo_url TEXT;

-- Create RLS policies for profile photos storage
-- Users can view all profile photos (public bucket)
CREATE POLICY "Anyone can view profile photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

-- Users can upload their own profile photos
CREATE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own profile photos
CREATE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own profile photos
CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);