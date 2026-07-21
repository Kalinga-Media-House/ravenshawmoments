-- =============================================================================
-- Ravenshaw Moments
-- Migration : 030_academic_logic_correction.sql
-- =============================================================================

BEGIN;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS level varchar(50),
ADD COLUMN IF NOT EXISTS stream varchar(100),
ADD COLUMN IF NOT EXISTS department_name varchar(150),
ADD COLUMN IF NOT EXISTS batch_year varchar(50);

COMMIT;
