-- =============================================================================
-- Ravenshaw Moments
-- Migration : 038_competition_judging_and_leaderboard.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Production-Ready Universal Competition Judging, Result Publication,
-- Idempotent Point Ledger, All-Time Leaderboard, and Winners Gallery Engine.
--
-- COMPATIBILITY & SAFETY
-- - Safe additive migration; never drops existing tables or data.
-- - Supports both Individual and Team competitions.
-- - Strict server-side RBAC and RLS; no client-supplied admin ID trusted.
-- - Idempotent point awarding and achievement generation.
-- - Functions exposed in public schema for PostgREST RPC access.
-- =============================================================================

BEGIN;

-- ============================================================================
-- 1. ENUM & CONSTRAINED TYPES
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE competition_position AS ENUM (
        'first',
        'second',
        'third',
        'participant'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competition_result_status AS ENUM (
        'draft',
        'evaluated',
        'finalized',
        'published'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competition_participant_outcome AS ENUM (
        'eligible',
        'participated',
        'first',
        'second',
        'third',
        'disqualified',
        'withdrawn',
        'absent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. EXTEND COMPETITIONS TABLE WITH RESULT VISIBILITY
-- ============================================================================
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS result_visibility varchar(30) NOT NULL DEFAULT 'hidden'
CHECK (result_visibility IN ('hidden', 'participant_only', 'published'));

-- ============================================================================
-- 3. EXTEND COMPETITION REGISTRATIONS WITH PARTICIPATION VERIFICATION
-- ============================================================================
ALTER TABLE public.competition_registrations
ADD COLUMN IF NOT EXISTS is_verified_participant boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS participated_at timestamptz;

-- ============================================================================
-- 4. EXTEND COMPETITION RESULTS TABLE
-- ============================================================================
ALTER TABLE public.competition_results
ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS marks_obtained numeric(8,2),
ADD COLUMN IF NOT EXISTS maximum_marks numeric(8,2) NOT NULL DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS normalized_score numeric(8,2),
ADD COLUMN IF NOT EXISTS position competition_position NOT NULL DEFAULT 'participant',
ADD COLUMN IF NOT EXISTS outcome competition_participant_outcome NOT NULL DEFAULT 'eligible',
ADD COLUMN IF NOT EXISTS result_status competition_result_status NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS leaderboard_points integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS requires_tie_break boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS tie_break_score numeric(8,2),
ADD COLUMN IF NOT EXISTS tie_break_notes text,
ADD COLUMN IF NOT EXISTS tie_resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tie_resolved_at timestamptz,
ADD COLUMN IF NOT EXISTS evaluated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS evaluated_at timestamptz,
ADD COLUMN IF NOT EXISTS finalized_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS finalized_at timestamptz,
ADD COLUMN IF NOT EXISTS published_at timestamptz,
ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT app.utc_now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT app.utc_now();

DO $$ BEGIN
    ALTER TABLE public.competition_results
    ADD CONSTRAINT chk_comp_results_marks
    CHECK (marks_obtained IS NULL OR (marks_obtained >= 0 AND maximum_marks > 0 AND marks_obtained <= maximum_marks));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_comp_results_status ON public.competition_results(result_status);
CREATE INDEX IF NOT EXISTS idx_comp_results_outcome ON public.competition_results(outcome);
CREATE INDEX IF NOT EXISTS idx_comp_results_position ON public.competition_results(position);
CREATE INDEX IF NOT EXISTS idx_comp_results_profile ON public.competition_results(profile_id);

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_competition_results_updated_at'
    ) THEN
        CREATE TRIGGER trg_competition_results_updated_at
        BEFORE UPDATE ON public.competition_results
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- ============================================================================
-- 5. LEADERBOARD POINT RULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competition_point_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    position competition_position NOT NULL UNIQUE,
    points integer NOT NULL CHECK (points >= 0),
    is_active boolean NOT NULL DEFAULT true,
    effective_from timestamptz NOT NULL DEFAULT app.utc_now(),
    effective_until timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_competition_point_rules_updated_at'
    ) THEN
        CREATE TRIGGER trg_competition_point_rules_updated_at
        BEFORE UPDATE ON public.competition_point_rules
        FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
    END IF;
END $$;

-- Seed initial point rules idempotently
INSERT INTO public.competition_point_rules (position, points)
VALUES
    ('first', 100),
    ('second', 75),
    ('third', 50),
    ('participant', 10)
ON CONFLICT (position) DO UPDATE
SET points = EXCLUDED.points;

-- ============================================================================
-- 6. COMPETITION POINT TRANSACTIONS LEDGER
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competition_point_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    result_id uuid REFERENCES public.competition_results(id) ON DELETE SET NULL,
    transaction_type varchar(50) NOT NULL CHECK (transaction_type IN ('award', 'reversal', 'manual_adjustment')),
    transaction_version integer NOT NULL DEFAULT 1,
    points integer NOT NULL,
    reason text,
    awarded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT uq_point_tx_profile_result_version UNIQUE (profile_id, result_id, transaction_type, transaction_version)
);

CREATE INDEX IF NOT EXISTS idx_point_tx_profile ON public.competition_point_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_point_tx_competition ON public.competition_point_transactions(competition_id);
CREATE INDEX IF NOT EXISTS idx_point_tx_result ON public.competition_point_transactions(result_id);

-- ============================================================================
-- 7. AUDIT TRAIL FOR RESULT CORRECTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competition_result_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id uuid NOT NULL REFERENCES public.competition_results(id) ON DELETE CASCADE,
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    registration_id uuid NOT NULL REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    previous_marks numeric(8,2),
    corrected_marks numeric(8,2),
    previous_rank integer,
    corrected_rank integer,
    previous_outcome varchar(50),
    corrected_outcome varchar(50),
    correction_reason text,
    corrected_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    corrected_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX IF NOT EXISTS idx_comp_result_audit_result ON public.competition_result_audit_logs(result_id);

-- ============================================================================
-- 8. AUTHORIZATION HELPER FUNCTION (PUBLIC & APP SCHEMAS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_competition_admin(p_competition_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT
    app.is_admin_or_super()
    OR EXISTS (
        SELECT 1 FROM public.profile_roles pr
        JOIN public.roles r ON r.id = pr.role_id
        WHERE pr.profile_id = app.current_profile_id()
          AND pr.is_active = true
          AND r.code = 'COMPETITION_ADMIN'
    )
    OR (
        p_competition_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.competitions c
            WHERE c.id = p_competition_id
              AND c.created_by = app.current_profile_id()
        )
    );
$$;

REVOKE ALL ON FUNCTION public.is_competition_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_competition_admin(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION app.is_competition_admin(p_competition_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT public.is_competition_admin(p_competition_id);
$$;

REVOKE ALL ON FUNCTION app.is_competition_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.is_competition_admin(uuid) TO authenticated;

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.competition_point_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_result_audit_logs ENABLE ROW LEVEL SECURITY;

-- point rules: public read, admin write
DO $$ BEGIN
    CREATE POLICY "Public read competition_point_rules"
        ON public.competition_point_rules FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin write competition_point_rules"
        ON public.competition_point_rules FOR ALL
        TO authenticated
        USING (app.is_admin_or_super())
        WITH CHECK (app.is_admin_or_super());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- point transactions: public read, admin insert/update
DO $$ BEGIN
    CREATE POLICY "Public read competition_point_transactions"
        ON public.competition_point_transactions FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin write competition_point_transactions"
        ON public.competition_point_transactions FOR ALL
        TO authenticated
        USING (public.is_competition_admin(competition_id))
        WITH CHECK (public.is_competition_admin(competition_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- audit logs: admin only
DO $$ BEGIN
    CREATE POLICY "Admin read competition_result_audit_logs"
        ON public.competition_result_audit_logs FOR SELECT
        TO authenticated
        USING (public.is_competition_admin(competition_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 10. SECURE RPC: CALCULATE COMPETITION RANKINGS (DETERMINISTIC & TIE-BREAKING)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calculate_competition_rankings(
    p_competition_id uuid
)
RETURNS TABLE (
    result_id uuid,
    registration_id uuid,
    marks_obtained numeric,
    normalized_score numeric,
    rank integer,
    outcome competition_participant_outcome,
    requires_tie_break boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
    v_admin_profile_id uuid;
BEGIN
    v_admin_profile_id := app.current_profile_id();
    IF v_admin_profile_id IS NULL OR NOT public.is_competition_admin(p_competition_id) THEN
        RAISE EXCEPTION 'Unauthorized: Only authorized competition administrators can calculate rankings.';
    END IF;

    -- Update normalized score
    UPDATE public.competition_results cr
    SET normalized_score = cr.marks_obtained * (100.00 / NULLIF(cr.maximum_marks, 0)),
        evaluated_by = v_admin_profile_id,
        evaluated_at = app.utc_now(),
        result_status = CASE WHEN cr.result_status = 'draft' THEN 'evaluated'::competition_result_status ELSE cr.result_status END
    WHERE cr.competition_id = p_competition_id
      AND cr.marks_obtained IS NOT NULL
      AND cr.outcome IN ('eligible', 'participated', 'first', 'second', 'third');

    -- Compute deterministic rankings and detect top-three ties
    WITH RankedResults AS (
        SELECT cr.id,
               cr.registration_id,
               cr.marks_obtained,
               cr.normalized_score,
               cr.tie_break_score,
               DENSE_RANK() OVER (
                   ORDER BY cr.normalized_score DESC,
                            COALESCE(cr.tie_break_score, -1) DESC
               ) AS computed_rank,
               COUNT(*) OVER (
                   PARTITION BY cr.normalized_score, COALESCE(cr.tie_break_score, -1)
               ) AS tie_count
        FROM public.competition_results cr
        WHERE cr.competition_id = p_competition_id
          AND cr.marks_obtained IS NOT NULL
          AND cr.outcome NOT IN ('disqualified', 'withdrawn', 'absent')
    )
    UPDATE public.competition_results cr
    SET rank = CASE WHEN rr.computed_rank <= 3 THEN rr.computed_rank ELSE NULL END,
        outcome = CASE
            WHEN rr.computed_rank = 1 THEN 'first'::competition_participant_outcome
            WHEN rr.computed_rank = 2 THEN 'second'::competition_participant_outcome
            WHEN rr.computed_rank = 3 THEN 'third'::competition_participant_outcome
            ELSE 'participated'::competition_participant_outcome
        END,
        position = CASE
            WHEN rr.computed_rank = 1 THEN 'first'::competition_position
            WHEN rr.computed_rank = 2 THEN 'second'::competition_position
            WHEN rr.computed_rank = 3 THEN 'third'::competition_position
            ELSE 'participant'::competition_position
        END,
        requires_tie_break = (rr.computed_rank <= 3 AND rr.tie_count > 1 AND cr.tie_break_score IS NULL)
    FROM RankedResults rr
    WHERE cr.id = rr.id;

    RETURN QUERY
    SELECT cr.id,
           cr.registration_id,
           cr.marks_obtained,
           cr.normalized_score,
           cr.rank,
           cr.outcome,
           cr.requires_tie_break
    FROM public.competition_results cr
    WHERE cr.competition_id = p_competition_id
    ORDER BY COALESCE(cr.rank, 999), cr.normalized_score DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_competition_rankings(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_competition_rankings(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION app.calculate_competition_rankings(p_competition_id uuid)
RETURNS TABLE (
    result_id uuid,
    registration_id uuid,
    marks_obtained numeric,
    normalized_score numeric,
    rank integer,
    outcome competition_participant_outcome,
    requires_tie_break boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT * FROM public.calculate_competition_rankings(p_competition_id);
$$;

REVOKE ALL ON FUNCTION app.calculate_competition_rankings(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.calculate_competition_rankings(uuid) TO authenticated;

-- ============================================================================
-- 11. SECURE RPC: RESOLVE TOP-THREE TIES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.resolve_competition_tie(
    p_competition_id uuid,
    p_registration_id uuid,
    p_tie_break_score numeric,
    p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
    v_admin_profile_id uuid;
BEGIN
    v_admin_profile_id := app.current_profile_id();
    IF v_admin_profile_id IS NULL OR NOT public.is_competition_admin(p_competition_id) THEN
        RAISE EXCEPTION 'Unauthorized: Only authorized competition administrators can resolve ties.';
    END IF;

    UPDATE public.competition_results
    SET tie_break_score = p_tie_break_score,
        tie_break_notes = p_notes,
        tie_resolved_by = v_admin_profile_id,
        tie_resolved_at = app.utc_now(),
        requires_tie_break = false
    WHERE competition_id = p_competition_id
      AND registration_id = p_registration_id;

    -- Automatically recalculate ranks after tie resolution
    PERFORM public.calculate_competition_rankings(p_competition_id);
    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_competition_tie(uuid, uuid, numeric, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_competition_tie(uuid, uuid, numeric, text) TO authenticated;

CREATE OR REPLACE FUNCTION app.resolve_competition_tie(
    p_competition_id uuid,
    p_registration_id uuid,
    p_tie_break_score numeric,
    p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT public.resolve_competition_tie(p_competition_id, p_registration_id, p_tie_break_score, p_notes);
$$;

REVOKE ALL ON FUNCTION app.resolve_competition_tie(uuid, uuid, numeric, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.resolve_competition_tie(uuid, uuid, numeric, text) TO authenticated;

-- ============================================================================
-- 12. SECURE RPC: FINALIZE & PUBLISH COMPETITION RESULTS (IDEMPOTENT)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.finalize_and_publish_competition_results(
    p_competition_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
    v_admin_profile_id uuid;
    v_unresolved_ties integer;
    r_result RECORD;
    v_target_profile_id uuid;
    v_points integer;
    v_is_team boolean;
BEGIN
    v_admin_profile_id := app.current_profile_id();
    IF v_admin_profile_id IS NULL OR NOT public.is_competition_admin(p_competition_id) THEN
        RAISE EXCEPTION 'Unauthorized: Only authorized competition administrators can publish results.';
    END IF;

    -- Ensure no unresolved top-three ties exist
    SELECT COUNT(*) INTO v_unresolved_ties
    FROM public.competition_results
    WHERE competition_id = p_competition_id
      AND requires_tie_break = true;

    IF v_unresolved_ties > 0 THEN
        RAISE EXCEPTION 'Cannot publish results: There are % unresolved top-three ties.', v_unresolved_ties;
    END IF;

    SELECT allow_team INTO v_is_team
    FROM public.competitions
    WHERE id = p_competition_id;

    -- Mark results as published
    UPDATE public.competition_results
    SET result_status = 'published',
        finalized_by = COALESCE(finalized_by, v_admin_profile_id),
        finalized_at = COALESCE(finalized_at, app.utc_now()),
        published_at = COALESCE(published_at, app.utc_now())
    WHERE competition_id = p_competition_id
      AND outcome NOT IN ('disqualified', 'withdrawn', 'absent');

    UPDATE public.competitions
    SET competition_status = 'completed',
        result_visibility = 'published',
        result_date = COALESCE(result_date, app.utc_now())
    WHERE id = p_competition_id;

    -- Award points idempotently into point transactions ledger
    FOR r_result IN (
        SELECT cr.id AS result_id,
               cr.registration_id,
               cr.position,
               cr.outcome,
               reg.profile_id AS registrant_profile_id,
               reg.is_verified_participant
        FROM public.competition_results cr
        JOIN public.competition_registrations reg ON reg.id = cr.registration_id
        WHERE cr.competition_id = p_competition_id
          AND cr.result_status = 'published'
          AND cr.outcome IN ('first', 'second', 'third', 'participated')
    ) LOOP
        SELECT COALESCE(points, 0) INTO v_points
        FROM public.competition_point_rules
        WHERE position = r_result.position
          AND is_active = true
        LIMIT 1;

        IF r_result.position = 'participant' AND NOT r_result.is_verified_participant THEN
            v_points := 0;
        END IF;

        IF v_points > 0 THEN
            IF v_is_team THEN
                FOR v_target_profile_id IN (
                    SELECT profile_id FROM public.competition_team_members
                    WHERE registration_id = r_result.registration_id
                    UNION
                    SELECT r_result.registrant_profile_id
                ) LOOP
                    INSERT INTO public.competition_point_transactions (
                        profile_id, competition_id, result_id, transaction_type, transaction_version, points, reason, awarded_by
                    ) VALUES (
                        v_target_profile_id, p_competition_id, r_result.result_id, 'award', 1, v_points,
                        'Awarded ' || v_points || ' points for ' || r_result.position || ' position.', v_admin_profile_id
                    )
                    ON CONFLICT (profile_id, result_id, transaction_type, transaction_version) DO NOTHING;
                END LOOP;
            ELSE
                INSERT INTO public.competition_point_transactions (
                    profile_id, competition_id, result_id, transaction_type, transaction_version, points, reason, awarded_by
                ) VALUES (
                    r_result.registrant_profile_id, p_competition_id, r_result.result_id, 'award', 1, v_points,
                    'Awarded ' || v_points || ' points for ' || r_result.position || ' position.', v_admin_profile_id
                )
                ON CONFLICT (profile_id, result_id, transaction_type, transaction_version) DO NOTHING;
            END IF;
        END IF;
    END LOOP;

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_and_publish_competition_results(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finalize_and_publish_competition_results(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION app.finalize_and_publish_competition_results(p_competition_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT public.finalize_and_publish_competition_results(p_competition_id);
$$;

REVOKE ALL ON FUNCTION app.finalize_and_publish_competition_results(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.finalize_and_publish_competition_results(uuid) TO authenticated;

-- ============================================================================
-- 13. AUTHORITATIVE LEADERBOARD QUERY RPC
-- Aggregates real profile & department/institution data from valid ledger entries
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_competition_leaderboard(
    p_limit integer DEFAULT 50,
    p_offset integer DEFAULT 0,
    p_category_id uuid DEFAULT NULL,
    p_academic_year varchar DEFAULT NULL,
    p_competition_level competition_level DEFAULT NULL
)
RETURNS TABLE (
    leaderboard_rank bigint,
    profile_id uuid,
    slug varchar,
    full_name varchar,
    avatar_url text,
    department_or_institution varchar,
    profile_type profile_type,
    total_points bigint,
    wins bigint,
    second_place bigint,
    third_place bigint,
    podium_finishes bigint,
    competitions_participated bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
WITH ProfilePoints AS (
    SELECT
        tx.profile_id,
        SUM(tx.points)::bigint AS total_points,
        COUNT(CASE WHEN cr.outcome = 'first' THEN 1 END)::bigint AS wins,
        COUNT(CASE WHEN cr.outcome = 'second' THEN 1 END)::bigint AS second_place,
        COUNT(CASE WHEN cr.outcome = 'third' THEN 1 END)::bigint AS third_place,
        COUNT(CASE WHEN cr.outcome IN ('first', 'second', 'third') THEN 1 END)::bigint AS podium_finishes,
        COUNT(DISTINCT tx.competition_id)::bigint AS competitions_participated
    FROM public.competition_point_transactions tx
    JOIN public.competitions c ON c.id = tx.competition_id
    LEFT JOIN public.competition_results cr ON cr.id = tx.result_id
    WHERE (p_category_id IS NULL OR c.category_id = p_category_id)
      AND (p_competition_level IS NULL OR c.competition_level = p_competition_level)
    GROUP BY tx.profile_id
    HAVING SUM(tx.points) > 0
)
SELECT
    RANK() OVER (
        ORDER BY pp.total_points DESC,
                 pp.wins DESC,
                 pp.second_place DESC,
                 pp.third_place DESC
    ) AS leaderboard_rank,
    p.id AS profile_id,
    p.slug,
    p.full_name,
    NULL::text AS avatar_url,
    COALESCE(
        dept.name,
        ext.college_name,
        fac_dept.name,
        'Ravenshaw University'
    )::varchar AS department_or_institution,
    p.profile_type,
    pp.total_points,
    pp.wins,
    pp.second_place,
    pp.third_place,
    pp.podium_finishes,
    pp.competitions_participated
FROM ProfilePoints pp
JOIN public.profiles p ON p.id = pp.profile_id
LEFT JOIN public.education_records er ON er.profile_id = p.id AND er.is_primary = true
LEFT JOIN public.department_programs dp ON dp.id = er.department_program_id
LEFT JOIN public.departments dept ON dept.id = dp.department_id
LEFT JOIN public.external_participant_profiles ext ON ext.profile_id = p.id
LEFT JOIN public.faculty_profiles fp ON fp.profile_id = p.id
LEFT JOIN public.departments fac_dept ON fac_dept.id = fp.department_id
ORDER BY leaderboard_rank ASC, p.full_name ASC
LIMIT p_limit
OFFSET p_offset;
$$;

REVOKE ALL ON FUNCTION public.get_competition_leaderboard(integer, integer, uuid, varchar, competition_level) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_competition_leaderboard(integer, integer, uuid, varchar, competition_level) TO authenticated, anon;

CREATE OR REPLACE FUNCTION app.get_competition_leaderboard(
    p_limit integer DEFAULT 50,
    p_offset integer DEFAULT 0,
    p_category_id uuid DEFAULT NULL,
    p_academic_year varchar DEFAULT NULL,
    p_competition_level competition_level DEFAULT NULL
)
RETURNS TABLE (
    leaderboard_rank bigint,
    profile_id uuid,
    slug varchar,
    full_name varchar,
    avatar_url text,
    department_or_institution varchar,
    profile_type profile_type,
    total_points bigint,
    wins bigint,
    second_place bigint,
    third_place bigint,
    podium_finishes bigint,
    competitions_participated bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT * FROM public.get_competition_leaderboard(p_limit, p_offset, p_category_id, p_academic_year, p_competition_level);
$$;

REVOKE ALL ON FUNCTION app.get_competition_leaderboard(integer, integer, uuid, varchar, competition_level) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.get_competition_leaderboard(integer, integer, uuid, varchar, competition_level) TO authenticated, anon;

-- ============================================================================
-- 14. WINNERS GALLERY QUERY RPC (SOURCE OF TRUTH: COMPETITION_RESULTS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_competition_winners_gallery(
    p_limit integer DEFAULT 5,
    p_offset integer DEFAULT 0,
    p_category_id uuid DEFAULT NULL,
    p_competition_id uuid DEFAULT NULL,
    p_year integer DEFAULT NULL
)
RETURNS TABLE (
    result_id uuid,
    competition_id uuid,
    competition_title varchar,
    competition_slug varchar,
    category_name varchar,
    competition_year integer,
    profile_id uuid,
    slug varchar,
    full_name varchar,
    avatar_url text,
    department_or_institution varchar,
    marks_obtained numeric,
    published_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT
    cr.id AS result_id,
    c.id AS competition_id,
    c.title AS competition_title,
    c.slug AS competition_slug,
    cat.name AS category_name,
    EXTRACT(YEAR FROM COALESCE(c.result_date, cr.published_at))::integer AS competition_year,
    p.id AS profile_id,
    p.slug,
    p.full_name,
    NULL::text AS avatar_url,
    COALESCE(
        dept.name,
        ext.college_name,
        fac_dept.name,
        'Ravenshaw University'
    )::varchar AS department_or_institution,
    cr.marks_obtained,
    cr.published_at
FROM public.competition_results cr
JOIN public.competitions c ON c.id = cr.competition_id
JOIN public.competition_categories cat ON cat.id = c.category_id
JOIN public.competition_registrations reg ON reg.id = cr.registration_id
JOIN public.profiles p ON p.id = reg.profile_id
LEFT JOIN public.education_records er ON er.profile_id = p.id AND er.is_primary = true
LEFT JOIN public.department_programs dp ON dp.id = er.department_program_id
LEFT JOIN public.departments dept ON dept.id = dp.department_id
LEFT JOIN public.external_participant_profiles ext ON ext.profile_id = p.id
LEFT JOIN public.faculty_profiles fp ON fp.profile_id = p.id
LEFT JOIN public.departments fac_dept ON fac_dept.id = fp.department_id
WHERE cr.position = 'first'
  AND cr.result_status = 'published'
  AND cr.outcome = 'first'
  AND (p_category_id IS NULL OR c.category_id = p_category_id)
  AND (p_competition_id IS NULL OR c.id = p_competition_id)
  AND (p_year IS NULL OR EXTRACT(YEAR FROM COALESCE(c.result_date, cr.published_at))::integer = p_year)
ORDER BY COALESCE(cr.published_at, c.result_date) DESC, c.title ASC
LIMIT p_limit
OFFSET p_offset;
$$;

REVOKE ALL ON FUNCTION public.get_competition_winners_gallery(integer, integer, uuid, uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_competition_winners_gallery(integer, integer, uuid, uuid, integer) TO authenticated, anon;

CREATE OR REPLACE FUNCTION app.get_competition_winners_gallery(
    p_limit integer DEFAULT 5,
    p_offset integer DEFAULT 0,
    p_category_id uuid DEFAULT NULL,
    p_competition_id uuid DEFAULT NULL,
    p_year integer DEFAULT NULL
)
RETURNS TABLE (
    result_id uuid,
    competition_id uuid,
    competition_title varchar,
    competition_slug varchar,
    category_name varchar,
    competition_year integer,
    profile_id uuid,
    slug varchar,
    full_name varchar,
    avatar_url text,
    department_or_institution varchar,
    marks_obtained numeric,
    published_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app
AS $$
SELECT * FROM public.get_competition_winners_gallery(p_limit, p_offset, p_category_id, p_competition_id, p_year);
$$;

REVOKE ALL ON FUNCTION app.get_competition_winners_gallery(integer, integer, uuid, uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.get_competition_winners_gallery(integer, integer, uuid, uuid, integer) TO authenticated, anon;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;
