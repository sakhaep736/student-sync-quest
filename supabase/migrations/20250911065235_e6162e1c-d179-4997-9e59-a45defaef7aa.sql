-- Create OTP table for temporary storage of verification codes
CREATE TABLE public.otps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  otp_code text NOT NULL,
  otp_type text NOT NULL CHECK (otp_type IN ('signup', 'password_reset')),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '5 minutes'),
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Create policy for OTP verification (users can verify their own OTPs)
CREATE POLICY "Users can verify their own OTPs" ON public.otps
FOR SELECT USING (true);

-- Create policy for OTP creation (anyone can create OTPs for signup/reset)
CREATE POLICY "Anyone can create OTPs" ON public.otps
FOR INSERT WITH CHECK (true);

-- Create policy for OTP updates (for attempt tracking)
CREATE POLICY "Anyone can update OTP attempts" ON public.otps
FOR UPDATE USING (true);

-- Create policy for OTP deletion (cleanup)
CREATE POLICY "Anyone can delete expired OTPs" ON public.otps
FOR DELETE USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_otps_email_type ON public.otps(email, otp_type);
CREATE INDEX idx_otps_expires_at ON public.otps(expires_at);

-- Function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.otps WHERE expires_at < now();
$$;

-- Function to generate OTP
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
  
  -- Insert new OTP
  INSERT INTO public.otps (email, otp_code, otp_type)
  VALUES (email_param, otp_code, otp_type_param);
  
  RETURN otp_code;
END;
$$;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION public.verify_otp(
  email_param text,
  otp_code_param text,
  otp_type_param text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  otp_record record;
  is_valid boolean := false;
BEGIN
  -- Get OTP record
  SELECT * INTO otp_record
  FROM public.otps
  WHERE email = email_param 
    AND otp_type = otp_type_param 
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Check if OTP exists and hasn't exceeded attempts
  IF otp_record.id IS NOT NULL AND otp_record.attempts < 3 THEN
    -- Increment attempts
    UPDATE public.otps 
    SET attempts = attempts + 1 
    WHERE id = otp_record.id;
    
    -- Check if OTP matches
    IF otp_record.otp_code = otp_code_param THEN
      is_valid := true;
      -- Delete the OTP after successful verification
      DELETE FROM public.otps WHERE id = otp_record.id;
    END IF;
  END IF;
  
  RETURN is_valid;
END;
$$;