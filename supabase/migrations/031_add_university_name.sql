-- =============================================================================
-- Ravenshaw Moments
-- Migration : 031_add_university_name.sql
-- =============================================================================
-- PURPOSE
-- Adds university_name to public.profiles to store external participant data natively.
-- =============================================================================

BEGIN;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS university_name varchar(255);

COMMIT;
