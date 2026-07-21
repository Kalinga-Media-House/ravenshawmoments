-- =============================================================================
-- Ravenshaw Moments
-- Migration : 067_organization_advanced.sql
-- Purpose   : Advanced Organization Ecosystem Schema (Projects, Recruitment, Attendance)
-- =============================================================================

-- 1. Organization Projects & Initiatives Table
CREATE TABLE IF NOT EXISTS public.organization_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL DEFAULT 'project', -- project, campaign, outreach
  description TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'planned', -- planned, active, completed, cancelled
  impact_metrics JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Organization Recruitment Campaigns
CREATE TABLE IF NOT EXISTS public.organization_recruitment_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  open_date TIMESTAMPTZ NOT NULL,
  close_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, open, closed
  eligibility_criteria TEXT,
  selection_process TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Organization Recruitment Applications
CREATE TABLE IF NOT EXISTS public.organization_recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.organization_recruitment_campaigns(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'applied', -- applied, interviewing, selected, rejected
  application_data JSONB DEFAULT '{}'::jsonb,
  interview_time TIMESTAMPTZ,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, profile_id)
);

-- 4. Organization Attendance Sessions
CREATE TABLE IF NOT EXISTS public.organization_attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.organization_events(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.organization_projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  session_date DATE NOT NULL,
  hours_awarded NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Organization Attendance Records
CREATE TABLE IF NOT EXISTS public.organization_attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.organization_attendance_sessions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'present', -- present, absent, excused
  volunteer_hours NUMERIC(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, profile_id)
);

-- Enable RLS
ALTER TABLE public.organization_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_recruitment_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_attendance_records ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER trg_org_projects_updated_at BEFORE UPDATE ON public.organization_projects FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_rect_camp_updated_at BEFORE UPDATE ON public.organization_recruitment_campaigns FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_rect_app_updated_at BEFORE UPDATE ON public.organization_recruitment_applications FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_att_sess_updated_at BEFORE UPDATE ON public.organization_attendance_sessions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER trg_org_att_rec_updated_at BEFORE UPDATE ON public.organization_attendance_records FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Policies for Projects
CREATE POLICY "Public read projects" ON public.organization_projects
  FOR SELECT USING (is_published = true OR public.is_organization_admin(org_id));

CREATE POLICY "Organization admins manage projects" ON public.organization_projects
  FOR ALL USING (public.is_organization_admin(org_id)) WITH CHECK (public.is_organization_admin(org_id));

-- Policies for Recruitment Campaigns
CREATE POLICY "Public read open campaigns" ON public.organization_recruitment_campaigns
  FOR SELECT USING (status = 'open' OR public.is_organization_admin(org_id));

CREATE POLICY "Organization admins manage campaigns" ON public.organization_recruitment_campaigns
  FOR ALL USING (public.is_organization_admin(org_id)) WITH CHECK (public.is_organization_admin(org_id));

-- Policies for Recruitment Applications
CREATE POLICY "Users read own applications" ON public.organization_recruitment_applications
  FOR SELECT USING (profile_id = app.current_profile_id() OR public.is_organization_admin((SELECT org_id FROM public.organization_recruitment_campaigns WHERE id = campaign_id)));

CREATE POLICY "Users insert own applications" ON public.organization_recruitment_applications
  FOR INSERT WITH CHECK (profile_id = app.current_profile_id());

CREATE POLICY "Organization admins manage applications" ON public.organization_recruitment_applications
  FOR UPDATE USING (public.is_organization_admin((SELECT org_id FROM public.organization_recruitment_campaigns WHERE id = campaign_id))) WITH CHECK (public.is_organization_admin((SELECT org_id FROM public.organization_recruitment_campaigns WHERE id = campaign_id)));

CREATE POLICY "Organization admins delete applications" ON public.organization_recruitment_applications
  FOR DELETE USING (public.is_organization_admin((SELECT org_id FROM public.organization_recruitment_campaigns WHERE id = campaign_id)));

-- Policies for Attendance Sessions
CREATE POLICY "Public read sessions" ON public.organization_attendance_sessions
  FOR SELECT USING (true);

CREATE POLICY "Organization admins manage sessions" ON public.organization_attendance_sessions
  FOR ALL USING (public.is_organization_admin(org_id)) WITH CHECK (public.is_organization_admin(org_id));

-- Policies for Attendance Records
CREATE POLICY "Users read own records" ON public.organization_attendance_records
  FOR SELECT USING (profile_id = app.current_profile_id() OR public.is_organization_admin((SELECT org_id FROM public.organization_attendance_sessions WHERE id = session_id)));

CREATE POLICY "Organization admins manage records" ON public.organization_attendance_records
  FOR ALL USING (public.is_organization_admin((SELECT org_id FROM public.organization_attendance_sessions WHERE id = session_id))) WITH CHECK (public.is_organization_admin((SELECT org_id FROM public.organization_attendance_sessions WHERE id = session_id)));
