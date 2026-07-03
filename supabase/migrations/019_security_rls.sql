-- =============================================================================
-- Ravenshaw Moments
-- Migration : 019_security_rls.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Enables Row Level Security (RLS) and provides helper functions and starter
-- policies. Extend these policies as application modules evolve.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Helper Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION app.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
SELECT id
FROM public.profiles
WHERE auth_user_id = auth.uid()
LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION app.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION app.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.profile_roles pr
    JOIN public.roles r ON r.id = pr.role_id
    WHERE pr.profile_id = app.current_profile_id()
      AND pr.is_active = true
      AND r.code = 'SUPER_ADMIN'
);
$$;

-- ============================================================================
-- Enable RLS
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_privacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Profiles
-- ============================================================================

CREATE POLICY profiles_public_read
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY profiles_self_update
ON public.profiles
FOR UPDATE
USING (
    auth_user_id = auth.uid()
    OR app.is_super_admin()
)
WITH CHECK (
    auth_user_id = auth.uid()
    OR app.is_super_admin()
);

-- ============================================================================
-- Profile Settings
-- ============================================================================

CREATE POLICY profile_settings_owner
ON public.profile_settings
FOR ALL
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
)
WITH CHECK (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

-- ============================================================================
-- Profile Privacy
-- ============================================================================

CREATE POLICY profile_privacy_owner
ON public.profile_privacy
FOR ALL
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
)
WITH CHECK (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

-- ============================================================================
-- Notifications
-- ============================================================================

CREATE POLICY notifications_owner_read
ON public.notifications
FOR SELECT
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

CREATE POLICY notifications_owner_update
ON public.notifications
FOR UPDATE
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

-- ============================================================================
-- Payments
-- ============================================================================

CREATE POLICY payments_owner
ON public.payments
FOR SELECT
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

-- ============================================================================
-- Donations
-- ============================================================================

CREATE POLICY donations_owner
ON public.donations
FOR SELECT
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

-- ============================================================================
-- Certificates
-- ============================================================================

CREATE POLICY certificates_owner
ON public.certificates
FOR SELECT
USING (
    profile_id = app.current_profile_id()
    OR app.is_super_admin()
);

COMMENT ON FUNCTION app.current_profile_id IS
'Returns the current authenticated profile UUID.';
COMMENT ON FUNCTION app.is_super_admin IS
'Checks whether the current profile has the SUPER_ADMIN role.';

COMMIT;
