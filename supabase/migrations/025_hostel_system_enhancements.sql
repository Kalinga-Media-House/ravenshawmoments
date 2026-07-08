-- =============================================================================
-- Ravenshaw Moments
-- Migration : 025_hostel_system_enhancements.sql
-- Purpose   : Hostel Ecosystem & Housing Hub Schema, RLS Policies, Indexes & Views
-- =============================================================================

-- 1. Create Hostel Type Enum if not exists
DO $$ BEGIN
  CREATE TYPE hostel_type_enum AS ENUM ('university_boys', 'university_girls', 'private_sponsored');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Core Hostels & Housing Hub Table
CREATE TABLE IF NOT EXISTS public.hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  hostel_type hostel_type_enum NOT NULL DEFAULT 'university_boys',
  description TEXT,
  history TEXT,
  address TEXT NOT NULL,
  google_maps_url TEXT,
  contact_number VARCHAR(50),
  contact_email VARCHAR(255),
  owner_name VARCHAR(255), -- Used for Housing Hub private hostels
  rent_info TEXT,          -- Used for Housing Hub private hostels
  room_types JSONB DEFAULT '[]'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  cover_image_url TEXT,
  logo_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_sponsored BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Hostel Wardens Table (University Hostels)
CREATE TABLE IF NOT EXISTS public.hostel_wardens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50),
  email VARCHAR(255),
  office_location VARCHAR(255),
  tenure_start DATE,
  tenure_end DATE,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Hostel BMC (Block Management Committee / Council) Table
CREATE TABLE IF NOT EXISTS public.hostel_bmcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_title VARCHAR(100) NOT NULL DEFAULT 'member', -- general_secretary, mess_secretary, cultural_secretary, sports_secretary, member
  permissions_grant JSONB NOT NULL DEFAULT '{"can_post_notices": false, "can_manage_events": false, "can_manage_gallery": false}'::jsonb,
  term_year VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hostel_bmc_profile_term UNIQUE (hostel_id, profile_id, term_year)
);

-- 5. Hostel Residents Table (Current Residents & Alumni)
CREATE TABLE IF NOT EXISTS public.hostel_residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_number VARCHAR(50),
  batch_year VARCHAR(20) NOT NULL,
  department_name VARCHAR(255),
  is_alumni BOOLEAN NOT NULL DEFAULT false,
  is_verified_by_bmc BOOLEAN NOT NULL DEFAULT false,
  joined_date DATE,
  left_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hostel_resident_profile UNIQUE (hostel_id, profile_id)
);

-- 6. Hostel Notices Table
CREATE TABLE IF NOT EXISTS public.hostel_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, critical
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all', -- all, residents, alumni
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  published_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Hostel Events Table
CREATE TABLE IF NOT EXISTS public.hostel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'festival', -- festival, competition, farewell, freshers, other
  description TEXT,
  venue VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_registration_required BOOLEAN NOT NULL DEFAULT false,
  registration_url TEXT,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Hostel Gallery Items Table
CREATE TABLE IF NOT EXISTS public.hostel_gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  media_id VARCHAR(255) NOT NULL,
  media_url TEXT NOT NULL,
  title VARCHAR(255),
  caption TEXT,
  category VARCHAR(50) DEFAULT 'event', -- event, historic, daily_life, celebration
  display_order INT NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  uploaded_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Hostel Achievements Table
CREATE TABLE IF NOT EXISTS public.hostel_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  resident_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'inter_hostel', -- academic, sports, cultural, leadership, inter_hostel
  awarded_date DATE NOT NULL,
  issuer VARCHAR(255),
  certificate_media_id VARCHAR(255),
  certificate_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_hostels_slug ON public.hostels(slug);
CREATE INDEX IF NOT EXISTS idx_hostels_type_active ON public.hostels(hostel_type, is_active, is_verified);
CREATE INDEX IF NOT EXISTS idx_hostel_wardens_hostel ON public.hostel_wardens(hostel_id, is_current);
CREATE INDEX IF NOT EXISTS idx_hostel_bmcs_hostel ON public.hostel_bmcs(hostel_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hostel_residents_hostel ON public.hostel_residents(hostel_id, is_alumni, is_verified_by_bmc);
CREATE INDEX IF NOT EXISTS idx_hostel_notices_hostel ON public.hostel_notices(hostel_id, is_pinned, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_hostel_events_hostel ON public.hostel_events(hostel_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_hostel_gallery_hostel ON public.hostel_gallery_items(hostel_id, display_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hostel_achievements_hostel ON public.hostel_achievements(hostel_id, awarded_date DESC);

-- =============================================================================
-- PUBLIC DIRECTORY VIEW
-- =============================================================================
CREATE OR REPLACE VIEW public.hostel_public_directory_v AS
SELECT 
  h.id,
  h.name,
  h.slug,
  h.hostel_type,
  h.description,
  h.address,
  h.cover_image_url,
  h.logo_url,
  h.is_verified,
  h.is_sponsored,
  h.rent_info,
  h.contact_number,
  (SELECT hw.name FROM public.hostel_wardens hw WHERE hw.hostel_id = h.id AND hw.is_current = true LIMIT 1) AS current_warden_name
FROM public.hostels h
WHERE h.is_active = true AND h.is_verified = true;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_bmcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_achievements ENABLE ROW LEVEL SECURITY;

-- Hostels policies
CREATE POLICY "Public can read verified active hostels" ON public.hostels
  FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Admins can manage all hostels" ON public.hostels
  FOR ALL USING (auth.role() = 'authenticated');

-- Wardens policies
CREATE POLICY "Public can read current wardens" ON public.hostel_wardens
  FOR SELECT USING (true);

-- BMC policies
CREATE POLICY "Public can read active BMC members" ON public.hostel_bmcs
  FOR SELECT USING (is_active = true);

-- Residents policies
CREATE POLICY "Public can read verified residents" ON public.hostel_residents
  FOR SELECT USING (is_verified_by_bmc = true);

-- Notices policies
CREATE POLICY "Public can read published notices" ON public.hostel_notices
  FOR SELECT USING (is_published = true);

-- Events policies
CREATE POLICY "Public can read published events" ON public.hostel_events
  FOR SELECT USING (is_published = true);

-- Gallery policies
CREATE POLICY "Public can read public gallery items" ON public.hostel_gallery_items
  FOR SELECT USING (is_public = true);

-- Achievements policies
CREATE POLICY "Public can read verified achievements" ON public.hostel_achievements
  FOR SELECT USING (is_verified = true);
