-- 074_news_publications.sql

-- 1. Extend Enums
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'press_release';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'editorial';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'opinion_piece';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'interview';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'magazine_article';
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'research_news';

CREATE TYPE publication_type AS ENUM ('magazine', 'journal', 'newsletter', 'report', 'brochure', 'booklet');
CREATE TYPE editorial_role AS ENUM ('chief_editor', 'managing_editor', 'section_editor', 'reviewer', 'proofreader', 'publisher');

-- 2. Modify content_items for AI Readiness
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS ai_metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Content Categories
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS content_category_map (
    content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, category_id)
);

-- 4. Content Interactions
CREATE TABLE IF NOT EXISTS content_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES content_comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TRIGGER set_content_comments_updated_at BEFORE UPDATE ON content_comments FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS content_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reaction reaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(content_id, profile_id, reaction)
);

CREATE TABLE IF NOT EXISTS content_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Nullable for anonymous viewers
    session_id TEXT, -- To track unique anonymous views
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Publications Ecosystem
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    type publication_type NOT NULL,
    issn TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TRIGGER set_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS publication_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    volume_number TEXT,
    issue_number TEXT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE,
    document_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    cover_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(publication_id, slug)
);
CREATE TRIGGER set_publication_editions_updated_at BEFORE UPDATE ON publication_editions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS publication_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES publication_editions(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    page_number TEXT,
    display_order INTEGER DEFAULT 0,
    UNIQUE(edition_id, content_id)
);

CREATE TABLE IF NOT EXISTS editorial_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role editorial_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(publication_id, profile_id, role)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email TEXT,
    publication_id UUID REFERENCES publications(id) ON DELETE CASCADE, -- Null means global university newsletter
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(email, publication_id)
);

-- RLS Policies
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_categories_select" ON content_categories FOR SELECT USING (true);
CREATE POLICY "content_categories_admin" ON content_categories USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin'))
);

ALTER TABLE content_category_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_category_map_select" ON content_category_map FOR SELECT USING (true);
CREATE POLICY "content_category_map_admin" ON content_category_map USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin', 'department_cr', 'hostel_bmc', 'organization_admin'))
);

ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_comments_select" ON content_comments FOR SELECT USING (status = 'published');
CREATE POLICY "content_comments_insert" ON content_comments FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = profile_id)
);
CREATE POLICY "content_comments_update" ON content_comments FOR UPDATE USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = profile_id) OR
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin'))
);

ALTER TABLE content_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_reactions_select" ON content_reactions FOR SELECT USING (true);
CREATE POLICY "content_reactions_insert" ON content_reactions FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = profile_id)
);
CREATE POLICY "content_reactions_delete" ON content_reactions FOR DELETE USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = profile_id)
);

ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_views_insert" ON content_views FOR INSERT WITH CHECK (true);
CREATE POLICY "content_views_select" ON content_views FOR SELECT USING (true);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publications_select" ON publications FOR SELECT USING (true);
CREATE POLICY "publications_all" ON publications USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin', 'department_cr', 'organization_admin', 'hostel_bmc', 'alumni'))
);

ALTER TABLE publication_editions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publication_editions_select" ON publication_editions FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);
CREATE POLICY "publication_editions_all" ON publication_editions USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin', 'department_cr', 'organization_admin', 'hostel_bmc', 'alumni'))
);

ALTER TABLE publication_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publication_articles_select" ON publication_articles FOR SELECT USING (true);
CREATE POLICY "publication_articles_all" ON publication_articles USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin', 'department_cr', 'organization_admin', 'hostel_bmc', 'alumni'))
);

ALTER TABLE editorial_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editorial_boards_select" ON editorial_boards FOR SELECT USING (true);
CREATE POLICY "editorial_boards_all" ON editorial_boards USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin'))
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter_subscribers_insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_subscribers_select" ON newsletter_subscribers FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = profile_id) OR
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE profile_type IN ('admin', 'super_admin'))
);

-- Seed some default categories
INSERT INTO content_categories (name, slug) VALUES
('Campus Life', 'campus-life'),
('Research', 'research'),
('Academics', 'academics'),
('Placements', 'placements'),
('Sports', 'sports'),
('Culture', 'culture'),
('Technology', 'technology'),
('Alumni News', 'alumni-news')
ON CONFLICT (slug) DO NOTHING;
