-- =============================================================================
-- Ravenshaw Moments
-- Migration : 047_fix_is_super_admin_rpc.sql
-- Purpose   : Fix public.is_super_admin() to use the RBAC profile_roles table
-- =============================================================================
-- ROOT CAUSE:
--   public.is_super_admin() from migration 026 checks:
--     profiles.profile_type = 'super_admin'
--   But the platform's RBAC system stores roles in:
--     profile_roles + roles (where roles.code = 'SUPER_ADMIN')
--   This means the function returns false for users who have SUPER_ADMIN
--   in the RBAC system but whose profiles.profile_type is 'student'.
--
-- FIX:
--   Redefine public.is_super_admin() to check the canonical RBAC tables,
--   consistent with app.is_super_admin() from migration 019.
--   Also check profiles.profile_type as a legacy fallback for safety.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. Fix public.is_super_admin() to use the RBAC profile_roles table
-- ============================================================================
-- This replaces the legacy implementation from migration 026 which only
-- checked profiles.profile_type = 'super_admin'. The new version checks
-- the canonical RBAC system (profile_roles + roles) AND the legacy column
-- as a safety fallback.

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Primary: check the RBAC profile_roles table
    SELECT 1
    FROM public.profile_roles pr
    JOIN public.roles r ON r.id = pr.role_id
    WHERE pr.profile_id = (
      SELECT p.id FROM public.profiles p WHERE p.auth_user_id = auth.uid() LIMIT 1
    )
    AND pr.is_active = true
    AND r.code = 'SUPER_ADMIN'
  )
  OR EXISTS (
    -- Legacy fallback: check profiles.profile_type for backwards compatibility
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
    AND profile_type = 'super_admin'
  );
$$;

COMMENT ON FUNCTION public.is_super_admin IS
'Returns true if the current user holds an active SUPER_ADMIN role in the RBAC system (profile_roles) or has profile_type = super_admin (legacy fallback).';

-- ============================================================================
-- 2. Create a public.is_super_admin_rpc() wrapper for explicit RPC calls
-- ============================================================================
-- Some application code may call the function by the explicit _rpc name.
-- This ensures consistency.

CREATE OR REPLACE FUNCTION public.is_super_admin_rpc()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_super_admin();
$$;

COMMENT ON FUNCTION public.is_super_admin_rpc IS
'RPC wrapper: returns true if the current user holds SUPER_ADMIN role.';

COMMIT;
