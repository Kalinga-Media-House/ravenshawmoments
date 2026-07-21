-- ============================================================================
-- Ravenshaw Moments
-- Migration : 054_department_faculty.sql
-- Purpose   : Enhance Department Teachers for full CMS & Faculty Profile integration
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.department_teachers;
--    CREATE POLICY "Public Read Access" ON public.department_teachers FOR SELECT USING (true);
-- 2. ALTER TABLE public.department_teachers DROP COLUMN IF EXISTS employee_code, DROP COLUMN IF EXISTS faculty_type_id, DROP COLUMN IF EXISTS specialization, DROP COLUMN IF EXISTS biography, DROP COLUMN IF EXISTS teaching_areas, DROP COLUMN IF EXISTS experience_years, DROP COLUMN IF EXISTS joining_date, DROP COLUMN IF EXISTS office_hours, DROP COLUMN IF EXISTS website_url, DROP COLUMN IF EXISTS google_scholar_url, DROP COLUMN IF EXISTS orcid_id, DROP COLUMN IF EXISTS researchgate_url, DROP COLUMN IF EXISTS scopus_id, DROP COLUMN IF EXISTS linkedin_url, DROP COLUMN IF EXISTS cv_media_id, DROP COLUMN IF EXISTS profile_media_id, DROP COLUMN IF EXISTS cover_media_id, DROP COLUMN IF EXISTS is_featured, DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS published_at, DROP COLUMN IF EXISTS published_by, DROP COLUMN IF EXISTS deleted_at;
-- 3. DROP TABLE IF EXISTS public.faculty_types CASCADE;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. FACULTY TYPES LOOKUP TABLE
-- ============================================================================
-- Normalizes faculty categorization (Current, Emeritus, Guest, Visiting, Adjunct)
CREATE TABLE IF NOT EXISTS public.faculty_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    slug varchar(100) UNIQUE NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- RLS for faculty_types
ALTER TABLE public.faculty_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.faculty_types;
CREATE POLICY "Public Read Access" ON public.faculty_types FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin Write Access" ON public.faculty_types;
CREATE POLICY "Admin Write Access" ON public.faculty_types FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_faculty_types_updated_at') THEN
        CREATE TRIGGER trg_faculty_types_updated_at
        BEFORE UPDATE ON public.faculty_types
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 2. ENHANCE DEPARTMENT TEACHERS
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'employee_code') THEN
        ALTER TABLE public.department_teachers ADD COLUMN employee_code VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'faculty_type_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN faculty_type_id UUID REFERENCES public.faculty_types(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'specialization') THEN
        ALTER TABLE public.department_teachers ADD COLUMN specialization VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'biography') THEN
        ALTER TABLE public.department_teachers ADD COLUMN biography TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'teaching_areas') THEN
        -- NOTE: Implemented as text[] for high-performance retrieval and CMS flexibility. 
        -- Fully future-compatible: can be trivially migrated to a normalized many-to-many lookup table later via UNNEST().
        ALTER TABLE public.department_teachers ADD COLUMN teaching_areas TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'experience_years') THEN
        ALTER TABLE public.department_teachers ADD COLUMN experience_years INTEGER CHECK (experience_years >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'joining_date') THEN
        ALTER TABLE public.department_teachers ADD COLUMN joining_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'office_hours') THEN
        ALTER TABLE public.department_teachers ADD COLUMN office_hours VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'website_url') THEN
        ALTER TABLE public.department_teachers ADD COLUMN website_url VARCHAR(500) CHECK (website_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'google_scholar_url') THEN
        ALTER TABLE public.department_teachers ADD COLUMN google_scholar_url VARCHAR(500) CHECK (google_scholar_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'orcid_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN orcid_id VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'researchgate_url') THEN
        ALTER TABLE public.department_teachers ADD COLUMN researchgate_url VARCHAR(500) CHECK (researchgate_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'scopus_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN scopus_id VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'linkedin_url') THEN
        ALTER TABLE public.department_teachers ADD COLUMN linkedin_url VARCHAR(500) CHECK (linkedin_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'cv_media_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN cv_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'profile_media_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN profile_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'cover_media_id') THEN
        ALTER TABLE public.department_teachers ADD COLUMN cover_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'is_featured') THEN
        ALTER TABLE public.department_teachers ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'status') THEN
        ALTER TABLE public.department_teachers ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'published_at') THEN
        ALTER TABLE public.department_teachers ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'published_by') THEN
        ALTER TABLE public.department_teachers ADD COLUMN published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_teachers' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.department_teachers ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================================================
-- 3. INTEGRITY AND PERFORMANCE INDEXES
-- ============================================================================

-- Ensure unique employee code globally among active teachers
CREATE UNIQUE INDEX IF NOT EXISTS idx_dept_teachers_emp_code 
ON public.department_teachers(employee_code) 
WHERE employee_code IS NOT NULL AND deleted_at IS NULL;

-- Ensure deterministic display order within a department for active teachers
CREATE UNIQUE INDEX IF NOT EXISTS idx_dept_teachers_unique_order 
ON public.department_teachers(department_id, display_order) 
WHERE is_active = true AND deleted_at IS NULL;

-- Standard foreign key and query performance indexes
CREATE INDEX IF NOT EXISTS idx_dept_teachers_cv ON public.department_teachers(cv_media_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_profile_media ON public.department_teachers(profile_media_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_cover_media ON public.department_teachers(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_published_by ON public.department_teachers(published_by);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_faculty_type ON public.department_teachers(faculty_type_id);

-- ============================================================================
-- 4. UPDATE RLS POLICIES
-- ============================================================================

ALTER TABLE public.department_teachers ENABLE ROW LEVEL SECURITY;

-- Public Read Access: Only published and non-deleted faculty are visible
DROP POLICY IF EXISTS "Public Read Access" ON public.department_teachers;
CREATE POLICY "Public Read Access" ON public.department_teachers 
FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Admin Write Access: Restricted to verified admins
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_teachers;
CREATE POLICY "Admin Write Access" ON public.department_teachers 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 5. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Added Lookup Table
SELECT table_name FROM information_schema.tables WHERE table_name = 'faculty_types';

-- Verify Added Columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'department_teachers' 
AND column_name IN ('employee_code', 'faculty_type_id', 'specialization', 'is_featured', 'status');

-- Verify Unique Indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'department_teachers' AND indexname IN ('idx_dept_teachers_emp_code', 'idx_dept_teachers_unique_order');

-- Verify RLS Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('department_teachers', 'faculty_types');
*/
