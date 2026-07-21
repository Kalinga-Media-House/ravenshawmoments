-- Migration: 076_business_directory.sql
-- Description: Creates the Business Directory schema integrating with existing sponsorships and entity types.

-- 1. Enums
ALTER TYPE public.entity_type ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'business_news';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'business_promo';

CREATE TYPE public.business_verification_status AS ENUM (
    'unverified',
    'pending_verification',
    'verified',
    'rejected'
);

CREATE TYPE public.business_claim_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE public.business_listing_status AS ENUM (
    'draft',
    'pending_review',
    'published',
    'suspended',
    'closed',
    'archived'
);

-- 2. Tables

-- Business Categories
CREATE TABLE IF NOT EXISTS public.business_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    description text,
    icon_name varchar(100),
    parent_id uuid REFERENCES public.business_categories(id) ON DELETE CASCADE,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Listings
CREATE TABLE IF NOT EXISTS public.business_listings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL REFERENCES public.business_categories(id) ON DELETE RESTRICT,
    owner_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable if not yet claimed
    
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    description text,
    
    -- Media
    logo_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    cover_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    -- Contact Information
    owner_name varchar(255),
    phone varchar(50),
    whatsapp varchar(50),
    email varchar(255),
    website varchar(255),
    instagram varchar(255),
    facebook varchar(255),
    
    -- Location
    address text,
    latitude numeric(10, 8),
    longitude numeric(11, 8),
    google_maps_url varchar(2000),
    nearby_landmarks text[],
    
    -- Metadata
    price_range integer CHECK (price_range >= 1 AND price_range <= 4), -- 1: $, 2: $$, 3: $$$, 4: $$$$
    payment_methods text[],
    services_offered text[],
    facilities text[],
    amenities text[],
    
    -- Status
    status business_listing_status NOT NULL DEFAULT 'draft',
    verification_status business_verification_status NOT NULL DEFAULT 'unverified',
    
    -- Integration flags
    is_alumni_owned boolean NOT NULL DEFAULT false,
    
    -- Sponsorship & Prominence (Managed via sponsorship engine technically, but cached here for quick reads if needed)
    is_featured boolean NOT NULL DEFAULT false,
    is_premium boolean NOT NULL DEFAULT false,
    
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Hours
CREATE TABLE IF NOT EXISTS public.business_hours (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
    day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday
    open_time time,
    close_time time,
    is_closed boolean NOT NULL DEFAULT false,
    UNIQUE(business_id, day_of_week)
);

-- Business Gallery
CREATE TABLE IF NOT EXISTS public.business_gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
    media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    caption varchar(255),
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Business Claims
CREATE TABLE IF NOT EXISTS public.business_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status business_claim_status NOT NULL DEFAULT 'pending',
    proof_text text,
    proof_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(business_id, profile_id)
);

-- Business Reviews
CREATE TABLE IF NOT EXISTS public.business_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
    reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    is_verified_purchase boolean NOT NULL DEFAULT false,
    helpful_votes integer NOT NULL DEFAULT 0,
    status varchar(50) NOT NULL DEFAULT 'published', -- published, reported, removed
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business Analytics
CREATE TABLE IF NOT EXISTS public.business_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
    date date NOT NULL DEFAULT CURRENT_DATE,
    views_count integer NOT NULL DEFAULT 0,
    phone_clicks integer NOT NULL DEFAULT 0,
    whatsapp_clicks integer NOT NULL DEFAULT 0,
    website_clicks integer NOT NULL DEFAULT 0,
    direction_requests integer NOT NULL DEFAULT 0,
    UNIQUE(business_id, date)
);

-- 3. Triggers
CREATE TRIGGER update_business_categories_updated_at
    BEFORE UPDATE ON public.business_categories
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_business_listings_updated_at
    BEFORE UPDATE ON public.business_listings
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_business_claims_updated_at
    BEFORE UPDATE ON public.business_claims
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

CREATE TRIGGER update_business_reviews_updated_at
    BEFORE UPDATE ON public.business_reviews
    FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

-- 4. Indexes
CREATE INDEX idx_business_categories_slug ON public.business_categories(slug);
CREATE INDEX idx_business_listings_category ON public.business_listings(category_id);
CREATE INDEX idx_business_listings_slug ON public.business_listings(slug);
CREATE INDEX idx_business_listings_status ON public.business_listings(status);
CREATE INDEX idx_business_listings_verification ON public.business_listings(verification_status);
CREATE INDEX idx_business_claims_status ON public.business_claims(status);
CREATE INDEX idx_business_reviews_business ON public.business_reviews(business_id);
CREATE INDEX idx_business_analytics_date ON public.business_analytics(business_id, date);

-- 5. RLS
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read business categories" ON public.business_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published business listings" ON public.business_listings FOR SELECT USING (status = 'published');
CREATE POLICY "Owners read own business listings" ON public.business_listings FOR SELECT USING (auth.uid() = owner_profile_id);
CREATE POLICY "Public read business hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Public read business gallery" ON public.business_gallery FOR SELECT USING (true);
CREATE POLICY "Owners read own claims" ON public.business_claims FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Public read published reviews" ON public.business_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Owners read own analytics" ON public.business_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.business_listings bl WHERE bl.id = business_analytics.business_id AND bl.owner_profile_id = auth.uid())
);

-- Seed basic categories
INSERT INTO public.business_categories (name, slug, icon_name, display_order) VALUES
('Accommodation', 'accommodation', 'Home', 10),
('Education', 'education', 'BookOpen', 20),
('Food', 'food', 'Coffee', 30),
('Health', 'health', 'HeartPulse', 40),
('Student Services', 'student-services', 'Briefcase', 50),
('Transport', 'transport', 'Car', 60),
('Shopping', 'shopping', 'ShoppingBag', 70),
('Financial', 'financial', 'Wallet', 80)
ON CONFLICT (slug) DO NOTHING;
