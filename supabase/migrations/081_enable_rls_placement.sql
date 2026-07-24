-- =============================================================================
-- Ravenshaw Moments
-- Migration : 081_enable_rls_placement.sql
-- Purpose   : Enable RLS and create policies for 16 placement/career tables
-- Phase     : 1 of 6 (Security Hardening)
-- =============================================================================
-- ROLLBACK GUIDANCE
-- For each table: DROP POLICY IF EXISTS ... ON public.<table>;
-- ALTER TABLE public.<table> DISABLE ROW LEVEL SECURITY;
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL PLACEMENT TABLES
-- ============================================================================

ALTER TABLE public.student_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drive_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drive_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_counselling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. STUDENT PORTFOLIO TABLES (Owner CRUD + Admin All)
-- Pattern: Students manage their own data. Admins have full access.
-- Public can view (for placement portal / company review).
-- ============================================================================

-- student_resumes: profile_id column references the owner
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['student_resumes', 'student_skills', 'student_projects', 'student_experiences', 'student_certifications'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Drop existing policies for idempotency
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Owner Write Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Full Access" ON public.%I', tbl);

    -- Public can read all portfolio items (for placement portal)
    EXECUTE format('
      CREATE POLICY "Public Read Access" ON public.%I
      FOR SELECT
      USING (true);
    ', tbl);

    -- Owner can insert/update/delete their own records
    EXECUTE format('
      CREATE POLICY "Owner Write Access" ON public.%I
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
    ', tbl);

    -- Admin/Super Admin have full access
    EXECUTE format('
      CREATE POLICY "Admin Full Access" ON public.%I
      FOR ALL TO authenticated
      USING (app.is_admin_or_super())
      WITH CHECK (app.is_admin_or_super());
    ', tbl);
  END LOOP;
END $$;

-- ============================================================================
-- 3. COMPANIES (Public Read + Admin Write)
-- Companies are public reference data managed by admins.
-- ============================================================================

DROP POLICY IF EXISTS "Public Read Access" ON public.companies;
DROP POLICY IF EXISTS "Admin Full Access" ON public.companies;

CREATE POLICY "Public Read Access" ON public.companies
FOR SELECT
USING (true);

CREATE POLICY "Admin Full Access" ON public.companies
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- ============================================================================
-- 4. COMPANY CONTACTS (Admin Only — sensitive contact information)
-- ============================================================================

DROP POLICY IF EXISTS "Admin Only Access" ON public.company_contacts;

CREATE POLICY "Admin Only Access" ON public.company_contacts
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- ============================================================================
-- 5. PLACEMENT DRIVES & RELATED LOOKUP TABLES (Public Read + Admin Write)
-- Published placement drives are public. Only admins can create/modify.
-- ============================================================================

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['placement_drives', 'placement_drive_departments', 'placement_drive_skills', 'placement_rounds'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Full Access" ON public.%I', tbl);

    EXECUTE format('
      CREATE POLICY "Public Read Access" ON public.%I
      FOR SELECT
      USING (true);
    ', tbl);

    EXECUTE format('
      CREATE POLICY "Admin Full Access" ON public.%I
      FOR ALL TO authenticated
      USING (app.is_admin_or_super())
      WITH CHECK (app.is_admin_or_super());
    ', tbl);
  END LOOP;
END $$;

-- ============================================================================
-- 6. PLACEMENT REGISTRATIONS (Owner CRUD + Admin All)
-- Students register for drives. They manage their own registrations.
-- ============================================================================

DROP POLICY IF EXISTS "Public Read Access" ON public.placement_registrations;
DROP POLICY IF EXISTS "Owner Write Access" ON public.placement_registrations;
DROP POLICY IF EXISTS "Admin Full Access" ON public.placement_registrations;

CREATE POLICY "Public Read Access" ON public.placement_registrations
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.profiles WHERE id = profile_id
  )
  OR app.is_admin_or_super()
);

CREATE POLICY "Owner Write Access" ON public.placement_registrations
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

CREATE POLICY "Admin Full Access" ON public.placement_registrations
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- ============================================================================
-- 7. PLACEMENT INTERVIEWS & OFFERS (Owner Read + Admin All)
-- Students can view their own interviews/offers. Only admins can create/modify.
-- Linked via registration_id -> placement_registrations.profile_id
-- ============================================================================

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['placement_interviews', 'placement_offers'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Owner Read Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Full Access" ON public.%I', tbl);

    -- Owner can read their own records via registration_id FK
    EXECUTE format('
      CREATE POLICY "Owner Read Access" ON public.%I
      FOR SELECT TO authenticated
      USING (
        auth.uid() IN (
          SELECT p.auth_user_id
          FROM public.profiles p
          JOIN public.placement_registrations pr ON pr.profile_id = p.id
          WHERE pr.id = registration_id
        )
        OR app.is_admin_or_super()
      );
    ', tbl);

    -- Admin can do everything
    EXECUTE format('
      CREATE POLICY "Admin Full Access" ON public.%I
      FOR ALL TO authenticated
      USING (app.is_admin_or_super())
      WITH CHECK (app.is_admin_or_super());
    ', tbl);
  END LOOP;
END $$;

-- ============================================================================
-- 8. CAREER COUNSELLING & MOCK INTERVIEWS (Owner CRUD + Admin All)
-- Students manage their own sessions.
-- ============================================================================

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['career_counselling_sessions', 'mock_interviews'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Owner Read Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Owner Write Access" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Full Access" ON public.%I', tbl);

    -- Owner can read their own sessions
    EXECUTE format('
      CREATE POLICY "Owner Read Access" ON public.%I
      FOR SELECT TO authenticated
      USING (
        auth.uid() IN (
          SELECT auth_user_id FROM public.profiles WHERE id = student_profile_id
        )
        OR app.is_admin_or_super()
      );
    ', tbl);

    -- Owner can create/update/delete their own sessions
    EXECUTE format('
      CREATE POLICY "Owner Write Access" ON public.%I
      FOR ALL TO authenticated
      USING (
        auth.uid() IN (
          SELECT auth_user_id FROM public.profiles WHERE id = student_profile_id
        )
      )
      WITH CHECK (
        auth.uid() IN (
          SELECT auth_user_id FROM public.profiles WHERE id = student_profile_id
        )
      );
    ', tbl);

    -- Admin/Super Admin have full access
    EXECUTE format('
      CREATE POLICY "Admin Full Access" ON public.%I
      FOR ALL TO authenticated
      USING (app.is_admin_or_super())
      WITH CHECK (app.is_admin_or_super());
    ', tbl);
  END LOOP;
END $$;

COMMIT;
