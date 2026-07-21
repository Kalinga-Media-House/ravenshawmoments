-- ============================================================================
-- Ravenshaw Moments
-- Migration : 053_department_programs.sql
-- Purpose   : Enhance Department Programs and Batches for full CMS integration
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.department_programs;
--    CREATE POLICY "Public Read Access" ON public.department_programs FOR SELECT USING (true);
-- 2. DROP POLICY IF EXISTS "Public Read Access" ON public.batches;
--    CREATE POLICY "Public Read Access" ON public.batches FOR SELECT USING (true);
-- 3. ALTER TABLE public.batches DROP COLUMN IF EXISTS academic_session_id, DROP COLUMN IF EXISTS display_order, DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS deleted_at;
-- 4. ALTER TABLE public.department_programs DROP CONSTRAINT IF EXISTS uq_department_programs_slug;
-- 5. ALTER TABLE public.department_programs DROP COLUMN IF EXISTS short_name, DROP COLUMN IF EXISTS slug, DROP COLUMN IF EXISTS description, DROP COLUMN IF EXISTS overview, DROP COLUMN IF EXISTS eligibility, DROP COLUMN IF EXISTS intake_capacity, DROP COLUMN IF EXISTS curriculum_url, DROP COLUMN IF EXISTS brochure_media_id, DROP COLUMN IF EXISTS syllabus_media_id, DROP COLUMN IF EXISTS admission_url, DROP COLUMN IF EXISTS learning_outcomes, DROP COLUMN IF EXISTS career_opportunities, DROP COLUMN IF EXISTS display_order, DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS published_at, DROP COLUMN IF EXISTS published_by, DROP COLUMN IF EXISTS seo_metadata, DROP COLUMN IF EXISTS deleted_at;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ENHANCE DEPARTMENT PROGRAMS
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'short_name') THEN
        ALTER TABLE public.department_programs ADD COLUMN short_name VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'slug') THEN
        -- Add slug without global uniqueness, and add departmental uniqueness constraint
        ALTER TABLE public.department_programs ADD COLUMN slug VARCHAR(180);
        ALTER TABLE public.department_programs ADD CONSTRAINT uq_department_programs_slug UNIQUE (department_id, slug);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'description') THEN
        ALTER TABLE public.department_programs ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'overview') THEN
        ALTER TABLE public.department_programs ADD COLUMN overview TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'eligibility') THEN
        ALTER TABLE public.department_programs ADD COLUMN eligibility TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'intake_capacity') THEN
        ALTER TABLE public.department_programs ADD COLUMN intake_capacity INTEGER CHECK (intake_capacity > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'curriculum_url') THEN
        ALTER TABLE public.department_programs ADD COLUMN curriculum_url VARCHAR(500) CHECK (curriculum_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'brochure_media_id') THEN
        ALTER TABLE public.department_programs ADD COLUMN brochure_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'syllabus_media_id') THEN
        ALTER TABLE public.department_programs ADD COLUMN syllabus_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'admission_url') THEN
        ALTER TABLE public.department_programs ADD COLUMN admission_url VARCHAR(500) CHECK (admission_url ~ '^https?://');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'learning_outcomes') THEN
        ALTER TABLE public.department_programs ADD COLUMN learning_outcomes TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'career_opportunities') THEN
        ALTER TABLE public.department_programs ADD COLUMN career_opportunities TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'display_order') THEN
        ALTER TABLE public.department_programs ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'status') THEN
        ALTER TABLE public.department_programs ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'published_at') THEN
        ALTER TABLE public.department_programs ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'published_by') THEN
        ALTER TABLE public.department_programs ADD COLUMN published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'seo_metadata') THEN
        ALTER TABLE public.department_programs ADD COLUMN seo_metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_programs' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.department_programs ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Explicitly enforce deterministic display ordering within a department (Partial Unique Index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_department_programs_unique_order 
ON public.department_programs(department_id, display_order) 
WHERE deleted_at IS NULL;

-- Standard performance indexes for department_programs
CREATE INDEX IF NOT EXISTS idx_department_programs_brochure ON public.department_programs(brochure_media_id);
CREATE INDEX IF NOT EXISTS idx_department_programs_syllabus ON public.department_programs(syllabus_media_id);
CREATE INDEX IF NOT EXISTS idx_department_programs_published_by ON public.department_programs(published_by);
CREATE INDEX IF NOT EXISTS idx_department_programs_slug ON public.department_programs(slug);

-- ============================================================================
-- 2. ENHANCE BATCHES
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'academic_session_id') THEN
        -- Explicitly link to the global academic_sessions table, avoiding isolated silos
        ALTER TABLE public.batches ADD COLUMN academic_session_id UUID REFERENCES public.academic_sessions(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'display_order') THEN
        ALTER TABLE public.batches ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'status') THEN
        ALTER TABLE public.batches ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.batches ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Explicitly enforce deterministic display ordering within a program (Partial Unique Index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_batches_unique_order 
ON public.batches(department_program_id, display_order) 
WHERE deleted_at IS NULL;

-- Standard performance indexes for batches
CREATE INDEX IF NOT EXISTS idx_batches_academic_session ON public.batches(academic_session_id);

-- ============================================================================
-- 3. UPDATE RLS POLICIES FOR SOFT DELETE & STATUS
-- ============================================================================
DROP POLICY IF EXISTS "Public Read Access" ON public.department_programs;
CREATE POLICY "Public Read Access" ON public.department_programs FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public Read Access" ON public.batches;
CREATE POLICY "Public Read Access" ON public.batches FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Explicitly ensure Admin Write Access is maintained 
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_programs;
CREATE POLICY "Admin Write Access" ON public.department_programs FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DROP POLICY IF EXISTS "Admin Write Access" ON public.batches;
CREATE POLICY "Admin Write Access" ON public.batches FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 4. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Program Columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'department_programs' 
AND column_name IN ('slug', 'curriculum_url', 'status');

-- Verify Batch Columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'batches' 
AND column_name IN ('academic_session_id', 'display_order', 'status', 'deleted_at');

-- Verify Foreign Keys
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid IN ('department_programs'::regclass, 'batches'::regclass) AND contype IN ('f', 'u');

-- Verify Indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('department_programs', 'batches');

-- Verify Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('department_programs', 'batches');
*/
