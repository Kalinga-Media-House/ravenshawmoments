-- =============================================================================
-- Ravenshaw Moments
-- Migration : 016_social_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Social Engine
-- Supports follows, bookmarks, notifications preferences, comments and reports
-- across reusable entities.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Profile Follows
-- ============================================================================
CREATE TABLE public.profile_follows (
    follower_profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    PRIMARY KEY (follower_profile_id, following_profile_id),
    CONSTRAINT chk_no_self_follow
        CHECK (follower_profile_id <> following_profile_id)
);

CREATE INDEX idx_profile_follows_following
ON public.profile_follows(following_profile_id);

-- ============================================================================
-- Entity Followers
-- ============================================================================
CREATE TABLE public.entity_follows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT uq_entity_follow UNIQUE(profile_id, entity_type, entity_id)
);

CREATE INDEX idx_entity_follows_entity
ON public.entity_follows(entity_type, entity_id);

-- ============================================================================
-- Bookmarks
-- ============================================================================
CREATE TABLE public.bookmarks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT uq_bookmark UNIQUE(profile_id, entity_type, entity_id)
);

CREATE INDEX idx_bookmarks_profile
ON public.bookmarks(profile_id);

-- ============================================================================
-- Reports
-- ============================================================================
CREATE TABLE public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,
    reason varchar(150) NOT NULL,
    description text,
    approval_status approval_status NOT NULL DEFAULT 'pending',
    reviewed_by uuid REFERENCES public.profiles(id),
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_reports_status
ON public.reports(approval_status);

COMMENT ON TABLE public.reports IS
'Generic moderation reports for any supported entity.';

COMMIT;
