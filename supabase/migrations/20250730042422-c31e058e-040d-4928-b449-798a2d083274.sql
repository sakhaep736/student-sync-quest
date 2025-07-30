-- Insert the website content data
INSERT INTO public.website_content (url, title, content, metadata) VALUES (
  'https://boisterous-queijadas-c934f6.netlify.app/',
  'Hire India''s Most Talented Students for Freelance & Part-Time Work',
  'From design to tutoring to delivery – support student talent while getting work done affordably. Connect with 18+ students across India for your next project.',
  '{"categories": ["Digital / Online Services", "Tech / IT Jobs for Beginners", "Offline / On-Ground Jobs", "Content & Creator Economy", "Business / Entrepreneurial", "Campus-Based Jobs"], "stats": {"active_students": "5000+", "jobs_completed": "1000+", "cities_covered": "50+"}, "job_counts": {"digital": "1200+", "tech": "800+", "offline": "1500+", "content": "600+", "business": "400+", "campus": "300+"}}'
);

-- Insert some sample student data
INSERT INTO public.students (name, email, category, skills, location, description, hourly_rate, experience_level, availability) VALUES
('Rajesh Kumar', 'rajesh@example.com', 'digital', ARRAY['Graphic Design', 'Adobe Photoshop', 'UI/UX'], 'Mumbai', 'Creative graphic designer with 2 years experience in digital marketing campaigns', 500.00, 'intermediate', 'part-time'),
('Priya Sharma', 'priya@example.com', 'tech', ARRAY['Web Development', 'React', 'JavaScript'], 'Bangalore', 'Full-stack developer specializing in React applications', 800.00, 'advanced', 'freelance'),
('Arjun Singh', 'arjun@example.com', 'offline', ARRAY['Event Management', 'Promotion', 'Customer Service'], 'Delhi', 'Experienced in managing events and promotional activities', 300.00, 'beginner', 'part-time'),
('Sneha Patel', 'sneha@example.com', 'content', ARRAY['Content Writing', 'Social Media', 'Blogging'], 'Pune', 'Content creator with expertise in social media management', 400.00, 'intermediate', 'freelance'),
('Vikram Gupta', 'vikram@example.com', 'business', ARRAY['Digital Marketing', 'Dropshipping', 'E-commerce'], 'Chennai', 'Entrepreneur with experience in online business development', 600.00, 'advanced', 'part-time');

-- Insert some sample job listings
INSERT INTO public.jobs (title, description, category, budget_min, budget_max, job_type, location, skills_required, employer_name, status) VALUES
('Social Media Graphics Designer', 'Need creative graphics for Instagram and Facebook posts', 'digital', 2000.00, 5000.00, 'freelance', 'Remote', ARRAY['Graphic Design', 'Social Media'], 'Digital Marketing Agency', 'active'),
('WordPress Website Developer', 'Build a simple business website using WordPress', 'tech', 8000.00, 15000.00, 'freelance', 'Remote', ARRAY['WordPress', 'Web Development'], 'Small Business Owner', 'active'),
('Campus Event Promoter', 'Promote our upcoming tech conference on college campuses', 'offline', 5000.00, 10000.00, 'part-time', 'Multiple Cities', ARRAY['Event Promotion', 'Marketing'], 'Tech Conference Organizer', 'active'),
('Blog Content Writer', 'Write weekly blog posts about technology trends', 'content', 1500.00, 3000.00, 'freelance', 'Remote', ARRAY['Content Writing', 'Technology'], 'Tech Blog', 'active');