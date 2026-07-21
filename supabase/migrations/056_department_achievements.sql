-- ============================================================================
-- Ravenshaw Moments
-- Migration : 056_department_achievements.sql
-- Purpose   : Enhance Global Achievement Engine for Department CMS
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.achievements;
--    CREATE POLICY "Public Read Access" ON public.achievements FOR SELECT USING (is_public = true);
-- 2. ALTER TABLE public.achievements DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS display_order, DROP COLUMN IF EXISTS achievement_level_id;
-- 3. DROP TABLE IF EXISTS public.achievement_levels CASCADE;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ACHIEVEMENT LEVELS LOOKUP
-- ============================================================================
-- Creates standard lookup for Department, University, State, National, International
CREATE TABLE IF NOT EXISTS public.achievement_levels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
);

-- RLS for achievement_levels
ALTER TABLE public.achievement_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.achievement_levels;
CREATE POLICY "Public Read Access" ON public.achievement_levels FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin Write Access" ON public.achievement_levels;
CREATE POLICY "Admin Write Access" ON public.achievement_levels FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

-- Seed Achievement Levels
INSERT INTO public.achievement_levels (name, display_order, is_active) 
VALUES 
    ('Department', 10, true),
    ('University', 20, true),
    ('State', 30, true),
    ('National', 40, true),
    ('International', 50, true)
ON CONFLICT (name) DO UPDATE SET 
    display_order = EXCLUDED.display_order,
    is_active = true;

-- ============================================================================
-- 2. SEED ACHIEVEMENT CATEGORIES
-- ============================================================================
-- Populating universal lookup table with supported categories cleanly.
INSERT INTO public.achievement_categories (name, description, is_active) 
VALUES 
    ('Academic Achievement', 'Awards and recognition for academic excellence.', true),
    ('Sports Achievement', 'Medals and recognition in sports and athletics.', true),
    ('Cultural Achievement', 'Awards in arts, music, dance, and cultural events.', true),
    ('Research Achievement', 'Breakthroughs, papers, and discoveries.', true),
    ('Placement Achievement', 'Notable corporate placements or career milestones.', true),
    ('Competition Achievement', 'Hackathons, debates, and competitive events.', true),
    ('Innovation', 'Startups, products, and innovative projects.', true),
    ('Patent', 'Registered patents and intellectual property.', true),
    ('Publication', 'Published books, journals, or major articles.', true),
    ('Award', 'General awards and trophies.', true),
    ('Scholarship', 'Grants and academic scholarships.', true),
    ('Grant', 'Research and institutional grants.', true),
    ('International Recognition', 'Global awards and international honors.', true)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    is_active = true;

-- ============================================================================
-- 3. ENHANCE ACHIEVEMENTS TABLE FOR CMS & CONTEXT
-- ============================================================================
-- Adding standard CMS visibility, ordering, and context without duplicating the system.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'status') THEN
        ALTER TABLE public.achievements ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'display_order') THEN
        ALTER TABLE public.achievements ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'achievement_level_id') THEN
        ALTER TABLE public.achievements ADD COLUMN achievement_level_id UUID REFERENCES public.achievement_levels(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- 4. INTEGRITY AND PERFORMANCE INDEXES
-- ============================================================================

-- Ensure deterministic display ordering per entity
CREATE UNIQUE INDEX IF NOT EXISTS idx_achievements_unique_order 
ON public.achievements(entity_type, entity_id, display_order) 
WHERE status = 'published' AND deleted_at IS NULL;

-- General CMS performance indexes
CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_level ON public.achievements(achievement_level_id);

-- Timeline optimization: Allows highly efficient YEAR grouping directly on the date field
CREATE INDEX IF NOT EXISTS idx_achievements_date_year ON public.achievements(EXTRACT(YEAR FROM achievement_date));

-- ============================================================================
-- 5. UPDATE RLS POLICIES
-- ============================================================================

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Public Read Access: Must be published, public, and not deleted
DROP POLICY IF EXISTS "Public Read Access" ON public.achievements;
CREATE POLICY "Public Read Access" ON public.achievements 
FOR SELECT USING (status = 'published' AND is_public = true AND deleted_at IS NULL);

-- Admin Write Access: Restricted to verified admins
DROP POLICY IF EXISTS "Admin Write Access" ON public.achievements;
CREATE POLICY "Admin Write Access" ON public.achievements 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

-- Ensure recipients and documents inherit visibility
ALTER TABLE public.achievement_recipients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.achievement_recipients;
CREATE POLICY "Public Read Access" ON public.achievement_recipients 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.achievements a 
        WHERE a.id = achievement_recipients.achievement_id 
        AND a.status = 'published' 
        AND a.is_public = true 
        AND a.deleted_at IS NULL
    )
);

ALTER TABLE public.achievement_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.achievement_documents;
CREATE POLICY "Public Read Access" ON public.achievement_documents 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.achievements a 
        WHERE a.id = achievement_documents.achievement_id 
        AND a.status = 'published' 
        AND a.is_public = true 
        AND a.deleted_at IS NULL
    )
);

COMMIT;

-- ============================================================================
-- 6. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Lookup Table
SELECT name FROM public.achievement_levels;

-- Verify Added Columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'achievements' 
AND column_name IN ('status', 'display_order', 'achievement_level_id');

-- Verify Timeline Index
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'achievements' AND indexname = 'idx_achievements_date_year';

-- Verify RLS Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('achievements', 'achievement_recipients', 'achievement_documents');
*/
