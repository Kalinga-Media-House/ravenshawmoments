-- =============================================================================
-- Ravenshaw Moments
-- Migration : 035_contributor_recognition.sql
-- Purpose   : Support manual contributions and secure public contributor recognition.
-- =============================================================================

BEGIN;

-- 1. Add manual contribution tracking fields to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS admin_note text;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- 2. Create a secure public view for contributor recognition
-- Security Model:
-- This view explicitly runs with Definer rights (the PostgreSQL default for views).
-- We DO NOT use `WITH (security_invoker = true)` because the underlying
-- `donations` and `payments` tables have strict RLS that blocks public access.
-- Using Definer rights allows this view to act as a secure, narrow projection gateway.
-- It strictly bypasses RLS ONLY to aggregate and expose approved safe fields,
-- guaranteeing that private fields (email, phone, internal UUIDs, payment IDs, amounts) 
-- remain inaccessible to unauthorized queries.

CREATE OR REPLACE VIEW public.vw_public_contributors AS
WITH MonthlyTotals AS (
    SELECT 
        -- Stable grouping identity: use profile_id, or safely hashed private email for guests.
        -- We never group by display name because corrections would split the identity.
        COALESCE(
            d.profile_id::text, 
            md5(lower(trim(COALESCE(d.donor_email, 'unknown_guest'))))
        ) AS grouping_identity,
        
        -- Store raw max profile_id to join for slugs later (null for guests)
        MAX(d.profile_id::text)::uuid AS matched_profile_id,
        
        -- We take the most recent donor name override in the month if it's a guest
        (ARRAY_AGG(d.donor_name_override ORDER BY p.paid_at DESC))[1] AS latest_donor_name,

        EXTRACT(YEAR FROM p.paid_at) AS contribution_year,
        EXTRACT(MONTH FROM p.paid_at) AS contribution_month,
        
        -- Aggregate amount internally ONLY for tier calculation. 
        -- NEVER exposed in the public SELECT projection.
        SUM(p.amount) AS internal_total_amount
        
    FROM public.donations d
    JOIN public.payments p ON d.payment_id = p.id
    WHERE p.payment_status = 'paid'
      AND p.paid_at IS NOT NULL
      AND d.visibility != 'anonymous'
    GROUP BY 
        COALESCE(
            d.profile_id::text, 
            md5(lower(trim(COALESCE(d.donor_email, 'unknown_guest'))))
        ),
        EXTRACT(YEAR FROM p.paid_at),
        EXTRACT(MONTH FROM p.paid_at)
)
SELECT 
    -- Generate a stable ID for React without exposing internal IDs
    md5(m.grouping_identity || m.contribution_year || m.contribution_month) AS id,
    
    m.contribution_year,
    m.contribution_month,
    
    -- Resolve the final safe display name
    COALESCE(
        m.latest_donor_name,
        pr.full_name,
        'Generous Contributor'
    ) AS display_name,
    
    -- Use the canonical public slug (NOT the internal profile UUID)
    pr.slug AS profile_slug,
    
    -- Hardcode NULL for avatar_url since profile_media_id requires a join to media_files
    -- and signed URL generation logic, which is handled at the API layer.
    NULL::text AS avatar_url,
    
    CASE 
        WHEN m.internal_total_amount >= 499 THEN 'premium'
        WHEN m.internal_total_amount >= 45 THEN 'regular'
        ELSE 'none'
    END AS tier
FROM MonthlyTotals m
LEFT JOIN public.profiles pr ON m.matched_profile_id = pr.id
-- Exclude below-threshold contributions from the public projection entirely
WHERE m.internal_total_amount >= 45;

-- 3. Explicitly manage grants
REVOKE ALL ON public.vw_public_contributors FROM PUBLIC;
GRANT SELECT ON public.vw_public_contributors TO anon, authenticated;

COMMIT;
