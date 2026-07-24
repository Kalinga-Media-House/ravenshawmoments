-- =============================================================================
-- Ravenshaw Moments
-- Migration : 083_rls_policies_community.sql
-- Purpose   : Add missing policies for community hub, news, and donation tables
-- Phase     : 2 of 6 (Security Hardening)
-- =============================================================================
-- ROLLBACK GUIDANCE
-- DROP POLICY IF EXISTS ... ON public.<table>;
-- ALTER TABLE public.content_reports DISABLE ROW LEVEL SECURITY;
-- =============================================================================
-- NOTE: Community Hub tables are NOT live yet. Policies are intentionally
-- restrictive (Admin/Super Admin only) until the feature launches.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. COMMUNITY HUB TABLES (Not Live — Admin/Super Admin Only)
-- These 11 tables have RLS enabled in 078_community_hub.sql but NO policies.
-- Until the community feature launches, only admins should access them.
-- ============================================================================

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'group_members',
    'post_media',
    'polls',
    'poll_options',
    'poll_votes',
    'saved_posts',
    'shared_posts',
    'hashtags',
    'post_hashtags',
    'mentions',
    'follow_relationships'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Drop any existing policies for idempotency
    EXECUTE format('DROP POLICY IF EXISTS "Admin Only Access" ON public.%I', tbl);

    -- Only Admin/Super Admin can access these tables until feature launch
    EXECUTE format('
      CREATE POLICY "Admin Only Access" ON public.%I
      FOR ALL TO authenticated
      USING (app.is_admin_or_super())
      WITH CHECK (app.is_admin_or_super());
    ', tbl);
  END LOOP;
END $$;

-- ============================================================================
-- 2. CONTENT REPORTS (Missing RLS entirely from 074_news_publications.sql)
-- Users can submit reports. Only admins can read/manage them.
-- ============================================================================

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated Insert Access" ON public.content_reports;
DROP POLICY IF EXISTS "Admin Full Access" ON public.content_reports;

-- Any authenticated user can submit a content report
CREATE POLICY "Authenticated Insert Access" ON public.content_reports
FOR INSERT TO authenticated
WITH CHECK (true);

-- Only admins can read/update/delete reports
CREATE POLICY "Admin Full Access" ON public.content_reports
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- ============================================================================
-- 3. DONATION TABLES (RLS enabled but NO policies in 075_donations_endowment.sql)
-- ============================================================================

-- fund_allocations: Admin internal tracking
DROP POLICY IF EXISTS "Admin Read Write Access" ON public.fund_allocations;

CREATE POLICY "Admin Read Write Access" ON public.fund_allocations
FOR ALL TO authenticated
USING (app.is_admin_or_super())
WITH CHECK (app.is_admin_or_super());

-- donation_audit_logs: Admin read-only audit trail
DROP POLICY IF EXISTS "Admin Read Access" ON public.donation_audit_logs;

CREATE POLICY "Admin Read Access" ON public.donation_audit_logs
FOR SELECT TO authenticated
USING (app.is_admin_or_super());

-- Admin can insert audit log entries (system-generated)
DROP POLICY IF EXISTS "Admin Insert Access" ON public.donation_audit_logs;

CREATE POLICY "Admin Insert Access" ON public.donation_audit_logs
FOR INSERT TO authenticated
WITH CHECK (app.is_admin_or_super());

COMMIT;
