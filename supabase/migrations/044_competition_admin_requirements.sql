-- =============================================================================
-- Ravenshaw Moments
-- Migration : 044_competition_admin_requirements.sql
-- =============================================================================
-- PURPOSE
-- Fixes schema gaps identified during Stage 2 Competition Admin workflow audit:
-- 1. registration_fee nullable and non-negative.
-- 2. Publication scheduling and explicit featured selection.
-- 3. Internal administrative notes.
-- 4. Explicit certificate flags and delivery methods.
-- 5. Explicit registration approval mode and waitlisting.
-- =============================================================================

BEGIN;

-- 1. registration_fee nullability and constraint
ALTER TABLE public.competitions
ALTER COLUMN registration_fee DROP NOT NULL,
ALTER COLUMN registration_fee DROP DEFAULT,
ADD CONSTRAINT chk_competitions_fee_non_negative CHECK (registration_fee IS NULL OR registration_fee >= 0);

COMMENT ON COLUMN public.competitions.registration_fee IS 'NULL = Fee Not Configured, 0 = Free Registration, >0 = Paid Registration';

-- 2. Publication and Featured Scheduling
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS published_at timestamptz,
ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamptz,
ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_at timestamptz,
ADD COLUMN IF NOT EXISTS internal_notes text;

COMMENT ON COLUMN public.competitions.published_at IS 'Timestamp when the competition was published. NULL if draft or scheduled.';
COMMENT ON COLUMN public.competitions.scheduled_publish_at IS 'Timestamp when a scheduled competition should automatically publish.';
COMMENT ON COLUMN public.competitions.is_featured IS 'Explicit flag to feature the competition in prominent UI sections.';
COMMENT ON COLUMN public.competitions.featured_at IS 'Timestamp indicating when the competition was featured, used for sorting.';
COMMENT ON COLUMN public.competitions.internal_notes IS 'Private administrative notes. NEVER exposed to public APIs or unprivileged users via RLS/DTOs.';

-- Drop outdated JSONB configurations if they were added in an intermediate step, to ensure explicit columns are authoritative
ALTER TABLE public.competitions 
DROP COLUMN IF EXISTS certificate_configuration,
DROP COLUMN IF EXISTS registration_configuration;

-- 3. Certificate Configuration Flags
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS participation_certificate_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS merit_certificate_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS winner_certificate_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS certificate_verification_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS certificate_delivery_method text,
ADD CONSTRAINT chk_comp_cert_delivery CHECK (certificate_delivery_method IN ('digital', 'physical', 'both'));

COMMENT ON COLUMN public.competitions.participation_certificate_enabled IS 'Indicates if participation certificates will be awarded.';
COMMENT ON COLUMN public.competitions.merit_certificate_enabled IS 'Indicates if merit certificates will be awarded.';
COMMENT ON COLUMN public.competitions.winner_certificate_enabled IS 'Indicates if winner certificates will be awarded.';
COMMENT ON COLUMN public.competitions.certificate_verification_enabled IS 'Enables unique QR code/ID verification for generated certificates.';
COMMENT ON COLUMN public.competitions.certificate_delivery_method IS 'Delivery mode for certificates: digital, physical, or both.';

-- 4. Registration Workflow Configuration
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS registration_approval_mode text NOT NULL DEFAULT 'automatic',
ADD COLUMN IF NOT EXISTS waitlist_enabled boolean NOT NULL DEFAULT false,
ADD CONSTRAINT chk_comp_reg_approval CHECK (registration_approval_mode IN ('automatic', 'manual'));

COMMENT ON COLUMN public.competitions.registration_approval_mode IS 'automatic = approved immediately; manual = requires admin approval before payment.';
COMMENT ON COLUMN public.competitions.waitlist_enabled IS 'If true, users can join a waitlist when max_participants is reached.';

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_competitions_scheduled_publish 
ON public.competitions(scheduled_publish_at) 
WHERE scheduled_publish_at IS NOT NULL AND published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_competitions_featured 
ON public.competitions(featured_at DESC) 
WHERE is_featured = true;

COMMIT;
