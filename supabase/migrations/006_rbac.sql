-- =============================================================================
-- Ravenshaw Moments
-- Migration : 006_rbac.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Role Based Access Control (RBAC)
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Roles
-- -----------------------------------------------------------------------------
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(50) NOT NULL UNIQUE,
    name varchar(100) NOT NULL UNIQUE,
    description text,
    is_system boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.roles IS 'System and custom roles.';

-- -----------------------------------------------------------------------------
-- Permissions
-- -----------------------------------------------------------------------------
CREATE TABLE public.permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module varchar(100) NOT NULL,
    action varchar(100) NOT NULL,
    code varchar(150) NOT NULL UNIQUE,
    description text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT uq_permission UNIQUE(module, action)
);

COMMENT ON TABLE public.permissions IS 'Atomic permissions.';

-- -----------------------------------------------------------------------------
-- Role Permissions
-- -----------------------------------------------------------------------------
CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    PRIMARY KEY(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_permission
ON public.role_permissions(permission_id);

-- -----------------------------------------------------------------------------
-- Profile Roles
-- -----------------------------------------------------------------------------
CREATE TABLE public.profile_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES public.roles(id),
    department_id uuid REFERENCES public.departments(id),
    hostel_id uuid REFERENCES public.hostels(id),
    organization_id uuid REFERENCES public.organizations(id),
    assigned_by uuid REFERENCES public.profiles(id),
    starts_at timestamptz NOT NULL DEFAULT app.utc_now(),
    ends_at timestamptz,
    is_active boolean NOT NULL DEFAULT true,
    remarks text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_role_scope CHECK (
      ((department_id IS NOT NULL)::int +
       (hostel_id IS NOT NULL)::int +
       (organization_id IS NOT NULL)::int) <= 1
    ),
    CONSTRAINT chk_role_dates CHECK (
      ends_at IS NULL OR ends_at >= starts_at
    )
);

CREATE INDEX idx_profile_roles_profile
ON public.profile_roles(profile_id);

CREATE INDEX idx_profile_roles_role
ON public.profile_roles(role_id);

CREATE INDEX idx_profile_roles_active
ON public.profile_roles(is_active);

CREATE TRIGGER trg_profile_roles_updated_at
BEFORE UPDATE ON public.profile_roles
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.profile_roles IS
'Assigns one or more roles to a profile with optional department, hostel or organization scope.';

COMMIT;
