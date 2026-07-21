-- ============================================================================
-- Ravenshaw Moments
-- Migration : 057_department_gallery.sql
-- Purpose   : Enhance Global Gallery Engine for Department CMS Integration
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.gallery_albums;
-- 2. DROP POLICY IF EXISTS "Public Read Access" ON public.gallery_items;
-- 3. ALTER TABLE public.gallery_items DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS photographer, DROP COLUMN IF EXISTS credit, DROP COLUMN IF EXISTS copyright_info, DROP COLUMN IF EXISTS tags, DROP COLUMN IF EXISTS location, DROP COLUMN IF EXISTS taken_date, DROP COLUMN IF EXISTS deleted_at;
-- 4. ALTER TABLE public.gallery_albums DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS category_id, DROP COLUMN IF EXISTS album_date, DROP COLUMN IF EXISTS seo_metadata, DROP COLUMN IF EXISTS display_order;
-- 5. DROP TABLE IF EXISTS public.gallery_categories CASCADE;
-- NOTE: ENUM additions (entity_type) cannot be rolled back cleanly in PostgreSQL without recreating the type.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ENHANCE POLYMORPHIC ENTITY TYPE (GLOBAL OWNERSHIP MODEL)
-- ============================================================================
-- NOTE: entity_type (and entity_id) serves as the standard, platform-wide 
-- ownership model for all reusable gallery content. By extending this enum, 
-- we inherently support Batch, Program, Event, and Achievement galleries 
-- completely natively without ever needing redundant siloed mapping tables.
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'batch';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'program';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'event';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'achievement';

-- ============================================================================
-- 2. GALLERY CATEGORIES LOOKUP
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.gallery_categories;
CREATE POLICY "Public Read Access" ON public.gallery_categories FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin Write Access" ON public.gallery_categories;
CREATE POLICY "Admin Write Access" ON public.gallery_categories FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

INSERT INTO public.gallery_categories (name, description, display_order, is_active) 
VALUES 
    ('Academic', 'Convocations, seminars, and academic events.', 10, true),
    ('Sports', 'Athletics, matches, and sports meets.', 20, true),
    ('Cultural', 'Festivals, dance, music, and art events.', 30, true),
    ('Historical', 'Archival and heritage photographs.', 40, true),
    ('Alumni', 'Alumni meets and networking events.', 50, true),
    ('Campus Life', 'Everyday campus activities and facilities.', 60, true)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = true;

-- ============================================================================
-- 3. ENHANCE GALLERY ALBUMS FOR CMS
-- ============================================================================
-- NOTE: public.gallery_albums natively relies on cover_media_id (REFERENCES 
-- media_files) for its cover image. No duplicate URL strings are introduced here.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'status') THEN
        ALTER TABLE public.gallery_albums ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'category_id') THEN
        ALTER TABLE public.gallery_albums ADD COLUMN category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'album_date') THEN
        ALTER TABLE public.gallery_albums ADD COLUMN album_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'seo_metadata') THEN
        ALTER TABLE public.gallery_albums ADD COLUMN seo_metadata JSONB DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'display_order') THEN
        ALTER TABLE public.gallery_albums ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- 4. ENHANCE GALLERY ITEMS FOR CMS
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'status') THEN
        ALTER TABLE public.gallery_items ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'photographer') THEN
        ALTER TABLE public.gallery_items ADD COLUMN photographer VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'credit') THEN
        ALTER TABLE public.gallery_items ADD COLUMN credit VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'copyright_info') THEN
        ALTER TABLE public.gallery_items ADD COLUMN copyright_info VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'tags') THEN
        -- NOTE: Implemented as text[] for high-performance retrieval and CMS flexibility. 
        -- Fully future-compatible: can be seamlessly migrated to a normalized 
        -- many-to-many lookup table later via UNNEST() without architectural breaks.
        ALTER TABLE public.gallery_items ADD COLUMN tags TEXT[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'location') THEN
        ALTER TABLE public.gallery_items ADD COLUMN location VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'taken_date') THEN
        ALTER TABLE public.gallery_items ADD COLUMN taken_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_items' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.gallery_items ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================================================
-- 5. INTEGRITY AND PERFORMANCE INDEXES
-- ============================================================================

-- Ensure deterministic display ordering per entity for albums
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_albums_unique_order 
ON public.gallery_albums(entity_type, entity_id, display_order) 
WHERE status = 'published' AND deleted_at IS NULL;

-- Timeline optimization: Allows highly efficient YEAR grouping natively
CREATE INDEX IF NOT EXISTS idx_gallery_albums_date_year 
ON public.gallery_albums(EXTRACT(YEAR FROM album_date));

-- Ensure deterministic display ordering for media items within an album
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_items_unique_order 
ON public.gallery_items(gallery_album_id, display_order) 
WHERE status = 'published' AND deleted_at IS NULL;

-- General CMS performance indexes
CREATE INDEX IF NOT EXISTS idx_gallery_albums_status ON public.gallery_albums(status);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_category ON public.gallery_albums(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_status ON public.gallery_items(status);

-- ============================================================================
-- 6. UPDATE RLS POLICIES
-- ============================================================================

ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public Read Access: Albums must be published, public, and not deleted
DROP POLICY IF EXISTS "Public Read Access" ON public.gallery_albums;
CREATE POLICY "Public Read Access" ON public.gallery_albums 
FOR SELECT USING (status = 'published' AND is_public = true AND deleted_at IS NULL);

-- Admin Write Access: Restricted to verified admins
DROP POLICY IF EXISTS "Admin Write Access" ON public.gallery_albums;
CREATE POLICY "Admin Write Access" ON public.gallery_albums 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

-- Public Read Access: Items must be published, not deleted, and belong to a visible album
DROP POLICY IF EXISTS "Public Read Access" ON public.gallery_items;
CREATE POLICY "Public Read Access" ON public.gallery_items 
FOR SELECT USING (
    status = 'published' 
    AND deleted_at IS NULL 
    AND EXISTS (
        SELECT 1 FROM public.gallery_albums a 
        WHERE a.id = gallery_items.gallery_album_id 
        AND a.status = 'published' 
        AND a.is_public = true 
        AND a.deleted_at IS NULL
    )
);

-- Admin Write Access for items
DROP POLICY IF EXISTS "Admin Write Access" ON public.gallery_items;
CREATE POLICY "Admin Write Access" ON public.gallery_items 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 7. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Enum Additions
SELECT unnest(enum_range(NULL::entity_type)) AS supported_entities;

-- Verify Seed Data
SELECT name FROM public.gallery_categories;

-- Verify Added Columns (Albums)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_albums' 
AND column_name IN ('status', 'display_order', 'category_id', 'album_date', 'seo_metadata');

-- Verify Added Columns (Items)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_items' 
AND column_name IN ('status', 'photographer', 'credit', 'tags', 'taken_date', 'deleted_at');

-- Verify Indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('gallery_albums', 'gallery_items') 
AND indexname LIKE '%unique_order%';

-- Verify RLS Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('gallery_albums', 'gallery_items');
*/
