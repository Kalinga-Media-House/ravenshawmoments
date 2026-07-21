-- 080_verified_posting_policy.sql
-- Platform-Wide Verified Profile Posting Policy & Schema Alignment

BEGIN;

-- 1. Add new status values ('verified', 'rejected') to profile_status enum if not existing
ALTER TYPE public.profile_status ADD VALUE IF NOT EXISTS 'verified';
ALTER TYPE public.profile_status ADD VALUE IF NOT EXISTS 'rejected';

COMMIT;

-- Note: In PostgreSQL, enum additions above cannot run inside a transaction box where enum is used immediately without commit,
-- so we run data migration right after enum addition:

BEGIN;

-- 2. Migrate existing verified profiles to have profile_status = 'verified'
UPDATE public.profiles
SET profile_status = 'verified'
WHERE is_verified = true AND profile_status IN ('active', 'pending', 'unclaimed');

-- 3. Update verify_student_roll_claim helper function so future claims set profile_status = 'verified'
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

    -- 2. Link auth user and activate profile identity with profile_status = 'verified'
    UPDATE public.profiles
    SET auth_user_id = v_claimant_auth_id,
        is_profile_claimed = true,
        profile_status = 'verified',
        is_verified = true,
        updated_by = p_reviewer_profile_id,
        updated_at = app.utc_now()
    WHERE id = v_profile_id;

    -- 3. Flag primary education record as verified
    UPDATE public.education_records
    SET is_verified = true,
        updated_at = app.utc_now()
    WHERE profile_id = v_profile_id
      AND is_primary = true;

    RETURN true;
END;
$$;

COMMIT;
