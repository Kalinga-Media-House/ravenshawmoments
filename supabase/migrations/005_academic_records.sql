-- =============================================================================
-- Ravenshaw Moments
-- Migration : 005_academic_records.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Academic identity and university relationships.
-- Depends on:
--   001_database_foundation.sql
--   002_enums.sql
--   003_master_data.sql
--   004_identity.sql
-- =============================================================================

BEGIN;

-- ============================================================================
-- Education Records
-- ============================================================================
CREATE TABLE public.education_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_program_id uuid NOT NULL REFERENCES public.department_programs(id),
    batch_id uuid NOT NULL REFERENCES public.batches(id),
    roll_number varchar(50),
    registration_number varchar(100),
    admission_date date,
    graduation_date date,
    academic_status academic_status NOT NULL DEFAULT 'studying',
    is_primary boolean NOT NULL DEFAULT true,
    is_verified boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES public.profiles(id),
    updated_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz,
    CONSTRAINT uq_batch_roll UNIQUE(batch_id, roll_number),
    CONSTRAINT uq_batch_registration UNIQUE(batch_id, registration_number)
);

CREATE INDEX idx_education_profile ON public.education_records(profile_id);
CREATE INDEX idx_education_batch ON public.education_records(batch_id);
CREATE INDEX idx_education_program ON public.education_records(department_program_id);

CREATE TRIGGER trg_education_records_updated_at
BEFORE UPDATE ON public.education_records
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.education_records IS
'Academic records for students and alumni. One profile may have multiple records.';

-- ============================================================================
-- Faculty Profiles
-- ============================================================================
CREATE TABLE public.faculty_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id uuid NOT NULL REFERENCES public.departments(id),
    designation_id uuid NOT NULL REFERENCES public.teacher_designations(id),
    employee_code varchar(50),
    joining_date date,
    leaving_date date,
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_faculty_dates CHECK (
        leaving_date IS NULL OR joining_date IS NULL OR leaving_date >= joining_date
    )
);

CREATE INDEX idx_faculty_department ON public.faculty_profiles(department_id);

CREATE TRIGGER trg_faculty_profiles_updated_at
BEFORE UPDATE ON public.faculty_profiles
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Hostel Memberships
-- ============================================================================
CREATE TABLE public.hostel_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hostel_id uuid NOT NULL REFERENCES public.hostels(id),
    academic_session_id uuid NOT NULL REFERENCES public.academic_sessions(id),
    room_number varchar(30),
    joined_on date,
    left_on date,
    is_current boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_hostel_dates CHECK (
        left_on IS NULL OR joined_on IS NULL OR left_on >= joined_on
    )
);

CREATE INDEX idx_hostel_profile ON public.hostel_memberships(profile_id);
CREATE INDEX idx_hostel_session ON public.hostel_memberships(academic_session_id);

CREATE TRIGGER trg_hostel_memberships_updated_at
BEFORE UPDATE ON public.hostel_memberships
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Leadership Assignments
-- ============================================================================
CREATE TABLE public.leadership_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leadership_role_id uuid NOT NULL REFERENCES public.leadership_roles(id),
    academic_session_id uuid NOT NULL REFERENCES public.academic_sessions(id),
    department_id uuid REFERENCES public.departments(id),
    hostel_id uuid REFERENCES public.hostels(id),
    organization_id uuid REFERENCES public.organizations(id),
    start_date date NOT NULL,
    end_date date,
    assigned_by uuid REFERENCES public.profiles(id),
    remarks text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_scope CHECK (
        ((department_id IS NOT NULL)::int +
         (hostel_id IS NOT NULL)::int +
         (organization_id IS NOT NULL)::int) = 1
    ),
    CONSTRAINT chk_leadership_dates CHECK (
        end_date IS NULL OR end_date >= start_date
    )
);

CREATE INDEX idx_leadership_profile ON public.leadership_assignments(profile_id);
CREATE INDEX idx_leadership_session ON public.leadership_assignments(academic_session_id);

CREATE TRIGGER trg_leadership_assignments_updated_at
BEFORE UPDATE ON public.leadership_assignments
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Verification
-- ============================================================================
CREATE TABLE public.verification_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_by uuid NOT NULL REFERENCES public.profiles(id),
    verification_status verification_status NOT NULL DEFAULT 'pending',
    reviewer_id uuid REFERENCES public.profiles(id),
    remarks text,
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_verification_profile
ON public.verification_requests(profile_id);

CREATE TABLE public.verification_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_request_id uuid NOT NULL
        REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    action verification_status NOT NULL,
    reviewer_id uuid REFERENCES public.profiles(id),
    remarks text,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

COMMIT;
