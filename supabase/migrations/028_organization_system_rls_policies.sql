-- =============================================================================
-- Ravenshaw Moments
-- Migration : 028_organization_system_rls_policies.sql
-- Purpose   : Enterprise RBAC, RLS, Granular Organization Permissions & Least Privilege
-- =============================================================================

-- Ensure RLS is enabled on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_publications ENABLE ROW LEVEL SECURITY;

-- Helper function: check if caller is super_admin (assumes existing function is_super_admin)
-- Helper function: check if caller has organization admin privileges
CREATE OR REPLACE FUNCTION public.is_organization_admin(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE org_id = target_org_id
      AND profile_id = auth.uid()
      AND status = 'active'
      AND (role IN ('executive', 'office_bearer') OR can_manage_org = true)
  ) OR EXISTS (
    SELECT 1 FROM public.organization_advisors
    WHERE org_id = target_org_id
      AND profile_id = auth.uid()
      AND is_current = true
  ) OR public.is_super_admin();
$$;

-- =============================================================================
-- 1. ORGANIZATIONS POLICIES
-- =============================================================================
CREATE POLICY "Public read verified active organizations" ON public.organizations
  FOR SELECT
  USING (is_active = true AND is_verified = true OR public.is_super_admin());

CREATE POLICY "Organization admins update organization" ON public.organizations
  FOR UPDATE
  USING (public.is_organization_admin(id))
  WITH CHECK (public.is_organization_admin(id));

CREATE POLICY "Super Admin manage organizations" ON public.organizations
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 2. ORGANIZATION MEMBERS POLICIES
-- =============================================================================
CREATE POLICY "Public read organization members" ON public.organization_members
  FOR SELECT
  USING (true);

CREATE POLICY "Organization admins manage members" ON public.organization_members
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));

-- =============================================================================
-- 3. ORGANIZATION ADVISORS POLICIES
-- =============================================================================
CREATE POLICY "Public read organization advisors" ON public.organization_advisors
  FOR SELECT
  USING (true);

CREATE POLICY "Super Admin manage advisors" ON public.organization_advisors
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 4. ORGANIZATION EVENTS POLICIES
-- =============================================================================
CREATE POLICY "Public read published events" ON public.organization_events
  FOR SELECT
  USING (is_published = true OR public.is_organization_admin(org_id));

CREATE POLICY "Organization admins manage events" ON public.organization_events
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));

-- =============================================================================
-- 5. ORGANIZATION GALLERY POLICIES
-- =============================================================================
CREATE POLICY "Public read gallery" ON public.organization_gallery
  FOR SELECT
  USING (true);

CREATE POLICY "Organization admins manage gallery" ON public.organization_gallery
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));

-- =============================================================================
-- 6. ORGANIZATION NOTICES POLICIES
-- =============================================================================
CREATE POLICY "Read organization notices" ON public.organization_notices
  FOR SELECT
  USING (
    audience = 'public' OR 
    public.is_organization_admin(org_id) OR
    (audience = 'members' AND EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = organization_notices.org_id AND profile_id = auth.uid() AND status = 'active'))
  );

CREATE POLICY "Organization admins manage notices" ON public.organization_notices
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));

-- =============================================================================
-- 7. ORGANIZATION ACHIEVEMENTS POLICIES
-- =============================================================================
CREATE POLICY "Public read achievements" ON public.organization_achievements
  FOR SELECT
  USING (true);

CREATE POLICY "Organization admins manage achievements" ON public.organization_achievements
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));

-- =============================================================================
-- 8. ORGANIZATION PUBLICATIONS POLICIES
-- =============================================================================
CREATE POLICY "Public read publications" ON public.organization_publications
  FOR SELECT
  USING (true);

CREATE POLICY "Organization admins manage publications" ON public.organization_publications
  FOR ALL
  USING (public.is_organization_admin(org_id))
  WITH CHECK (public.is_organization_admin(org_id));
