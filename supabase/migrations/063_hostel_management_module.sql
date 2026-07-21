-- =============================================================================
-- Ravenshaw Moments
-- Migration : 063_hostel_management_module.sql
-- Purpose   : Adds comprehensive Hostel Management schemas (Rooms, Mess, Visitors, Complaints)
-- =============================================================================

-- 1. Updates to existing hostels table
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS assistant_warden_profile_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS superintendent_profile_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 0;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS current_occupancy INT DEFAULT 0;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS rules JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS timings JSONB DEFAULT '[]'::jsonb;

-- 2. Rooms & Occupancy Management
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  block_name VARCHAR(50) DEFAULT 'Main',
  floor_number INT NOT NULL DEFAULT 1,
  room_number VARCHAR(20) NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  current_occupancy INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hostel_room UNIQUE(hostel_id, room_number)
);

CREATE TABLE IF NOT EXISTS public.hostel_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  bed_number VARCHAR(10) NOT NULL,
  is_occupied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hostel_room_bed UNIQUE(room_id, bed_number)
);

CREATE TABLE IF NOT EXISTS public.hostel_room_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES public.hostel_beds(id) ON DELETE SET NULL,
  allocation_date DATE NOT NULL,
  vacating_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, revoked
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hostel_room_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_room_id UUID REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  requested_room_id UUID REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Mess Management
CREATE TABLE IF NOT EXISTS public.hostel_mess_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner, snacks
  items_description TEXT NOT NULL,
  is_special BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hostel_mess_menu UNIQUE(hostel_id, day_of_week, meal_type)
);

CREATE TABLE IF NOT EXISTS public.hostel_mess_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Visitor Management
CREATE TABLE IF NOT EXISTS public.hostel_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  host_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_name VARCHAR(255) NOT NULL,
  visitor_contact VARCHAR(50),
  purpose TEXT NOT NULL,
  expected_arrival TIMESTAMPTZ,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, checked_in, checked_out, rejected
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Complaint Management
CREATE TABLE IF NOT EXISTS public.hostel_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- electrical, plumbing, carpentry, cleaning, internet, mess, discipline, other
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, critical
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  evidence_media_id VARCHAR(255),
  resolution_timeline TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hostel_complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.hostel_complaints(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Inventory Management
CREATE TABLE IF NOT EXISTS public.hostel_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  condition VARCHAR(50) DEFAULT 'good', -- good, fair, poor, damaged
  location VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_hostel_rooms_hostel ON public.hostel_rooms(hostel_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hostel_beds_room ON public.hostel_beds(room_id, is_occupied);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_active ON public.hostel_room_allocations(hostel_id, status);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_profile ON public.hostel_room_allocations(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_hostel_visitors_hostel ON public.hostel_visitors(hostel_id, status, expected_arrival);
CREATE INDEX IF NOT EXISTS idx_hostel_complaints_hostel ON public.hostel_complaints(hostel_id, status, priority);
CREATE INDEX IF NOT EXISTS idx_hostel_mess_feedbacks_hostel ON public.hostel_mess_feedbacks(hostel_id, created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_room_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_room_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_mess_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_inventory ENABLE ROW LEVEL SECURITY;

-- 1. Read Policies (Public & Authenticated)
CREATE POLICY "Public can read active rooms" ON public.hostel_rooms FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read mess menus" ON public.hostel_mess_menus FOR SELECT USING (true);
CREATE POLICY "Public can read mess feedback" ON public.hostel_mess_feedbacks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read their allocations" ON public.hostel_room_allocations FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Authenticated users can read their requests" ON public.hostel_room_change_requests FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Authenticated users can read their visitors" ON public.hostel_visitors FOR SELECT USING (host_profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Authenticated users can read their complaints" ON public.hostel_complaints FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());
CREATE POLICY "Authenticated users can read complaint comments" ON public.hostel_complaint_comments FOR SELECT USING (profile_id = auth.uid() OR app.is_admin_or_super());

-- 2. Write Policies (Admin Only fallback for broad access, but we trust server layer)
CREATE POLICY "Admins can manage all hostel records" ON public.hostel_rooms FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admins can manage all beds" ON public.hostel_beds FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admins can manage allocations" ON public.hostel_room_allocations FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admins can manage mess menus" ON public.hostel_mess_menus FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admins can manage inventory" ON public.hostel_inventory FOR ALL USING (app.is_admin_or_super());

-- Residents can insert
CREATE POLICY "Residents can insert requests" ON public.hostel_room_change_requests FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Residents can insert feedbacks" ON public.hostel_mess_feedbacks FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Residents can insert visitors" ON public.hostel_visitors FOR INSERT WITH CHECK (auth.uid() = host_profile_id);
CREATE POLICY "Residents can insert complaints" ON public.hostel_complaints FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Residents can insert comments" ON public.hostel_complaint_comments FOR INSERT WITH CHECK (auth.uid() = profile_id);
