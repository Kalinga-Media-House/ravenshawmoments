-- ============================================================================
-- Ravenshaw Moments
-- Migration : 024_department_system_rls_policies.sql
-- Purpose   : Enterprise Row Level Security (RLS) Policies for Department System
-- Security  : Least Privilege | Zero Anonymous Write | Granular RBAC / CR Isolation
-- ============================================================================

-- Enable RLS on all 7 Department module tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_crs ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_publications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running migration safely
DROP POLICY IF EXISTS departments_select_policy ON departments;
DROP POLICY IF EXISTS departments_insert_policy ON departments;
DROP POLICY IF EXISTS departments_update_policy ON departments;
DROP POLICY IF EXISTS departments_delete_policy ON departments;

DROP POLICY IF EXISTS department_crs_select_policy ON department_crs;
DROP POLICY IF EXISTS department_crs_insert_policy ON department_crs;
DROP POLICY IF EXISTS department_crs_update_policy ON department_crs;
DROP POLICY IF EXISTS department_crs_delete_policy ON department_crs;

DROP POLICY IF EXISTS department_teachers_select_policy ON department_teachers;
DROP POLICY IF EXISTS department_teachers_insert_policy ON department_teachers;
DROP POLICY IF EXISTS department_teachers_update_policy ON department_teachers;
DROP POLICY IF EXISTS department_teachers_delete_policy ON department_teachers;

DROP POLICY IF EXISTS department_students_select_policy ON department_students;
DROP POLICY IF EXISTS department_students_insert_policy ON department_students;
DROP POLICY IF EXISTS department_students_update_policy ON department_students;
DROP POLICY IF EXISTS department_students_delete_policy ON department_students;

DROP POLICY IF EXISTS department_notices_select_policy ON department_notices;
DROP POLICY IF EXISTS department_notices_insert_policy ON department_notices;
DROP POLICY IF EXISTS department_notices_update_policy ON department_notices;
DROP POLICY IF EXISTS department_notices_delete_policy ON department_notices;

DROP POLICY IF EXISTS department_events_select_policy ON department_events;
DROP POLICY IF EXISTS department_events_insert_policy ON department_events;
DROP POLICY IF EXISTS department_events_update_policy ON department_events;
DROP POLICY IF EXISTS department_events_delete_policy ON department_events;

DROP POLICY IF EXISTS department_publications_select_policy ON department_publications;
DROP POLICY IF EXISTS department_publications_insert_policy ON department_publications;
DROP POLICY IF EXISTS department_publications_update_policy ON department_publications;
DROP POLICY IF EXISTS department_publications_delete_policy ON department_publications;

-- ============================================================================
-- 1. TABLE: departments
-- ============================================================================

-- SELECT: Verified or active departments are public read. Unverified visible to HOD / Super Admin.
CREATE POLICY departments_select_policy ON departments
  FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = departments.id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT: Super Admin only.
CREATE POLICY departments_insert_policy ON departments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
  );

-- UPDATE: Super Admin or active HOD for that department.
CREATE POLICY departments_update_policy ON departments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = departments.id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- DELETE: Super Admin only.
CREATE POLICY departments_delete_policy ON departments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
  );

-- ============================================================================
-- 2. TABLE: department_crs
-- ============================================================================

-- SELECT: Active CRs are public read. History visible to CR themselves, HOD, or Super Admin.
CREATE POLICY department_crs_select_policy ON department_crs
  FOR SELECT
  USING (
    is_active = true
    OR profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_crs.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT / UPDATE / DELETE: Super Admin or active HOD of that department.
CREATE POLICY department_crs_insert_policy ON department_crs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_crs.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_crs_update_policy ON department_crs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_crs.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_crs_delete_policy ON department_crs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_crs.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- ============================================================================
-- 3. TABLE: department_teachers
-- ============================================================================

-- SELECT: Active faculty roster public read. Inactive visible to HOD, self, or Super Admin.
CREATE POLICY department_teachers_select_policy ON department_teachers
  FOR SELECT
  USING (
    is_active = true
    OR profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
  );

-- INSERT / DELETE: Super Admin or active HOD.
CREATE POLICY department_teachers_insert_policy ON department_teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers hod
      WHERE hod.department_id = department_teachers.department_id
      AND hod.profile_id = app.current_profile_id()
      AND hod.is_hod = true
      AND hod.is_active = true
    )
  );

-- UPDATE: Super Admin, active HOD, or teacher updating their own profile.
CREATE POLICY department_teachers_update_policy ON department_teachers
  FOR UPDATE
  USING (
    profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers hod
      WHERE hod.department_id = department_teachers.department_id
      AND hod.profile_id = app.current_profile_id()
      AND hod.is_hod = true
      AND hod.is_active = true
    )
  );

CREATE POLICY department_teachers_delete_policy ON department_teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers hod
      WHERE hod.department_id = department_teachers.department_id
      AND hod.profile_id = app.current_profile_id()
      AND hod.is_hod = true
      AND hod.is_active = true
    )
  );

-- ============================================================================
-- 4. TABLE: department_students
-- ============================================================================

-- SELECT: Active verified/featured students public read. Unverified visible to self, CR, HOD, Super Admin.
CREATE POLICY department_students_select_policy ON department_students
  FOR SELECT
  USING (
    (is_active = true AND (is_verified_by_cr = true OR is_featured = true))
    OR profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_students.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_students.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT: Student enrolling themselves OR CR / HOD / Super Admin.
CREATE POLICY department_students_insert_policy ON department_students
  FOR INSERT
  WITH CHECK (
    profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_students.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
  );

-- UPDATE: Student themselves OR CR / HOD / Super Admin.
CREATE POLICY department_students_update_policy ON department_students
  FOR UPDATE
  USING (
    profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_students.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_students.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- DELETE: Student themselves, HOD, or Super Admin.
CREATE POLICY department_students_delete_policy ON department_students
  FOR DELETE
  USING (
    profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_students.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- ============================================================================
-- 5. TABLE: department_notices
-- ============================================================================

-- SELECT: Published notices public read. Drafts visible to author, active CR, HOD, Super Admin.
CREATE POLICY department_notices_select_policy ON department_notices
  FOR SELECT
  USING (
    is_published = true
    OR published_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_notices.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_notices.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT / UPDATE / DELETE: Active CR with notice permission, HOD, or Super Admin.
CREATE POLICY department_notices_insert_policy ON department_notices
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_notices.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
      AND (department_crs.permissions_grant->>'can_post_notices')::boolean = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_notices.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_notices_update_policy ON department_notices
  FOR UPDATE
  USING (
    published_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_notices.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
      AND (department_crs.permissions_grant->>'can_post_notices')::boolean = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_notices.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_notices_delete_policy ON department_notices
  FOR DELETE
  USING (
    published_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_notices.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_notices.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- ============================================================================
-- 6. TABLE: department_events
-- ============================================================================

-- SELECT: Published events public read. Drafts visible to coordinator, CR, HOD, Super Admin.
CREATE POLICY department_events_select_policy ON department_events
  FOR SELECT
  USING (
    is_published = true
    OR coordinator_profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_events.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_events.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT / UPDATE / DELETE: Coordinator, CR with event permission, HOD, Super Admin.
CREATE POLICY department_events_insert_policy ON department_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_events.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
      AND (department_crs.permissions_grant->>'can_manage_events')::boolean = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_events.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_events_update_policy ON department_events
  FOR UPDATE
  USING (
    coordinator_profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_events.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
      AND (department_crs.permissions_grant->>'can_manage_events')::boolean = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_events.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_events_delete_policy ON department_events
  FOR DELETE
  USING (
    coordinator_profile_id = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_events.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- ============================================================================
-- 7. TABLE: department_publications
-- ============================================================================

-- SELECT: Public publications public read. Drafts visible to uploader, CR, HOD, Super Admin.
CREATE POLICY department_publications_select_policy ON department_publications
  FOR SELECT
  USING (
    is_public = true
    OR uploaded_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_publications.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

-- INSERT / UPDATE / DELETE: Uploader, CR with publication grant, HOD, Super Admin.
CREATE POLICY department_publications_insert_policy ON department_publications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_crs
      WHERE department_crs.department_id = department_publications.department_id
      AND department_crs.profile_id = app.current_profile_id()
      AND department_crs.is_active = true
      AND (department_crs.permissions_grant->>'can_upload_publications')::boolean = true
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_publications.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_publications_update_policy ON department_publications
  FOR UPDATE
  USING (
    uploaded_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_publications.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );

CREATE POLICY department_publications_delete_policy ON department_publications
  FOR DELETE
  USING (
    uploaded_by = app.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = app.current_profile_id()
      AND profiles.profile_type = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM department_teachers
      WHERE department_teachers.department_id = department_publications.department_id
      AND department_teachers.profile_id = app.current_profile_id()
      AND department_teachers.is_hod = true
      AND department_teachers.is_active = true
    )
  );
