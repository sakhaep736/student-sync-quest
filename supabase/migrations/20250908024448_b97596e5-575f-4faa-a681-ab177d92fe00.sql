-- Fix search path issues for security
CREATE OR REPLACE FUNCTION public.sanitize_html_input(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove script tags and other dangerous HTML
  input_text := regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi');
  input_text := regexp_replace(input_text, '<iframe[^>]*>.*?</iframe>', '', 'gi');
  input_text := regexp_replace(input_text, '<object[^>]*>.*?</object>', '', 'gi');
  input_text := regexp_replace(input_text, '<embed[^>]*>', '', 'gi');
  input_text := regexp_replace(input_text, 'javascript:', '', 'gi');
  input_text := regexp_replace(input_text, 'on\w+\s*=', '', 'gi');
  
  -- Limit length to prevent abuse
  IF LENGTH(input_text) > 5000 THEN
    input_text := LEFT(input_text, 5000);
  END IF;
  
  RETURN TRIM(input_text);
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_student_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sanitize text inputs
  NEW.name := public.sanitize_html_input(NEW.name);
  NEW.description := public.sanitize_html_input(NEW.description);
  NEW.location := public.sanitize_html_input(NEW.location);
  
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  
  IF NEW.category IS NULL OR LENGTH(TRIM(NEW.category)) = 0 THEN
    RAISE EXCEPTION 'Category is required';
  END IF;
  
  -- Validate hourly rate
  IF NEW.hourly_rate IS NOT NULL AND NEW.hourly_rate < 0 THEN
    RAISE EXCEPTION 'Hourly rate must be positive';
  END IF;
  
  -- Validate portfolio links format
  IF NEW.portfolio_links IS NOT NULL THEN
    FOR i IN 1..array_length(NEW.portfolio_links, 1) LOOP
      IF NEW.portfolio_links[i] !~ '^https?://' THEN
        RAISE EXCEPTION 'Portfolio links must be valid URLs starting with http:// or https://';
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_job_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sanitize text inputs
  NEW.title := public.sanitize_html_input(NEW.title);
  NEW.description := public.sanitize_html_input(NEW.description);
  NEW.location := public.sanitize_html_input(NEW.location);
  NEW.employer_name := public.sanitize_html_input(NEW.employer_name);
  
  -- Validate required fields
  IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Job title is required';
  END IF;
  
  IF NEW.description IS NULL OR LENGTH(TRIM(NEW.description)) = 0 THEN
    RAISE EXCEPTION 'Job description is required';
  END IF;
  
  -- Validate budget
  IF NEW.budget_min IS NOT NULL AND NEW.budget_min < 0 THEN
    RAISE EXCEPTION 'Minimum budget must be positive';
  END IF;
  
  IF NEW.budget_max IS NOT NULL AND NEW.budget_max < 0 THEN
    RAISE EXCEPTION 'Maximum budget must be positive';
  END IF;
  
  IF NEW.budget_min IS NOT NULL AND NEW.budget_max IS NOT NULL AND NEW.budget_min > NEW.budget_max THEN
    RAISE EXCEPTION 'Minimum budget cannot exceed maximum budget';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_contact_request_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sanitize message
  NEW.message := public.sanitize_html_input(NEW.message);
  
  -- Validate message length
  IF NEW.message IS NOT NULL AND LENGTH(NEW.message) < 10 THEN
    RAISE EXCEPTION 'Message must be at least 10 characters long';
  END IF;
  
  RETURN NEW;
END;
$$;