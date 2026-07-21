-- =============================================================================
-- Ravenshaw Moments
-- Migration : 072_placement_career.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Builds the Placement & Career Development Engine.
-- Extends profiles and adds companies, drives, registrations, interviews.
-- Includes AI-ready fields.
-- =============================================================================

BEGIN;

-- 1. Extend profile_type Enum safely
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'recruiter';

-- 2. Extend profiles additively
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_objective text;

-- 3. Student Career Profile Extensions

CREATE TABLE IF NOT EXISTS public.student_resumes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE RESTRICT,
    title varchar(150) NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    parsed_skills jsonb, -- AI Ready: for skill gap analysis
    resume_score numeric(5,2), -- AI Ready: resume scoring
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- Ensure only one default resume per profile
CREATE UNIQUE INDEX idx_student_resumes_default ON public.student_resumes(profile_id) WHERE is_default = true;
CREATE INDEX idx_student_resumes_profile ON public.student_resumes(profile_id);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name varchar(100) NOT NULL,
    proficiency varchar(50) CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_student_skills_profile ON public.student_skills(profile_id);

CREATE TABLE IF NOT EXISTS public.student_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title varchar(200) NOT NULL,
    description text NOT NULL,
    repo_url text,
    live_url text,
    technologies text[],
    start_date date,
    end_date date,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_student_projects_profile ON public.student_projects(profile_id);

CREATE TABLE IF NOT EXISTS public.student_experiences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name varchar(200) NOT NULL,
    role varchar(150) NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date,
    is_current boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_student_experiences_profile ON public.student_experiences(profile_id);

CREATE TABLE IF NOT EXISTS public.student_certifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name varchar(200) NOT NULL,
    issuer varchar(150) NOT NULL,
    issue_date date,
    expiry_date date,
    credential_id varchar(150),
    credential_url text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_student_certifications_profile ON public.student_certifications(profile_id);

-- 4. Company Management

CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(200) NOT NULL,
    slug varchar(200) NOT NULL UNIQUE,
    logo_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    industry varchar(100),
    description text,
    website text,
    linkedin_url text,
    career_page_url text,
    headquarters varchar(200),
    locations text[],
    company_size varchar(50),
    founded_year integer,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_companies_slug ON public.companies(slug);

CREATE TABLE IF NOT EXISTS public.company_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- profile_type = 'recruiter'
    role varchar(100) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE UNIQUE INDEX idx_company_contacts_primary ON public.company_contacts(company_id) WHERE is_primary = true;
CREATE INDEX idx_company_contacts_company ON public.company_contacts(company_id);
CREATE INDEX idx_company_contacts_profile ON public.company_contacts(profile_id);

-- 5. Placement Drives & Jobs

CREATE TYPE placement_drive_status AS ENUM (
    'draft',
    'published',
    'registration_open',
    'registration_closed',
    'shortlisting',
    'assessment',
    'interview',
    'offer_released',
    'completed',
    'archived'
);

CREATE TYPE placement_job_type AS ENUM (
    'full_time',
    'internship',
    'apprenticeship',
    'research',
    'campus_placement',
    'off_campus'
);

CREATE TABLE IF NOT EXISTS public.placement_drives (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    title varchar(200) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    description text NOT NULL,
    job_type placement_job_type NOT NULL,
    salary_package numeric(12,2), -- e.g., CTC in LPA or flat amount
    salary_currency varchar(10) DEFAULT 'INR',
    min_cgpa numeric(4,2),
    max_backlogs integer,
    passing_year integer[],
    status placement_drive_status NOT NULL DEFAULT 'draft',
    registration_start timestamptz,
    registration_end timestamptz,
    job_recommendation_score jsonb, -- AI Ready: match scoring parameters
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_placement_drives_company ON public.placement_drives(company_id);
CREATE INDEX idx_placement_drives_status ON public.placement_drives(status);
CREATE INDEX idx_placement_drives_slug ON public.placement_drives(slug);

CREATE TABLE IF NOT EXISTS public.placement_drive_departments (
    drive_id uuid NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    PRIMARY KEY (drive_id, department_id)
);

CREATE TABLE IF NOT EXISTS public.placement_drive_skills (
    drive_id uuid NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    skill_name varchar(100) NOT NULL,
    is_mandatory boolean NOT NULL DEFAULT false,
    PRIMARY KEY (drive_id, skill_name)
);

-- 6. Registrations & Interviews

CREATE TYPE placement_registration_status AS ENUM (
    'applied',
    'withdrawn',
    'waitlisted',
    'shortlisted',
    'rejected',
    'selected',
    'offer_accepted',
    'offer_declined'
);

CREATE TABLE IF NOT EXISTS public.placement_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id uuid NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_id uuid REFERENCES public.student_resumes(id) ON DELETE SET NULL,
    status placement_registration_status NOT NULL DEFAULT 'applied',
    match_score numeric(5,2), -- AI Ready: applicant matching score
    applied_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(drive_id, profile_id)
);
CREATE INDEX idx_placement_registrations_drive ON public.placement_registrations(drive_id);
CREATE INDEX idx_placement_registrations_profile ON public.placement_registrations(profile_id);

CREATE TYPE placement_round_type AS ENUM (
    'written_test',
    'coding_test',
    'technical_interview',
    'group_discussion',
    'hr_interview',
    'managerial_interview',
    'presentation',
    'final_interview',
    'other'
);

CREATE TABLE IF NOT EXISTS public.placement_rounds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id uuid NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    title varchar(150) NOT NULL,
    round_type placement_round_type NOT NULL,
    scheduled_at timestamptz,
    location text,
    description text,
    order_index integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_placement_rounds_drive ON public.placement_rounds(drive_id);

CREATE TABLE IF NOT EXISTS public.placement_interviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id uuid NOT NULL REFERENCES public.placement_rounds(id) ON DELETE CASCADE,
    registration_id uuid NOT NULL REFERENCES public.placement_registrations(id) ON DELETE CASCADE,
    interviewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Alumni/Faculty/Recruiter
    scheduled_time timestamptz,
    status varchar(50) DEFAULT 'scheduled', -- scheduled, completed, no_show
    feedback text,
    score numeric(5,2),
    interview_recommendation jsonb, -- AI Ready: generated interview questions/tips
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(round_id, registration_id)
);

-- 7. Offers

CREATE TABLE IF NOT EXISTS public.placement_offers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid NOT NULL UNIQUE REFERENCES public.placement_registrations(id) ON DELETE CASCADE,
    offer_letter_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    ctc numeric(12,2) NOT NULL,
    base_salary numeric(12,2),
    location text,
    joining_date date,
    bond_details text,
    status varchar(50) DEFAULT 'released', -- released, accepted, declined, expired
    deadline timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- 8. Career Services (Mock Interviews & Counselling)

CREATE TABLE IF NOT EXISTS public.career_counselling_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    counselor_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheduled_at timestamptz NOT NULL,
    duration_minutes integer DEFAULT 30,
    topic varchar(200),
    status varchar(50) DEFAULT 'requested', -- requested, confirmed, completed, cancelled
    career_roadmap_json jsonb, -- AI Ready: Generated career roadmap
    notes text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);
CREATE INDEX idx_career_counselling_student ON public.career_counselling_sessions(student_profile_id);
CREATE INDEX idx_career_counselling_counselor ON public.career_counselling_sessions(counselor_profile_id);

CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interviewer_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- Often Alumni
    scheduled_at timestamptz NOT NULL,
    focus_area varchar(200),
    status varchar(50) DEFAULT 'requested',
    feedback text,
    score numeric(5,2),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- 9. Analytics Views

CREATE VIEW public.placement_statistics AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    COUNT(DISTINCT pd.id) as total_drives,
    COUNT(DISTINCT pr.id) as total_applications,
    COUNT(DISTINCT po.id) as total_offers,
    MAX(po.ctc) as highest_package,
    AVG(po.ctc) as average_package
FROM public.companies c
LEFT JOIN public.placement_drives pd ON c.id = pd.company_id
LEFT JOIN public.placement_registrations pr ON pd.id = pr.drive_id
LEFT JOIN public.placement_offers po ON pr.id = po.registration_id AND po.status = 'accepted'
GROUP BY c.id, c.name;

-- 10. Triggers for updated_at

CREATE TRIGGER set_timestamp_student_resumes BEFORE UPDATE ON public.student_resumes FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_student_projects BEFORE UPDATE ON public.student_projects FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_student_experiences BEFORE UPDATE ON public.student_experiences FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_student_certifications BEFORE UPDATE ON public.student_certifications FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER set_timestamp_companies BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_placement_drives BEFORE UPDATE ON public.placement_drives FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_placement_registrations BEFORE UPDATE ON public.placement_registrations FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_placement_rounds BEFORE UPDATE ON public.placement_rounds FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_placement_interviews BEFORE UPDATE ON public.placement_interviews FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_placement_offers BEFORE UPDATE ON public.placement_offers FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_career_counselling_sessions BEFORE UPDATE ON public.career_counselling_sessions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER set_timestamp_mock_interviews BEFORE UPDATE ON public.mock_interviews FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMIT;
