-- =============================================================================
-- Ravenshaw Moments
-- Migration : 013_certificate_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Certificate Engine
-- Supports competition, achievement, volunteer, organizer and custom
-- certificates with QR verification.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Certificate Templates
-- ============================================================================
CREATE TABLE public.certificate_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(150) NOT NULL UNIQUE,
    certificate_type certificate_type NOT NULL,
    template_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_certificate_templates_updated_at
BEFORE UPDATE ON public.certificate_templates
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Issued Certificates
-- ============================================================================
CREATE TABLE public.certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('CERT'),
    certificate_number varchar(100) NOT NULL UNIQUE,

    template_id uuid REFERENCES public.certificate_templates(id),
    profile_id uuid NOT NULL REFERENCES public.profiles(id),

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    certificate_type certificate_type NOT NULL,
    title varchar(250) NOT NULL,
    description text,

    issued_on date NOT NULL DEFAULT CURRENT_DATE,
    issued_by uuid REFERENCES public.profiles(id),

    qr_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    verification_url text,

    pdf_media_id uuid REFERENCES public.media_files(id),
    preview_media_id uuid REFERENCES public.media_files(id),

    is_revoked boolean NOT NULL DEFAULT false,
    revoked_reason text,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_certificates_profile
ON public.certificates(profile_id);

CREATE INDEX idx_certificates_entity
ON public.certificates(entity_type, entity_id);

CREATE INDEX idx_certificates_qr
ON public.certificates(qr_token);

CREATE TRIGGER trg_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Certificate Verification Log
-- ============================================================================
CREATE TABLE public.certificate_verification_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id uuid NOT NULL
        REFERENCES public.certificates(id) ON DELETE CASCADE,
    verified_at timestamptz NOT NULL DEFAULT app.utc_now(),
    ip_address inet,
    user_agent text,
    verification_result boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_certificate_verification_logs_certificate
ON public.certificate_verification_logs(certificate_id);

COMMENT ON TABLE public.certificates IS
'Universal certificate issuance table with QR verification support.';

COMMIT;
