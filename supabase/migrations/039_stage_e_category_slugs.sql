-- =============================================================================
-- Ravenshaw Moments
-- Migration : 039_stage_e_category_slugs.sql
-- Purpose   : Additive URL-friendly slugs & deterministic display ordering
--             for Competition Categories (Stage E-A)
-- =============================================================================

BEGIN;

-- 1. Additive columns (Idempotent schema extension)
ALTER TABLE public.competition_categories
ADD COLUMN IF NOT EXISTS slug varchar(150),
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 100;

-- 2. Deterministic Display Order Backfill
-- Enforces explicit ordering for the 12 authoritative frontend categories
-- and distinct alphabetical ordering for the remaining 43 categories.
UPDATE public.competition_categories
SET display_order = CASE name
    WHEN 'Graphic Design' THEN 10
    WHEN 'Video Editing' THEN 20
    WHEN 'Photography' THEN 30
    WHEN 'Videography' THEN 40
    WHEN 'Short Story — Odia' THEN 50
    WHEN 'Poetry — Odia' THEN 60
    WHEN 'Essay Writing' THEN 70
    WHEN 'Debate' THEN 80
    WHEN 'Quiz' THEN 90
    WHEN 'Painting' THEN 100
    WHEN 'Music' THEN 110
    WHEN 'Dance' THEN 120
    ELSE display_order
END
WHERE name IN (
    'Graphic Design', 'Video Editing', 'Photography', 'Videography',
    'Short Story — Odia', 'Poetry — Odia', 'Essay Writing', 'Debate',
    'Quiz', 'Painting', 'Music', 'Dance'
);

WITH ordered_remaining AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
    FROM public.competition_categories
    WHERE name NOT IN (
        'Graphic Design', 'Video Editing', 'Photography', 'Videography',
        'Short Story — Odia', 'Poetry — Odia', 'Essay Writing', 'Debate',
        'Quiz', 'Painting', 'Music', 'Dance'
    )
)
UPDATE public.competition_categories c
SET display_order = 200 + (o.rn * 10)
FROM ordered_remaining o
WHERE c.id = o.id;

-- 3. Deterministic Safe Backfill for Slugs
-- Trims leading/trailing hyphens and preserves existing non-null slugs.
UPDATE public.competition_categories
SET slug = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')))
WHERE slug IS NULL;

-- 4. Execution-Time Slug Validation (Fail-Fast & Rollback)
DO $$
DECLARE
    v_null_count integer;
    v_empty_count integer;
    v_long_count integer;
    v_duplicate_count integer;
    v_invalid_format_count integer;
BEGIN
    -- Check for NULL slugs
    SELECT COUNT(*) INTO v_null_count
    FROM public.competition_categories
    WHERE slug IS NULL;

    IF v_null_count > 0 THEN
        RAISE EXCEPTION 'Slug validation failed: % rows have a NULL slug.', v_null_count;
    END IF;

    -- Check for empty slugs
    SELECT COUNT(*) INTO v_empty_count
    FROM public.competition_categories
    WHERE TRIM(slug) = '';

    IF v_empty_count > 0 THEN
        RAISE EXCEPTION 'Slug validation failed: % rows have an empty slug.', v_empty_count;
    END IF;

    -- Check for length violations (> 150 characters)
    SELECT COUNT(*) INTO v_long_count
    FROM public.competition_categories
    WHERE LENGTH(slug) > 150;

    IF v_long_count > 0 THEN
        RAISE EXCEPTION 'Slug validation failed: % rows exceed maximum slug length of 150.', v_long_count;
    END IF;

    -- Check for canonical slug format ^[a-z0-9]+(?:-[a-z0-9]+)*$
    SELECT COUNT(*) INTO v_invalid_format_count
    FROM public.competition_categories
    WHERE slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$';

    IF v_invalid_format_count > 0 THEN
        RAISE EXCEPTION 'Slug validation failed: % rows contain a non-canonical slug format.', v_invalid_format_count;
    END IF;

    -- Check for duplicate normalized slugs across all rows
    SELECT COUNT(*) INTO v_duplicate_count
    FROM (
        SELECT slug
        FROM public.competition_categories
        GROUP BY slug
        HAVING COUNT(*) > 1
    ) dups;

    IF v_duplicate_count > 0 THEN
        RAISE EXCEPTION 'Slug validation failed: % duplicate slugs detected.', v_duplicate_count;
    END IF;
END $$;

-- 5. Enforce NOT NULL after successful execution-time validation
ALTER TABLE public.competition_categories
ALTER COLUMN slug SET NOT NULL;

-- 6. Single Authoritative Unique Index
-- Provides unique B-tree index lookup without redundant index storage.
CREATE UNIQUE INDEX IF NOT EXISTS uq_competition_categories_slug
ON public.competition_categories(slug);

COMMIT;
