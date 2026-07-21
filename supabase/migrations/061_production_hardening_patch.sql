-- ============================================================================
-- Ravenshaw Moments
-- Migration : 061_production_hardening_patch.sql
-- Purpose   : Final Production Hardening (Search, Triggers, Security, Refresh)
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE
-- To rollback this migration:
-- 1. DROP TRIGGER IF EXISTS trg_sync_content_status ON public.content_items;
-- 2. DROP FUNCTION IF EXISTS app.sync_content_status();
-- 3. DROP INDEX IF EXISTS idx_departments_name_trgm;
-- 4. DROP INDEX IF EXISTS idx_department_programs_name_trgm;
-- 5. Restore original department_refresh_statistics() function.
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX 1: SEARCH OPTIMIZATION (pg_trgm)
-- ============================================================================
-- The previous search implementation relied on ILIKE which triggers sequential 
-- scans. Enabling pg_trgm and applying GIN indexes ensures ILIKE queries utilize 
-- the index for lightning-fast partial matching.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_departments_name_trgm 
ON public.departments USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_department_programs_name_trgm 
ON public.department_programs USING gin (program_name gin_trgm_ops);

-- ============================================================================
-- FIX 2: CONTENT STATUS SYNCHRONIZATION
-- ============================================================================
-- Migration 058 introduced a robust 'status' enum pattern but left the legacy 
-- 'is_published' boolean vulnerable to sync drift if updated by older APIs.
-- We deploy a two-way sync trigger to permanently solve this without dropping 
-- the column, guaranteeing 100% backward compatibility for legacy API inserts.

CREATE OR REPLACE FUNCTION app.sync_content_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
BEGIN
    -- Scenario A: Legacy API explicitly modifies `is_published` directly
    IF (TG_OP = 'UPDATE' AND NEW.is_published IS DISTINCT FROM OLD.is_published AND NEW.status = OLD.status) OR
       (TG_OP = 'INSERT' AND NEW.is_published = true AND NEW.status = 'draft') THEN
        
        IF NEW.is_published THEN
            NEW.status := 'published';
        ELSE
            NEW.status := 'draft';
        END IF;

    -- Scenario B: Modern API natively modifies `status` enum
    ELSE
        NEW.is_published := (NEW.status = 'published');
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_content_status ON public.content_items;
CREATE TRIGGER trg_sync_content_status
BEFORE INSERT OR UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION app.sync_content_status();

-- ============================================================================
-- FIX 3: MATERIALIZED VIEW REFRESH AUTOMATION
-- ============================================================================
-- Implements pg_cron to ensure mv_department_statistics stays fresh automatically.
-- NOTE: Requires pg_cron extension to be enabled in Supabase Dashboard.
-- If pg_cron is unavailable, Supabase Edge Functions must hit the refresh RPC.

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
    -- Safely attempt to schedule the cron job if pg_cron is active
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Schedule refresh every 5 minutes
        PERFORM cron.schedule(
            'refresh_dept_stats',
            '*/5 * * * *',
            'SELECT public.department_refresh_statistics();'
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Fail silently if permissions or environment block pg_cron execution
        RAISE NOTICE 'pg_cron schedule failed. Ensure Edge Functions trigger the refresh.';
END $$;

-- ============================================================================
-- FIX 4: VERIFIED SNAPSHOT INTEGRITY (Audit Confirmed)
-- ============================================================================
-- Architecture Audit verified that `department_students.source_education_record_id`
-- correctly utilizes `ON DELETE SET NULL`. No schema modifications are required.

-- ============================================================================
-- FIX 5 & 6: SECURITY & PRIVILEGE ESCALATION PREVENTION
-- ============================================================================
-- The previous migration granted EXECUTE to `authenticated` for the refresh RPC.
-- This introduced a DDoS vulnerability where any logged-in user could spam the 
-- materialized view refresh. We restrict this to Admins and the Service Role.

REVOKE ALL ON FUNCTION public.department_refresh_statistics() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.department_refresh_statistics() FROM authenticated;
REVOKE ALL ON FUNCTION public.department_refresh_statistics() FROM anon;

CREATE OR REPLACE FUNCTION public.department_refresh_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
BEGIN
    -- Strict execution barrier: Must be an Admin/Super Admin, OR the Supabase Service Role
    IF current_user NOT IN ('postgres', 'service_role', 'supabase_admin') THEN
        IF NOT app.is_admin_or_super() THEN
            RAISE EXCEPTION 'Access Denied: Requires administrative privileges to invoke refresh.';
        END IF;
    END IF;
    
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_department_statistics;
END;
$$;

-- Grant to authenticated (the function internal logic now safely blocks non-admins)
GRANT EXECUTE ON FUNCTION public.department_refresh_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.department_refresh_statistics() TO service_role;

-- Hardening the public RPCs (Removing PUBLIC grants, strictly explicit)
REVOKE ALL ON FUNCTION public.department_get_public_page(varchar) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.department_get_public_page(varchar) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.department_search(varchar) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.department_search(varchar) TO anon, authenticated;

COMMIT;

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================
/*
-- Verify GIN Indexes
SELECT indexname, indexdef FROM pg_indexes WHERE indexname LIKE '%trgm%';

-- Verify Content Trigger
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers WHERE trigger_name = 'trg_sync_content_status';

-- Verify Cron Job
SELECT jobname, schedule, command FROM cron.job WHERE jobname = 'refresh_dept_stats';

-- Verify Security Execution Grants
SELECT routine_name, grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name IN ('department_refresh_statistics', 'department_get_public_page', 'department_search')
AND grantee IN ('anon', 'authenticated', 'service_role');
*/
