-- Create table for student profiles
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  category TEXT NOT NULL, -- digital, tech, offline, content, business, campus
  skills TEXT[], -- array of skills
  location TEXT,
  description TEXT,
  hourly_rate DECIMAL(10,2),
  experience_level TEXT,
  availability TEXT,
  contact_info JSONB,
  portfolio_links TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  job_type TEXT NOT NULL, -- freelance, part-time, full-time
  location TEXT,
  skills_required TEXT[],
  employer_name TEXT,
  employer_contact JSONB,
  status TEXT DEFAULT 'active', -- active, closed, filled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for crawled website data
CREATE TABLE public.website_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  html_content TEXT,
  metadata JSONB,
  crawled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public platform)
CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jobs" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update jobs" ON public.jobs FOR UPDATE USING (true);

CREATE POLICY "Anyone can view website content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Anyone can insert website content" ON public.website_content FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_students_category ON public.students(category);
CREATE INDEX idx_students_location ON public.students(location);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_status ON public.jobs(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();