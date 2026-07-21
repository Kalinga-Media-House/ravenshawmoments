-- =============================================================================
-- Ravenshaw Moments
-- Migration : 036_competition_system_enhancements.sql
-- =============================================================================

BEGIN;

-- 1. Extend Course Level Type
-- ALTER TYPE course_level_type ADD VALUE IF NOT EXISTS 'other';
-- PostgreSQL does not allow ALTER TYPE ... ADD VALUE inside a transaction block in older versions,
-- but from PG 12+ it is allowed under certain conditions. Supabase uses PG 15+.
ALTER TYPE course_level_type ADD VALUE IF NOT EXISTS 'other';

-- 2. Create Competition Level Type
DO $$ BEGIN
    CREATE TYPE competition_level AS ENUM (
        'department',
        'hostel',
        'university',
        'inter_university',
        'district',
        'state',
        'national'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Enhance Competitions Table
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS competition_level competition_level NOT NULL DEFAULT 'university',
ADD COLUMN IF NOT EXISTS theme varchar(250),
ADD COLUMN IF NOT EXISTS eligibility_rules text,
ADD COLUMN IF NOT EXISTS judging_criteria text,
ADD COLUMN IF NOT EXISTS prize_details text;

-- 4. Seed Competition Categories
INSERT INTO public.competition_categories (name, description)
VALUES
('Short Story — Odia', 'Odia short story writing competitions'),
('Poetry — Odia', 'Odia poetry writing competitions'),
('Painting', 'Fine arts and painting competitions'),
('Music', 'Vocal and instrumental music competitions'),
('Dance', 'Classical, folk, and contemporary dance competitions')
ON CONFLICT (name) DO NOTHING;

-- 5. External Participant Profiles
CREATE TABLE IF NOT EXISTS public.external_participant_profiles (
    profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_name varchar(250) NOT NULL,
    course_level course_level_type NOT NULL,
    course_name varchar(150),
    current_year varchar(50),
    state varchar(100),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- Trigger for updated_at
DO $$ BEGIN
    CREATE TRIGGER trg_external_participant_profiles_updated_at
    BEFORE UPDATE ON public.external_participant_profiles
    FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. RLS Policies for external_participant_profiles
ALTER TABLE public.external_participant_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view their own external profile"
        ON public.external_participant_profiles FOR SELECT
        USING (profile_id IN (
            SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own external profile"
        ON public.external_participant_profiles FOR INSERT
        WITH CHECK (profile_id IN (
            SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own external profile"
        ON public.external_participant_profiles FOR UPDATE
        USING (profile_id IN (
            SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admin policies
DO $$ BEGIN
    CREATE POLICY "Admins can view all external profiles"
        ON public.external_participant_profiles FOR SELECT
        USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

COMMIT;
