-- Fix OTP expiry time to be more secure (reduce from 5 minutes to 2 minutes)
ALTER TABLE public.otps ALTER COLUMN expires_at SET DEFAULT (now() + interval '2 minutes');

-- Update the generate_otp function to use 2-minute expiry
CREATE OR REPLACE FUNCTION public.generate_otp(
  email_param text,
  otp_type_param text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  otp_code text;
BEGIN
  -- Generate 6-digit OTP
  otp_code := LPAD(floor(random() * 1000000)::text, 6, '0');
  
  -- Clean up any existing OTPs for this email and type
  DELETE FROM public.otps 
  WHERE email = email_param AND otp_type = otp_type_param;
  
  -- Insert new OTP with 2-minute expiry
  INSERT INTO public.otps (email, otp_code, otp_type, expires_at)
  VALUES (email_param, otp_code, otp_type_param, now() + interval '2 minutes');
  
  RETURN otp_code;
END;
$$;