-- ============================================================================
-- Ravenshaw Moments
-- Migration : 058_department_content.sql
-- Purpose   : Enhance Global Content Engine for Department CMS Sections
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.content_items;
-- 2. ALTER TABLE public.content_items DROP COLUMN IF EXISTS subtitle, DROP COLUMN IF EXISTS banner_media_id, DROP COLUMN IF EXISTS display_order, DROP COLUMN IF EXISTS seo_metadata, DROP COLUMN IF EXISTS status;
-- 3. DROP TABLE IF EXISTS public.content_attachments CASCADE;
-- NOTE: ENUM additions (content_type) cannot be rolled back cleanly in PostgreSQL.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ENHANCE CONTENT TYPES FOR SECTIONS (GLOBAL CMS TAXONOMY)
-- ============================================================================
-- NOTE: content_type acts as the definitive, platform-wide taxonomy for 
-- classifying reusable CMS content. By adding 'page_section' and 'custom_block', 
-- we inherently support complex, orderable Department Pages natively without 
-- ever introducing alternative siloed classification systems.
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'page_section';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'custom_block';

-- ============================================================================
-- 2. ENHANCE CONTENT ITEMS FOR CMS BLOCKS
-- ============================================================================
-- Incorporates all required CMS features without duplicating the content engine.
-- Existing summary, body, slug, and title fields are natively reused.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'subtitle') THEN
        ALTER TABLE public.content_items ADD COLUMN subtitle VARCHAR(250);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'banner_media_id') THEN
        ALTER TABLE public.content_items ADD COLUMN banner_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'display_order') THEN
        ALTER TABLE public.content_items ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'seo_metadata') THEN
        -- Reuses the exact same platform-wide SEO JSONB schema (title, description, keywords, og)
        -- ensuring we do not create a redundant SEO table.
        ALTER TABLE public.content_items ADD COLUMN seo_metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'status') THEN
        -- Seamlessly map the legacy boolean to the new CMS status enum pattern
        ALTER TABLE public.content_items ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
        UPDATE public.content_items SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END;
        ALTER TABLE public.content_items ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

-- ============================================================================
-- 3. CONTENT ATTACHMENTS
-- ============================================================================
-- Reusable intersection table for mapping multiple documents/PDFs/media to a content block
CREATE TABLE IF NOT EXISTS public.content_attachments (
    content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    media_file_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    PRIMARY KEY(content_item_id, media_file_id)
);

CREATE INDEX IF NOT EXISTS idx_content_attachments_media ON public.content_attachments(media_file_id);

-- ============================================================================
-- 4. INTEGRITY AND PERFORMANCE INDEXES
-- ============================================================================

-- Ensure deterministic display ordering per entity AND per content_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_items_unique_order 
ON public.content_items(entity_type, entity_id, content_type, display_order) 
WHERE status = 'published' AND deleted_at IS NULL;

-- General CMS performance indexes
CREATE INDEX IF NOT EXISTS idx_content_items_status ON public.content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_banner ON public.content_items(banner_media_id);

-- ============================================================================
-- 5. UPDATE RLS POLICIES
-- ============================================================================

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Public Read Access: Must be published and not deleted
DROP POLICY IF EXISTS "Public Read Access" ON public.content_items;
CREATE POLICY "Public Read Access" ON public.content_items 
FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Admin Write Access: Restricted to verified admins
DROP POLICY IF EXISTS "Admin Write Access" ON public.content_items;
CREATE POLICY "Admin Write Access" ON public.content_items 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

-- Attachments inherit content visibility
ALTER TABLE public.content_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.content_attachments;
CREATE POLICY "Public Read Access" ON public.content_attachments 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.content_items c 
        WHERE c.id = content_attachments.content_item_id 
        AND c.status = 'published'
        AND c.deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Admin Write Access" ON public.content_attachments;
CREATE POLICY "Admin Write Access" ON public.content_attachments 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

-- Version History: Restricted to authenticated admins (reusing content_revisions)
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin Read Access" ON public.content_revisions;
CREATE POLICY "Admin Read Access" ON public.content_revisions 
FOR SELECT TO authenticated USING (app.is_admin_or_super());

DROP POLICY IF EXISTS "Admin Write Access" ON public.content_revisions;
CREATE POLICY "Admin Write Access" ON public.content_revisions 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 6. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Enum Additions
SELECT unnest(enum_range(NULL::content_type)) AS supported_content_types;

-- Verify Added Columns (Content Items)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content_items' 
AND column_name IN ('subtitle', 'banner_media_id', 'display_order', 'seo_metadata', 'status');

-- Verify Attachments Table
SELECT table_name FROM information_schema.tables WHERE table_name = 'content_attachments';

-- Verify Indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'content_items' 
AND indexname LIKE '%unique_order%';

-- Verify RLS Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('content_items', 'content_attachments', 'content_revisions');
*/
