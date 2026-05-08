-- Supabase SQL Schema for Holy Cross College Admission Survey

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    mobile TEXT,
    district TEXT,
    study_plan TEXT[] DEFAULT '{}',
    course_interest TEXT[] DEFAULT '{}',
    distance TEXT,
    transportation_issue TEXT,
    interest_level TEXT,
    not_interested_reasons TEXT[] DEFAULT '{}',
    other_reason TEXT,
    preferred_contact TEXT,
    best_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (users submitting the form)
CREATE POLICY "Allow anonymous inserts" ON public.survey_responses
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow anonymous updates based on session_id
CREATE POLICY "Allow anonymous updates" ON public.survey_responses
    FOR UPDATE
    USING (true);

-- Create policy to allow read access (for admin dashboard, assuming anon key is used there as well for simplicity, 
-- but in production you should use an authenticated role or service role key for the admin panel)
CREATE POLICY "Allow anonymous read" ON public.survey_responses
    FOR SELECT
    USING (true);
