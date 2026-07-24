-- =============================================================================
-- Ravenshaw Moments
-- Migration : 085_function_security.sql
-- Purpose   : Function security audit and remediation
-- Phase     : 4-5 of 6 (Security Hardening)
-- =============================================================================
-- AUDIT RESULTS
-- All SECURITY DEFINER functions already have SET search_path. ✅
-- All competition functions already have proper GRANT/REVOKE. ✅
-- Only one function needs a GRANT fix: validate_finite_numeric.
-- =============================================================================
-- ROLLBACK GUIDANCE
-- REVOKE EXECUTE ON FUNCTION public.validate_finite_numeric FROM authenticated;
-- REVOKE EXECUTE ON FUNCTION public.is_super_admin_rpc FROM authenticated;
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. FUNCTION AUDIT SUMMARY
-- ============================================================================
-- The following SECURITY DEFINER functions were audited and confirmed SAFE:
--
-- FUNCTION                                    | search_path        | GRANT
-- -------------------------------------------|-------------------|------------------
-- handle_new_user()                           | public             | (trigger)
-- get_private_profile_fields(uuid)            | public             | authenticated
-- department_get_public_page(varchar)         | public, app        | anon, authenticated
-- department_search(varchar)                  | public, app        | anon, authenticated
-- department_refresh_statistics()             | public, app        | authenticated, service_role
-- app.sync_content_status()                   | public, app        | (trigger)
-- app.verify_student_roll_claim(...)          | public, app        | authenticated
-- app.is_admin_or_super()                     | public, app        | (RLS helper)
-- app.has_role(text)                          | public, app        | (RLS helper)
-- app.is_platform_admin()                     | public, app        | (RLS helper)
-- public.is_platform_admin_rpc()              | public             | authenticated
-- public.is_super_admin()                     | public             | (RLS helper)
-- public.is_hostel_bmc_with_permission(...)   | public             | (RLS helper)
-- public.is_organization_admin(uuid)          | public             | (RLS helper)
-- public.is_competition_admin(uuid)           | public, app        | authenticated
-- calculate_competition_rankings(uuid)        | public, app        | authenticated
-- resolve_competition_tie(...)                | public, app        | authenticated
-- finalize_and_publish_competition_results()  | public, app        | authenticated
-- get_competition_leaderboard(...)            | public, app        | anon, authenticated
-- get_competition_winners_gallery(...)        | public, app        | anon, authenticated
-- get_latest_category_winners(uuid)           | public             | anon, authenticated
-- get_category_winners_archive(...)           | public             | anon, authenticated
-- save_competition_workflow(...)              | pg_catalog, public | authenticated
-- get_explore_by_month(...)                   | pg_catalog, public | anon, authenticated
-- ============================================================================

-- ============================================================================
-- 2. FIX: validate_finite_numeric - has REVOKE FROM PUBLIC but no GRANT
-- This function is called internally by save_competition_workflow.
-- It needs EXECUTE for authenticated users.
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.validate_finite_numeric(jsonb, numeric, numeric, int)
TO authenticated;

-- ============================================================================
-- 3. FIX: is_super_admin_rpc - missing explicit GRANT in 047
-- Application code calls it via .rpc('is_super_admin_rpc')
-- ============================================================================

REVOKE ALL ON FUNCTION public.is_super_admin_rpc() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin_rpc() TO authenticated;

-- Also ensure is_super_admin() is restricted (used in RLS but also callable)
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ============================================================================
-- 4. DASHBOARD-DEFINED FUNCTIONS (Manual audit required)
-- ============================================================================
-- These RPCs are called by the application but NOT defined in migration files.
-- They must be manually audited in the Supabase Dashboard SQL Editor:
--
-- track_business_view(p_business_id uuid)
--   Called from: src/features/business/repositories/business.repository.ts
--   Required: SECURITY DEFINER + SET search_path + GRANT TO anon, authenticated
--
-- delete_user_account()
--   Called from: src/actions/student/account.actions.ts
--   Required: SECURITY DEFINER + SET search_path + GRANT TO authenticated
--
-- increment_department_notice_view(p_notice_id uuid)
--   Called from: src/lib/repositories/department.repository.ts
--   Required: SECURITY DEFINER + SET search_path + GRANT TO anon, authenticated
--
-- increment_mentee_count(mentor_profile_id uuid)
--   Called from: src/repositories/alumni/mentorship.repository.ts
--   Required: SECURITY DEFINER + SET search_path + GRANT TO authenticated
-- ============================================================================

COMMIT;
