-- =============================================================================
-- Ravenshaw Moments
-- Migration : 046_platform_admin_role.sql
-- Purpose   : Platform Admin Role Implementation
-- =============================================================================
-- Implements the ADMIN role beneath SUPER_ADMIN with:
-- 1. is_platform_admin() helper (SUPER_ADMIN or ADMIN)
-- 2. Final SUPER_ADMIN protection trigger
-- 3. Role-assignment privilege-escalation prevention
-- 4. RLS policy updates for hostel admin write operations
-- =============================================================================
-- NOTE: app.is_admin_or_super() from migration 022 already grants SUPER_ADMIN,
--       ADMIN, and MODERATOR access to most content tables. This migration adds
--       a stricter is_platform_admin() that excludes MODERATOR, creates
--       privilege-escalation guards, and updates hostel-specific policies that
--       were still restricted to is_super_admin() only.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. Create is_platform_admin() helpers
-- ============================================================================
-- Returns true if the authenticated user has SUPER_ADMIN or ADMIN role.
-- This is stricter than app.is_admin_or_super() which also includes MODERATOR.

CREATE OR REPLACE FUNCTION app.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.profile_roles pr
    JOIN public.roles r ON r.id = pr.role_id
    WHERE pr.profile_id = app.current_profile_id()
      AND pr.is_active = true
      AND r.code IN ('SUPER_ADMIN', 'ADMIN')
);
$$;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.profile_roles pr
    JOIN public.roles r ON r.id = pr.role_id
    WHERE pr.profile_id = app.current_profile_id()
      AND pr.is_active = true
      AND r.code IN ('SUPER_ADMIN', 'ADMIN')
);
$$;

COMMENT ON FUNCTION app.is_platform_admin IS
'Returns true if the current user holds an active SUPER_ADMIN or ADMIN role.';
COMMENT ON FUNCTION public.is_platform_admin IS
'Returns true if the current user holds an active SUPER_ADMIN or ADMIN role (public schema).';

-- ============================================================================
-- 2. Final SUPER_ADMIN Protection Trigger
-- ============================================================================
-- Prevents deletion or deactivation of the final SUPER_ADMIN role assignment.

CREATE OR REPLACE FUNCTION app.protect_final_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
  v_role_code varchar;
  v_remaining_count integer;
BEGIN
  -- Determine role code for the affected row
  SELECT r.code INTO v_role_code
  FROM public.roles r
  WHERE r.id = COALESCE(OLD.role_id, NEW.role_id);

  -- Only guard SUPER_ADMIN
  IF v_role_code != 'SUPER_ADMIN' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -- For UPDATE: only guard if deactivating an active record
  IF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = true AND NEW.is_active = false THEN
      -- Count remaining active SUPER_ADMIN assignments excluding current row
      SELECT COUNT(*) INTO v_remaining_count
      FROM public.profile_roles pr
      JOIN public.roles r ON r.id = pr.role_id
      WHERE r.code = 'SUPER_ADMIN'
        AND pr.is_active = true
        AND pr.id != OLD.id;

      IF v_remaining_count < 1 THEN
        RAISE EXCEPTION 'Ravenshaw Moments must retain at least one active Super Admin.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  -- For DELETE: guard if deleting an active SUPER_ADMIN assignment
  IF TG_OP = 'DELETE' THEN
    IF OLD.is_active = true THEN
      SELECT COUNT(*) INTO v_remaining_count
      FROM public.profile_roles pr
      JOIN public.roles r ON r.id = pr.role_id
      WHERE r.code = 'SUPER_ADMIN'
        AND pr.is_active = true
        AND pr.id != OLD.id;

      IF v_remaining_count < 1 THEN
        RAISE EXCEPTION 'Ravenshaw Moments must retain at least one active Super Admin.';
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_final_super_admin ON public.profile_roles;

CREATE TRIGGER trg_protect_final_super_admin
BEFORE UPDATE OR DELETE ON public.profile_roles
FOR EACH ROW EXECUTE FUNCTION app.protect_final_super_admin();

COMMENT ON FUNCTION app.protect_final_super_admin IS
'Trigger function that prevents the removal of the last active SUPER_ADMIN.';

-- ============================================================================
-- 3. Role Assignment Privilege-Escalation Prevention
-- ============================================================================
-- Prevents ADMIN from assigning/revoking SUPER_ADMIN or ADMIN roles.
-- Only SUPER_ADMIN may assign/revoke these top-level roles.

CREATE OR REPLACE FUNCTION app.guard_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
  v_role_code varchar;
  v_caller_is_super_admin boolean;
BEGIN
  -- Determine the role code being assigned or modified
  SELECT r.code INTO v_role_code
  FROM public.roles r
  WHERE r.id = NEW.role_id;

  -- If assigning SUPER_ADMIN or ADMIN, require SUPER_ADMIN caller
  IF v_role_code IN ('SUPER_ADMIN', 'ADMIN') THEN
    v_caller_is_super_admin := app.is_super_admin();
    
    IF NOT v_caller_is_super_admin THEN
      RAISE EXCEPTION 'Only a Super Admin may assign or modify the % role.', v_role_code;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_role_assignment ON public.profile_roles;

CREATE TRIGGER trg_guard_role_assignment
BEFORE INSERT OR UPDATE ON public.profile_roles
FOR EACH ROW EXECUTE FUNCTION app.guard_role_assignment();

-- Guard for DELETE of SUPER_ADMIN/ADMIN role assignments
CREATE OR REPLACE FUNCTION app.guard_role_revocation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
  v_role_code varchar;
  v_caller_is_super_admin boolean;
BEGIN
  SELECT r.code INTO v_role_code
  FROM public.roles r
  WHERE r.id = OLD.role_id;

  IF v_role_code IN ('SUPER_ADMIN', 'ADMIN') THEN
    v_caller_is_super_admin := app.is_super_admin();
    
    IF NOT v_caller_is_super_admin THEN
      RAISE EXCEPTION 'Only a Super Admin may revoke the % role.', v_role_code;
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_role_revocation ON public.profile_roles;

CREATE TRIGGER trg_guard_role_revocation
BEFORE DELETE ON public.profile_roles
FOR EACH ROW EXECUTE FUNCTION app.guard_role_revocation();

COMMENT ON FUNCTION app.guard_role_assignment IS
'Prevents non-SUPER_ADMIN users from assigning SUPER_ADMIN or ADMIN roles.';
COMMENT ON FUNCTION app.guard_role_revocation IS
'Prevents non-SUPER_ADMIN users from revoking SUPER_ADMIN or ADMIN roles.';

-- ============================================================================
-- 4. Update Hostel RLS Policies to Allow Platform Admin Access
-- ============================================================================
-- The hostel RLS from migration 026 only checks public.is_super_admin().
-- Update the write policies to also allow ADMIN users.

-- Hostels write
DROP POLICY IF EXISTS "Super Admin write hostels" ON public.hostels;
CREATE POLICY "Platform Admin write hostels" ON public.hostels
  FOR ALL
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Hostel read policy: also allow platform admins to see all
DROP POLICY IF EXISTS "Public read verified active hostels" ON public.hostels;
CREATE POLICY "Public read verified active hostels" ON public.hostels
  FOR SELECT
  USING (is_active = true AND is_verified = true OR public.is_platform_admin());

-- Wardens write
DROP POLICY IF EXISTS "Super Admin write wardens" ON public.hostel_wardens;
CREATE POLICY "Platform Admin write wardens" ON public.hostel_wardens
  FOR ALL
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Wardens read
DROP POLICY IF EXISTS "Public read current wardens" ON public.hostel_wardens;
CREATE POLICY "Public read current wardens" ON public.hostel_wardens
  FOR SELECT
  USING (is_current = true OR public.is_platform_admin());

-- BMC write
DROP POLICY IF EXISTS "Super Admin write BMC members" ON public.hostel_bmcs;
CREATE POLICY "Platform Admin write BMC members" ON public.hostel_bmcs
  FOR ALL
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- BMC read
DROP POLICY IF EXISTS "Public read active BMC members" ON public.hostel_bmcs;
CREATE POLICY "Public read active BMC members" ON public.hostel_bmcs
  FOR SELECT
  USING (is_active = true OR public.is_platform_admin());

-- Achievements write
DROP POLICY IF EXISTS "Super Admin write achievements" ON public.hostel_achievements;
CREATE POLICY "Platform Admin write achievements" ON public.hostel_achievements
  FOR ALL
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Achievements read
DROP POLICY IF EXISTS "Public read verified achievements" ON public.hostel_achievements;
CREATE POLICY "Public read verified achievements" ON public.hostel_achievements
  FOR SELECT
  USING (is_verified = true OR public.is_platform_admin());

-- Notices: update to include platform admin
DROP POLICY IF EXISTS "BMC write notices" ON public.hostel_notices;
CREATE POLICY "BMC or Admin write notices" ON public.hostel_notices
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_platform_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_platform_admin());

-- Notice read: update to include platform admin
DROP POLICY IF EXISTS "Public read published notices" ON public.hostel_notices;
CREATE POLICY "Public read published notices" ON public.hostel_notices
  FOR SELECT
  USING (is_published = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_platform_admin());

-- Events: update to include platform admin
DROP POLICY IF EXISTS "BMC write events" ON public.hostel_events;
CREATE POLICY "BMC or Admin write events" ON public.hostel_events
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_platform_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_platform_admin());

DROP POLICY IF EXISTS "Public read published events" ON public.hostel_events;
CREATE POLICY "Public read published events" ON public.hostel_events
  FOR SELECT
  USING (is_published = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_platform_admin());

-- Gallery: update to include platform admin
DROP POLICY IF EXISTS "BMC write gallery items" ON public.hostel_gallery_items;
CREATE POLICY "BMC or Admin write gallery items" ON public.hostel_gallery_items
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_platform_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_platform_admin());

DROP POLICY IF EXISTS "Public read gallery items" ON public.hostel_gallery_items;
CREATE POLICY "Public read gallery items" ON public.hostel_gallery_items
  FOR SELECT
  USING (is_public = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_platform_admin());

-- Residents: update to include platform admin
DROP POLICY IF EXISTS "Student insert own resident record" ON public.hostel_residents;
CREATE POLICY "Student insert own resident record" ON public.hostel_residents
  FOR INSERT
  WITH CHECK (profile_id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS "Update resident record" ON public.hostel_residents;
CREATE POLICY "Update resident record" ON public.hostel_residents
  FOR UPDATE
  USING (
    profile_id = auth.uid()
    OR public.is_hostel_bmc_with_permission(hostel_id, 'can_verify_residents')
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "Public read verified residents" ON public.hostel_residents;
CREATE POLICY "Public read verified residents" ON public.hostel_residents
  FOR SELECT
  USING (
    is_verified_by_bmc = true
    OR profile_id = auth.uid()
    OR public.is_hostel_bmc_with_permission(hostel_id, 'can_verify_residents')
    OR public.is_platform_admin()
  );

-- ============================================================================
-- 5. Ensure profile_roles has RLS + Proper Policies
-- ============================================================================
-- Enable RLS on profile_roles if not already enabled
ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own role assignments
DROP POLICY IF EXISTS "Users read own roles" ON public.profile_roles;
CREATE POLICY "Users read own roles" ON public.profile_roles
  FOR SELECT TO authenticated
  USING (
    profile_id = app.current_profile_id()
    OR app.is_platform_admin()
  );

-- Allow platform admins to manage role assignments
-- The trg_guard_role_assignment trigger ensures escalation prevention
DROP POLICY IF EXISTS "Platform Admin manage roles" ON public.profile_roles;
CREATE POLICY "Platform Admin manage roles" ON public.profile_roles
  FOR ALL TO authenticated
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

-- ============================================================================
-- 6. Grant is_platform_admin to public RPC access
-- ============================================================================
-- Expose as an RPC callable from the application
CREATE OR REPLACE FUNCTION public.is_platform_admin_rpc()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT public.is_platform_admin();
$$;

COMMENT ON FUNCTION public.is_platform_admin_rpc IS
'RPC wrapper: returns true if the current user holds SUPER_ADMIN or ADMIN.';

COMMIT;
