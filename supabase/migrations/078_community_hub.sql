-- =============================================================================
-- Ravenshaw Moments
-- Migration : 078_community_hub.sql
-- Version   : 1.0.0
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Safely add new values to ENUMs (if they don't already exist)
-- -----------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_type') THEN
        CREATE TYPE entity_type AS ENUM ('university');
    END IF;
END $$;

ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'community_group';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'post';
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'business';

ALTER TYPE reaction_type ADD VALUE IF NOT EXISTS 'insightful';
ALTER TYPE reaction_type ADD VALUE IF NOT EXISTS 'bookmark';

-- -----------------------------------------------------------------------------
-- New ENUMs for Community Hub
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM (
        'text', 'image', 'gallery', 'video', 'document', 'poll', 
        'announcement', 'achievement', 'event_update', 'competition_update', 'business_promotion'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_visibility AS ENUM (
        'public', 'university', 'department', 'hostel', 'organization', 'private_group'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE moderation_status AS ENUM (
        'pending', 'published', 'reported', 'under_review', 'hidden', 'removed', 'appealed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM (
        'draft', 'scheduled', 'published', 'archived', 'deleted'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- 1. community_groups
CREATE TABLE IF NOT EXISTS public.community_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    group_type text NOT NULL, -- e.g. 'club', 'batch', 'interest'
    visibility post_visibility DEFAULT 'public',
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. group_members
CREATE TABLE IF NOT EXISTS public.group_members (
    group_id uuid REFERENCES public.community_groups(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member', -- owner, admin, moderator, member
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, profile_id)
);

-- 3. community_posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    author_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- "Posting as" (e.g. as a department, hostel, business)
    actor_entity_type entity_type,
    actor_entity_id uuid,
    
    content text NOT NULL,
    post_type post_type NOT NULL DEFAULT 'text',
    visibility post_visibility NOT NULL DEFAULT 'public',
    status post_status NOT NULL DEFAULT 'published',
    moderation_status moderation_status NOT NULL DEFAULT 'published',
    
    -- Target audience/location
    group_id uuid REFERENCES public.community_groups(id) ON DELETE CASCADE,
    is_pinned boolean DEFAULT false,
    is_sponsored boolean DEFAULT false,
    
    -- Embedded Content Links
    embedded_entity_type entity_type,
    embedded_entity_id uuid,
    
    scheduled_for timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

-- 4. post_media
CREATE TABLE IF NOT EXISTS public.post_media (
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    media_id uuid REFERENCES public.media_files(id) ON DELETE CASCADE,
    display_order integer DEFAULT 0,
    PRIMARY KEY (post_id, media_id)
);

-- 5. post_comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    parent_comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
    author_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    is_pinned boolean DEFAULT false,
    moderation_status moderation_status NOT NULL DEFAULT 'published',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

-- 6. post_reactions
CREATE TABLE IF NOT EXISTS public.post_reactions (
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type reaction_type NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, profile_id)
);

-- 7. comment_reactions
CREATE TABLE IF NOT EXISTS public.comment_reactions (
    comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type reaction_type NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (comment_id, profile_id)
);

-- 8. polls, poll_options, poll_votes
CREATE TABLE IF NOT EXISTS public.polls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    question text NOT NULL,
    is_anonymous boolean DEFAULT false,
    ends_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text text NOT NULL,
    display_order integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id uuid REFERENCES public.poll_options(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (poll_id, profile_id)
);

-- 9. saved_posts & shared_posts
CREATE TABLE IF NOT EXISTS public.saved_posts (
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.shared_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    platform text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. hashtags & post_hashtags
CREATE TABLE IF NOT EXISTS public.hashtags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tag text UNIQUE NOT NULL,
    usage_count integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.post_hashtags (
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    hashtag_id uuid REFERENCES public.hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id)
);

-- 11. mentions
CREATE TABLE IF NOT EXISTS public.mentions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
    mentioned_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. follow_relationships
CREATE TABLE IF NOT EXISTS public.follow_relationships (
    follower_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_entity_type entity_type NOT NULL,
    target_entity_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_profile_id, target_entity_type, target_entity_id)
);

-- 13. community_reports
CREATE TABLE IF NOT EXISTS public.community_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_entity_type entity_type NOT NULL, -- 'post', 'profile', 'community_group'
    reported_entity_id uuid NOT NULL,
    reason text NOT NULL,
    details text,
    status text NOT NULL DEFAULT 'pending', -- pending, reviewed, dismissed, actioned
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz,
    resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 14. community_moderation (Moderator Actions Log)
-- Although we have audit_events, this table allows specific notes and tracking of community suspensions.
CREATE TABLE IF NOT EXISTS public.community_moderation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    action text NOT NULL, -- e.g. 'warning', 'suspension', 'ban'
    reason text NOT NULL,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Triggers for Updated At
-- -----------------------------------------------------------------------------
CREATE TRIGGER update_community_groups_updated_at BEFORE UPDATE ON public.community_groups FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

-- -----------------------------------------------------------------------------
-- RLS Policies
-- -----------------------------------------------------------------------------
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_moderation ENABLE ROW LEVEL SECURITY;

-- Post Policies (simplified for migration, actual enforcement via services)
CREATE POLICY "Public read active posts" ON public.community_posts FOR SELECT USING (status = 'published' AND deleted_at IS NULL AND moderation_status = 'published');
CREATE POLICY "Admins read all posts" ON public.community_posts FOR ALL USING (app.is_admin_or_super());

-- Comments
CREATE POLICY "Public read active comments" ON public.post_comments FOR SELECT USING (deleted_at IS NULL AND moderation_status = 'published');
CREATE POLICY "Admins read all comments" ON public.post_comments FOR ALL USING (app.is_admin_or_super());

-- Groups
CREATE POLICY "Public read public groups" ON public.community_groups FOR SELECT USING (visibility = 'public');
CREATE POLICY "Admins read all groups" ON public.community_groups FOR ALL USING (app.is_admin_or_super());

-- Reactions
CREATE POLICY "Public read reactions" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Public read comment reactions" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Admins read all reactions" ON public.post_reactions FOR ALL USING (app.is_admin_or_super());

-- Reports
CREATE POLICY "Admins read reports" ON public.community_reports FOR SELECT USING (app.is_admin_or_super());
CREATE POLICY "Admins write reports" ON public.community_reports FOR ALL USING (app.is_admin_or_super());

-- Moderation
CREATE POLICY "Admins read moderation" ON public.community_moderation FOR SELECT USING (app.is_admin_or_super());
CREATE POLICY "Admins write moderation" ON public.community_moderation FOR ALL USING (app.is_admin_or_super());

COMMIT;
