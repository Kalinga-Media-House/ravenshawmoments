-- 079_digital_identity.sql
-- Digital Identity & Campus Access Center

-- Enums
CREATE TYPE identity_type_enum AS ENUM ('student', 'faculty', 'department_cr', 'hostel_bmc', 'organization_executive', 'alumni', 'business_owner', 'admin', 'super_admin', 'staff');
CREATE TYPE identity_status_enum AS ENUM ('pending', 'verified', 'active', 'suspended', 'expired', 'revoked', 'archived');
CREATE TYPE card_type_enum AS ENUM ('premium', 'standard');
CREATE TYPE access_log_type_enum AS ENUM ('login', 'logout', 'qr_scan', 'event_entry', 'competition_entry', 'certificate_verification', 'business_verification', 'identity_verification', 'device_login', 'failed_login');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- 1. digital_identities
CREATE TABLE IF NOT EXISTS public.digital_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    identity_type identity_type_enum NOT NULL,
    identity_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. University ID
    status identity_status_enum NOT NULL DEFAULT 'pending',
    issue_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_profile_identity UNIQUE (profile_id) -- One Digital Identity per user
);

-- 2. identity_cards
CREATE TABLE IF NOT EXISTS public.identity_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL REFERENCES public.digital_identities(id) ON DELETE CASCADE,
    card_type card_type_enum NOT NULL DEFAULT 'standard',
    qr_code_hash VARCHAR(500) NOT NULL, -- Hashed/signed payload or token
    active BOOLEAN NOT NULL DEFAULT TRUE,
    template_config JSONB DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. identity_devices
CREATE TABLE IF NOT EXISTS public.identity_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address INET,
    country VARCHAR(100),
    is_trusted BOOLEAN NOT NULL DEFAULT FALSE,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. verification_requests
CREATE TABLE IF NOT EXISTS public.identity_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    identity_type identity_type_enum NOT NULL,
    status verification_status_enum NOT NULL DEFAULT 'pending',
    notes TEXT,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. verification_documents
CREATE TABLE IF NOT EXISTS public.identity_verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.identity_verification_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. access_logs
CREATE TABLE IF NOT EXISTS public.identity_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    identity_id UUID REFERENCES public.digital_identities(id) ON DELETE SET NULL,
    log_type access_log_type_enum NOT NULL,
    entity_id UUID, -- e.g. event_id, competition_id
    entity_type VARCHAR(100),
    ip_address INET,
    device_id UUID REFERENCES public.identity_devices(id) ON DELETE SET NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. identity_audit_logs (Timeline)
CREATE TABLE IF NOT EXISTS public.identity_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL REFERENCES public.digital_identities(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- e.g. 'created', 'verified', 'suspended', 'card_generated', 'qr_regenerated'
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_digital_identities_profile ON public.digital_identities(profile_id);
CREATE INDEX IF NOT EXISTS idx_identity_cards_identity ON public.identity_cards(identity_id);
CREATE INDEX IF NOT EXISTS idx_identity_devices_profile ON public.identity_devices(profile_id);
CREATE INDEX IF NOT EXISTS idx_identity_verification_profile ON public.identity_verification_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_identity_access_logs_profile ON public.identity_access_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_identity_access_logs_entity ON public.identity_access_logs(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_identity_audit_logs_identity ON public.identity_audit_logs(identity_id);

-- RLS Policies

-- digital_identities
ALTER TABLE public.digital_identities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own identity" ON public.digital_identities FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Admins can manage identities" ON public.digital_identities FOR ALL USING (app.is_admin_or_super());

-- identity_cards
ALTER TABLE public.identity_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cards" ON public.identity_cards FOR SELECT USING (identity_id IN (SELECT id FROM public.digital_identities WHERE profile_id = auth.uid()) OR app.is_admin_or_super());
CREATE POLICY "Admins can manage cards" ON public.identity_cards FOR ALL USING (app.is_admin_or_super());

-- identity_devices
ALTER TABLE public.identity_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own devices" ON public.identity_devices FOR ALL USING (profile_id = auth.uid() OR app.is_admin_or_super());

-- identity_verification_requests
ALTER TABLE public.identity_verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own requests" ON public.identity_verification_requests FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Users can create requests" ON public.identity_verification_requests FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Admins can manage requests" ON public.identity_verification_requests FOR ALL USING (app.is_admin_or_super());

-- identity_verification_documents
ALTER TABLE public.identity_verification_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own docs" ON public.identity_verification_documents FOR SELECT USING (request_id IN (SELECT id FROM public.identity_verification_requests WHERE profile_id = auth.uid()) OR app.is_admin_or_super());
CREATE POLICY "Users can insert docs" ON public.identity_verification_documents FOR INSERT WITH CHECK (request_id IN (SELECT id FROM public.identity_verification_requests WHERE profile_id = auth.uid()));
CREATE POLICY "Admins can manage docs" ON public.identity_verification_documents FOR ALL USING (app.is_admin_or_super());

-- identity_access_logs
ALTER TABLE public.identity_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own logs" ON public.identity_access_logs FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Admins can view all logs" ON public.identity_access_logs FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Users can insert logs for themselves" ON public.identity_access_logs FOR INSERT WITH CHECK (profile_id = auth.uid() OR app.is_admin_or_super());

-- identity_audit_logs
ALTER TABLE public.identity_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own audit logs" ON public.identity_audit_logs FOR SELECT USING (identity_id IN (SELECT id FROM public.digital_identities WHERE profile_id = auth.uid()) OR app.is_admin_or_super());
CREATE POLICY "Admins can insert audit logs" ON public.identity_audit_logs FOR ALL USING (app.is_admin_or_super());
