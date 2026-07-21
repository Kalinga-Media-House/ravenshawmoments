-- =============================================================================
-- Ravenshaw Moments
-- Migration : 043_competition_rls_hotfix.sql
-- =============================================================================
-- PURPOSE
-- 1. Restricts public access to legal_documents to only active ones.
-- 2. Restricts public access to legal_document_versions to only those published 
--    and currently effective.
-- 3. Adds narrow ownership policies allowing participants to read inactive/historical
--    legal documents and versions they explicitly consented to during registration.
--    This derives ownership strictly through the accepted version's ID.
-- =============================================================================

BEGIN;

-- 1. Drop overly broad public policies safely
DROP POLICY IF EXISTS "Public can view legal documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Public can view published legal document versions" ON public.legal_document_versions;
DROP POLICY IF EXISTS "Public can view active legal documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Public can view published and effective legal document versions" ON public.legal_document_versions;
DROP POLICY IF EXISTS "Participants can view their signed legal documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Participants can view their signed legal document versions" ON public.legal_document_versions;

-- 2. Create strict public policies (implicitly PUBLIC)
CREATE POLICY "Public can view active legal documents" 
    ON public.legal_documents 
    FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Public can view published and effective legal document versions" 
    ON public.legal_document_versions 
    FOR SELECT 
    USING (
        published_at IS NOT NULL 
        AND published_at <= app.utc_now() 
        AND effective_at <= app.utc_now()
    );

-- 3. Create narrow authenticated ownership policies for consent history
-- Note: 'accepted_at' in registration_consents is NOT NULL, meaning all rows 
-- structurally represent accepted consents. No explicit 'consent_status' exists.

CREATE POLICY "Participants can view their signed legal document versions" 
    ON public.legal_document_versions 
    FOR SELECT 
    TO authenticated
    USING (
        id IN (
            SELECT rc.legal_document_version_id 
            FROM public.registration_consents rc
            JOIN public.competition_registrations cr ON cr.id = rc.registration_id
            WHERE cr.profile_id = app.current_profile_id()
        )
    );

CREATE POLICY "Participants can view their signed legal documents" 
    ON public.legal_documents 
    FOR SELECT 
    TO authenticated
    USING (
        id IN (
            SELECT ldv.document_id 
            FROM public.legal_document_versions ldv
            JOIN public.registration_consents rc ON rc.legal_document_version_id = ldv.id
            JOIN public.competition_registrations cr ON cr.id = rc.registration_id
            WHERE cr.profile_id = app.current_profile_id()
        )
    );

COMMIT;
