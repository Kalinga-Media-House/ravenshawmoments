-- =============================================================================
-- Ravenshaw Moments
-- Migration : 012_payment_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Payment Engine
-- Supports competition fees, donations, event registrations,
-- merchandise and future paid services.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Payments
-- ============================================================================
CREATE TABLE public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('PAY'),

    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE RESTRICT,

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    amount numeric(12,2) NOT NULL CHECK (amount >= 0),
    currency_code char(3) NOT NULL DEFAULT 'INR',

    payment_provider payment_provider NOT NULL,
    provider_payment_id text,
    provider_order_id text,

    payment_status payment_status NOT NULL DEFAULT 'pending',

    description text,

    paid_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_provider_payment UNIQUE(payment_provider, provider_payment_id)
);

CREATE INDEX idx_payments_profile
ON public.payments(profile_id);

CREATE INDEX idx_payments_entity
ON public.payments(entity_type, entity_id);

CREATE INDEX idx_payments_status
ON public.payments(payment_status);

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.payments IS
'Universal payment records for all payable entities.';

-- ============================================================================
-- Transactions
-- ============================================================================
CREATE TABLE public.payment_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id uuid NOT NULL
        REFERENCES public.payments(id) ON DELETE CASCADE,

    transaction_reference text NOT NULL,
    gateway_response jsonb,

    amount numeric(12,2) NOT NULL,
    payment_status payment_status NOT NULL,

    processed_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_transaction_reference UNIQUE(transaction_reference)
);

CREATE INDEX idx_payment_transactions_payment
ON public.payment_transactions(payment_id);

-- ============================================================================
-- Refunds
-- ============================================================================
CREATE TABLE public.payment_refunds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id uuid NOT NULL
        REFERENCES public.payments(id) ON DELETE CASCADE,

    refund_reference text UNIQUE,
    refund_amount numeric(12,2) NOT NULL CHECK (refund_amount >= 0),

    reason text,

    payment_status payment_status NOT NULL DEFAULT 'refunded',

    approved_by uuid
        REFERENCES public.profiles(id),

    refunded_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_payment_refunds_payment
ON public.payment_refunds(payment_id);

COMMENT ON TABLE public.payment_refunds IS
'Tracks full and partial refunds.';

COMMIT;
