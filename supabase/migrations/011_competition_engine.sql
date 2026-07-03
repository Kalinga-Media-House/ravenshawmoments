-- =============================================================================
-- Ravenshaw Moments
-- Migration : 011_competition_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Competition Engine
-- Supports free/paid competitions, registrations, submissions, judging,
-- results and certificate generation.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Competitions
-- ============================================================================
CREATE TABLE public.competitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('COM'),
    category_id uuid NOT NULL REFERENCES public.competition_categories(id),
    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    description text,
    rules text,
    featured_media_id uuid REFERENCES public.media_files(id),
    registration_open_at timestamptz,
    registration_close_at timestamptz,
    submission_open_at timestamptz,
    submission_close_at timestamptz,
    result_date timestamptz,
    competition_status competition_status NOT NULL DEFAULT 'draft',
    registration_fee numeric(10,2) NOT NULL DEFAULT 0,
    max_participants integer,
    allow_team boolean NOT NULL DEFAULT false,
    is_public boolean NOT NULL DEFAULT true,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_competitions_status ON public.competitions(competition_status);
CREATE INDEX idx_competitions_category ON public.competitions(category_id);

CREATE TRIGGER trg_competitions_updated_at
BEFORE UPDATE ON public.competitions
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Registrations
-- ============================================================================
CREATE TABLE public.competition_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('REG'),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registration_status registration_status NOT NULL DEFAULT 'registered',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_reference text,
    registered_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(competition_id, profile_id)
);

CREATE INDEX idx_comp_reg_profile ON public.competition_registrations(profile_id);

-- ============================================================================
-- Team Members (Future Ready)
-- ============================================================================
CREATE TABLE public.competition_team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid NOT NULL REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_team_lead boolean NOT NULL DEFAULT false,
    UNIQUE(registration_id, profile_id)
);

-- ============================================================================
-- Submissions
-- ============================================================================
CREATE TABLE public.competition_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid NOT NULL UNIQUE
        REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    media_file_id uuid REFERENCES public.media_files(id),
    submission_url text,
    remarks text,
    submitted_at timestamptz NOT NULL DEFAULT app.utc_now(),
    score numeric(8,2),
    evaluated_by uuid REFERENCES public.profiles(id),
    evaluated_at timestamptz
);

-- ============================================================================
-- Results
-- ============================================================================
CREATE TABLE public.competition_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    registration_id uuid NOT NULL REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    rank integer,
    certificate_type certificate_type NOT NULL,
    remarks text,
    announced_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(competition_id, registration_id)
);

CREATE INDEX idx_comp_results_competition
ON public.competition_results(competition_id);

COMMIT;
