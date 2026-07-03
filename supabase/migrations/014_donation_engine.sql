-- =============================================================================
-- Ravenshaw Moments
-- Migration : 014_donation_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Donation Engine
-- Supports fundraising campaigns, donations, transparency and public wall of
-- supporters. Integrates with the universal payment engine.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Donation Campaigns
-- ============================================================================
CREATE TABLE public.donation_campaigns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('CAM'),

    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    description text,

    featured_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,

    target_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK(target_amount >= 0),
    minimum_donation numeric(12,2) NOT NULL DEFAULT 0 CHECK(minimum_donation >= 0),

    starts_at timestamptz,
    ends_at timestamptz,

    is_active boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,

    created_by uuid REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_campaign_slug ON public.donation_campaigns(slug);
CREATE INDEX idx_campaign_active ON public.donation_campaigns(is_active);

CREATE TRIGGER trg_campaign_updated_at
BEFORE UPDATE ON public.donation_campaigns
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.donation_campaigns IS
'Fundraising campaigns.';

-- ============================================================================
-- Donations
-- ============================================================================
CREATE TABLE public.donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('DON'),

    campaign_id uuid REFERENCES public.donation_campaigns(id) ON DELETE SET NULL,

    profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,

    payment_id uuid UNIQUE
        REFERENCES public.payments(id) ON DELETE SET NULL,

    amount numeric(12,2) NOT NULL CHECK(amount > 0),

    visibility donation_visibility NOT NULL DEFAULT 'public',

    donor_name_override varchar(200),
    message text,

    receipt_number varchar(100) UNIQUE,

    donated_at timestamptz NOT NULL DEFAULT app.utc_now(),

    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_donations_campaign
ON public.donations(campaign_id);

CREATE INDEX idx_donations_profile
ON public.donations(profile_id);

CREATE INDEX idx_donations_visibility
ON public.donations(visibility);

COMMENT ON TABLE public.donations IS
'Donation records linked to payment engine.';

-- ============================================================================
-- Donation Receipts
-- ============================================================================
CREATE TABLE public.donation_receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    donation_id uuid NOT NULL UNIQUE
        REFERENCES public.donations(id) ON DELETE CASCADE,

    receipt_media_id uuid
        REFERENCES public.media_files(id) ON DELETE SET NULL,

    generated_at timestamptz NOT NULL DEFAULT app.utc_now(),

    generated_by uuid
        REFERENCES public.profiles(id)
);

COMMENT ON TABLE public.donation_receipts IS
'Stores generated receipt PDFs or receipt documents.';

COMMIT;
