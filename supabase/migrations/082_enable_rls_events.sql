-- =============================================================================
-- Ravenshaw Moments
-- Migration : 082_enable_rls_events.sql
-- Purpose   : Enable RLS on 6 missing event tables + tighten existing permissive policies
-- Phase     : 1 of 6 (Security Hardening)
-- =============================================================================
-- ROLLBACK GUIDANCE
-- To rollback: DROP POLICY IF EXISTS ... ON public.<table>;
-- Recreate original permissive policies from 070_event_engine.sql
-- ALTER TABLE public.<table> DISABLE ROW LEVEL SECURITY;
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. ENABLE RLS ON 6 MISSING EVENT TABLES
-- ============================================================================

ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_live_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_budgets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. TIGHTEN EXISTING OVERLY-PERMISSIVE EVENT POLICIES
-- The original 070 migration used USING(true) for ALL operations.
-- This means anyone (including unauthenticated users) could create/modify/delete events.
-- We now restrict writes to admins while keeping public reads.
-- ============================================================================

-- events: Public read, Admin write
DROP POLICY IF EXISTS "events_select_all" ON public.events;
DROP POLICY IF EXISTS "events_insert_all" ON public.events;
DROP POLICY IF EXISTS "events_update_all" ON public.events;
DROP POLICY IF EXISTS "events_delete_all" ON public.events;
DROP POLICY IF EXISTS "Public Read Access" ON public.events;
DROP POLICY IF EXISTS "Admin Full Access" ON public.events;

CREATE POLICY "Public Read Access" ON public.events
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.events
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_registrations: Authenticated users can read/register, Admin manages all
DROP POLICY IF EXISTS "event_registrations_select_all" ON public.event_registrations;
DROP POLICY IF EXISTS "event_registrations_insert_all" ON public.event_registrations;
DROP POLICY IF EXISTS "event_registrations_update_all" ON public.event_registrations;
DROP POLICY IF EXISTS "event_registrations_delete_all" ON public.event_registrations;
DROP POLICY IF EXISTS "Owner Read Access" ON public.event_registrations;
DROP POLICY IF EXISTS "Owner Write Access" ON public.event_registrations;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_registrations;

CREATE POLICY "Owner Read Access" ON public.event_registrations
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
  OR app.is_admin_or_super()
);

CREATE POLICY "Owner Write Access" ON public.event_registrations
FOR ALL TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
);

CREATE POLICY "Admin Full Access" ON public.event_registrations
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_attendance: Read by owner (via registration), Admin manages
DROP POLICY IF EXISTS "event_attendance_select_all" ON public.event_attendance;
DROP POLICY IF EXISTS "event_attendance_insert_all" ON public.event_attendance;
DROP POLICY IF EXISTS "event_attendance_update_all" ON public.event_attendance;
DROP POLICY IF EXISTS "Owner Read Access" ON public.event_attendance;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_attendance;

CREATE POLICY "Owner Read Access" ON public.event_attendance
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT p.auth_user_id
    FROM public.profiles p
    JOIN public.event_registrations er ON er.profile_id = p.id
    WHERE er.id = registration_id
  )
  OR app.is_admin_or_super()
);

CREATE POLICY "Admin Full Access" ON public.event_attendance
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_speakers: Public read, Admin write
DROP POLICY IF EXISTS "event_speakers_select_all" ON public.event_speakers;
DROP POLICY IF EXISTS "event_speakers_insert_all" ON public.event_speakers;
DROP POLICY IF EXISTS "event_speakers_update_all" ON public.event_speakers;
DROP POLICY IF EXISTS "event_speakers_delete_all" ON public.event_speakers;
DROP POLICY IF EXISTS "Public Read Access" ON public.event_speakers;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_speakers;

CREATE POLICY "Public Read Access" ON public.event_speakers
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.event_speakers
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_schedule: Public read, Admin write
DROP POLICY IF EXISTS "event_schedule_select_all" ON public.event_schedule;
DROP POLICY IF EXISTS "event_schedule_insert_all" ON public.event_schedule;
DROP POLICY IF EXISTS "event_schedule_update_all" ON public.event_schedule;
DROP POLICY IF EXISTS "event_schedule_delete_all" ON public.event_schedule;
DROP POLICY IF EXISTS "Public Read Access" ON public.event_schedule;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_schedule;

CREATE POLICY "Public Read Access" ON public.event_schedule
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.event_schedule
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- ============================================================================
-- 3. POLICIES FOR NEWLY RLS-ENABLED EVENT TABLES
-- ============================================================================

-- event_feedback: Public can read, Authenticated users can submit their own feedback
DROP POLICY IF EXISTS "Public Read Access" ON public.event_feedback;
DROP POLICY IF EXISTS "Owner Write Access" ON public.event_feedback;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_feedback;

CREATE POLICY "Public Read Access" ON public.event_feedback
FOR SELECT USING (true);

CREATE POLICY "Owner Write Access" ON public.event_feedback
FOR ALL TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
);

CREATE POLICY "Admin Full Access" ON public.event_feedback
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_sponsors: Public read, Admin write
DROP POLICY IF EXISTS "Public Read Access" ON public.event_sponsors;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_sponsors;

CREATE POLICY "Public Read Access" ON public.event_sponsors
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.event_sponsors
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_resources: Public read, Admin write
DROP POLICY IF EXISTS "Public Read Access" ON public.event_resources;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_resources;

CREATE POLICY "Public Read Access" ON public.event_resources
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.event_resources
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_live_updates: Public read, Admin write
DROP POLICY IF EXISTS "Public Read Access" ON public.event_live_updates;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_live_updates;

CREATE POLICY "Public Read Access" ON public.event_live_updates
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access" ON public.event_live_updates
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_volunteers: Owner can view/manage their own, Admin manages all
DROP POLICY IF EXISTS "Owner Read Access" ON public.event_volunteers;
DROP POLICY IF EXISTS "Owner Write Access" ON public.event_volunteers;
DROP POLICY IF EXISTS "Admin Full Access" ON public.event_volunteers;

CREATE POLICY "Owner Read Access" ON public.event_volunteers
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
  OR app.is_admin_or_super()
);

CREATE POLICY "Owner Write Access" ON public.event_volunteers
FOR ALL TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
);

CREATE POLICY "Admin Full Access" ON public.event_volunteers
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- event_budgets: Admin only (sensitive financial data)
DROP POLICY IF EXISTS "Admin Only Access" ON public.event_budgets;

CREATE POLICY "Admin Only Access" ON public.event_budgets
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

COMMIT;
