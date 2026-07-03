-- =============================================================================
-- Ravenshaw Moments
-- Migration : 017_notification_engine.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Universal Notification Engine
-- Supports in-app, email and push notifications with delivery queues.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Notification Preferences
-- ============================================================================
CREATE TABLE public.notification_preferences (
    profile_id uuid PRIMARY KEY
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    email_enabled boolean NOT NULL DEFAULT true,
    push_enabled boolean NOT NULL DEFAULT true,
    in_app_enabled boolean NOT NULL DEFAULT true,

    competition_notifications boolean NOT NULL DEFAULT true,
    achievement_notifications boolean NOT NULL DEFAULT true,
    donation_notifications boolean NOT NULL DEFAULT true,
    announcement_notifications boolean NOT NULL DEFAULT true,

    updated_at timestamptz NOT NULL DEFAULT app.utc_now()
);

-- ============================================================================
-- Notifications
-- ============================================================================
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id text NOT NULL UNIQUE DEFAULT app.generate_public_id('NOT'),

    profile_id uuid NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    notification_type notification_type NOT NULL,

    entity_type entity_type,
    entity_id uuid,

    title varchar(200) NOT NULL,
    message text NOT NULL,

    is_read boolean NOT NULL DEFAULT false,
    read_at timestamptz,

    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_notifications_profile
ON public.notifications(profile_id);

CREATE INDEX idx_notifications_unread
ON public.notifications(profile_id, is_read);

COMMENT ON TABLE public.notifications IS
'In-app notification inbox.';

-- ============================================================================
-- Email Queue
-- ============================================================================
CREATE TABLE public.email_notification_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id uuid
        REFERENCES public.notifications(id) ON DELETE CASCADE,

    recipient_email text NOT NULL,
    subject varchar(250) NOT NULL,
    body text NOT NULL,

    sent boolean NOT NULL DEFAULT false,
    sent_at timestamptz,

    retry_count integer NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_email_queue_sent
ON public.email_notification_queue(sent);

-- ============================================================================
-- Push Queue
-- ============================================================================
CREATE TABLE public.push_notification_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id uuid
        REFERENCES public.notifications(id) ON DELETE CASCADE,

    device_token text NOT NULL,

    title varchar(200) NOT NULL,
    body text NOT NULL,

    sent boolean NOT NULL DEFAULT false,
    sent_at timestamptz,

    retry_count integer NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT app.utc_now()
);

CREATE INDEX idx_push_queue_sent
ON public.push_notification_queue(sent);

COMMIT;
