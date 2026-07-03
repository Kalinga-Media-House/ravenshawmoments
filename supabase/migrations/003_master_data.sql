-- =============================================================================
-- Ravenshaw Moments
-- Migration : 003_master_data.sql
-- Version   : 1.0.0
-- Author    : Kalinga Media House
-- =============================================================================
-- PURPOSE
-- Creates core master/reference tables.
-- NOTE: Seed data is added in 020_seed_data.sql
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Academic Sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.academic_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(20) NOT NULL UNIQUE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_current boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT chk_session_dates CHECK (end_date > start_date)
);

CREATE TRIGGER trg_academic_sessions_updated_at
BEFORE UPDATE ON public.academic_sessions
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Course Levels
-- -----------------------------------------------------------------------------
CREATE TABLE public.course_levels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code course_level_type NOT NULL UNIQUE,
    display_name varchar(50) NOT NULL,
    duration_years smallint NOT NULL CHECK(duration_years BETWEEN 1 AND 10),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_course_levels_updated_at
BEFORE UPDATE ON public.course_levels
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Departments
-- -----------------------------------------------------------------------------
CREATE TABLE public.departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(150) NOT NULL UNIQUE,
    short_name varchar(30),
    slug varchar(180) NOT NULL UNIQUE,
    description text,
    established_year smallint,
    logo_media_id uuid,
    cover_media_id uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_departments_slug ON public.departments(slug);

CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Department Programs
-- -----------------------------------------------------------------------------
CREATE TABLE public.department_programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    course_level_id uuid NOT NULL REFERENCES public.course_levels(id),
    program_name varchar(150) NOT NULL,
    duration_years smallint NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(department_id, program_name)
);

CREATE INDEX idx_department_programs_department
ON public.department_programs(department_id);

CREATE TRIGGER trg_department_programs_updated_at
BEFORE UPDATE ON public.department_programs
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Batches
-- -----------------------------------------------------------------------------
CREATE TABLE public.batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department_program_id uuid NOT NULL
        REFERENCES public.department_programs(id) ON DELETE CASCADE,
    batch_name varchar(30) NOT NULL,
    start_year smallint NOT NULL,
    end_year smallint NOT NULL,
    graduation_year smallint,
    is_current boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CHECK(end_year >= start_year),
    UNIQUE(department_program_id,batch_name)
);

CREATE INDEX idx_batches_program
ON public.batches(department_program_id);

CREATE TRIGGER trg_batches_updated_at
BEFORE UPDATE ON public.batches
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Hostels
-- -----------------------------------------------------------------------------
CREATE TABLE public.hostels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL UNIQUE,
    hostel_type hostel_type NOT NULL,
    slug varchar(150) NOT NULL UNIQUE,
    description text,
    established_year smallint,
    logo_media_id uuid,
    cover_media_id uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_hostels_updated_at
BEFORE UPDATE ON public.hostels
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Organizations
-- -----------------------------------------------------------------------------
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(150) NOT NULL UNIQUE,
    short_name varchar(50),
    slug varchar(150) NOT NULL UNIQUE,
    description text,
    logo_media_id uuid,
    cover_media_id uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- -----------------------------------------------------------------------------
-- Master Lookup Tables
-- -----------------------------------------------------------------------------
CREATE TABLE public.facilities(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true
);

CREATE TABLE public.leadership_roles(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(80) UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true
);

CREATE TABLE public.teacher_designations(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    is_active boolean DEFAULT true
);

CREATE TABLE public.competition_categories(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true
);

CREATE TABLE public.achievement_categories(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true
);

COMMIT;
