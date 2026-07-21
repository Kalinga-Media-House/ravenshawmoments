-- ============================================================================
-- Ravenshaw Moments
-- Migration : 060_department_views_and_rpcs.sql
-- Purpose   : Department CMS Integration Layer (Views, Materialized Views, RPCs)
-- Target    : Supabase PostgreSQL 17
-- Status    : Production Ready
-- ============================================================================
-- ROLLBACK GUIDANCE (Non-Destructive)
-- To rollback this migration:
-- 1. DROP FUNCTION IF EXISTS public.department_refresh_statistics;
-- 2. DROP FUNCTION IF EXISTS public.department_search;
-- 3. DROP FUNCTION IF EXISTS public.department_get_public_page;
-- 4. DROP VIEW IF EXISTS public.v_department_public_directory;
-- 5. DROP MATERIALIZED VIEW IF EXISTS public.mv_department_statistics;
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. MATERIALIZED VIEWS (Analytics & Aggregation)
-- ============================================================================
-- Provides highly optimized, pre-calculated counters for the public directory 
-- and admin dashboards without hammering the transactional tables.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_department_statistics AS
SELECT 
    d.id AS department_id,
    d.slug,
    d.name,
    COUNT(DISTINCT dp.id) AS programs_count,
    COUNT(DISTINCT dt.id) AS faculty_count,
    COUNT(DISTINCT ds.id) AS students_count,
    COUNT(DISTINCT ga.id) AS gallery_albums_count,
    COUNT(DISTINCT a.id) AS achievements_count,
    COUNT(DISTINCT ci.id) AS content_sections_count
FROM public.departments d
LEFT JOIN public.department_programs dp ON dp.department_id = d.id AND dp.is_active = true 
LEFT JOIN public.department_teachers dt ON dt.department_id = d.id AND dt.is_active = true
LEFT JOIN public.department_students ds ON ds.department_id = d.id AND ds.is_active = true
LEFT JOIN public.gallery_albums ga ON ga.entity_id = d.id AND ga.entity_type = 'department' AND ga.is_public = true
LEFT JOIN public.achievements a ON a.entity_id = d.id AND a.entity_type = 'department' AND a.is_public = true
LEFT JOIN public.content_items ci ON ci.entity_id = d.id AND ci.entity_type = 'department' AND ci.is_published = true  
WHERE d.is_active = true 
GROUP BY d.id, d.slug, d.name;

-- Concurrent refresh requires a unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_department_statistics_id ON public.mv_department_statistics(department_id);

-- ============================================================================
-- 2. PUBLIC VIEWS (Read Models)
-- ============================================================================
-- Clean abstraction over the departments table exposing joined statistics and 
-- resolved media URLs for fast grid rendering.
CREATE OR REPLACE VIEW public.v_department_public_directory AS
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
WHERE d.is_active = true ;

-- ============================================================================
-- 3. RPC FUNCTIONS (Frontend Integration)
-- ============================================================================

-- A. Fetch complete public department page payload in a single query
CREATE OR REPLACE FUNCTION public.department_get_public_page(p_slug varchar)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
    SELECT jsonb_build_object(
        'department', (
            SELECT row_to_json(d.*) 
            FROM public.v_department_public_directory d 
            WHERE d.slug = p_slug
        ),
        'settings', (
            SELECT row_to_json(ds.*)
            FROM public.department_settings ds
            JOIN public.departments d ON d.id = ds.department_id
            WHERE d.slug = p_slug
        ),
        'seo', (
            SELECT row_to_json(seo.*)
            FROM public.department_seo seo
            JOIN public.departments d ON d.id = seo.department_id
            WHERE d.slug = p_slug
        ),
        'contacts', (
            SELECT COALESCE(jsonb_agg(row_to_json(c.*)), '[]'::jsonb)
            FROM public.department_contacts c
            JOIN public.departments d ON d.id = c.department_id
            WHERE d.slug = p_slug
        ),
        'sections', (
            SELECT COALESCE(jsonb_agg(row_to_json(ci.*) ORDER BY ci.created_at ASC), '[]'::jsonb)
            FROM public.content_items ci
            JOIN public.departments d ON d.id = ci.entity_id
            WHERE d.slug = p_slug 
              AND ci.entity_type = 'department' 
              
              AND ci.is_published = true
              
        )
    );
$$;

-- B. Unified Department Search (Minimal viable search)
CREATE OR REPLACE FUNCTION public.department_search(p_query varchar)
RETURNS TABLE (
    id uuid,
    name varchar,
    slug varchar,
    match_type varchar,
    snippet text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
    SELECT 
        d.id, 
        d.name, 
        d.slug, 
        'Department'::varchar AS match_type, 
        d.name::text AS snippet
    FROM public.departments d
    WHERE d.is_active = true 
       
      AND d.name ILIKE '%' || p_query || '%'
    UNION ALL
    SELECT 
        d.id, 
        d.name, 
        d.slug, 
        'Program'::varchar AS match_type, 
        dp.program_name::text AS snippet
    FROM public.department_programs dp
    JOIN public.departments d ON d.id = dp.department_id
    WHERE dp.is_active = true 
       
      AND dp.program_name ILIKE '%' || p_query || '%'
    LIMIT 20;
$$;

-- C. Statistics Refresh Trigger Function
CREATE OR REPLACE FUNCTION public.department_refresh_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
BEGIN
    -- Refreshing concurrently allows reads to continue during the update
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_department_statistics;
END;
$$;

-- ============================================================================
-- 4. GRANT EXECUTE CAPABILITIES
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.department_get_public_page(varchar) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.department_search(varchar) TO authenticated, anon;
-- Refresh should only be triggerable by authenticated users/admins/cron
GRANT EXECUTE ON FUNCTION public.department_refresh_statistics() TO authenticated;

COMMIT;

-- ============================================================================
-- 5. VALIDATION QUERIES
-- ============================================================================
/*
-- Verify Materialized View Data
SELECT * FROM public.mv_department_statistics LIMIT 5;

-- Verify Public Directory View
SELECT * FROM public.v_department_public_directory LIMIT 5;

-- Verify RPC Accessibility
SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('department_get_public_page', 'department_search', 'department_refresh_statistics');

-- Test the GET Page RPC (Replace with actual slug)
-- SELECT jsonb_pretty(public.department_get_public_page('computer-science'));
*/
