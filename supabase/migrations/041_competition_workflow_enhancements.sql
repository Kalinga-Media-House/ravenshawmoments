-- =============================================================================
-- Ravenshaw Moments
-- Migration : 041_competition_workflow_enhancements.sql
-- =============================================================================
-- PURPOSE
-- Extends the competition engine to support the robust workflow required by
-- the admin creation process, public details page, scheduling, and submissions.
-- =============================================================================

BEGIN;

-- 1. Competition Mode Enum
DO $$ BEGIN
    CREATE TYPE competition_mode AS ENUM (
        'offline',
        'online',
        'hybrid'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enhance Competitions Table
ALTER TABLE public.competitions
    -- Competition Mode
    ADD COLUMN IF NOT EXISTS mode competition_mode NOT NULL DEFAULT 'offline',
    
    -- Event Scheduling (Real event dates, distinct from registration/submission)
    ADD COLUMN IF NOT EXISTS starts_at timestamptz,
    ADD COLUMN IF NOT EXISTS ends_at timestamptz,
    
    -- Venue
    ADD COLUMN IF NOT EXISTS venue_name varchar(250),
    ADD COLUMN IF NOT EXISTS venue_details text,
    ADD COLUMN IF NOT EXISTS reporting_instructions text,
    
    -- Participation & Eligibility Configuration
    ADD COLUMN IF NOT EXISTS min_team_size integer,
    ADD COLUMN IF NOT EXISTS max_team_size integer,
    ADD COLUMN IF NOT EXISTS external_participants_allowed boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS eligible_participant_types jsonb,
    ADD COLUMN IF NOT EXISTS eligibility_configuration jsonb,
    
    -- Content Fields
    ADD COLUMN IF NOT EXISTS short_description varchar(500),
    ADD COLUMN IF NOT EXISTS highlights jsonb,
    ADD COLUMN IF NOT EXISTS important_information jsonb,
    
    -- Submission Requirements
    ADD COLUMN IF NOT EXISTS submission_requirements jsonb,
    
    -- Organizer Relationships (Strict foreign keys instead of unconstrained polymorphic)
    ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES public.departments(id),
    ADD COLUMN IF NOT EXISTS hostel_id uuid REFERENCES public.hostels(id),
    ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id);

-- Safe Constraints for Scheduling and Team Size
DO $$ BEGIN
    ALTER TABLE public.competitions
    ADD CONSTRAINT chk_competitions_event_dates CHECK (ends_at >= starts_at),
    ADD CONSTRAINT chk_competitions_registration_dates CHECK (registration_close_at >= registration_open_at),
    ADD CONSTRAINT chk_competitions_submission_dates CHECK (submission_close_at >= submission_open_at),
    ADD CONSTRAINT chk_competitions_team_size CHECK (min_team_size > 0),
    ADD CONSTRAINT chk_competitions_max_team_size CHECK (max_team_size >= min_team_size),
    -- Ensure only one organizer is selected
    ADD CONSTRAINT chk_competitions_organizer CHECK (
        (department_id IS NOT NULL)::integer + 
        (hostel_id IS NOT NULL)::integer + 
        (organization_id IS NOT NULL)::integer <= 1
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Competition Prizes Table
CREATE TABLE IF NOT EXISTS public.competition_prizes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    position_name varchar(100) NOT NULL,
    prize_title varchar(250) NOT NULL,
    monetary_amount numeric(12,2) DEFAULT 0,
    currency varchar(3) DEFAULT 'INR',
    includes_trophy boolean NOT NULL DEFAULT false,
    includes_certificate boolean NOT NULL DEFAULT false,
    additional_description text,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_competition_prizes_amount CHECK (monetary_amount >= 0),
    CONSTRAINT chk_competition_prizes_order CHECK (display_order >= 0)
);

CREATE INDEX IF NOT EXISTS idx_comp_prizes_competition ON public.competition_prizes(competition_id);

DO $$ BEGIN
    CREATE TRIGGER trg_competition_prizes_updated_at
    BEFORE UPDATE ON public.competition_prizes
    FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Legal Document Architecture
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type varchar(100) NOT NULL,
    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

DO $$ BEGIN
    CREATE TRIGGER trg_legal_documents_updated_at
    BEFORE UPDATE ON public.legal_documents
    FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.legal_document_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id uuid NOT NULL REFERENCES public.legal_documents(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    content text NOT NULL,
    content_hash varchar(256),
    effective_at timestamptz NOT NULL DEFAULT app.utc_now(),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(document_id, version_number)
);

-- 5. Registration Consents
CREATE TABLE IF NOT EXISTS public.registration_consents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid NOT NULL REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    legal_document_id uuid NOT NULL REFERENCES public.legal_documents(id),
    legal_document_version_id uuid NOT NULL REFERENCES public.legal_document_versions(id),
    consent_type varchar(100) NOT NULL,
    accepted_at timestamptz NOT NULL DEFAULT app.utc_now(),
    consent_text_snapshot text,
    policy_url_reference text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(registration_id, legal_document_version_id)
);

CREATE INDEX IF NOT EXISTS idx_reg_consents_registration ON public.registration_consents(registration_id);

-- 6. Refund Configuration
CREATE TABLE IF NOT EXISTS public.competition_refund_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL UNIQUE REFERENCES public.competitions(id) ON DELETE CASCADE,
    refund_policy_type varchar(100) NOT NULL,
    refund_deadline timestamptz,
    refund_percentage numeric(5,2) CHECK (refund_percentage >= 0 AND refund_percentage <= 100),
    legal_document_version_id uuid REFERENCES public.legal_document_versions(id),
    custom_policy_note text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

DO $$ BEGIN
    CREATE TRIGGER trg_comp_refund_config_updated_at
    BEFORE UPDATE ON public.competition_refund_configurations
    FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 7. Add RLS Policies for new tables
ALTER TABLE public.competition_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_refund_configurations ENABLE ROW LEVEL SECURITY;

-- Competition Prizes (Public read, admin write)
DO $$ BEGIN
    CREATE POLICY "Public can view competition prizes" ON public.competition_prizes FOR SELECT USING (true);
    CREATE POLICY "Admins can manage competition prizes" ON public.competition_prizes FOR ALL USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Legal Documents (Public read, admin write)
DO $$ BEGIN
    CREATE POLICY "Public can view legal documents" ON public.legal_documents FOR SELECT USING (true);
    CREATE POLICY "Admins can manage legal documents" ON public.legal_documents FOR ALL USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Legal Document Versions (Public read, admin write)
DO $$ BEGIN
    CREATE POLICY "Public can view legal document versions" ON public.legal_document_versions FOR SELECT USING (true);
    CREATE POLICY "Admins can manage legal document versions" ON public.legal_document_versions FOR ALL USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Registration Consents (Users can view their own, admins can view all)
DO $$ BEGIN
    CREATE POLICY "Users can view their own consents" ON public.registration_consents FOR SELECT
        USING (registration_id IN (SELECT id FROM public.competition_registrations WHERE profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())));
    CREATE POLICY "Users can insert their own consents" ON public.registration_consents FOR INSERT
        WITH CHECK (registration_id IN (SELECT id FROM public.competition_registrations WHERE profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())));
    CREATE POLICY "Admins can view all consents" ON public.registration_consents FOR SELECT USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Refund Configurations (Public read, admin write)
DO $$ BEGIN
    CREATE POLICY "Public can view refund configurations" ON public.competition_refund_configurations FOR SELECT USING (true);
    CREATE POLICY "Admins can manage refund configurations" ON public.competition_refund_configurations FOR ALL USING (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

COMMIT;
