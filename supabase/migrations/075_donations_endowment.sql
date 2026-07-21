-- Migration: 075_donations_endowment.sql
-- Description: Alters existing Donations engine (014) and adds Sponsors, Endowment Funds.

-- 1. Extend existing enums safely
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'endowment_fund';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'sponsor';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'campaign_update';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'fund_report';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'success_story';

-- 2. Create new enums
DO $$ BEGIN
    CREATE TYPE donation_type AS ENUM ('one_time', 'recurring');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE donation_frequency AS ENUM ('none', 'monthly', 'quarterly', 'yearly');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE donation_status AS ENUM ('pending', 'successful', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'goal_achieved', 'completed', 'archived', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fund_type AS ENUM ('permanent', 'named', 'scholarship', 'department', 'hostel', 'memorial', 'general', 'research');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sponsor_type AS ENUM ('corporate', 'media', 'academic', 'ngo', 'government', 'individual', 'title', 'knowledge', 'technology', 'community');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sponsorship_tier AS ENUM ('gold', 'silver', 'bronze', 'title', 'associate');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fund_allocation_status AS ENUM ('pending', 'approved', 'disbursed', 'utilized');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Alter Existing Tables

-- Alter donation_campaigns
ALTER TABLE public.donation_campaigns
    ADD COLUMN IF NOT EXISTS status campaign_status NOT NULL DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS raised_amount numeric(15, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS donor_count integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS beneficiary_entity_type entity_type,
    ADD COLUMN IF NOT EXISTS beneficiary_entity_id uuid,
    ADD COLUMN IF NOT EXISTS ai_metadata jsonb DEFAULT '{}'::jsonb;

-- Migrate existing is_active to status
UPDATE public.donation_campaigns SET status = 'active' WHERE is_active = true AND status = 'draft';
UPDATE public.donation_campaigns SET status = 'archived' WHERE is_active = false AND status = 'draft';

-- Endowment Funds (New)
CREATE TABLE IF NOT EXISTS public.endowment_funds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    fund_type fund_type NOT NULL DEFAULT 'general',
    principal_amount numeric(15, 2) NOT NULL DEFAULT 0.00,
    available_balance numeric(15, 2) NOT NULL DEFAULT 0.00,
    allocated_amount numeric(15, 2) NOT NULL DEFAULT 0.00,
    disbursed_amount numeric(15, 2) NOT NULL DEFAULT 0.00,
    beneficiary_entity_type entity_type,
    beneficiary_entity_id uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Alter donations
ALTER TABLE public.donations
    ADD COLUMN IF NOT EXISTS fund_id uuid REFERENCES public.endowment_funds(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS target_entity_type entity_type,
    ADD COLUMN IF NOT EXISTS target_entity_id uuid,
    ADD COLUMN IF NOT EXISTS currency varchar(10) NOT NULL DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS base_amount numeric(15, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS exchange_rate numeric(15, 6) NOT NULL DEFAULT 1.0,
    ADD COLUMN IF NOT EXISTS donation_type donation_type NOT NULL DEFAULT 'one_time',
    ADD COLUMN IF NOT EXISTS frequency donation_frequency NOT NULL DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS status donation_status NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS payment_gateway_ref varchar(255);

-- Migrate existing amount to base_amount and status based on existing payment logic if possible (assume successful for old data)
UPDATE public.donations SET base_amount = amount, status = 'successful' WHERE base_amount = 0.00;

-- Sponsors
CREATE TABLE IF NOT EXISTS public.sponsors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    sponsor_type sponsor_type NOT NULL DEFAULT 'corporate',
    website_url varchar(255),
    contact_email varchar(255),
    logo_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    priority_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sponsorships
CREATE TABLE IF NOT EXISTS public.sponsorships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id uuid NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    sponsored_entity_type entity_type NOT NULL,
    sponsored_entity_id uuid NOT NULL,
    amount numeric(15, 2),
    tier sponsorship_tier NOT NULL DEFAULT 'associate',
    start_date timestamptz,
    end_date timestamptz,
    benefits text[],
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Fund Allocations
CREATE TABLE IF NOT EXISTS public.fund_allocations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id uuid NOT NULL REFERENCES public.endowment_funds(id) ON DELETE CASCADE,
    amount numeric(15, 2) NOT NULL,
    purpose text NOT NULL,
    status fund_allocation_status NOT NULL DEFAULT 'pending',
    allocated_date timestamptz,
    disbursed_date timestamptz,
    approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    beneficiary_entity_type entity_type,
    beneficiary_entity_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.donation_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type varchar(100) NOT NULL,
    entity_id uuid NOT NULL,
    action varchar(100) NOT NULL,
    previous_state jsonb,
    new_state jsonb,
    actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Triggers (Only for new tables, assuming donation_campaigns and donations already have updated_at triggers or we use the custom one)
CREATE OR REPLACE FUNCTION update_donations_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: donation_campaigns and donations already have a trigger 'trg_campaign_updated_at' using app.set_updated_at().
-- We will just add our trigger for the new tables.

CREATE TRIGGER update_endowment_funds_updated_at
    BEFORE UPDATE ON public.endowment_funds
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at
    BEFORE UPDATE ON public.sponsors
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_sponsorships_updated_at
    BEFORE UPDATE ON public.sponsorships
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_fund_allocations_updated_at
    BEFORE UPDATE ON public.fund_allocations
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_donation_campaigns_status ON public.donation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donation_campaigns_beneficiary ON public.donation_campaigns(beneficiary_entity_type, beneficiary_entity_id);

CREATE INDEX IF NOT EXISTS idx_endowment_funds_type ON public.endowment_funds(fund_type);
CREATE INDEX IF NOT EXISTS idx_endowment_funds_beneficiary ON public.endowment_funds(beneficiary_entity_type, beneficiary_entity_id);

CREATE INDEX IF NOT EXISTS idx_donations_fund ON public.donations(fund_id);
CREATE INDEX IF NOT EXISTS idx_donations_target ON public.donations(target_entity_type, target_entity_id);
CREATE INDEX IF NOT EXISTS idx_donations_status_new ON public.donations(status);

CREATE INDEX IF NOT EXISTS idx_sponsors_type ON public.sponsors(sponsor_type);
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsored_entity ON public.sponsorships(sponsored_entity_type, sponsored_entity_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor ON public.sponsorships(sponsor_id);

CREATE INDEX IF NOT EXISTS idx_fund_allocations_fund ON public.fund_allocations(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_allocations_status ON public.fund_allocations(status);
CREATE INDEX IF NOT EXISTS idx_donation_audit_logs_entity ON public.donation_audit_logs(entity_type, entity_id);

-- 6. Basic RLS (New Tables)
ALTER TABLE public.endowment_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: RLS for donation_campaigns and donations is handled in 032_security_rls_remediation.sql

CREATE POLICY "Public read funds" ON public.endowment_funds FOR SELECT USING (is_active = true);
CREATE POLICY "Public read sponsors" ON public.sponsors FOR SELECT USING (is_active = true);
CREATE POLICY "Public read sponsorships" ON public.sponsorships FOR SELECT USING (is_active = true);
