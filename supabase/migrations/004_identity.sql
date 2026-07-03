-- =============================================================================
-- Ravenshaw Moments
-- Migration : 004_identity.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Identity layer only.
-- University-specific records belong to later migrations.
-- =============================================================================

BEGIN;

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('RM'),
    username citext UNIQUE,
    slug varchar(180) NOT NULL UNIQUE,
    full_name varchar(150) NOT NULL,
    gender gender_type,
    email citext,
    phone varchar(20),
    bio text,
    date_of_birth date,
    profile_media_id uuid,
    cover_media_id uuid,
    profile_type profile_type NOT NULL DEFAULT 'student',
    profile_status profile_status NOT NULL DEFAULT 'unclaimed',
    is_profile_claimed boolean NOT NULL DEFAULT false,
    is_verified boolean NOT NULL DEFAULT false,
    created_by uuid,
    updated_by uuid,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

COMMENT ON TABLE public.profiles IS
'Stores identity and public profile. Academic, hostel and leadership data are stored separately.';

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_slug ON public.profiles(slug);
CREATE INDEX idx_profiles_type ON public.profiles(profile_type);
CREATE INDEX idx_profiles_status ON public.profiles(profile_status);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE public.profile_privacy (
    profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_visibility visibility_type NOT NULL DEFAULT 'public',
    email_visibility visibility_type NOT NULL DEFAULT 'private',
    phone_visibility visibility_type NOT NULL DEFAULT 'private',
    dob_visibility visibility_type NOT NULL DEFAULT 'private',
    gallery_visibility visibility_type NOT NULL DEFAULT 'public',
    achievements_visibility visibility_type NOT NULL DEFAULT 'public',
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_profile_privacy_updated_at
BEFORE UPDATE ON public.profile_privacy
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE public.profile_settings (
    profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    language_code varchar(10) NOT NULL DEFAULT 'en',
    email_notifications boolean NOT NULL DEFAULT true,
    push_notifications boolean NOT NULL DEFAULT true,
    competition_notifications boolean NOT NULL DEFAULT true,
    donation_notifications boolean NOT NULL DEFAULT true,
    newsletter_enabled boolean NOT NULL DEFAULT true,
    dark_mode boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_profile_settings_updated_at
BEFORE UPDATE ON public.profile_settings
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE public.profile_claim_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    claimant_auth_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    supporting_document_url text,
    reviewer_profile_id uuid REFERENCES public.profiles(id),
    remarks text,
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_claim_profile
ON public.profile_claim_requests(profile_id);

CREATE INDEX idx_claim_status
ON public.profile_claim_requests(verification_status);

COMMIT;
