-- =============================================================================
-- Ravenshaw Moments
-- Migration : 010_achievement_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Achievement Engine
-- Supports academic, sports, cultural, research, placement and competition
-- achievements for individuals and university entities.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Achievements
-- ============================================================================
CREATE TABLE public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('ACH'),

    category_id uuid NOT NULL
        REFERENCES public.achievement_categories(id),

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    title varchar(250) NOT NULL,
    slug varchar(250) NOT NULL UNIQUE,
    description text,

    achievement_date date,
    issuing_organization varchar(250),

    featured_media_id uuid
        REFERENCES public.media_files(id) ON DELETE SET NULL,

    certificate_media_id uuid
        REFERENCES public.media_files(id) ON DELETE SET NULL,

    created_by uuid
        REFERENCES public.profiles(id),

    is_public boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

COMMENT ON TABLE public.achievements IS
'Universal achievement records for profiles and university entities.';

CREATE INDEX idx_achievements_entity
ON public.achievements(entity_type, entity_id);

CREATE INDEX idx_achievements_category
ON public.achievements(category_id);

CREATE INDEX idx_achievements_public
ON public.achievements(is_public);

CREATE TRIGGER trg_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- Achievement Recipients
-- ============================================================================
CREATE TABLE public.achievement_recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    achievement_id uuid NOT NULL
        REFERENCES public.achievements(id) ON DELETE CASCADE,

    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    position varchar(100),
    remarks text,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_achievement_recipient
    UNIQUE(achievement_id, profile_id)
);

CREATE INDEX idx_achievement_recipients_profile
ON public.achievement_recipients(profile_id);

-- ============================================================================
-- Achievement Documents
-- ============================================================================
CREATE TABLE public.achievement_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    achievement_id uuid NOT NULL
        REFERENCES public.achievements(id) ON DELETE CASCADE,

    media_file_id uuid NOT NULL
        REFERENCES public.media_files(id) ON DELETE CASCADE,

    document_type varchar(100) NOT NULL,
    display_order integer NOT NULL DEFAULT 0,

    uploaded_by uuid
        REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_achievement_document
    UNIQUE(achievement_id, media_file_id)
);

CREATE INDEX idx_achievement_documents
ON public.achievement_documents(achievement_id);

COMMIT;
