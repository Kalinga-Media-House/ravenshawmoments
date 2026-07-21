-- ============================================================================
-- Ravenshaw Moments
-- Migration : 051_department_core.sql
-- Purpose   : Core Department CMS enhancements and satellite tables
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP TRIGGER IF EXISTS trg_department_highlights_updated_at ON public.department_highlights;
-- 2. DROP TRIGGER IF EXISTS trg_department_manual_metrics_updated_at ON public.department_manual_metrics;
-- 3. DROP TRIGGER IF EXISTS trg_department_contacts_updated_at ON public.department_contacts;
-- 4. DROP TRIGGER IF EXISTS trg_department_seo_updated_at ON public.department_seo;
-- 5. DROP TRIGGER IF EXISTS trg_department_settings_updated_at ON public.department_settings;
-- 6. DROP TABLE IF EXISTS public.department_highlights CASCADE;
-- 7. DROP TABLE IF EXISTS public.department_manual_metrics CASCADE;
-- 8. DROP TABLE IF EXISTS public.department_contacts CASCADE;
-- 9. DROP TABLE IF EXISTS public.department_seo CASCADE;
-- 10. DROP TABLE IF EXISTS public.department_settings CASCADE;
-- 11. ALTER TABLE public.departments DROP COLUMN IF EXISTS motto, DROP COLUMN IF EXISTS official_website, DROP COLUMN IF EXISTS hero_media_id, DROP COLUMN IF EXISTS hero_quote, DROP COLUMN IF EXISTS category, DROP COLUMN IF EXISTS location, DROP COLUMN IF EXISTS academic_excellence, DROP COLUMN IF EXISTS deleted_at;
-- 12. ALTER TABLE public.departments DROP CONSTRAINT IF EXISTS departments_logo_media_id_fkey, DROP CONSTRAINT IF EXISTS departments_cover_media_id_fkey;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ALTER EXISTING TABLES
-- Extending the base departments table verified from migration 003 & 023.
-- ============================================================================
DO $$
BEGIN
    -- Enhance departments with new CMS fields safely
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'motto') THEN
        ALTER TABLE public.departments ADD COLUMN motto VARCHAR(300);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'official_website') THEN
        ALTER TABLE public.departments ADD COLUMN official_website VARCHAR(500) CHECK (official_website ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'hero_media_id') THEN
        ALTER TABLE public.departments ADD COLUMN hero_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'hero_quote') THEN
        ALTER TABLE public.departments ADD COLUMN hero_quote TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'category') THEN
        ALTER TABLE public.departments ADD COLUMN category VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'location') THEN
        ALTER TABLE public.departments ADD COLUMN location VARCHAR(200);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'academic_excellence') THEN
        ALTER TABLE public.departments ADD COLUMN academic_excellence TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.departments ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Fix missing FK constraints on existing media columns from 003 if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'departments' AND constraint_name = 'departments_logo_media_id_fkey'
    ) THEN
        ALTER TABLE public.departments 
        ADD CONSTRAINT departments_logo_media_id_fkey 
        FOREIGN KEY (logo_media_id) REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'departments' AND constraint_name = 'departments_cover_media_id_fkey'
    ) THEN
        ALTER TABLE public.departments 
        ADD CONSTRAINT departments_cover_media_id_fkey 
        FOREIGN KEY (cover_media_id) REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add indexes for new and existing media foreign keys on `departments`
CREATE INDEX IF NOT EXISTS idx_departments_hero_media ON public.departments(hero_media_id);
CREATE INDEX IF NOT EXISTS idx_departments_cover_media ON public.departments(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_departments_logo_media ON public.departments(logo_media_id);

-- ============================================================================
-- 2. NEW SATELLITE TABLES
-- ============================================================================

-- A. Department Settings
CREATE TABLE IF NOT EXISTS public.department_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL UNIQUE REFERENCES public.departments(id) ON DELETE CASCADE,
    theme_color VARCHAR(30) DEFAULT 'default',
    layout_style VARCHAR(30) DEFAULT 'standard',
    is_accepting_admissions BOOLEAN NOT NULL DEFAULT true,
    show_faculty_profiles BOOLEAN NOT NULL DEFAULT true,
    show_student_profiles BOOLEAN NOT NULL DEFAULT true,
    custom_css TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now()
);

-- B. Department SEO
CREATE TABLE IF NOT EXISTS public.department_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL UNIQUE REFERENCES public.departments(id) ON DELETE CASCADE,
    meta_title VARCHAR(250),
    meta_description TEXT,
    keywords TEXT,
    canonical_url VARCHAR(500) CHECK (canonical_url ~ '^https?://'),
    og_title VARCHAR(250),
    og_description TEXT,
    og_image JSONB,
    twitter_title VARCHAR(250),
    twitter_description TEXT,
    twitter_image JSONB,
    robots VARCHAR(100) DEFAULT 'index, follow',
    schema_markup JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now()
);

-- C. Department Contacts
CREATE TABLE IF NOT EXISTS public.department_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL UNIQUE REFERENCES public.departments(id) ON DELETE CASCADE,
    email VARCHAR(255) CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    phone VARCHAR(50),
    telephone VARCHAR(50),
    fax VARCHAR(50),
    website VARCHAR(500) CHECK (website ~ '^https?://'),
    office_address TEXT,
    google_maps_url VARCHAR(1000) CHECK (google_maps_url ~ '^https?://'),
    social_links JSONB DEFAULT '{}'::jsonb,
    working_hours JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now()
);

-- D. Department Manual Metrics
CREATE TABLE IF NOT EXISTS public.department_manual_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL UNIQUE REFERENCES public.departments(id) ON DELETE CASCADE,
    metric_label_1 VARCHAR(100),
    metric_value_1 VARCHAR(100),
    metric_label_2 VARCHAR(100),
    metric_value_2 VARCHAR(100),
    metric_label_3 VARCHAR(100),
    metric_value_3 VARCHAR(100),
    metric_label_4 VARCHAR(100),
    metric_value_4 VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now()
);

-- E. Department Highlights
CREATE TABLE IF NOT EXISTS public.department_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    cover_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    link_url VARCHAR(500) CHECK (link_url ~ '^https?://'),
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    deleted_at TIMESTAMPTZ
);

-- Explicit indexes needed for 1-to-N relationships and foreign keys
CREATE INDEX IF NOT EXISTS idx_department_highlights_dept ON public.department_highlights(department_id);
CREATE INDEX IF NOT EXISTS idx_department_highlights_order ON public.department_highlights(display_order);
CREATE INDEX IF NOT EXISTS idx_department_highlights_cover ON public.department_highlights(cover_media_id);

-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_settings_updated_at') THEN
        CREATE TRIGGER trg_department_settings_updated_at BEFORE UPDATE ON public.department_settings FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_seo_updated_at') THEN
        CREATE TRIGGER trg_department_seo_updated_at BEFORE UPDATE ON public.department_seo FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_contacts_updated_at') THEN
        CREATE TRIGGER trg_department_contacts_updated_at BEFORE UPDATE ON public.department_contacts FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_manual_metrics_updated_at') THEN
        CREATE TRIGGER trg_department_manual_metrics_updated_at BEFORE UPDATE ON public.department_manual_metrics FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_highlights_updated_at') THEN
        CREATE TRIGGER trg_department_highlights_updated_at BEFORE UPDATE ON public.department_highlights FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.department_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_manual_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_highlights ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent setup)
DROP POLICY IF EXISTS "Public Read Access" ON public.department_settings;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_settings;
DROP POLICY IF EXISTS "Public Read Access" ON public.department_seo;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_seo;
DROP POLICY IF EXISTS "Public Read Access" ON public.department_contacts;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_contacts;
DROP POLICY IF EXISTS "Public Read Access" ON public.department_manual_metrics;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_manual_metrics;
DROP POLICY IF EXISTS "Public Read Access" ON public.department_highlights;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_highlights;

-- Recreate policies securely
CREATE POLICY "Admin Write Access" ON public.department_settings FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
CREATE POLICY "Admin Write Access" ON public.department_seo FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
CREATE POLICY "Admin Write Access" ON public.department_contacts FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
CREATE POLICY "Admin Write Access" ON public.department_manual_metrics FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());
CREATE POLICY "Admin Write Access" ON public.department_highlights FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

CREATE POLICY "Public Read Access" ON public.department_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.department_seo FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.department_contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.department_manual_metrics FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.department_highlights FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

COMMIT;

-- ============================================================================
-- 5. VALIDATION QUERIES
-- Run these in Supabase SQL Editor to verify the migration
-- ============================================================================
/*
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name IN ('departments', 'department_settings', 'department_seo', 'department_contacts') 
  AND column_name IN ('motto', 'theme_color', 'og_image', 'social_links', 'hero_media_id', 'deleted_at');

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('departments', 'department_settings', 'department_seo', 'department_contacts', 'department_highlights');

SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('department_settings', 'department_seo', 'department_contacts', 'department_manual_metrics', 'department_highlights');

SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('department_settings', 'department_seo', 'department_contacts', 'department_manual_metrics', 'department_highlights');
*/
