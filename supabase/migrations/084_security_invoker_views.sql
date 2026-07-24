-- =============================================================================
-- Ravenshaw Moments
-- Migration : 084_security_invoker_views.sql
-- Purpose   : Convert 6 views to SECURITY INVOKER mode
-- Phase     : 3 of 6 (Security Hardening)
-- =============================================================================
-- ROLLBACK GUIDANCE
-- Recreate each view WITHOUT the security_invoker option.
-- =============================================================================
-- EXCEPTION: vw_public_contributors is intentionally kept as SECURITY DEFINER.
-- It must bypass RLS on donations/payments to expose only safe aggregated fields.
-- See 035_contributor_recognition.sql for documented justification.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. v_department_galleries (from 023_department_system_enhancements.sql)
-- Underlying tables: gallery_albums, departments, media_files
-- All have public read RLS policies. Safe to use INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.v_department_galleries
WITH (security_invoker = true) AS
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
    mf.storage_bucket AS cover_storage_bucket,
    mf.storage_path AS cover_storage_path,
    ga.is_featured,
    ga.created_at,
    (SELECT count(*) FROM public.gallery_items gi WHERE gi.gallery_album_id = ga.id) AS item_count
FROM public.gallery_albums ga
JOIN public.departments d ON d.id = ga.entity_id AND ga.entity_type = 'department'
LEFT JOIN public.media_files mf ON mf.id = ga.cover_media_id
WHERE ga.is_public = true AND ga.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_galleries IS 'Unified showcase view of public gallery albums belonging to academic departments. Runs with SECURITY INVOKER.';

-- ============================================================================
-- 2. v_department_achievements (from 023_department_system_enhancements.sql)
-- Underlying tables: achievements, departments, achievement_categories, media_files
-- All have public read RLS policies. Safe to use INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.v_department_achievements
WITH (security_invoker = true) AS
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
    mf.storage_bucket AS featured_image_storage_bucket,
    mf.storage_path AS featured_image_storage_path,
    a.is_featured,
    a.created_at
FROM public.achievements a
JOIN public.departments d ON d.id = a.entity_id AND a.entity_type = 'department'
JOIN public.achievement_categories ac ON ac.id = a.category_id
LEFT JOIN public.media_files mf ON mf.id = a.featured_media_id
WHERE a.is_public = true AND a.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_achievements IS 'Unified showcase view of honors and awards earned by academic departments. Runs with SECURITY INVOKER.';

-- ============================================================================
-- 3. v_department_news (from 023_department_system_enhancements.sql)
-- Underlying tables: content_items, departments, media_files
-- All have public read RLS for published content. Safe to use INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.v_department_news
WITH (security_invoker = true) AS
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
    mf.storage_bucket AS featured_image_storage_bucket,
    mf.storage_path AS featured_image_storage_path,
    ci.published_at,
    ci.view_count,
    ci.is_featured
FROM public.content_items ci
JOIN public.departments d ON d.id = ci.entity_id AND ci.entity_type = 'department'
LEFT JOIN public.media_files mf ON mf.id = ci.featured_media_id
WHERE ci.content_type = 'news' AND ci.is_published = true AND ci.deleted_at IS NULL;

COMMENT ON VIEW public.v_department_news IS 'Unified showcase view of published news items related to academic departments. Runs with SECURITY INVOKER.';

-- ============================================================================
-- 4. v_department_statistics (from 023_department_system_enhancements.sql)
-- Underlying tables: departments and various subcount queries.
-- All have public read RLS. Safe to use INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.v_department_statistics
WITH (security_invoker = true) AS
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

COMMENT ON VIEW public.v_department_statistics IS 'Real-time aggregated statistics dashboard for every academic department. Runs with SECURITY INVOKER.';

-- ============================================================================
-- 5. v_department_public_directory (from 060_department_views_and_rpcs.sql)
-- Underlying tables: departments, media_files, mv_department_statistics
-- departments has public read RLS. Safe to use INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.v_department_public_directory
WITH (security_invoker = true) AS
SELECT 
    d.id,
    d.name,
    d.slug,
    d.short_name,
    d.established_year,
    d.vision,
    d.mission,
    d.academic_excellence,
    d.is_active,
    m_logo.storage_path AS logo_url,
    m_cover.storage_path AS cover_url,
    m_hero.storage_path AS hero_url,
    COALESCE(s.programs_count, 0) AS programs_count,
    COALESCE(s.faculty_count, 0) AS faculty_count,
    COALESCE(s.students_count, 0) AS students_count
FROM public.departments d
LEFT JOIN public.media_files m_logo ON m_logo.id = d.logo_media_id
LEFT JOIN public.media_files m_cover ON m_cover.id = d.cover_media_id
LEFT JOIN public.media_files m_hero ON m_hero.id = d.hero_media_id
LEFT JOIN public.mv_department_statistics s ON s.department_id = d.id
WHERE d.is_active = true;

COMMENT ON VIEW public.v_department_public_directory IS 'Clean abstraction over the departments table exposing joined statistics and resolved media URLs for fast grid rendering. Runs with SECURITY INVOKER.';

-- ============================================================================
-- 6. placement_statistics (from 072_placement_career.sql)
-- Public read — only shows aggregated stats (company_name, counts, avg package)
-- No PII is exposed. Safe for public access with INVOKER.
-- ============================================================================

CREATE OR REPLACE VIEW public.placement_statistics
WITH (security_invoker = true) AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    COUNT(DISTINCT pd.id) as total_drives,
    COUNT(DISTINCT pr.id) as total_applications,
    COUNT(DISTINCT po.id) as total_offers,
    MAX(po.ctc) as highest_package,
    AVG(po.ctc) as average_package
FROM public.companies c
LEFT JOIN public.placement_drives pd ON c.id = pd.company_id
LEFT JOIN public.placement_registrations pr ON pd.id = pr.drive_id
LEFT JOIN public.placement_offers po ON pr.id = po.registration_id AND po.status = 'accepted'
GROUP BY c.id, c.name;

COMMENT ON VIEW public.placement_statistics IS 'Aggregated placement statistics per company. Public read only — no PII exposed. Runs with SECURITY INVOKER.';

-- ============================================================================
-- EXCEPTION DOCUMENTATION
-- ============================================================================
-- vw_public_contributors: Intentionally KEPT as SECURITY DEFINER.
-- Reason: The underlying donations and payments tables have strict RLS that
-- blocks public access. This view must bypass RLS to expose only safe,
-- aggregated contributor recognition data (name, tier, month).
-- No private fields (email, phone, amounts, payment IDs) are exposed.
-- See 035_contributor_recognition.sql for the full security model documentation.
-- ============================================================================

COMMIT;
