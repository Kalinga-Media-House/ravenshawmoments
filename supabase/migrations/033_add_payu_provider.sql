-- =============================================================================
-- Ravenshaw Moments
-- Migration : 033_add_payu_provider.sql
-- Purpose   : Add 'payu' to payment_provider enum
-- =============================================================================

BEGIN;

ALTER TYPE payment_provider ADD VALUE IF NOT EXISTS 'payu';

COMMIT;
