-- =============================================================================
-- Ravenshaw Moments
-- Migration : 034_guest_donations_support.sql
-- Purpose   : Support guest payments without requiring a dummy profile.
-- =============================================================================

BEGIN;

-- 1. Allow payments to exist without a registered profile
ALTER TABLE public.payments ALTER COLUMN profile_id DROP NOT NULL;

-- 2. Allow payments to not require a specific entity ID (e.g. general university donations)
ALTER TABLE public.payments ALTER COLUMN entity_id DROP NOT NULL;

-- 3. Store guest payer details directly on the payment record
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payer_email citext;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payer_name varchar(255);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payer_phone varchar(20);

-- 4. Store guest donor contact info on the donation record
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_email citext;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_phone varchar(20);

COMMIT;
