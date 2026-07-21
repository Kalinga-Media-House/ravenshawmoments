-- ============================================================================
-- Ravenshaw Moments
-- Migration : 052_department_hod.sql
-- Purpose   : Dedicated HOD management table with history and profile linking
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP TRIGGER IF EXISTS trg_validate_hod_tenure_overlap ON public.department_hod;
-- 2. DROP TRIGGER IF EXISTS trg_ensure_single_current_hod ON public.department_hod;
-- 3. DROP TRIGGER IF EXISTS trg_department_hod_updated_at ON public.department_hod;
-- 4. DROP FUNCTION IF EXISTS app.validate_hod_tenure_overlap();
-- 5. DROP FUNCTION IF EXISTS app.ensure_single_current_hod();
-- 6. DROP TABLE IF EXISTS public.department_hod CASCADE;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. TABLE CREATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_hod (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(20) DEFAULT 'Prof.',
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(150) DEFAULT 'Head of Department',
    photo_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
    message TEXT,
    is_current BOOLEAN NOT NULL DEFAULT false,
    start_date DATE,
    end_date DATE,
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT app.utc_now(),
    deleted_at TIMESTAMPTZ,
    
    -- Ensure dates are logical if both are provided
    CONSTRAINT check_hod_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- ============================================================================
-- 2. INDEXES & UNIQUE CONSTRAINTS
-- ============================================================================
-- Explicit indexes for foreign keys to prevent sequential scans on DELETE CASCADE/SET NULL
CREATE INDEX IF NOT EXISTS idx_department_hod_dept ON public.department_hod(department_id);
CREATE INDEX IF NOT EXISTS idx_department_hod_profile ON public.department_hod(profile_id);
CREATE INDEX IF NOT EXISTS idx_department_hod_photo ON public.department_hod(photo_media_id);

-- Performance index for fetching the current HOD quickly, serving as a Partial UNIQUE Constraint
-- This ensures strictly one active HOD at the schema level.
CREATE UNIQUE INDEX IF NOT EXISTS idx_department_hod_single_current 
ON public.department_hod(department_id) 
WHERE is_current = true AND deleted_at IS NULL;

-- Ordering index for historical views
CREATE INDEX IF NOT EXISTS idx_department_hod_order ON public.department_hod(department_id, display_order);

-- ============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================================

-- A. Function to prevent overlapping tenure periods
CREATE OR REPLACE FUNCTION app.validate_hod_tenure_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Only validate rows that have at least one date boundary defined.
    IF NEW.start_date IS NOT NULL OR NEW.end_date IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.department_hod
            WHERE department_id = NEW.department_id
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
            AND deleted_at IS NULL
            AND (start_date IS NOT NULL OR end_date IS NOT NULL)
            AND (
                COALESCE(NEW.start_date, '-infinity'::date) <= COALESCE(end_date, 'infinity'::date)
                AND
                COALESCE(NEW.end_date, 'infinity'::date) >= COALESCE(start_date, '-infinity'::date)
            )
        ) THEN
            RAISE EXCEPTION 'HOD tenure periods cannot overlap within the same department.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, app;

-- B. Function to automatically demote the existing current HOD when a new one is set to true.
-- Runs BEFORE INSERT OR UPDATE, which executes *before* the UNIQUE index checks at statement end.
CREATE OR REPLACE FUNCTION app.ensure_single_current_hod()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE public.department_hod 
        SET is_current = false, updated_at = app.utc_now()
        WHERE department_id = NEW.department_id 
        AND id != NEW.id 
        AND is_current = true
        AND deleted_at IS NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, app;

-- Deploy Overlap Validation Trigger
DROP TRIGGER IF EXISTS trg_validate_hod_tenure_overlap ON public.department_hod;
CREATE TRIGGER trg_validate_hod_tenure_overlap
BEFORE INSERT OR UPDATE ON public.department_hod
FOR EACH ROW EXECUTE FUNCTION app.validate_hod_tenure_overlap();

-- Deploy Single Current HOD Trigger
DROP TRIGGER IF EXISTS trg_ensure_single_current_hod ON public.department_hod;
CREATE TRIGGER trg_ensure_single_current_hod 
BEFORE INSERT OR UPDATE ON public.department_hod 
FOR EACH ROW EXECUTE FUNCTION app.ensure_single_current_hod();

-- Deploy Updated At Trigger
DROP TRIGGER IF EXISTS trg_department_hod_updated_at ON public.department_hod;
CREATE TRIGGER trg_department_hod_updated_at 
BEFORE UPDATE ON public.department_hod 
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.department_hod ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.department_hod;
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_hod;

-- Public can view active HODs and historical ones that aren't deleted
CREATE POLICY "Public Read Access" ON public.department_hod 
FOR SELECT USING (deleted_at IS NULL);

-- Admins can manage all HOD entries
CREATE POLICY "Admin Write Access" ON public.department_hod 
FOR ALL TO authenticated 
USING (app.is_admin_or_super()) 
WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 5. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Table and Columns
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'department_hod';

-- Verify Indexes (Includes Unique Constraint)
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'department_hod';

-- Verify Foreign Keys and Constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'department_hod'::regclass AND contype IN ('f', 'c');

-- Verify Triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'department_hod';

-- Verify RLS Policies
SELECT policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'department_hod';
*/
