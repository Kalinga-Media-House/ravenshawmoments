-- =============================================================================
-- Ravenshaw Moments
-- Migration : 042_competition_security_remediation.sql
-- =============================================================================
-- PURPOSE
-- Remediates overly broad RLS policies introduced in Migration 041.
-- Restricts public access to legal_document_versions to only published, 
-- active versions rather than exposing drafts or future unpublished versions.
-- =============================================================================

BEGIN;

-- 1. Drop the overly broad policy
DROP POLICY IF EXISTS "Public can view legal document versions" ON public.legal_document_versions;

-- 2. Create the strict policy restricting access to published documents
CREATE POLICY "Public can view published legal document versions" 
    ON public.legal_document_versions 
    FOR SELECT 
    USING (published_at IS NOT NULL AND published_at <= app.utc_now());

COMMIT;
