-- 069_alumni_management.sql

-- ENUMS
DO $$ BEGIN
    CREATE TYPE alumni_verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mentorship_request_status AS ENUM ('draft', 'pending', 'accepted', 'rejected', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mentorship_session_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_posting_status AS ENUM ('active', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE success_story_category AS ENUM ('entrepreneurship', 'civil_services', 'research', 'corporate', 'startup', 'international');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE connection_request_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Alumni Profiles
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_status alumni_verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verification_date TIMESTAMP WITH TIME ZONE,
    current_position TEXT,
    company TEXT,
    industry TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    location TEXT,
    biography TEXT,
    profile_visibility visibility_type NOT NULL DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Alumni Employment
CREATE TABLE IF NOT EXISTS public.alumni_employment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(profile_id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    industry TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    location TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Alumni Education
CREATE TABLE IF NOT EXISTS public.alumni_education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(profile_id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Mentorship Profiles
CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_mentor BOOLEAN NOT NULL DEFAULT false,
    is_mentee BOOLEAN NOT NULL DEFAULT false,
    areas_of_expertise TEXT[] DEFAULT '{}',
    availability_status TEXT DEFAULT 'accepting',
    meeting_preference TEXT DEFAULT 'online',
    max_mentees INTEGER DEFAULT 5,
    current_mentees INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Mentorship Requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status mentorship_request_status NOT NULL DEFAULT 'pending',
    request_message TEXT,
    goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (mentor_id, mentee_id)
);

-- 6. Mentorship Sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    meeting_link TEXT,
    status mentorship_session_status NOT NULL DEFAULT 'scheduled',
    feedback_mentor TEXT,
    feedback_mentee TEXT,
    rating_mentor INTEGER,
    rating_mentee INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Alumni Job Postings
CREATE TABLE IF NOT EXISTS public.alumni_job_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    employment_type TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    application_link TEXT,
    is_referral_available BOOLEAN NOT NULL DEFAULT false,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status job_posting_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Alumni Success Stories
CREATE TABLE IF NOT EXISTS public.alumni_success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(profile_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category success_story_category NOT NULL,
    story_content TEXT NOT NULL,
    media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Alumni Connections (Networking)
CREATE TABLE IF NOT EXISTS public.alumni_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status connection_request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (requester_id, recipient_id)
);


-- TRIGGERS FOR UPDATED_AT
CREATE TRIGGER set_timestamp_alumni_profiles
BEFORE UPDATE ON public.alumni_profiles
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER set_timestamp_mentorship_profiles
BEFORE UPDATE ON public.mentorship_profiles
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER set_timestamp_mentorship_requests
BEFORE UPDATE ON public.mentorship_requests
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER set_timestamp_alumni_job_postings
BEFORE UPDATE ON public.alumni_job_postings
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER set_timestamp_alumni_connections
BEFORE UPDATE ON public.alumni_connections
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- RLS
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_connections ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Read access to all verified alumni profiles for authenticated users
CREATE POLICY "Anyone can view verified alumni profiles" ON public.alumni_profiles
FOR SELECT USING (verification_status = 'verified' AND profile_visibility = 'public');

-- Alumni can manage their own profiles
CREATE POLICY "Alumni can manage their own profiles" ON public.alumni_profiles
FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Alumni can manage their own employment" ON public.alumni_employment
FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = alumni_id));

CREATE POLICY "Alumni can manage their own education" ON public.alumni_education
FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = alumni_id));

-- Mentorship Profiles
CREATE POLICY "Anyone can view mentorship profiles" ON public.mentorship_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own mentorship profiles" ON public.mentorship_profiles
FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = profile_id));

-- Mentorship Requests
CREATE POLICY "Users can view their own requests" ON public.mentorship_requests
FOR SELECT USING (
    auth.uid() IN (
        SELECT auth_user_id FROM public.profiles WHERE id = mentor_id
        UNION
        SELECT auth_user_id FROM public.profiles WHERE id = mentee_id
    )
);

CREATE POLICY "Users can create requests" ON public.mentorship_requests
FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = mentee_id));

CREATE POLICY "Users can update their own requests" ON public.mentorship_requests
FOR UPDATE USING (
    auth.uid() IN (
        SELECT auth_user_id FROM public.profiles WHERE id = mentor_id
        UNION
        SELECT auth_user_id FROM public.profiles WHERE id = mentee_id
    )
);

-- Sessions
CREATE POLICY "Users can manage their own sessions" ON public.mentorship_sessions
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.mentorship_requests mr
        JOIN public.profiles p ON p.id = mr.mentor_id OR p.id = mr.mentee_id
        WHERE mr.id = request_id AND p.auth_user_id = auth.uid()
    )
);

-- Jobs
CREATE POLICY "Anyone can view active job postings" ON public.alumni_job_postings
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own job postings" ON public.alumni_job_postings
FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = posted_by));

-- Success Stories
CREATE POLICY "Anyone can view published success stories" ON public.alumni_success_stories
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins manage success stories" ON public.alumni_success_stories
FOR ALL USING (public.is_super_admin());

-- Networking
CREATE POLICY "Users can view and manage their connections" ON public.alumni_connections
FOR ALL USING (
    auth.uid() IN (
        SELECT auth_user_id FROM public.profiles WHERE id = requester_id
        UNION
        SELECT auth_user_id FROM public.profiles WHERE id = recipient_id
    )
);

-- Admin Access
CREATE POLICY "Admins have full access to alumni_profiles" ON public.alumni_profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Admins have full access to mentorship_profiles" ON public.mentorship_profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Admins have full access to alumni_job_postings" ON public.alumni_job_postings FOR ALL USING (public.is_super_admin());
