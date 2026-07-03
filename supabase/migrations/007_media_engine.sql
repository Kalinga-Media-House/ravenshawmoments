-- =============================================================================
-- Ravenshaw Moments
-- Migration : 007_media_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Media Engine
-- Stores metadata for all uploaded files and reusable attachments.
-- Actual binaries are stored in Supabase Storage.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Media Files
-- ============================================================================
CREATE TABLE public.media_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('MED'),
    owner_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,

    storage_bucket varchar(100) NOT NULL,
    storage_path text NOT NULL UNIQUE,

    original_filename varchar(255) NOT NULL,
    mime_type text NOT NULL,
    media_type media_type NOT NULL,

    file_extension varchar(20),
    file_size_bytes bigint NOT NULL CHECK(file_size_bytes >= 0),

    width integer,
    height integer,
    duration_seconds integer,

    alt_text text,
    caption text,

    checksum_sha256 text,

    is_public boolean NOT NULL DEFAULT true,
    is_processed boolean NOT NULL DEFAULT false,
    is_deleted boolean NOT NULL DEFAULT false,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),
    updated_at timestamptz NOT NULL DEFAULT app.utc_now(),
    deleted_at timestamptz
);

CREATE INDEX idx_media_owner ON public.media_files(owner_profile_id);
CREATE INDEX idx_media_type ON public.media_files(media_type);
CREATE INDEX idx_media_public ON public.media_files(is_public);
CREATE INDEX idx_media_bucket_path ON public.media_files(storage_bucket, storage_path);

CREATE TRIGGER trg_media_files_updated_at
BEFORE UPDATE ON public.media_files
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMENT ON TABLE public.media_files IS
'Universal metadata for all uploaded files.';

-- ============================================================================
-- Media Variants (thumbnail, webp, etc.)
-- ============================================================================
CREATE TABLE public.media_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id uuid NOT NULL
        REFERENCES public.media_files(id) ON DELETE CASCADE,

    variant_name varchar(50) NOT NULL,
    storage_path text NOT NULL UNIQUE,

    width integer,
    height integer,
    file_size_bytes bigint,

    created_at timestamptz NOT NULL DEFAULT app.utc_now(),

    CONSTRAINT uq_media_variant UNIQUE(media_file_id, variant_name)
);

CREATE INDEX idx_media_variants_media
ON public.media_variants(media_file_id);

-- ============================================================================
-- Generic Attachments
-- ============================================================================
CREATE TABLE public.attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type entity_type NOT NULL,
    entity_id uuid NOT NULL,

    media_file_id uuid NOT NULL
        REFERENCES public.media_files(id) ON DELETE CASCADE,

    display_order integer NOT NULL DEFAULT 0,
    is_cover boolean NOT NULL DEFAULT false,

    created_by uuid REFERENCES public.profiles(id),
    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_attachments_entity
ON public.attachments(entity_type, entity_id);

CREATE INDEX idx_attachments_media
ON public.attachments(media_file_id);

COMMENT ON TABLE public.attachments IS
'Links any entity (department, hostel, profile, competition, etc.) to media files.';

COMMIT;
