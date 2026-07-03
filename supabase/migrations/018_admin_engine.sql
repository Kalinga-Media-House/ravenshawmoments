-- =============================================================================
-- Ravenshaw Moments
-- Migration : 018_admin_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Administration, moderation, audit and system configuration.
-- =============================================================================

BEGIN;

-- ============================================================================
-- System Settings
-- ============================================================================
CREATE TABLE public.system_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key varchar(150) NOT NULL UNIQUE,
    setting_value jsonb NOT NULL,
    description text,
    updated_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Audit Logs
-- ============================================================================
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id uuid REFERENCES public.profiles(id),
    action varchar(100) NOT NULL,
    entity_type entity_type,
    entity_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_audit_actor
ON public.audit_logs(actor_profile_id);

CREATE INDEX idx_audit_entity
ON public.audit_logs(entity_type, entity_id);

CREATE INDEX idx_audit_created
ON public.audit_logs(created_at DESC);

COMMENT ON TABLE public.audit_logs IS
'Immutable audit trail for administrative actions.';

-- ============================================================================
-- Moderation Queue
-- ============================================================================
CREATE TABLE public.moderation_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,
    submitted_by uuid REFERENCES public.profiles(id),
    approval_status approval_status NOT NULL DEFAULT 'pending',
    reviewed_by uuid REFERENCES public.profiles(id),
    reviewed_at timestamptz,
    remarks text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_moderation_status
ON public.moderation_queue(approval_status);

-- ============================================================================
-- Admin Announcements
-- ============================================================================
CREATE TABLE public.admin_announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(250) NOT NULL,
    message text NOT NULL,
    starts_at timestamptz,
    ends_at timestamptz,
    is_active boolean NOT NULL DEFAULT true,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_admin_announcements_updated_at
BEFORE UPDATE ON public.admin_announcements
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMIT;
