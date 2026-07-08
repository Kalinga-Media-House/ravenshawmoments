-- =============================================================================
-- Ravenshaw Moments
-- Migration : 021_profile_system_enhancements.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Extends the database foundation for Phase 2: Universal Profile System.
-- Additively adds new profile types, creates the contribution proofs table,
-- introduces roll number claiming helper procedures, and configures RLS.
--
-- COMPATIBILITY & SAFETY
-- - Forward-only, non-destructive migration.
-- - No tables or columns are dropped or renamed.
-- - Existing RLS policies are preserved intact.
-- - Idempotent execution where permitted by PostgreSQL.
-- =============================================================================

-- ============================================================================
-- 1. Extend profile_type ENUM
-- Note: ALTER TYPE ... ADD VALUE cannot be executed inside a transaction block
-- in PostgreSQL if the enum type is used in tables or older PG versions.
-- We execute these at the top level with IF NOT EXISTS for full idempotency.
-- ============================================================================
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'department_cr';
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'hostel_bmc';
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'organization_admin';
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE profile_type ADD VALUE IF NOT EXISTS 'volunteer';

BEGIN;

-- ============================================================================
-- 2. Create Contribution Proofs Table (Private Profile Feature)
-- Stores private proof submissions (receipts, recognition documents, etc.)
-- linked to user profiles and the universal media engine.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contribution_proofs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_file_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    title varchar(250) NOT NULL,
    description text,
    amount_reference numeric(12,2) CHECK (amount_reference >= 0),
    
    verification_status verification_status NOT NULL DEFAULT 'pending',
    reviewer_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks text,
    reviewed_at timestamptz,
    
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT uq_profile_contrib_media UNIQUE(profile_id, media_file_id)
);

COMMENT ON TABLE public.contribution_proofs IS
'Stores private verification proofs and receipt documents uploaded by contributors and sponsors.';

COMMENT ON COLUMN public.contribution_proofs.amount_reference IS
'Optional numeric reference for financial or tangible contribution valuation.';

-- Create indexes for performance on foreign keys and status filtering
CREATE INDEX IF NOT EXISTS idx_contrib_proofs_profile ON public.contribution_proofs(profile_id);
CREATE INDEX IF NOT EXISTS idx_contrib_proofs_media ON public.contribution_proofs(media_file_id);
CREATE INDEX IF NOT EXISTS idx_contrib_proofs_status ON public.contribution_proofs(verification_status);

-- Attach automated updated_at timestamp trigger
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contribution_proofs_updated_at'
    ) THEN
        CREATE TRIGGER trg_contribution_proofs_updated_at
        BEFORE UPDATE ON public.contribution_proofs
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 3. Profile Claiming & Roll Number Verification Helper Procedure
-- Atomically approves a student profile claim, links the Supabase Auth user,
-- activates the profile, and flags the academic record as verified.
-- ============================================================================
CREATE OR REPLACE FUNCTION app.verify_student_roll_claim(
    p_claim_request_id uuid,
    p_reviewer_profile_id uuid,
    p_remarks text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
    v_profile_id uuid;
    v_claimant_auth_id uuid;
    v_status verification_status;
BEGIN
    -- Retrieve claim details
    SELECT profile_id, claimant_auth_user_id, verification_status
    INTO v_profile_id, v_claimant_auth_id, v_status
    FROM public.profile_claim_requests
    WHERE id = p_claim_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Claim request % not found.', p_claim_request_id;
    END IF;

    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'Claim request % is already processed (Status: %).', p_claim_request_id, v_status;
    END IF;

    -- 1. Update claim request status
    UPDATE public.profile_claim_requests
    SET verification_status = 'approved',
        reviewer_profile_id = p_reviewer_profile_id,
        remarks = COALESCE(p_remarks, 'Roll number verification successful.'),
        reviewed_at = app.utc_now()
    WHERE id = p_claim_request_id;

    -- 2. Link auth user and activate profile identity
    UPDATE public.profiles
    SET auth_user_id = v_claimant_auth_id,
        is_profile_claimed = true,
        profile_status = 'active',
        is_verified = true,
        updated_by = p_reviewer_profile_id,
        updated_at = app.utc_now()
    WHERE id = v_profile_id;

    -- 3. Mark primary education records as verified
    UPDATE public.education_records
    SET is_verified = true,
        updated_by = p_reviewer_profile_id,
        updated_at = app.utc_now()
    WHERE profile_id = v_profile_id;

    RETURN true;
END;
$$;

COMMENT ON FUNCTION app.verify_student_roll_claim IS
'Atomically approves a student roll number claim request, linking auth identity and verifying education records.';

-- ============================================================================
-- 4. Row Level Security (RLS) for Contribution Proofs
-- Enforces privacy: users view only their own proofs; admins moderate all.
-- ============================================================================
ALTER TABLE public.contribution_proofs ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation using anonymous block
DO $$ 
BEGIN
    -- Policy: Owners can view their own contribution proofs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contribution_proofs' AND policyname = 'Owners can view own contribution proofs'
    ) THEN
        CREATE POLICY "Owners can view own contribution proofs"
        ON public.contribution_proofs FOR SELECT
        USING (
            profile_id IN (
                SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
            )
        );
    END IF;

    -- Policy: Owners can insert their own contribution proofs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contribution_proofs' AND policyname = 'Owners can insert own contribution proofs'
    ) THEN
        CREATE POLICY "Owners can insert own contribution proofs"
        ON public.contribution_proofs FOR INSERT
        WITH CHECK (
            profile_id IN (
                SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
            )
        );
    END IF;

    -- Policy: Admins and moderators can view all contribution proofs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contribution_proofs' AND policyname = 'Admins can view all contribution proofs'
    ) THEN
        CREATE POLICY "Admins can view all contribution proofs"
        ON public.contribution_proofs FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.profiles p
                JOIN public.profile_roles pr ON p.id = pr.profile_id
                JOIN public.roles r ON pr.role_id = r.id
                WHERE p.auth_user_id = auth.uid() 
                  AND r.code IN ('admin', 'super_admin', 'moderator') 
                  AND pr.is_active = true
            )
        );
    END IF;

    -- Policy: Admins and moderators can update contribution proofs (for verification status)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contribution_proofs' AND policyname = 'Admins can update contribution proofs'
    ) THEN
        CREATE POLICY "Admins can update contribution proofs"
        ON public.contribution_proofs FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM public.profiles p
                JOIN public.profile_roles pr ON p.id = pr.profile_id
                JOIN public.roles r ON pr.role_id = r.id
                WHERE p.auth_user_id = auth.uid() 
                  AND r.code IN ('admin', 'super_admin', 'moderator') 
                  AND pr.is_active = true
            )
        );
    END IF;
END $$;

COMMIT;
