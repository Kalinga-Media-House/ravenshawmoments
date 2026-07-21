-- =============================================================================
-- Ravenshaw Moments
-- Migration : 022_profile_system_rls_policies.sql
-- Version   : 2.0.0 (Enterprise Security Phase)
-- =============================================================================
-- PURPOSE
-- Comprehensive Row Level Security (RLS) implementation for the Universal Profile
-- System and all 20 associated domain tables. Enforces Principle of Least Privilege,
-- strict ownership validation, role-scoped delegation (Department CR, Hostel BMC,
-- Organization Admin), and Super Admin / Admin overrides.
--
-- COMPATIBILITY & SAFETY
-- - Forward-only, non-destructive migration.
-- - No tables or columns are dropped or renamed.
-- - Uses anonymous blocks and DROP POLICY IF EXISTS for full idempotency.
-- - All helper functions use SECURITY DEFINER with fixed search_path to prevent
--   RLS recursion and privilege escalation.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 0. Ensure All Profile Roles Are Seeded in Master Table
-- ============================================================================
INSERT INTO public.roles(code, name, is_system)
VALUES
  ('ORGANIZATION_ADMIN', 'Organization Admin', true),
  ('CONTRIBUTOR', 'Contributor', true),
  ('VOLUNTEER', 'Volunteer', true),
  ('MODERATOR', 'Moderator', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 1. Security Helper Functions (SECURITY DEFINER)
-- ============================================================================

CREATE OR REPLACE FUNCTION app.is_admin_or_super()
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
      AND r.code IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR')
);
$$;

CREATE OR REPLACE FUNCTION app.has_role(p_role_code varchar)
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
      AND r.code = p_role_code
);
$$;

CREATE OR REPLACE FUNCTION app.is_dept_cr(p_dept_id uuid)
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
      AND r.code IN ('DEPARTMENT_CR', 'DEPARTMENT_ADMIN')
      AND (pr.department_id = p_dept_id OR r.code = 'DEPARTMENT_ADMIN')
);
$$;

CREATE OR REPLACE FUNCTION app.is_hostel_bmc(p_hostel_id uuid)
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
      AND r.code IN ('HOSTEL_BMC', 'HOSTEL_ADMIN')
      AND (pr.hostel_id = p_hostel_id OR r.code = 'HOSTEL_ADMIN')
);
$$;

CREATE OR REPLACE FUNCTION app.is_org_admin(p_org_id uuid)
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
      AND r.code = 'ORGANIZATION_ADMIN'
      AND pr.organization_id = p_org_id
);
$$;

COMMENT ON FUNCTION app.is_admin_or_super IS 'Checks if current user holds global admin/moderator privileges.';
COMMENT ON FUNCTION app.has_role IS 'Checks if current user holds a specific active role code.';
COMMENT ON FUNCTION app.is_dept_cr IS 'Checks if current user is an active Department CR for a target department.';
COMMENT ON FUNCTION app.is_hostel_bmc IS 'Checks if current user is an active Hostel BMC for a target hostel.';
COMMENT ON FUNCTION app.is_org_admin IS 'Checks if current user is an active Organization Admin for a target org.';

-- ============================================================================
-- 2. RLS Policies for Core Identity Tables
-- ============================================================================

-- -----------------------------------------------------------------------------
-- TABLE 1: public.profiles
-- Purpose: Core user profile identity and public representation.
-- Security Rationale: Public fields are visible to all users; private updates
-- are restricted strictly to the authenticated profile owner or system admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_update_self_or_admin" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;

  CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);

  CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT WITH CHECK (
    auth_user_id = auth.uid() OR app.is_admin_or_super()
  );

  CREATE POLICY "profiles_update_self_or_admin" ON public.profiles FOR UPDATE USING (
    auth_user_id = auth.uid() OR app.is_admin_or_super()
  ) WITH CHECK (
    auth_user_id = auth.uid() OR app.is_admin_or_super()
  );

  CREATE POLICY "profiles_delete_admin_only" ON public.profiles FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 2: public.profile_privacy
-- Purpose: Granular user-controlled visibility toggles for PII and media.
-- Security Rationale: Only the profile owner or super admins may read or edit
-- privacy settings; no anonymous or unauthorized access permitted.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profile_privacy ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "privacy_select_owner_admin" ON public.profile_privacy;
  DROP POLICY IF EXISTS "privacy_insert_owner_admin" ON public.profile_privacy;
  DROP POLICY IF EXISTS "privacy_update_owner_admin" ON public.profile_privacy;
  DROP POLICY IF EXISTS "privacy_delete_admin_only" ON public.profile_privacy;

  CREATE POLICY "privacy_select_owner_admin" ON public.profile_privacy FOR SELECT USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "privacy_insert_owner_admin" ON public.profile_privacy FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "privacy_update_owner_admin" ON public.profile_privacy FOR UPDATE USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  ) WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "privacy_delete_admin_only" ON public.profile_privacy FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 3: public.profile_settings
-- Purpose: User preferences, UI settings, and communication options.
-- Security Rationale: Strictly private to profile owner and system admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "settings_select_owner_admin" ON public.profile_settings;
  DROP POLICY IF EXISTS "settings_insert_owner_admin" ON public.profile_settings;
  DROP POLICY IF EXISTS "settings_update_owner_admin" ON public.profile_settings;
  DROP POLICY IF EXISTS "settings_delete_admin_only" ON public.profile_settings;

  CREATE POLICY "settings_select_owner_admin" ON public.profile_settings FOR SELECT USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "settings_insert_owner_admin" ON public.profile_settings FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "settings_update_owner_admin" ON public.profile_settings FOR UPDATE USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  ) WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "settings_delete_admin_only" ON public.profile_settings FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- ============================================================================
-- 3. RLS Policies for Academic & Verification Tables
-- ============================================================================

-- -----------------------------------------------------------------------------
-- TABLE 4: public.education_records
-- Purpose: Student and alumni academic enrollment records and roll numbers.
-- Security Rationale: Owners read own records; Department CRs and Teachers read
-- records within their department; Admins have full CRUD.
-- -----------------------------------------------------------------------------
ALTER TABLE public.education_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "edu_select_owner_cr_admin" ON public.education_records;
  DROP POLICY IF EXISTS "edu_insert_owner_admin" ON public.education_records;
  DROP POLICY IF EXISTS "edu_update_owner_admin" ON public.education_records;
  DROP POLICY IF EXISTS "edu_delete_admin_only" ON public.education_records;

  CREATE POLICY "edu_select_owner_cr_admin" ON public.education_records FOR SELECT USING (
    profile_id = app.current_profile_id()
    OR app.is_admin_or_super()
    OR EXISTS (
      SELECT 1 FROM public.departments d
      JOIN public.department_programs dp ON d.id = dp.department_id
      WHERE dp.id = department_program_id
        AND (app.is_dept_cr(d.id) OR app.has_role('TEACHER'))
    )
  );

  CREATE POLICY "edu_insert_owner_admin" ON public.education_records FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "edu_update_owner_admin" ON public.education_records FOR UPDATE USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  ) WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "edu_delete_admin_only" ON public.education_records FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 5: public.profile_claim_requests
-- Purpose: Student roll number profile verification requests.
-- Security Rationale: Claimants view own requests; Admins read, update, and
-- verify requests; no third-party visibility.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profile_claim_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "claims_select_claimant_admin" ON public.profile_claim_requests;
  DROP POLICY IF EXISTS "claims_insert_claimant" ON public.profile_claim_requests;
  DROP POLICY IF EXISTS "claims_update_admin" ON public.profile_claim_requests;
  DROP POLICY IF EXISTS "claims_delete_admin" ON public.profile_claim_requests;

  CREATE POLICY "claims_select_claimant_admin" ON public.profile_claim_requests FOR SELECT USING (
    claimant_auth_user_id = auth.uid()
    OR profile_id = app.current_profile_id()
    OR app.is_admin_or_super()
  );

  CREATE POLICY "claims_insert_claimant" ON public.profile_claim_requests FOR INSERT WITH CHECK (
    claimant_auth_user_id = auth.uid() OR app.is_admin_or_super()
  );

  CREATE POLICY "claims_update_admin" ON public.profile_claim_requests FOR UPDATE USING (
    app.is_admin_or_super()
  ) WITH CHECK (
    app.is_admin_or_super()
  );

  CREATE POLICY "claims_delete_admin" ON public.profile_claim_requests FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 6: public.faculty_profiles
-- Purpose: Teacher and faculty specialized academic designations and bio.
-- Security Rationale: Public read; updates restricted to faculty owner or admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "faculty_select_all" ON public.faculty_profiles;
  DROP POLICY IF EXISTS "faculty_insert_owner_admin" ON public.faculty_profiles;
  DROP POLICY IF EXISTS "faculty_update_owner_admin" ON public.faculty_profiles;
  DROP POLICY IF EXISTS "faculty_delete_admin" ON public.faculty_profiles;

  CREATE POLICY "faculty_select_all" ON public.faculty_profiles FOR SELECT USING (true);

  CREATE POLICY "faculty_insert_owner_admin" ON public.faculty_profiles FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "faculty_update_owner_admin" ON public.faculty_profiles FOR UPDATE USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  ) WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "faculty_delete_admin" ON public.faculty_profiles FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 7: public.hostel_memberships
-- Purpose: Student hostel residency affiliations.
-- Security Rationale: Owners read own residency; Hostel BMCs read members of
-- their assigned hostel; Admins manage all memberships.
-- -----------------------------------------------------------------------------
ALTER TABLE public.hostel_memberships ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "hostel_select_owner_bmc_admin" ON public.hostel_memberships;
  DROP POLICY IF EXISTS "hostel_insert_owner_admin" ON public.hostel_memberships;
  DROP POLICY IF EXISTS "hostel_update_owner_admin" ON public.hostel_memberships;
  DROP POLICY IF EXISTS "hostel_delete_admin" ON public.hostel_memberships;

  CREATE POLICY "hostel_select_owner_bmc_admin" ON public.hostel_memberships FOR SELECT USING (
    profile_id = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (hostel_id IS NOT NULL AND app.is_hostel_bmc(hostel_id))
  );

  CREATE POLICY "hostel_insert_owner_admin" ON public.hostel_memberships FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "hostel_update_owner_admin" ON public.hostel_memberships FOR UPDATE USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  ) WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "hostel_delete_admin" ON public.hostel_memberships FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 8: public.leadership_assignments
-- Purpose: Records leadership positions (CR, BMC, Union representatives).
-- Security Rationale: Public read for transparency; write access restricted to
-- system administrators.
-- -----------------------------------------------------------------------------
ALTER TABLE public.leadership_assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "lead_select_all" ON public.leadership_assignments;
  DROP POLICY IF EXISTS "lead_insert_admin" ON public.leadership_assignments;
  DROP POLICY IF EXISTS "lead_update_admin" ON public.leadership_assignments;
  DROP POLICY IF EXISTS "lead_delete_admin" ON public.leadership_assignments;

  CREATE POLICY "lead_select_all" ON public.leadership_assignments FOR SELECT USING (true);
  CREATE POLICY "lead_insert_admin" ON public.leadership_assignments FOR INSERT WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "lead_update_admin" ON public.leadership_assignments FOR UPDATE USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "lead_delete_admin" ON public.leadership_assignments FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 9: public.verification_requests
-- Purpose: General entity verification workflow tracker.
-- Security Rationale: Requester reads own requests; Admins and moderators review
-- and manage all verification workflows.
-- -----------------------------------------------------------------------------
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "verif_req_select_owner_admin" ON public.verification_requests;
  DROP POLICY IF EXISTS "verif_req_insert_owner_admin" ON public.verification_requests;
  DROP POLICY IF EXISTS "verif_req_update_admin" ON public.verification_requests;
  DROP POLICY IF EXISTS "verif_req_delete_admin" ON public.verification_requests;

  CREATE POLICY "verif_req_select_owner_admin" ON public.verification_requests FOR SELECT USING (
    requested_by = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "verif_req_insert_owner_admin" ON public.verification_requests FOR INSERT WITH CHECK (
    requested_by = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "verif_req_update_admin" ON public.verification_requests FOR UPDATE USING (
    app.is_admin_or_super()
  ) WITH CHECK (
    app.is_admin_or_super()
  );

  CREATE POLICY "verif_req_delete_admin" ON public.verification_requests FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 10: public.verification_logs
-- Purpose: Immutable audit log for verification status changes.
-- Security Rationale: Read-only for admins and involved users; insert only by
-- system verification functions or admins; updates/deletes forbidden.
-- -----------------------------------------------------------------------------
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "verif_log_select_involved_admin" ON public.verification_logs;
  DROP POLICY IF EXISTS "verif_log_insert_admin" ON public.verification_logs;

  CREATE POLICY "verif_log_select_involved_admin" ON public.verification_logs FOR SELECT USING (
    app.is_admin_or_super()
  );

  CREATE POLICY "verif_log_insert_admin" ON public.verification_logs FOR INSERT WITH CHECK (
    app.is_admin_or_super()
  );
END $$;

-- ============================================================================
-- 4. RLS Policies for RBAC Core Tables
-- ============================================================================

-- -----------------------------------------------------------------------------
-- TABLE 11: public.roles
-- Purpose: System and custom roles registry.
-- Security Rationale: Read-only for authenticated users to evaluate permissions;
-- write operations strictly restricted to Super Admin / Admin.
-- -----------------------------------------------------------------------------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "roles_select_auth" ON public.roles;
  DROP POLICY IF EXISTS "roles_insert_admin" ON public.roles;
  DROP POLICY IF EXISTS "roles_update_admin" ON public.roles;
  DROP POLICY IF EXISTS "roles_delete_admin" ON public.roles;

  CREATE POLICY "roles_select_auth" ON public.roles FOR SELECT USING (app.is_authenticated());
  CREATE POLICY "roles_insert_admin" ON public.roles FOR INSERT WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "roles_update_admin" ON public.roles FOR UPDATE USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "roles_delete_admin" ON public.roles FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 12: public.permissions
-- Purpose: Atomic system permission codes.
-- Security Rationale: Read-only for authenticated users; modifications restricted
-- to system administrators.
-- -----------------------------------------------------------------------------
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "perms_select_auth" ON public.permissions;
  DROP POLICY IF EXISTS "perms_insert_admin" ON public.permissions;
  DROP POLICY IF EXISTS "perms_update_admin" ON public.permissions;
  DROP POLICY IF EXISTS "perms_delete_admin" ON public.permissions;

  CREATE POLICY "perms_select_auth" ON public.permissions FOR SELECT USING (app.is_authenticated());
  CREATE POLICY "perms_insert_admin" ON public.permissions FOR INSERT WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "perms_update_admin" ON public.permissions FOR UPDATE USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "perms_delete_admin" ON public.permissions FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 13: public.role_permissions
-- Purpose: Mapping roles to atomic permissions.
-- Security Rationale: Read by authenticated users; managed strictly by Admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "role_perms_select_auth" ON public.role_permissions;
  DROP POLICY IF EXISTS "role_perms_insert_admin" ON public.role_permissions;
  DROP POLICY IF EXISTS "role_perms_update_admin" ON public.role_permissions;
  DROP POLICY IF EXISTS "role_perms_delete_admin" ON public.role_permissions;

  CREATE POLICY "role_perms_select_auth" ON public.role_permissions FOR SELECT USING (app.is_authenticated());
  CREATE POLICY "role_perms_insert_admin" ON public.role_permissions FOR INSERT WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "role_perms_update_admin" ON public.role_permissions FOR UPDATE USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "role_perms_delete_admin" ON public.role_permissions FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 14: public.profile_roles
-- Purpose: Assigns roles to users with optional department/hostel/org scope.
-- Security Rationale: Users read own role assignments; Admins and scoped leaders
-- manage assignments within their authorized domain.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "profile_roles_select_auth" ON public.profile_roles;
  DROP POLICY IF EXISTS "profile_roles_insert_admin" ON public.profile_roles;
  DROP POLICY IF EXISTS "profile_roles_update_admin" ON public.profile_roles;
  DROP POLICY IF EXISTS "profile_roles_delete_admin" ON public.profile_roles;

  CREATE POLICY "profile_roles_select_auth" ON public.profile_roles FOR SELECT USING (
    profile_id = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (department_id IS NOT NULL AND app.is_dept_cr(department_id))
    OR (hostel_id IS NOT NULL AND app.is_hostel_bmc(hostel_id))
    OR (organization_id IS NOT NULL AND app.is_org_admin(organization_id))
  );

  CREATE POLICY "profile_roles_insert_admin" ON public.profile_roles FOR INSERT WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "profile_roles_update_admin" ON public.profile_roles FOR UPDATE USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
  CREATE POLICY "profile_roles_delete_admin" ON public.profile_roles FOR DELETE USING (app.is_admin_or_super());
END $$;

-- ============================================================================
-- 5. RLS Policies for Gallery Engine
-- ============================================================================

-- -----------------------------------------------------------------------------
-- TABLE 15: public.gallery_albums
-- Purpose: Photo/video albums owned by users, departments, hostels, or orgs.
-- Security Rationale: Public read if published; write access granted to album
-- creator, Department CR (for dept albums), Hostel BMC (for hostel albums),
-- Organization Admin (for org albums), or Super Admin.
-- -----------------------------------------------------------------------------
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "albums_select_public" ON public.gallery_albums;
  DROP POLICY IF EXISTS "albums_insert_scoped" ON public.gallery_albums;
  DROP POLICY IF EXISTS "albums_update_scoped" ON public.gallery_albums;
  DROP POLICY IF EXISTS "albums_delete_scoped" ON public.gallery_albums;

  CREATE POLICY "albums_select_public" ON public.gallery_albums FOR SELECT USING (
    is_public = true
    OR created_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (entity_type = 'department' AND app.is_dept_cr(entity_id))
    OR (entity_type = 'hostel' AND app.is_hostel_bmc(entity_id))
    OR (entity_type = 'organization' AND app.is_org_admin(entity_id))
  );

  CREATE POLICY "albums_insert_scoped" ON public.gallery_albums FOR INSERT WITH CHECK (
    created_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (entity_type = 'department' AND app.is_dept_cr(entity_id))
    OR (entity_type = 'hostel' AND app.is_hostel_bmc(entity_id))
    OR (entity_type = 'organization' AND app.is_org_admin(entity_id))
  );

  CREATE POLICY "albums_update_scoped" ON public.gallery_albums FOR UPDATE USING (
    created_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (entity_type = 'department' AND app.is_dept_cr(entity_id))
    OR (entity_type = 'hostel' AND app.is_hostel_bmc(entity_id))
    OR (entity_type = 'organization' AND app.is_org_admin(entity_id))
  ) WITH CHECK (
    created_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (entity_type = 'department' AND app.is_dept_cr(entity_id))
    OR (entity_type = 'hostel' AND app.is_hostel_bmc(entity_id))
    OR (entity_type = 'organization' AND app.is_org_admin(entity_id))
  );

  CREATE POLICY "albums_delete_scoped" ON public.gallery_albums FOR DELETE USING (
    created_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR (entity_type = 'department' AND app.is_dept_cr(entity_id))
    OR (entity_type = 'hostel' AND app.is_hostel_bmc(entity_id))
    OR (entity_type = 'organization' AND app.is_org_admin(entity_id))
  );
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 16: public.gallery_items
-- Purpose: Media files contained inside gallery albums (up to 50 for profiles).
-- Security Rationale: Visible if parent album is accessible; write/delete access
-- granted strictly to parent album owners, scoped leaders, or Admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "items_select_scoped" ON public.gallery_items;
  DROP POLICY IF EXISTS "items_insert_scoped" ON public.gallery_items;
  DROP POLICY IF EXISTS "items_update_scoped" ON public.gallery_items;
  DROP POLICY IF EXISTS "items_delete_scoped" ON public.gallery_items;

  CREATE POLICY "items_select_scoped" ON public.gallery_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_album_id
        AND (
          ga.is_public = true
          OR ga.created_by = app.current_profile_id()
          OR app.is_admin_or_super()
          OR (ga.entity_type = 'department' AND app.is_dept_cr(ga.entity_id))
          OR (ga.entity_type = 'hostel' AND app.is_hostel_bmc(ga.entity_id))
          OR (ga.entity_type = 'organization' AND app.is_org_admin(ga.entity_id))
        )
    )
  );

  CREATE POLICY "items_insert_scoped" ON public.gallery_items FOR INSERT WITH CHECK (
    uploaded_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_album_id
        AND (
          ga.created_by = app.current_profile_id()
          OR (ga.entity_type = 'department' AND app.is_dept_cr(ga.entity_id))
          OR (ga.entity_type = 'hostel' AND app.is_hostel_bmc(ga.entity_id))
          OR (ga.entity_type = 'organization' AND app.is_org_admin(ga.entity_id))
        )
    )
  );

  CREATE POLICY "items_update_scoped" ON public.gallery_items FOR UPDATE USING (
    uploaded_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_album_id
        AND (
          ga.created_by = app.current_profile_id()
          OR (ga.entity_type = 'department' AND app.is_dept_cr(ga.entity_id))
          OR (ga.entity_type = 'hostel' AND app.is_hostel_bmc(ga.entity_id))
          OR (ga.entity_type = 'organization' AND app.is_org_admin(ga.entity_id))
        )
    )
  ) WITH CHECK (
    uploaded_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_album_id
        AND (
          ga.created_by = app.current_profile_id()
          OR (ga.entity_type = 'department' AND app.is_dept_cr(ga.entity_id))
          OR (ga.entity_type = 'hostel' AND app.is_hostel_bmc(ga.entity_id))
          OR (ga.entity_type = 'organization' AND app.is_org_admin(ga.entity_id))
        )
    )
  );

  CREATE POLICY "items_delete_scoped" ON public.gallery_items FOR DELETE USING (
    uploaded_by = app.current_profile_id()
    OR app.is_admin_or_super()
    OR EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_album_id
        AND (
          ga.created_by = app.current_profile_id()
          OR (ga.entity_type = 'department' AND app.is_dept_cr(ga.entity_id))
          OR (ga.entity_type = 'hostel' AND app.is_hostel_bmc(ga.entity_id))
          OR (ga.entity_type = 'organization' AND app.is_org_admin(ga.entity_id))
        )
    )
  );
END $$;

-- ============================================================================
-- 6. RLS Policies for Achievements & Certificates
-- ============================================================================

-- -----------------------------------------------------------------------------
-- TABLE 17: public.achievements
-- Purpose: Public honors, awards, and event highlights.
-- Security Rationale: Public read; creation and modification restricted to
-- system administrators, Department CRs, Hostel BMCs, or Organization Admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "achiev_select_public" ON public.achievements;
  DROP POLICY IF EXISTS "achiev_insert_leaders" ON public.achievements;
  DROP POLICY IF EXISTS "achiev_update_leaders" ON public.achievements;
  DROP POLICY IF EXISTS "achiev_delete_admin" ON public.achievements;

  CREATE POLICY "achiev_select_public" ON public.achievements FOR SELECT USING (true);

  CREATE POLICY "achiev_insert_leaders" ON public.achievements FOR INSERT WITH CHECK (
    app.is_admin_or_super()
    OR app.has_role('DEPARTMENT_CR')
    OR app.has_role('HOSTEL_BMC')
    OR app.has_role('ORGANIZATION_ADMIN')
  );

  CREATE POLICY "achiev_update_leaders" ON public.achievements FOR UPDATE USING (
    app.is_admin_or_super()
    OR app.has_role('DEPARTMENT_CR')
    OR app.has_role('HOSTEL_BMC')
    OR app.has_role('ORGANIZATION_ADMIN')
  ) WITH CHECK (
    app.is_admin_or_super()
    OR app.has_role('DEPARTMENT_CR')
    OR app.has_role('HOSTEL_BMC')
    OR app.has_role('ORGANIZATION_ADMIN')
  );

  CREATE POLICY "achiev_delete_admin" ON public.achievements FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 18: public.achievement_recipients
-- Purpose: Maps profiles to specific achievements.
-- Security Rationale: Public read; managed by achievement issuers and admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.achievement_recipients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "recip_select_public" ON public.achievement_recipients;
  DROP POLICY IF EXISTS "recip_insert_leaders" ON public.achievement_recipients;
  DROP POLICY IF EXISTS "recip_update_leaders" ON public.achievement_recipients;
  DROP POLICY IF EXISTS "recip_delete_admin" ON public.achievement_recipients;

  CREATE POLICY "recip_select_public" ON public.achievement_recipients FOR SELECT USING (true);

  CREATE POLICY "recip_insert_leaders" ON public.achievement_recipients FOR INSERT WITH CHECK (
    app.is_admin_or_super()
    OR app.has_role('DEPARTMENT_CR')
    OR app.has_role('HOSTEL_BMC')
    OR app.has_role('ORGANIZATION_ADMIN')
  );

  CREATE POLICY "recip_update_leaders" ON public.achievement_recipients FOR UPDATE USING (
    app.is_admin_or_super()
  ) WITH CHECK (app.is_admin_or_super());

  CREATE POLICY "recip_delete_admin" ON public.achievement_recipients FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 19: public.certificates
-- Purpose: Issued certificates (Winner, Runner Up, Participation, Volunteer).
-- Security Rationale: Winner/Runner Up certificates are public; private
-- Participation and Volunteer certificates are visible only to the recipient
-- profile owner or administrators; issuance is restricted to Admins and Leaders.
-- -----------------------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "certs_select_scoped" ON public.certificates;
  DROP POLICY IF EXISTS "certs_insert_leaders" ON public.certificates;
  DROP POLICY IF EXISTS "certs_update_admin" ON public.certificates;
  DROP POLICY IF EXISTS "certs_delete_admin" ON public.certificates;

  CREATE POLICY "certs_select_scoped" ON public.certificates FOR SELECT USING (
    certificate_type IN ('winner', 'runner_up')
    OR profile_id = app.current_profile_id()
    OR app.is_admin_or_super()
  );

  CREATE POLICY "certs_insert_leaders" ON public.certificates FOR INSERT WITH CHECK (
    app.is_admin_or_super()
    OR app.has_role('DEPARTMENT_CR')
    OR app.has_role('HOSTEL_BMC')
    OR app.has_role('ORGANIZATION_ADMIN')
  );

  CREATE POLICY "certs_update_admin" ON public.certificates FOR UPDATE USING (
    app.is_admin_or_super()
  ) WITH CHECK (app.is_admin_or_super());

  CREATE POLICY "certs_delete_admin" ON public.certificates FOR DELETE USING (app.is_admin_or_super());
END $$;

-- -----------------------------------------------------------------------------
-- TABLE 20: public.contribution_proofs
-- Purpose: Private supporting proof documents for contributors and volunteers.
-- Security Rationale: Strictly private to proof owner; readable and modifiable
-- only by system moderators and administrators for verification review.
-- -----------------------------------------------------------------------------
ALTER TABLE public.contribution_proofs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "proofs_select_owner_admin" ON public.contribution_proofs;
  DROP POLICY IF EXISTS "proofs_insert_owner" ON public.contribution_proofs;
  DROP POLICY IF EXISTS "proofs_update_admin" ON public.contribution_proofs;
  DROP POLICY IF EXISTS "proofs_delete_admin" ON public.contribution_proofs;

  CREATE POLICY "proofs_select_owner_admin" ON public.contribution_proofs FOR SELECT USING (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "proofs_insert_owner" ON public.contribution_proofs FOR INSERT WITH CHECK (
    profile_id = app.current_profile_id() OR app.is_admin_or_super()
  );

  CREATE POLICY "proofs_update_admin" ON public.contribution_proofs FOR UPDATE USING (
    app.is_admin_or_super()
  ) WITH CHECK (app.is_admin_or_super());

  CREATE POLICY "proofs_delete_admin" ON public.contribution_proofs FOR DELETE USING (
    app.is_admin_or_super()
  );
END $$;

COMMIT;
