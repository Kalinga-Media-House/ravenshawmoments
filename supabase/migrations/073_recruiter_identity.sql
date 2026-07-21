-- =================================================================================================
-- Ravenshaw Moments - Recruiter Identity & RBAC
-- Description: Adds 'recruiter' to profile_type enum and 'COMPANY_RECRUITER' role to roles table.
-- =================================================================================================

BEGIN;

-- 1. Add 'recruiter' to profile_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'profile_type' AND e.enumlabel = 'recruiter') THEN
    ALTER TYPE profile_type ADD VALUE 'recruiter';
  END IF;
END $$;

-- 2. Insert 'COMPANY_RECRUITER' into roles
INSERT INTO public.roles (id, code, name, description, is_system, is_active)
VALUES (
  gen_random_uuid(),
  'COMPANY_RECRUITER',
  'Company Recruiter',
  'Recruiter with permissions to manage placement drives and review applications.',
  true,
  true
) ON CONFLICT (code) DO NOTHING;

COMMIT;
