-- ============================================================================
-- Ravenshaw Moments
-- Migration : 055_department_students.sql
-- Purpose   : Enhance Department Students for verified membership snapshot
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP POLICY IF EXISTS "Public Read Access" ON public.department_students;
--    CREATE POLICY "Public Read Access" ON public.department_students FOR SELECT USING (true);
-- 2. ALTER TABLE public.department_students DROP COLUMN IF EXISTS source_education_record_id, DROP COLUMN IF EXISTS verification_request_id, DROP COLUMN IF EXISTS approved_by_role, DROP COLUMN IF EXISTS membership_status, DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS display_order, DROP COLUMN IF EXISTS deleted_at, DROP COLUMN IF EXISTS snapshot_version;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ENHANCE DEPARTMENT STUDENTS SNAPSHOT
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'source_education_record_id') THEN
        ALTER TABLE public.department_students ADD COLUMN source_education_record_id UUID REFERENCES public.education_records(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'verification_request_id') THEN
        ALTER TABLE public.department_students ADD COLUMN verification_request_id UUID REFERENCES public.verification_requests(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'approved_by_role') THEN
        ALTER TABLE public.department_students ADD COLUMN approved_by_role VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'membership_status') THEN
        ALTER TABLE public.department_students ADD COLUMN membership_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (membership_status IN ('active', 'graduated', 'transferred', 'suspended', 'withdrawn', 'alumni'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'status') THEN
        ALTER TABLE public.department_students ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'display_order') THEN
        ALTER TABLE public.department_students ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'deleted_at') THEN
        ALTER TABLE public.department_students ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'department_students' AND column_name = 'snapshot_version') THEN
        ALTER TABLE public.department_students ADD COLUMN snapshot_version INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

-- ============================================================================
-- 2. INTEGRITY AND PERFORMANCE INDEXES
-- ============================================================================

-- Ensure deterministic display order within a department for active, published snapshots
CREATE UNIQUE INDEX IF NOT EXISTS idx_dept_students_unique_order 
ON public.department_students(department_id, display_order) 
WHERE is_active = true AND deleted_at IS NULL;

-- Standard foreign key and query performance indexes
CREATE INDEX IF NOT EXISTS idx_dept_students_source_ed ON public.department_students(source_education_record_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_verification_req ON public.department_students(verification_request_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_membership ON public.department_students(membership_status);
CREATE INDEX IF NOT EXISTS idx_dept_students_status ON public.department_students(status);

-- ============================================================================
-- 3. UPDATE RLS POLICIES
-- ============================================================================

ALTER TABLE public.department_students ENABLE ROW LEVEL SECURITY;

-- Public Read Access: Only published, active and non-deleted snapshots are visible
DROP POLICY IF EXISTS "Public Read Access" ON public.department_students;
CREATE POLICY "Public Read Access" ON public.department_students 
FOR SELECT USING (status = 'published' AND deleted_at IS NULL AND is_active = true);

-- Admin Write Access: Restricted to verified admins
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_students;
CREATE POLICY "Admin Write Access" ON public.department_students 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 4. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Added Columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'department_students' 
AND column_name IN ('source_education_record_id', 'verification_request_id', 'approved_by_role', 'membership_status', 'status', 'snapshot_version');

-- Verify Unique Indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'department_students' AND indexname = 'idx_dept_students_unique_order';

-- Verify RLS Policies
SELECT tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'department_students';
*/
