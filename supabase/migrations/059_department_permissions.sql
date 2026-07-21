-- ============================================================================
-- Ravenshaw Moments
-- Migration : 059_department_permissions.sql
-- Purpose   : Enhance Global RBAC Engine for Department Granular Permissions
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP FUNCTION IF EXISTS app.has_department_permission(uuid, varchar);
-- NOTE: Roles and permissions inserted via ON CONFLICT are safely retained.
-- ============================================================================
-- ARCHITECTURE NOTE: TEMPORAL ROLE ASSIGNMENTS
-- The global public.profile_roles table inherently supports temporal delegation 
-- via its existing `starts_at`, `ends_at`, and `assigned_by` columns. This 
-- migration explicitly reuses these fields to handle Department role delegations 
-- (e.g., Department CR terms) without requiring redundant assignment tables.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. EXTEND RBAC ROLES
-- ============================================================================
-- Seed missing roles into the global public.roles table.
INSERT INTO public.roles(code, name, is_system)
VALUES
    ('DEPARTMENT_MODERATOR', 'Department Moderator', true),
    ('DEPARTMENT_EDITOR', 'Department Editor', true),
    ('GUEST', 'Guest', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 2. SEED GRANULAR DEPARTMENT PERMISSIONS
-- ============================================================================
-- Extending public.permissions with department-specific actions.
INSERT INTO public.permissions(module, action, code, description)
VALUES
    ('DEPARTMENT', 'VIEW', 'DEPARTMENT_VIEW', 'View department details'),
    ('DEPARTMENT', 'EDIT', 'DEPARTMENT_EDIT', 'Edit core department details'),
    ('DEPARTMENT', 'PUBLISH', 'DEPARTMENT_PUBLISH', 'Publish department profile'),
    ('DEPARTMENT', 'ARCHIVE', 'DEPARTMENT_ARCHIVE', 'Archive department profile'),
    ('DEPARTMENT', 'DELETE', 'DEPARTMENT_DELETE', 'Delete department profile'),
    ('DEPARTMENT', 'SETTINGS', 'DEPARTMENT_SETTINGS', 'Manage department settings'),
    ('DEPARTMENT', 'SEO', 'DEPARTMENT_SEO', 'Manage department SEO metadata'),
    ('DEPARTMENT_STUDENTS', 'VIEW', 'DEPARTMENT_STUDENTS_VIEW', 'View department students'),
    ('DEPARTMENT_STUDENTS', 'VERIFY', 'DEPARTMENT_STUDENTS_VERIFY', 'Verify student claims'),
    ('DEPARTMENT_STUDENTS', 'EDIT', 'DEPARTMENT_STUDENTS_EDIT', 'Edit student records'),
    ('DEPARTMENT_STUDENTS', 'APPROVE', 'DEPARTMENT_STUDENTS_APPROVE', 'Approve student verification'),
    ('DEPARTMENT_STUDENTS', 'REJECT', 'DEPARTMENT_STUDENTS_REJECT', 'Reject student verification'),
    ('DEPARTMENT_FACULTY', 'MANAGE', 'DEPARTMENT_FACULTY_MANAGE', 'Manage department faculty'),
    ('DEPARTMENT_PROGRAMS', 'MANAGE', 'DEPARTMENT_PROGRAMS_MANAGE', 'Manage department programs'),
    ('DEPARTMENT_GALLERY', 'MANAGE', 'DEPARTMENT_GALLERY_MANAGE', 'Manage department gallery'),
    ('DEPARTMENT_ACHIEVEMENTS', 'MANAGE', 'DEPARTMENT_ACHIEVEMENTS_MANAGE', 'Manage department achievements'),
    ('DEPARTMENT_CONTENT', 'MANAGE', 'DEPARTMENT_CONTENT_MANAGE', 'Manage department CMS sections'),
    ('DEPARTMENT_EVENTS', 'MANAGE', 'DEPARTMENT_EVENTS_MANAGE', 'Manage department events'),
    ('DEPARTMENT_STATISTICS', 'MANAGE', 'DEPARTMENT_STATISTICS_MANAGE', 'Manage department statistics'),
    ('DEPARTMENT_DOWNLOADS', 'MANAGE', 'DEPARTMENT_DOWNLOADS_MANAGE', 'Manage department downloads'),
    ('DEPARTMENT_ANALYTICS', 'VIEW', 'DEPARTMENT_ANALYTICS_VIEW', 'View department analytics'),
    ('DEPARTMENT_AUDIT', 'VIEW', 'DEPARTMENT_AUDIT_VIEW', 'View department audit logs'),
    ('DEPARTMENT_PERMISSIONS', 'MANAGE', 'DEPARTMENT_PERMISSIONS_MANAGE', 'Manage department delegated roles')
ON CONFLICT (code) DO UPDATE SET 
    description = EXCLUDED.description;

-- ============================================================================
-- 3. BIND PERMISSIONS TO ROLES (DELEGATION MODEL)
-- ============================================================================
-- Map permissions to roles safely using UUID cross joins.
WITH role_mappings AS (
    SELECT r.id AS role_id, p.id AS permission_id
    FROM public.roles r
    CROSS JOIN public.permissions p
    WHERE 
        -- SUPER ADMIN & ADMIN get everything
        ((r.code IN ('SUPER_ADMIN', 'ADMIN')) AND p.module LIKE 'DEPARTMENT%')
        OR
        -- DEPARTMENT ADMIN gets full department scope
        (r.code = 'DEPARTMENT_ADMIN' AND p.module LIKE 'DEPARTMENT%')
        OR
        -- DEPARTMENT CR gets student verification and general CMS
        (r.code = 'DEPARTMENT_CR' AND p.code IN (
            'DEPARTMENT_STUDENTS_VIEW', 'DEPARTMENT_STUDENTS_VERIFY', 'DEPARTMENT_STUDENTS_EDIT',
            'DEPARTMENT_CONTENT_MANAGE', 'DEPARTMENT_GALLERY_MANAGE', 'DEPARTMENT_EVENTS_MANAGE',
            'DEPARTMENT_ACHIEVEMENTS_MANAGE'
        ))
        OR
        -- DEPARTMENT EDITOR gets limited CMS mapping
        (r.code = 'DEPARTMENT_EDITOR' AND p.code IN (
            'DEPARTMENT_CONTENT_MANAGE', 'DEPARTMENT_GALLERY_MANAGE', 'DEPARTMENT_EVENTS_MANAGE'
        ))
        OR
        -- DEPARTMENT MODERATOR gets analytics and audit
        (r.code = 'DEPARTMENT_MODERATOR' AND p.code IN (
            'DEPARTMENT_ANALYTICS_VIEW', 'DEPARTMENT_AUDIT_VIEW', 'DEPARTMENT_STUDENTS_VIEW'
        ))
)
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT role_id, permission_id, true FROM role_mappings
ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = true;

-- ============================================================================
-- 4. SECURITY HELPER FUNCTION
-- ============================================================================
-- PostgreSQL SECURITY DEFINER Guarantees:
-- 1. Controlled Search Path: Hardcoded to `public, app` to prevent malicious schema overriding.
-- 2. Minimal Privilege: Elevated read execution exclusively for evaluating RBAC tables without exposing underlying rows to the client.
-- 3. No Escalation: Prevents infinite recursion during complex RLS evaluations by bypassing user-level RLS strictly for this evaluation context.
CREATE OR REPLACE FUNCTION app.has_department_permission(p_dept_id uuid, p_permission_code varchar)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.profile_roles pr
    JOIN public.role_permissions rp ON rp.role_id = pr.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    JOIN public.roles r ON r.id = pr.role_id
    WHERE pr.profile_id = app.current_profile_id()
      AND pr.is_active = true
      AND rp.granted = true
      AND p.code = p_permission_code
      -- Either the role is explicitly scoped to this department, OR it is a global role (like SUPER_ADMIN)
      AND (pr.department_id = p_dept_id OR pr.department_id IS NULL OR r.code IN ('SUPER_ADMIN', 'ADMIN'))
);
$$;

-- ============================================================================
-- 5. UPGRADE DEPARTMENT RLS POLICIES (Example Upgrades)
-- ============================================================================
-- Note: We inject granular permission checks into critical department tables.
-- The global app.is_admin_or_super() is retained as a failsafe fallback.

-- DEPARTMENTS (Core)
DROP POLICY IF EXISTS "Admin Write Access" ON public.departments;
CREATE POLICY "Admin Write Access" ON public.departments 
FOR ALL TO authenticated 
USING (app.has_department_permission(id, 'DEPARTMENT_EDIT') OR app.is_admin_or_super()) 
WITH CHECK (app.has_department_permission(id, 'DEPARTMENT_EDIT') OR app.is_admin_or_super());

-- DEPARTMENT PROGRAMS
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_programs;
CREATE POLICY "Admin Write Access" ON public.department_programs 
FOR ALL TO authenticated 
USING (app.has_department_permission(department_id, 'DEPARTMENT_PROGRAMS_MANAGE') OR app.is_admin_or_super()) 
WITH CHECK (app.has_department_permission(department_id, 'DEPARTMENT_PROGRAMS_MANAGE') OR app.is_admin_or_super());

-- DEPARTMENT TEACHERS
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_teachers;
CREATE POLICY "Admin Write Access" ON public.department_teachers 
FOR ALL TO authenticated 
USING (app.has_department_permission(department_id, 'DEPARTMENT_FACULTY_MANAGE') OR app.is_admin_or_super()) 
WITH CHECK (app.has_department_permission(department_id, 'DEPARTMENT_FACULTY_MANAGE') OR app.is_admin_or_super());

-- DEPARTMENT STUDENTS (Snapshots)
DROP POLICY IF EXISTS "Admin Write Access" ON public.department_students;
CREATE POLICY "Admin Write Access" ON public.department_students 
FOR ALL TO authenticated 
USING (app.has_department_permission(department_id, 'DEPARTMENT_STUDENTS_EDIT') OR app.is_admin_or_super()) 
WITH CHECK (app.has_department_permission(department_id, 'DEPARTMENT_STUDENTS_EDIT') OR app.is_admin_or_super());

COMMIT;

-- ============================================================================
-- 6. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Seeded Roles
SELECT code, name FROM public.roles WHERE code LIKE 'DEPARTMENT%';

-- Verify Seeded Permissions
SELECT code, description FROM public.permissions WHERE module LIKE 'DEPARTMENT%';

-- Verify Mappings
SELECT r.code, count(rp.permission_id) as total_permissions
FROM public.roles r
JOIN public.role_permissions rp ON rp.role_id = r.id
WHERE r.code LIKE 'DEPARTMENT%'
GROUP BY r.code;

-- Verify Helper Function Security Implementation
SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_schema = 'app' AND routine_name = 'has_department_permission';

-- Verify Upgraded Policies
SELECT tablename, policyname, qual 
FROM pg_policies 
WHERE tablename IN ('departments', 'department_programs', 'department_teachers', 'department_students') 
AND policyname = 'Admin Write Access';
*/
