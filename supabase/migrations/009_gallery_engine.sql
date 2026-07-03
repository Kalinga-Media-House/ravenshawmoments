-- =============================================================================
-- Ravenshaw Moments
-- Migration : 009_gallery_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Gallery Engine
-- Reusable galleries for departments, hostels, organizations, competitions,
-- campaigns, profiles and university events.
-- Depends on 007_media_engine.sql
-- =============================================================================

BEGIN;

-- ============================================================================
-- Gallery Albums
-- ============================================================================
CREATE TABLE public.gallery_albums (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('GAL'),

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    title varchar(200) NOT NULL,
    slug varchar(220) NOT NULL UNIQUE,
    description text,

    cover_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,

    created_by uuid REFERENCES public.profiles(id),
    is_public boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

COMMENT ON TABLE public.gallery_albums IS
'Reusable gallery albums for any supported entity.';

CREATE INDEX idx_gallery_entity
ON public.gallery_albums(entity_type, entity_id);

CREATE INDEX idx_gallery_public
ON public.gallery_albums(is_public);

CREATE INDEX idx_gallery_slug
ON public.gallery_albums(slug);

CREATE TRIGGER trg_gallery_albums_updated_at
BEFORE UPDATE ON public.gallery_albums
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Gallery Items
-- ============================================================================
CREATE TABLE public.gallery_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    gallery_album_id uuid NOT NULL
        REFERENCES public.gallery_albums(id) ON DELETE CASCADE,

    media_file_id uuid NOT NULL
        REFERENCES public.media_files(id) ON DELETE CASCADE,

    caption text,
    display_order integer NOT NULL DEFAULT 0,

    is_cover boolean NOT NULL DEFAULT false,
    is_featured boolean NOT NULL DEFAULT false,

    uploaded_by uuid REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_gallery_media UNIQUE(gallery_album_id, media_file_id)
);

CREATE INDEX idx_gallery_items_album
ON public.gallery_items(gallery_album_id);

CREATE INDEX idx_gallery_items_media
ON public.gallery_items(media_file_id);

-- ============================================================================
-- Gallery Collaborators
-- ============================================================================
CREATE TABLE public.gallery_collaborators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    gallery_album_id uuid NOT NULL
        REFERENCES public.gallery_albums(id) ON DELETE CASCADE,

    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    can_upload boolean NOT NULL DEFAULT true,
    can_manage boolean NOT NULL DEFAULT false,

    assigned_by uuid REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_gallery_collaborator
    UNIQUE(gallery_album_id, profile_id)
);

CREATE INDEX idx_gallery_collaborators_profile
ON public.gallery_collaborators(profile_id);

COMMIT;
