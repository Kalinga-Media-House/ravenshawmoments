-- =============================================================================
-- Ravenshaw Moments
-- Migration : 015_timeline_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Timeline Engine
-- Powers "Ravenshaw Journey" by recording significant events for profiles
-- and university entities.
-- =============================================================================

BEGIN;

CREATE TABLE public.timeline_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('TL'),
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,
    event_type varchar(100) NOT NULL,
    title varchar(250) NOT NULL,
    description text,
    event_date timestamptz NOT NULL,
    visibility visibility_type NOT NULL DEFAULT 'public',
    related_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

COMMENT ON TABLE public.timeline_events IS
'Stores Ravenshaw Journey events for profiles and entities.';

CREATE INDEX idx_timeline_profile
ON public.timeline_events(profile_id);

CREATE INDEX idx_timeline_entity
ON public.timeline_events(entity_type, entity_id);

CREATE INDEX idx_timeline_event_date
ON public.timeline_events(event_date DESC);

CREATE TRIGGER trg_timeline_events_updated_at
BEFORE UPDATE ON public.timeline_events
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE public.timeline_event_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_event_id uuid NOT NULL
        REFERENCES public.timeline_events(id) ON DELETE CASCADE,
    linked_entity_type entity_type NOT NULL,
    linked_entity_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_timeline_links
ON public.timeline_event_links(linked_entity_type, linked_entity_id);

CREATE TABLE public.timeline_reactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_event_id uuid NOT NULL
        REFERENCES public.timeline_events(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction reaction_type NOT NULL,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    CONSTRAINT uq_timeline_reaction UNIQUE(timeline_event_id, profile_id)
);

CREATE INDEX idx_timeline_reactions_event
ON public.timeline_reactions(timeline_event_id);

CREATE TABLE public.timeline_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_event_id uuid NOT NULL
        REFERENCES public.timeline_events(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_comment_id uuid
        REFERENCES public.timeline_comments(id) ON DELETE CASCADE,
    comment text NOT NULL,
    is_edited boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_timeline_comments_event
ON public.timeline_comments(timeline_event_id);

CREATE TRIGGER trg_timeline_comments_updated_at
BEFORE UPDATE ON public.timeline_comments
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMIT;
