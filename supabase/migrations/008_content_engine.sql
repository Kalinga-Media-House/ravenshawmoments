-- =============================================================================
-- Ravenshaw Moments
-- Migration : 008_content_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Content Management Engine
-- Supports news, events, announcements, blogs and Voice of Ravensshaw.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Content Items
-- ============================================================================
CREATE TABLE public.content_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('CNT'),

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    content_type content_type NOT NULL,

    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    summary text,
    body text NOT NULL,

    featured_media_id uuid REFERENCES public.media_files(id),

    author_profile_id uuid REFERENCES public.profiles(id),
    published_at timestamptz,
    is_published boolean NOT NULL DEFAULT false,
    is_featured boolean NOT NULL DEFAULT false,

    view_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

CREATE INDEX idx_content_entity
ON public.content_items(entity_type, entity_id);

CREATE INDEX idx_content_type
ON public.content_items(content_type);

CREATE INDEX idx_content_published
ON public.content_items(is_published, published_at DESC);

CREATE TRIGGER trg_content_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.content_items IS
'Universal CMS table for departments, hostels, organizations and university.';

-- ============================================================================
-- Content Revisions
-- ============================================================================
CREATE TABLE public.content_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id uuid NOT NULL
        REFERENCES public.content_items(id) ON DELETE CASCADE,
    revision_no integer NOT NULL,
    title varchar(250) NOT NULL,
    body text NOT NULL,
    edited_by uuid REFERENCES public.profiles(id),
    edited_at timestamptz NOT NULL DEFAULT app.utc_now(),
    UNIQUE(content_item_id, revision_no)
);

-- ============================================================================
-- Tags
-- ============================================================================
CREATE TABLE public.content_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(80) NOT NULL UNIQUE,
    slug varchar(100) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- ============================================================================
-- Content ↔ Tags
-- ============================================================================
CREATE TABLE public.content_tag_map (
    content_item_id uuid NOT NULL
        REFERENCES public.content_items(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL
        REFERENCES public.content_tags(id) ON DELETE CASCADE,
    PRIMARY KEY(content_item_id, tag_id)
);

CREATE INDEX idx_content_tag_tag
ON public.content_tag_map(tag_id);

COMMIT;
