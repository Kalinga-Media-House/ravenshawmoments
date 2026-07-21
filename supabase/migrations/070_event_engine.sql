-- Migration: 070_event_engine
-- Purpose: Create the unified Event Engine schema and safely migrate legacy events.
-- Note: This is an ADDITIVE ONLY migration. Legacy tables are strictly preserved.

-- 1. Core Event Engine Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id TEXT NOT NULL UNIQUE DEFAULT app.generate_public_id('EVT'),
    scope_type VARCHAR(50) NOT NULL, -- 'UNIVERSITY', 'DEPARTMENT', 'HOSTEL', 'ORGANIZATION', 'COMPETITION', 'ALUMNI'
    scope_id UUID, -- Nullable for UNIVERSITY events
    
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    event_category VARCHAR(100) NOT NULL DEFAULT 'other', 
    
    venue VARCHAR(255) NOT NULL,
    event_start_time TIMESTAMPTZ NOT NULL,
    event_end_time TIMESTAMPTZ NOT NULL,
    
    cover_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    
    is_registration_required BOOLEAN NOT NULL DEFAULT false,
    registration_url TEXT,
    
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    visibility VARCHAR(50) NOT NULL DEFAULT 'public', -- 'public', 'university', 'department', 'hostel', 'organization', 'private'
    
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT chk_event_times CHECK (event_end_time > event_start_time)
);

COMMENT ON TABLE public.events IS 'Unified enterprise event engine supporting all organizational scopes.';

-- Add triggers for updated_at
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- 2. Data Migration from Legacy Tables
-- Safe insertion without dropping the originals

-- A. Migrate Department Events
INSERT INTO public.events (
    id, public_id, scope_type, scope_id, title, slug, description, event_category, venue, 
    event_start_time, event_end_time, cover_media_id, registration_url, is_registration_required, 
    organizer_id, is_published, is_featured, view_count, created_at, updated_at, visibility
)
SELECT 
    id, public_id, 'DEPARTMENT', department_id, title, slug, description, event_type, venue, 
    event_start_time, event_end_time, cover_media_id, registration_url, is_registration_required, 
    coordinator_profile_id, is_published, is_featured, view_count, created_at, updated_at, 'public'
FROM public.department_events
ON CONFLICT (id) DO NOTHING;

-- B. Migrate Hostel Events
-- For public_id we rely on the default if it wasn't provided, but let's just generate it inside the query.
INSERT INTO public.events (
    id, public_id, scope_type, scope_id, title, slug, description, event_category, venue, 
    event_start_time, event_end_time, registration_url, is_registration_required, 
    organizer_id, is_published, created_at, updated_at, visibility
)
SELECT 
    id, 'EVT' || substr(replace(id::text, '-', ''), 1, 6), 'HOSTEL', hostel_id, title, slug, description, category, venue, 
    start_time, end_time, registration_url, is_registration_required, 
    organizer_id, is_published, created_at, updated_at, 'public'
FROM public.hostel_events
ON CONFLICT (id) DO NOTHING;

-- C. Migrate Organization Events
INSERT INTO public.events (
    id, public_id, scope_type, scope_id, title, slug, description, event_category, venue, 
    event_start_time, event_end_time, registration_url, is_registration_required, 
    is_published, created_at, updated_at, visibility
)
SELECT 
    id, 'EVT' || substr(replace(id::text, '-', ''), 1, 6), 'ORGANIZATION', org_id, title, slug, description, category, venue, 
    start_time, end_time, registration_url, is_registration_required, 
    is_published, created_at, updated_at, 'public'
FROM public.organization_events
ON CONFLICT (id) DO NOTHING;

-- 3. Supporting Tables
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'draft', 'pending', 'approved', 'waitlisted', 'rejected', 'cancelled'
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(event_id, profile_id)
);

CREATE TABLE IF NOT EXISTS public.event_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    method VARCHAR(50) NOT NULL DEFAULT 'manual', -- 'qr', 'manual', 'bulk'
    checked_in_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(registration_id)
);

CREATE TABLE IF NOT EXISTS public.event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, profile_id)
);

CREATE TABLE IF NOT EXISTS public.event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    speaker_type VARCHAR(50) NOT NULL DEFAULT 'internal', -- 'internal', 'external'
    external_name VARCHAR(255),
    external_bio TEXT,
    external_company VARCHAR(255),
    role VARCHAR(100) NOT NULL DEFAULT 'guest', -- 'faculty', 'alumni', 'guest_speaker', 'expert', 'moderator', 'panelist'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'partner', -- 'title', 'gold', 'silver', 'bronze', 'partner', 'media'
    logo_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    website_url TEXT,
    contribution_amount NUMERIC(12,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    venue VARCHAR(255),
    speaker_id UUID REFERENCES public.event_speakers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_schedule_times CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS public.event_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    media_id UUID NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL DEFAULT 'document',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_live_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- 'coordinator', 'photography', 'hospitality', 'registration', 'technical', 'stage'
    hours_logged NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, profile_id, role)
);

CREATE TABLE IF NOT EXISTS public.event_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
    total_budget NUMERIC(12,2) DEFAULT 0,
    total_expenses NUMERIC(12,2) DEFAULT 0,
    sponsor_income NUMERIC(12,2) DEFAULT 0,
    other_revenue NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_event_budgets_updated_at
BEFORE UPDATE ON public.event_budgets
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_all" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_insert_all" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update_all" ON public.events FOR UPDATE USING (true);
CREATE POLICY "events_delete_all" ON public.events FOR DELETE USING (true);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_registrations_select_all" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "event_registrations_insert_all" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "event_registrations_update_all" ON public.event_registrations FOR UPDATE USING (true);
CREATE POLICY "event_registrations_delete_all" ON public.event_registrations FOR DELETE USING (true);

ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_attendance_select_all" ON public.event_attendance FOR SELECT USING (true);
CREATE POLICY "event_attendance_insert_all" ON public.event_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "event_attendance_update_all" ON public.event_attendance FOR UPDATE USING (true);

ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_speakers_select_all" ON public.event_speakers FOR SELECT USING (true);
CREATE POLICY "event_speakers_insert_all" ON public.event_speakers FOR INSERT WITH CHECK (true);
CREATE POLICY "event_speakers_update_all" ON public.event_speakers FOR UPDATE USING (true);
CREATE POLICY "event_speakers_delete_all" ON public.event_speakers FOR DELETE USING (true);

ALTER TABLE public.event_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_schedule_select_all" ON public.event_schedule FOR SELECT USING (true);
CREATE POLICY "event_schedule_insert_all" ON public.event_schedule FOR INSERT WITH CHECK (true);
CREATE POLICY "event_schedule_update_all" ON public.event_schedule FOR UPDATE USING (true);
CREATE POLICY "event_schedule_delete_all" ON public.event_schedule FOR DELETE USING (true);
