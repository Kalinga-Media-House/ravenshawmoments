-- =============================================================================
-- Ravenshaw Moments
-- Migration : 026_hostel_system_rls_policies.sql
-- Purpose   : Enterprise RBAC, RLS, Granular BMC Permissions & Least Privilege
-- =============================================================================

-- Ensure RLS is enabled on all tables
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_bmcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_achievements ENABLE ROW LEVEL SECURITY;

-- Helper function: check if caller is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND profile_type = 'super_admin'
  );
$$;

-- Helper function: check if caller is active BMC member with specific permission
CREATE OR REPLACE FUNCTION public.is_hostel_bmc_with_permission(target_hostel_id UUID, perm_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hostel_bmcs
    WHERE hostel_id = target_hostel_id
      AND profile_id = app.current_profile_id()
      AND is_active = true
      AND (
        role_title = 'general_secretary' OR
        COALESCE((permissions_grant->>perm_key)::boolean, false) = true
      )
  );
$$;

-- =============================================================================
-- 1. HOSTELS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read verified active hostels" ON public.hostels;
DROP POLICY IF EXISTS "Admins can manage all hostels" ON public.hostels;

CREATE POLICY "Public read verified active hostels" ON public.hostels
  FOR SELECT
  USING (is_active = true AND is_verified = true OR public.is_super_admin());

CREATE POLICY "Super Admin write hostels" ON public.hostels
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 2. WARDENS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read current wardens" ON public.hostel_wardens;

CREATE POLICY "Public read current wardens" ON public.hostel_wardens
  FOR SELECT
  USING (is_current = true OR public.is_super_admin());

CREATE POLICY "Super Admin write wardens" ON public.hostel_wardens
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 3. BMC POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read active BMC members" ON public.hostel_bmcs;

CREATE POLICY "Public read active BMC members" ON public.hostel_bmcs
  FOR SELECT
  USING (is_active = true OR public.is_super_admin());

CREATE POLICY "Super Admin write BMC members" ON public.hostel_bmcs
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 4. RESIDENTS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read verified residents" ON public.hostel_residents;

CREATE POLICY "Public read verified residents" ON public.hostel_residents
  FOR SELECT
  USING (
    is_verified_by_bmc = true
    OR profile_id = auth.uid()
    OR public.is_hostel_bmc_with_permission(hostel_id, 'can_verify_residents')
    OR public.is_super_admin()
  );

CREATE POLICY "Student insert own resident record" ON public.hostel_residents
  FOR INSERT
  WITH CHECK (profile_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Update resident record" ON public.hostel_residents
  FOR UPDATE
  USING (
    profile_id = auth.uid()
    OR public.is_hostel_bmc_with_permission(hostel_id, 'can_verify_residents')
    OR public.is_super_admin()
  );

-- =============================================================================
-- 5. NOTICES POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read published notices" ON public.hostel_notices;

CREATE POLICY "Public read published notices" ON public.hostel_notices
  FOR SELECT
  USING (is_published = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_super_admin());

CREATE POLICY "BMC write notices" ON public.hostel_notices
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_super_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_post_notices') OR public.is_super_admin());

-- =============================================================================
-- 6. EVENTS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read published events" ON public.hostel_events;

CREATE POLICY "Public read published events" ON public.hostel_events
  FOR SELECT
  USING (is_published = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_super_admin());

CREATE POLICY "BMC write events" ON public.hostel_events
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_super_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_events') OR public.is_super_admin());

-- =============================================================================
-- 7. GALLERY POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read public gallery items" ON public.hostel_gallery_items;

CREATE POLICY "Public read gallery items" ON public.hostel_gallery_items
  FOR SELECT
  USING (is_public = true OR public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_super_admin());

CREATE POLICY "BMC write gallery items" ON public.hostel_gallery_items
  FOR ALL
  USING (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_super_admin())
  WITH CHECK (public.is_hostel_bmc_with_permission(hostel_id, 'can_manage_gallery') OR public.is_super_admin());

-- =============================================================================
-- 8. ACHIEVEMENTS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Public can read verified achievements" ON public.hostel_achievements;

CREATE POLICY "Public read verified achievements" ON public.hostel_achievements
  FOR SELECT
  USING (is_verified = true OR public.is_super_admin());

CREATE POLICY "Super Admin write achievements" ON public.hostel_achievements
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
