-- =============================================================================
-- Ravenshaw Moments
-- Migration : 027_organization_system_enhancements.sql
-- Purpose   : Organization Ecosystem Schema (Clubs, Societies, Cells, NCC, NSS)
-- =============================================================================

-- 1. Create Organization Type Enum
DO $$ BEGIN
  CREATE TYPE organization_type_enum AS ENUM (
    'ncc', 'nss', 'yrc', 'rotaract', 'cell', 'society', 'club', 'council', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Enhance existing organizations table with ecosystem columns
-- The organizations table was created in 003_master_data.sql. We add new columns additively.
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS vision text;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS mission text;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS contact_email varchar(255);
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS contact_phone varchar(50);
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- 3. Organization Members & Leadership Table
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL DEFAULT 'member', -- member, executive, office_bearer, alumni, honorary
  designation VARCHAR(255), -- e.g., President, Secretary, Volunteer
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, alumni, past
  can_manage_org BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, profile_id, role, designation)
);

-- 4. Organization Faculty Advisors Table
CREATE TABLE IF NOT EXISTS public.organization_advisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Organization Events Table
CREATE TABLE IF NOT EXISTS public.organization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL DEFAULT 'workshop', -- workshop, camp, drive, cultural, competition, meeting
  description TEXT,
  venue VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_registration_required BOOLEAN NOT NULL DEFAULT false,
  registration_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Organization Gallery Table
CREATE TABLE IF NOT EXISTS public.organization_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(50) NOT NULL DEFAULT 'image',
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  event_id UUID REFERENCES public.organization_events(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Organization Notices Table
CREATE TABLE IF NOT EXISTS public.organization_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'normal',
  audience VARCHAR(50) NOT NULL DEFAULT 'public', -- public, members, executives
  attachment_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Organization Achievements Table
CREATE TABLE IF NOT EXISTS public.organization_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'award', -- award, recognition, competition, impact
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Organization Publications Table
CREATE TABLE IF NOT EXISTS public.organization_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL DEFAULT 'annual_report', -- annual_report, magazine, newsletter, research
  description TEXT,
  publication_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at (using canonical app.set_updated_at from 001_database_foundation.sql)
-- NOTE: organizations already has trg_organizations_updated_at from 003_master_data.sql, skip it.
CREATE TRIGGER trg_org_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_advisors_updated_at BEFORE UPDATE ON public.organization_advisors FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_events_updated_at BEFORE UPDATE ON public.organization_events FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_gallery_updated_at BEFORE UPDATE ON public.organization_gallery FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_notices_updated_at BEFORE UPDATE ON public.organization_notices FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_achievements_updated_at BEFORE UPDATE ON public.organization_achievements FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_publications_updated_at BEFORE UPDATE ON public.organization_publications FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.organization_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_profile_id ON public.organization_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_org_events_org_id ON public.organization_events(org_id);
CREATE INDEX IF NOT EXISTS idx_org_notices_org_id ON public.organization_notices(org_id);
