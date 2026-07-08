-- =============================================================================
-- Ravenshaw Moments
-- Migration : 023_department_system_enhancements.sql
-- Version   : 2.0.0 (Enterprise)
-- Author    : Kalinga Media House
-- =============================================================================
-- PURPOSE
-- Establishes the enterprise database architecture for Phase 3: Departments Module.
-- Additively enhances the master `departments` table and introduces specialized
-- domain tables for Department CRs, Faculty/Teacher Rosters, Student Directories,
-- Department Notices, Department Events, and Annual Magazines/Publications.
-- Also creates unified SQL views for Galleries, Achievements, News, and Statistics.
--
-- COMPATIBILITY & SAFETY
-- - Forward-only, non-destructive migration.
-- - No tables or columns are dropped or renamed.
-- - UUID primary keys with gen_random_uuid().
-- - Foreign keys fully indexed for query performance and RLS compatibility.
-- - Comments included on all tables and columns.
-- - Idempotent execution using IF NOT EXISTS and DO blocks.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. Enhance Master `departments` Table
-- Adding vision, mission, contact info, HOD references, and verification status.
-- ============================================================================
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS vision text;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS mission text;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS contact_email varchar(255);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS contact_phone varchar(50);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS office_location varchar(150);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS hod_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS hod_message text;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_departments_hod_profile ON public.departments(hod_profile_id);
CREATE INDEX IF NOT EXISTS idx_departments_verified ON public.departments(is_verified);

COMMENT ON COLUMN public.departments.vision IS 'Official vision statement of the academic department.';
COMMENT ON COLUMN public.departments.mission IS 'Official mission statement and academic goals of the department.';
COMMENT ON COLUMN public.departments.contact_email IS 'Public contact email address for departmental inquiries.';
COMMENT ON COLUMN public.departments.contact_phone IS 'Office contact telephone or extension number.';
COMMENT ON COLUMN public.departments.office_location IS 'Physical campus building, block, or office room location.';
COMMENT ON COLUMN public.departments.hod_profile_id IS 'Foreign key linking to the profile of the current Head of Department.';
COMMENT ON COLUMN public.departments.hod_message IS 'Welcome address or introductory message from the HOD.';
COMMENT ON COLUMN public.departments.is_verified IS 'Official verification flag approved by Super Admin.';
COMMENT ON COLUMN public.departments.verified_at IS 'Timestamp when the department page was verified.';
COMMENT ON COLUMN public.departments.verified_by IS 'Super Admin profile ID who approved verification.';

-- ============================================================================
-- 2. Department CRs Table (`department_crs`)
-- Tracks Class Representatives with term dates, roles, and administrative grants.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_crs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    academic_session_id uuid REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
    
    role_title varchar(100) NOT NULL DEFAULT 'Department CR',
    term_start_date date NOT NULL DEFAULT CURRENT_DATE,
    term_end_date date,
    
    is_active boolean NOT NULL DEFAULT true,
    permissions_grant jsonb NOT NULL DEFAULT '{"can_post_notices": true, "can_manage_gallery": true, "can_manage_events": true}'::jsonb,
    
    assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks text,
    
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT uq_dept_cr_profile_session UNIQUE(department_id, profile_id, academic_session_id, role_title),
    CONSTRAINT chk_dept_cr_dates CHECK (term_end_date IS NULL OR term_end_date >= term_start_date)
);

COMMENT ON TABLE public.department_crs IS 'Tracks Class Representatives (CRs) assigned to manage department communities.';
COMMENT ON COLUMN public.department_crs.id IS 'Primary key UUID for CR assignment record.';
COMMENT ON COLUMN public.department_crs.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_crs.profile_id IS 'Foreign key to the student profile appointed as CR.';
COMMENT ON COLUMN public.department_crs.academic_session_id IS 'Academic session during which this CR term is active.';
COMMENT ON COLUMN public.department_crs.role_title IS 'Specific leadership title (e.g., Senior CR, Junior CR, Cultural CR).';
COMMENT ON COLUMN public.department_crs.term_start_date IS 'Start date of CR leadership term.';
COMMENT ON COLUMN public.department_crs.term_end_date IS 'End date of CR leadership term (NULL if currently active).';
COMMENT ON COLUMN public.department_crs.is_active IS 'Flag indicating if this CR is currently holding office.';
COMMENT ON COLUMN public.department_crs.permissions_grant IS 'JSONB structure defining specific departmental management capabilities.';
COMMENT ON COLUMN public.department_crs.assigned_by IS 'Profile ID of faculty or admin who assigned this CR.';
COMMENT ON COLUMN public.department_crs.remarks IS 'Optional notes regarding CR appointment or tenure.';
COMMENT ON COLUMN public.department_crs.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_crs.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_crs_department ON public.department_crs(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_crs_profile ON public.department_crs(profile_id);
CREATE INDEX IF NOT EXISTS idx_dept_crs_session ON public.department_crs(academic_session_id);
CREATE INDEX IF NOT EXISTS idx_dept_crs_active ON public.department_crs(is_active);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_crs_updated_at') THEN
        CREATE TRIGGER trg_department_crs_updated_at
        BEFORE UPDATE ON public.department_crs
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 3. Department Teachers / Faculty Roster Table (`department_teachers`)
-- Manages faculty members affiliated with departments with sorting and contact rules.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_teachers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    designation_id uuid REFERENCES public.teacher_designations(id) ON DELETE SET NULL,
    
    designation_title varchar(100) NOT NULL DEFAULT 'Faculty Member',
    qualification varchar(150),
    research_interests text[],
    office_location varchar(150),
    
    contact_email varchar(255),
    contact_phone varchar(50),
    
    is_hod boolean NOT NULL DEFAULT false,
    is_visiting boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    bio_override text,
    
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT uq_dept_teacher_profile UNIQUE(department_id, profile_id)
);

COMMENT ON TABLE public.department_teachers IS 'Departmental faculty roster mapping professors and teachers to departments.';
COMMENT ON COLUMN public.department_teachers.id IS 'Primary key UUID for departmental teacher record.';
COMMENT ON COLUMN public.department_teachers.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_teachers.profile_id IS 'Foreign key to faculty member profile.';
COMMENT ON COLUMN public.department_teachers.designation_id IS 'Foreign key to master teacher designations table.';
COMMENT ON COLUMN public.department_teachers.designation_title IS 'Display title (e.g., Professor & HOD, Assistant Professor, Guest Faculty).';
COMMENT ON COLUMN public.department_teachers.qualification IS 'Academic qualifications (e.g., Ph.D., M.Phil., M.Sc.).';
COMMENT ON COLUMN public.department_teachers.research_interests IS 'Array of research domains and academic interest areas.';
COMMENT ON COLUMN public.department_teachers.office_location IS 'Faculty office room or cabin location.';
COMMENT ON COLUMN public.department_teachers.contact_email IS 'Public academic contact email address.';
COMMENT ON COLUMN public.department_teachers.contact_phone IS 'Office contact telephone number.';
COMMENT ON COLUMN public.department_teachers.is_hod IS 'Flag indicating if this faculty member is currently Head of Department.';
COMMENT ON COLUMN public.department_teachers.is_visiting IS 'Flag indicating visiting or guest faculty status.';
COMMENT ON COLUMN public.department_teachers.is_active IS 'Active teaching roster status.';
COMMENT ON COLUMN public.department_teachers.display_order IS 'Sorting weight for ordering faculty hierarchy on department homepage.';
COMMENT ON COLUMN public.department_teachers.bio_override IS 'Department-specific biography text.';
COMMENT ON COLUMN public.department_teachers.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_teachers.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_teachers_department ON public.department_teachers(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_profile ON public.department_teachers(profile_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_designation ON public.department_teachers(designation_id);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_active ON public.department_teachers(is_active);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_hod ON public.department_teachers(is_hod);
CREATE INDEX IF NOT EXISTS idx_dept_teachers_order ON public.department_teachers(display_order);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_teachers_updated_at') THEN
        CREATE TRIGGER trg_department_teachers_updated_at
        BEFORE UPDATE ON public.department_teachers
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 4. Department Student Roster Table (`department_students`)
-- Manages student directory listings, batch groupings, CR verifications, and showcases.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
    academic_session_id uuid REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
    department_program_id uuid REFERENCES public.department_programs(id) ON DELETE SET NULL,
    
    leadership_role varchar(100),
    is_featured boolean NOT NULL DEFAULT false,
    is_verified_by_cr boolean NOT NULL DEFAULT false,
    verified_at timestamptz,
    verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active boolean NOT NULL DEFAULT true,
    
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT uq_dept_student_profile_session UNIQUE(department_id, profile_id, academic_session_id)
);

COMMENT ON TABLE public.department_students IS 'Departmental student directory managing enrollments, verification, and leadership roles.';
COMMENT ON COLUMN public.department_students.id IS 'Primary key UUID for department student affiliation.';
COMMENT ON COLUMN public.department_students.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_students.profile_id IS 'Foreign key to student profile.';
COMMENT ON COLUMN public.department_students.batch_id IS 'Foreign key to student batch year.';
COMMENT ON COLUMN public.department_students.academic_session_id IS 'Foreign key to academic session.';
COMMENT ON COLUMN public.department_students.department_program_id IS 'Foreign key to specific program (e.g., B.Sc. Statistics, M.Sc. Statistics).';
COMMENT ON COLUMN public.department_students.leadership_role IS 'Optional leadership title (e.g., Seminar Secretary, Society President, Class Monitor).';
COMMENT ON COLUMN public.department_students.is_featured IS 'Flag to highlight distinguished student on department homepage.';
COMMENT ON COLUMN public.department_students.is_verified_by_cr IS 'Flag indicating CR or faculty verification of departmental membership.';
COMMENT ON COLUMN public.department_students.verified_at IS 'Timestamp when verification occurred.';
COMMENT ON COLUMN public.department_students.verified_by IS 'Profile ID of CR or faculty who performed verification.';
COMMENT ON COLUMN public.department_students.is_active IS 'Active student enrollment status.';
COMMENT ON COLUMN public.department_students.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_students.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_students_department ON public.department_students(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_profile ON public.department_students(profile_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_batch ON public.department_students(batch_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_session ON public.department_students(academic_session_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_program ON public.department_students(department_program_id);
CREATE INDEX IF NOT EXISTS idx_dept_students_featured ON public.department_students(is_featured);
CREATE INDEX IF NOT EXISTS idx_dept_students_verified ON public.department_students(is_verified_by_cr);
CREATE INDEX IF NOT EXISTS idx_dept_students_active ON public.department_students(is_active);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_students_updated_at') THEN
        CREATE TRIGGER trg_department_students_updated_at
        BEFORE UPDATE ON public.department_students
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 5. Department Notices Table (`department_notices`)
-- Manages official academic announcements, exam schedules, and circulars.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_notices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('DNT'),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    
    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    content text NOT NULL,
    priority varchar(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    target_audience varchar(50) NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'alumni')),
    
    attachment_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    published_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at timestamptz NOT NULL DEFAULT app.utc_now(),
    expires_at timestamptz,
    is_published boolean NOT NULL DEFAULT true,
    is_pinned boolean NOT NULL DEFAULT false,
    
    view_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT chk_notice_expiry CHECK (expires_at IS NULL OR expires_at > published_at)
);

COMMENT ON TABLE public.department_notices IS 'Official departmental circulars, academic notices, and announcements.';
COMMENT ON COLUMN public.department_notices.id IS 'Primary key UUID for notice record.';
COMMENT ON COLUMN public.department_notices.public_id IS 'Unique public reference identifier (DNT-XXXXXX).';
COMMENT ON COLUMN public.department_notices.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_notices.title IS 'Title of the notice or circular.';
COMMENT ON COLUMN public.department_notices.slug IS 'URL-friendly slug identifier.';
COMMENT ON COLUMN public.department_notices.content IS 'Detailed text content of the announcement.';
COMMENT ON COLUMN public.department_notices.priority IS 'Priority tier (low, normal, high, critical) controlling UI prominence.';
COMMENT ON COLUMN public.department_notices.target_audience IS 'Intended audience (all, students, faculty, alumni).';
COMMENT ON COLUMN public.department_notices.attachment_media_id IS 'Optional foreign key to media file attachment (PDF/image).';
COMMENT ON COLUMN public.department_notices.published_by IS 'Profile ID of CR, faculty, or admin who published the notice.';
COMMENT ON COLUMN public.department_notices.published_at IS 'Timestamp when notice became live.';
COMMENT ON COLUMN public.department_notices.expires_at IS 'Optional timestamp when notice should automatically archive.';
COMMENT ON COLUMN public.department_notices.is_published IS 'Publication status flag.';
COMMENT ON COLUMN public.department_notices.is_pinned IS 'Flag to pin notice at the top of the department bulletin board.';
COMMENT ON COLUMN public.department_notices.view_count IS 'Cumulative view counter for engagement tracking.';
COMMENT ON COLUMN public.department_notices.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_notices.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_notices_department ON public.department_notices(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_notices_published ON public.department_notices(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_dept_notices_pinned ON public.department_notices(is_pinned DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_dept_notices_audience ON public.department_notices(target_audience);
CREATE INDEX IF NOT EXISTS idx_dept_notices_priority ON public.department_notices(priority);
CREATE INDEX IF NOT EXISTS idx_dept_notices_slug ON public.department_notices(slug);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_notices_updated_at') THEN
        CREATE TRIGGER trg_department_notices_updated_at
        BEFORE UPDATE ON public.department_notices
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 6. Department Events Table (`department_events`)
-- Manages seminars, workshops, guest lectures, farewells, and department fests.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('DEV'),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    
    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    description text NOT NULL,
    event_type varchar(50) NOT NULL DEFAULT 'seminar' CHECK (event_type IN ('seminar', 'workshop', 'conference', 'guest_lecture', 'festival', 'farewell', 'freshers', 'competition', 'other')),
    
    venue varchar(200) NOT NULL,
    event_start_time timestamptz NOT NULL,
    event_end_time timestamptz NOT NULL,
    
    cover_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    registration_url varchar(500),
    is_registration_required boolean NOT NULL DEFAULT false,
    
    coordinator_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,
    
    view_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    
    CONSTRAINT chk_dept_event_times CHECK (event_end_time > event_start_time)
);

COMMENT ON TABLE public.department_events IS 'Departmental academic and cultural events, seminars, and celebrations.';
COMMENT ON COLUMN public.department_events.id IS 'Primary key UUID for department event.';
COMMENT ON COLUMN public.department_events.public_id IS 'Unique public reference identifier (DEV-XXXXXX).';
COMMENT ON COLUMN public.department_events.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_events.title IS 'Event title.';
COMMENT ON COLUMN public.department_events.slug IS 'URL-friendly slug identifier.';
COMMENT ON COLUMN public.department_events.description IS 'Detailed event agenda and information.';
COMMENT ON COLUMN public.department_events.event_type IS 'Category classification of the event.';
COMMENT ON COLUMN public.department_events.venue IS 'Physical venue or virtual meeting link.';
COMMENT ON COLUMN public.department_events.event_start_time IS 'Timestamp when event starts.';
COMMENT ON COLUMN public.department_events.event_end_time IS 'Timestamp when event concludes.';
COMMENT ON COLUMN public.department_events.cover_media_id IS 'Foreign key to promotional banner or poster media file.';
COMMENT ON COLUMN public.department_events.registration_url IS 'Optional external or internal registration link.';
COMMENT ON COLUMN public.department_events.is_registration_required IS 'Flag indicating if pre-registration is mandatory.';
COMMENT ON COLUMN public.department_events.coordinator_profile_id IS 'Profile ID of faculty or CR coordinating the event.';
COMMENT ON COLUMN public.department_events.is_published IS 'Publication status flag.';
COMMENT ON COLUMN public.department_events.is_featured IS 'Flag to highlight event on homepage carousel.';
COMMENT ON COLUMN public.department_events.view_count IS 'Cumulative view counter.';
COMMENT ON COLUMN public.department_events.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_events.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_events_department ON public.department_events(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_events_time ON public.department_events(event_start_time DESC);
CREATE INDEX IF NOT EXISTS idx_dept_events_published ON public.department_events(is_published, event_start_time DESC);
CREATE INDEX IF NOT EXISTS idx_dept_events_featured ON public.department_events(is_featured DESC, event_start_time DESC);
CREATE INDEX IF NOT EXISTS idx_dept_events_type ON public.department_events(event_type);
CREATE INDEX IF NOT EXISTS idx_dept_events_slug ON public.department_events(slug);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_events_updated_at') THEN
        CREATE TRIGGER trg_department_events_updated_at
        BEFORE UPDATE ON public.department_events
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 7. Department Publications Table (`department_publications`)
-- Archives annual magazines, newsletters, research journals, and souvenirs.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_publications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('PUB'),
    department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    academic_session_id uuid REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
    
    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    publication_type varchar(50) NOT NULL DEFAULT 'annual_magazine' CHECK (publication_type IN ('annual_magazine', 'newsletter', 'research_journal', 'souvenir', 'proceedings', 'other')),
    
    description text,
    publish_date date NOT NULL DEFAULT CURRENT_DATE,
    volume_number varchar(50),
    editor_in_chief varchar(150),
    
    cover_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    document_media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_public boolean NOT NULL DEFAULT true,
    
    download_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

COMMENT ON TABLE public.department_publications IS 'Archives of departmental annual magazines, newsletters, and publications.';
COMMENT ON COLUMN public.department_publications.id IS 'Primary key UUID for publication record.';
COMMENT ON COLUMN public.department_publications.public_id IS 'Unique public reference identifier (PUB-XXXXXX).';
COMMENT ON COLUMN public.department_publications.department_id IS 'Foreign key to target department.';
COMMENT ON COLUMN public.department_publications.academic_session_id IS 'Academic session associated with the publication.';
COMMENT ON COLUMN public.department_publications.title IS 'Title of the publication.';
COMMENT ON COLUMN public.department_publications.slug IS 'URL-friendly slug identifier.';
COMMENT ON COLUMN public.department_publications.publication_type IS 'Category of publication (annual magazine, newsletter, journal).';
COMMENT ON COLUMN public.department_publications.description IS 'Abstract or summary of contents.';
COMMENT ON COLUMN public.department_publications.publish_date IS 'Official release date.';
COMMENT ON COLUMN public.department_publications.volume_number IS 'Optional volume / issue identifier.';
COMMENT ON COLUMN public.department_publications.editor_in_chief IS 'Name of faculty or student editor in chief.';
COMMENT ON COLUMN public.department_publications.cover_media_id IS 'Foreign key to cover thumbnail image media file.';
COMMENT ON COLUMN public.department_publications.document_media_id IS 'Foreign key to PDF document media file.';
COMMENT ON COLUMN public.department_publications.uploaded_by IS 'Profile ID who archived the document.';
COMMENT ON COLUMN public.department_publications.is_public IS 'Public download availability flag.';
COMMENT ON COLUMN public.department_publications.download_count IS 'Cumulative download metric.';
COMMENT ON COLUMN public.department_publications.created_at IS 'Record creation timestamp.';
COMMENT ON COLUMN public.department_publications.updated_at IS 'Record last update timestamp.';

CREATE INDEX IF NOT EXISTS idx_dept_pubs_department ON public.department_publications(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_pubs_session ON public.department_publications(academic_session_id);
CREATE INDEX IF NOT EXISTS idx_dept_pubs_date ON public.department_publications(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_dept_pubs_type ON public.department_publications(publication_type);
CREATE INDEX IF NOT EXISTS idx_dept_pubs_slug ON public.department_publications(slug);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_department_publications_updated_at') THEN
        CREATE TRIGGER trg_department_publications_updated_at
        BEFORE UPDATE ON public.department_publications
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 8. Unified SQL Views for Department Galleries, Achievements, News, & Stats
-- Bridges universal engines with department entities for simplified querying.
-- ============================================================================

-- View: Department Galleries Showcase
CREATE OR REPLACE VIEW public.v_department_galleries AS
SELECT 
    ga.id AS album_id,
    ga.public_id,
    ga.entity_id AS department_id,
    d.name AS department_name,
    d.slug AS department_slug,
    ga.title,
    ga.slug AS album_slug,
    ga.description,
    ga.cover_media_id,
    mf.file_url AS cover_url,
    ga.is_featured,
    ga.created_at,
    (SELECT count(*) FROM public.gallery_items gi WHERE gi.gallery_album_id = ga.id) AS item_count
FROM public.gallery_albums ga
JOIN public.departments d ON d.id = ga.entity_id AND ga.entity_type = 'department'
LEFT JOIN public.media_files mf ON mf.id = ga.cover_media_id
WHERE ga.is_public = true AND ga.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_galleries IS 'Unified showcase view of public gallery albums belonging to academic departments.';

-- View: Department Achievements Showcase
CREATE OR REPLACE VIEW public.v_department_achievements AS
SELECT 
    a.id AS achievement_id,
    a.public_id,
    a.entity_id AS department_id,
    d.name AS department_name,
    d.slug AS department_slug,
    ac.name AS category_name,
    a.title,
    a.slug AS achievement_slug,
    a.description,
    a.achievement_date,
    a.issuing_organization,
    mf.file_url AS featured_image_url,
    a.is_featured,
    a.created_at
FROM public.achievements a
JOIN public.departments d ON d.id = a.entity_id AND a.entity_type = 'department'
JOIN public.achievement_categories ac ON ac.id = a.category_id
LEFT JOIN public.media_files mf ON mf.id = a.featured_media_id
WHERE a.is_public = true AND a.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_achievements IS 'Unified showcase view of honors and awards earned by academic departments.';

-- View: Department News Showcase
CREATE OR REPLACE VIEW public.v_department_news AS
SELECT 
    ci.id AS content_id,
    ci.public_id,
    ci.entity_id AS department_id,
    d.name AS department_name,
    d.slug AS department_slug,
    ci.title,
    ci.slug AS news_slug,
    ci.summary,
    ci.body,
    mf.file_url AS featured_image_url,
    ci.published_at,
    ci.view_count,
    ci.is_featured
FROM public.content_items ci
JOIN public.departments d ON d.id = ci.entity_id AND ci.entity_type = 'department'
LEFT JOIN public.media_files mf ON mf.id = ci.featured_media_id
WHERE ci.content_type = 'news' AND ci.is_published = true AND ci.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_news IS 'Unified showcase view of published news items related to academic departments.';

-- View: Department Statistics Dashboard
CREATE OR REPLACE VIEW public.v_department_statistics AS
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    d.slug AS department_slug,
    d.is_active,
    d.is_verified,
    (SELECT count(*) FROM public.department_students ds WHERE ds.department_id = d.id AND ds.is_active = true) AS total_students,
    (SELECT count(*) FROM public.department_teachers dt WHERE dt.department_id = d.id AND dt.is_active = true) AS total_teachers,
    (SELECT count(*) FROM public.department_crs dc WHERE dc.department_id = d.id AND dc.is_active = true) AS total_crs,
    (SELECT count(*) FROM public.department_events de WHERE de.department_id = d.id AND de.is_published = true) AS total_events,
    (SELECT count(*) FROM public.department_notices dn WHERE dn.department_id = d.id AND dn.is_published = true) AS total_notices,
    (SELECT count(*) FROM public.department_publications dp WHERE dp.department_id = d.id AND dp.is_public = true) AS total_publications,
    (SELECT count(*) FROM public.gallery_albums ga WHERE ga.entity_id = d.id AND ga.entity_type = 'department' AND ga.is_public = true AND ga.deleted_at IS NULL) AS total_gallery_albums,
    (SELECT count(*) FROM public.achievements a WHERE a.entity_id = d.id AND a.entity_type = 'department' AND a.is_public = true AND a.deleted_at IS NULL) AS total_achievements
FROM public.departments d;

COMMENT ON VIEW public.v_department_statistics IS 'Real-time aggregated statistics dashboard for every academic department.';

COMMIT;
