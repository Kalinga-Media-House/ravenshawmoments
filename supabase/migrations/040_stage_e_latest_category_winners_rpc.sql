BEGIN;

-- =============================================================================
-- Migration: 040_stage_e_latest_category_winners_rpc.sql
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_latest_category_winners(p_category_id uuid)
RETURNS TABLE (
    edition_year integer,
    edition_month integer,
    edition_date timestamptz,
    competition_id uuid,
    competition_slug varchar,
    competition_title varchar,
    competition_level competition_level,
    result_id uuid,
    result_outcome competition_participant_outcome,
    profile_id uuid,
    profile_slug varchar,
    full_name varchar,
    public_affiliation varchar,
    is_external boolean
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
WITH eligible_results AS (
    -- 1. Resolve eligible published podium results strictly for the active category
    SELECT 
        cr.id AS result_id,
        cr.competition_id,
        cr.outcome,
        cr.profile_id,
        c.slug AS competition_slug,
        c.title AS competition_title,
        c.competition_level,
        COALESCE(c.result_date, cr.published_at) AS authoritative_timestamp
    FROM public.competition_results cr
    JOIN public.competitions c ON cr.competition_id = c.id
    JOIN public.competition_categories cc ON c.category_id = cc.id
    WHERE cc.id = p_category_id
      AND cc.is_active = true
      AND cr.result_status = 'published'
      AND c.competition_level IN ('department', 'university', 'state')
      AND cr.outcome IN ('first', 'second', 'third')
      AND COALESCE(c.result_date, cr.published_at) IS NOT NULL
),
latest_edition AS (
    -- 2. Identify the single latest Chronological Year/Month Edition
    SELECT 
        EXTRACT(YEAR FROM authoritative_timestamp AT TIME ZONE 'UTC')::integer AS edition_year,
        EXTRACT(MONTH FROM authoritative_timestamp AT TIME ZONE 'UTC')::integer AS edition_month
    FROM eligible_results
    ORDER BY authoritative_timestamp DESC
    LIMIT 1
)
-- 3. Return strictly bounded podiums for that precise edition
SELECT 
    le.edition_year,
    le.edition_month,
    er.authoritative_timestamp AS edition_date,
    er.competition_id,
    er.competition_slug,
    er.competition_title,
    er.competition_level,
    er.result_id,
    er.outcome AS result_outcome,
    p.id AS profile_id,
    p.slug AS profile_slug,
    COALESCE(p.full_name, 'Unknown Participant') AS full_name,
    CASE 
        WHEN epp.profile_id IS NOT NULL 
            THEN COALESCE(NULLIF(TRIM(epp.college_name), ''), 'External Institution')
        ELSE 
            COALESCE(NULLIF(TRIM(p.department_name), ''), 'Ravenshaw University')
    END AS public_affiliation,
    (epp.profile_id IS NOT NULL) AS is_external
FROM latest_edition le
JOIN eligible_results er 
    ON EXTRACT(YEAR FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer = le.edition_year
    AND EXTRACT(MONTH FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer = le.edition_month
LEFT JOIN public.profiles p ON er.profile_id = p.id
LEFT JOIN public.external_participant_profiles epp ON p.id = epp.profile_id
ORDER BY 
    CASE er.competition_level
        WHEN 'department' THEN 1
        WHEN 'university' THEN 2
        WHEN 'state' THEN 3
        ELSE 4
    END ASC,
    er.competition_title ASC,
    er.competition_id ASC,
    CASE er.outcome
        WHEN 'first' THEN 1
        WHEN 'second' THEN 2
        WHEN 'third' THEN 3
        ELSE 4
    END ASC,
    er.result_id ASC
LIMIT 500;
$$;

-- -----------------------------------------------------------------------------
-- Archive RPC
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_category_winners_archive(
    p_category_id uuid,
    p_year integer,
    p_month integer,
    p_level competition_level DEFAULT NULL,
    p_limit integer DEFAULT 100,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    edition_year integer,
    edition_month integer,
    edition_date timestamptz,
    competition_id uuid,
    competition_slug varchar,
    competition_title varchar,
    competition_level competition_level,
    result_id uuid,
    result_outcome competition_participant_outcome,
    profile_id uuid,
    profile_slug varchar,
    full_name varchar,
    public_affiliation varchar,
    is_external boolean
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
WITH eligible_results AS (
    SELECT 
        cr.id AS result_id,
        cr.competition_id,
        cr.outcome,
        cr.profile_id,
        c.slug AS competition_slug,
        c.title AS competition_title,
        c.competition_level,
        COALESCE(c.result_date, cr.published_at) AS authoritative_timestamp
    FROM public.competition_results cr
    JOIN public.competitions c ON cr.competition_id = c.id
    JOIN public.competition_categories cc ON c.category_id = cc.id
    WHERE cc.id = p_category_id
      AND cc.is_active = true
      AND cr.result_status = 'published'
      AND c.competition_level IN ('department', 'university', 'state')
      AND cr.outcome IN ('first', 'second', 'third')
      AND COALESCE(c.result_date, cr.published_at) IS NOT NULL
      AND (
          p_level IS NULL 
          OR (
              p_level IN ('department', 'university', 'state') 
              AND c.competition_level = p_level
          )
      )
)
SELECT 
    EXTRACT(YEAR FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer AS edition_year,
    EXTRACT(MONTH FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer AS edition_month,
    er.authoritative_timestamp AS edition_date,
    er.competition_id,
    er.competition_slug,
    er.competition_title,
    er.competition_level,
    er.result_id,
    er.outcome AS result_outcome,
    p.id AS profile_id,
    p.slug AS profile_slug,
    COALESCE(p.full_name, 'Unknown Participant') AS full_name,
    CASE 
        WHEN epp.profile_id IS NOT NULL 
            THEN COALESCE(NULLIF(TRIM(epp.college_name), ''), 'External Institution')
        ELSE 
            COALESCE(NULLIF(TRIM(p.department_name), ''), 'Ravenshaw University')
    END AS public_affiliation,
    (epp.profile_id IS NOT NULL) AS is_external
FROM eligible_results er
LEFT JOIN public.profiles p ON er.profile_id = p.id
LEFT JOIN public.external_participant_profiles epp ON p.id = epp.profile_id
WHERE EXTRACT(YEAR FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer = p_year
  AND EXTRACT(MONTH FROM er.authoritative_timestamp AT TIME ZONE 'UTC')::integer = p_month
  AND p_year >= 2000 AND p_year <= (EXTRACT(YEAR FROM CURRENT_DATE AT TIME ZONE 'UTC')::integer + 1)
  AND p_month >= 1 AND p_month <= 12
ORDER BY 
    CASE er.competition_level
        WHEN 'department' THEN 1
        WHEN 'university' THEN 2
        WHEN 'state' THEN 3
        ELSE 4
    END ASC,
    er.competition_title ASC,
    er.competition_id ASC,
    CASE er.outcome
        WHEN 'first' THEN 1
        WHEN 'second' THEN 2
        WHEN 'third' THEN 3
        ELSE 4
    END ASC,
    er.result_id ASC
LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 500)
OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

REVOKE EXECUTE ON FUNCTION public.get_latest_category_winners(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_latest_category_winners(uuid) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_category_winners_archive(uuid, integer, integer, competition_level, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_category_winners_archive(uuid, integer, integer, competition_level, integer, integer) TO anon, authenticated;

COMMIT;
