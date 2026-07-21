-- Migration: 077_admin_intelligence.sql
-- Description: Centralized Super Admin Intelligence & Analytics Center

-- 1. Enums
CREATE TYPE public.widget_type AS ENUM (
    'line_chart',
    'bar_chart',
    'pie_chart',
    'area_chart',
    'table',
    'kpi_card',
    'trend_indicator',
    'leaderboard'
);

CREATE TYPE public.report_format AS ENUM (
    'pdf',
    'csv',
    'excel'
);

CREATE TYPE public.audit_severity AS ENUM (
    'info',
    'warning',
    'critical'
);

CREATE TYPE public.report_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

CREATE TYPE public.report_frequency AS ENUM (
    'daily',
    'weekly',
    'monthly'
);

-- 2. Tables

-- Analytics Dashboards
CREATE TABLE IF NOT EXISTS public.analytics_dashboards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    is_system_default boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Analytics Widgets
CREATE TABLE IF NOT EXISTS public.analytics_widgets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id uuid NOT NULL REFERENCES public.analytics_dashboards(id) ON DELETE CASCADE,
    widget_type widget_type NOT NULL,
    data_source varchar(100) NOT NULL, -- e.g., 'user_growth', 'department_activity'
    title varchar(255) NOT NULL,
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb, -- holds width, height, chart specific configs
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Dashboard Preferences
CREATE TABLE IF NOT EXISTS public.dashboard_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    active_dashboard_id uuid REFERENCES public.analytics_dashboards(id) ON DELETE SET NULL,
    layout_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(profile_id)
);

-- Analytics Reports
CREATE TABLE IF NOT EXISTS public.analytics_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    format report_format NOT NULL,
    parameters jsonb NOT NULL DEFAULT '{}'::jsonb, -- date ranges, filters
    generated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    status report_status NOT NULL DEFAULT 'pending',
    error_message text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Report Schedules
CREATE TABLE IF NOT EXISTS public.report_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    format report_format NOT NULL,
    frequency report_frequency NOT NULL,
    parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
    recipients uuid[] NOT NULL DEFAULT '{}', -- array of profile_ids
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    last_run_at timestamptz,
    next_run_at timestamptz,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Saved Filters
CREATE TABLE IF NOT EXISTS public.saved_filters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module varchar(100) NOT NULL, -- e.g., 'intelligence_events', 'intelligence_users'
    name varchar(255) NOT NULL,
    filters jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- System Health Metrics
CREATE TABLE IF NOT EXISTS public.system_health_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name varchar(100) NOT NULL, -- e.g., 'db_cpu', 'storage_bytes', 'api_latency_ms'
    metric_value numeric NOT NULL,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Audit Events
CREATE TABLE IF NOT EXISTS public.audit_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- who performed it
    action varchar(255) NOT NULL, -- e.g., 'LOGIN', 'ROLE_CHANGE', 'BUSINESS_VERIFICATION'
    severity audit_severity NOT NULL DEFAULT 'info',
    entity_type entity_type, -- reuses existing entity_type enum
    entity_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Triggers
CREATE TRIGGER update_analytics_dashboards_updated_at BEFORE UPDATE ON public.analytics_dashboards FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_analytics_widgets_updated_at BEFORE UPDATE ON public.analytics_widgets FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_dashboard_preferences_updated_at BEFORE UPDATE ON public.dashboard_preferences FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_analytics_reports_updated_at BEFORE UPDATE ON public.analytics_reports FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_report_schedules_updated_at BEFORE UPDATE ON public.report_schedules FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();
CREATE TRIGGER update_saved_filters_updated_at BEFORE UPDATE ON public.saved_filters FOR EACH ROW EXECUTE PROCEDURE update_donations_updated_at_column();

-- 4. Indexes
CREATE INDEX idx_analytics_widgets_dashboard ON public.analytics_widgets(dashboard_id);
CREATE INDEX idx_analytics_reports_status ON public.analytics_reports(status);
CREATE INDEX idx_report_schedules_next_run ON public.report_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX idx_system_health_recorded_at ON public.system_health_metrics(recorded_at);
CREATE INDEX idx_system_health_metric_name ON public.system_health_metrics(metric_name, recorded_at);
CREATE INDEX idx_audit_events_created_at ON public.audit_events(created_at);
CREATE INDEX idx_audit_events_actor ON public.audit_events(actor_id);
CREATE INDEX idx_audit_events_action ON public.audit_events(action);

-- 5. RLS
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Base policy: Only platform_admin can access intelligence tables
CREATE POLICY "Super Admins read dashboards" ON public.analytics_dashboards FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write dashboards" ON public.analytics_dashboards FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read widgets" ON public.analytics_widgets FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write widgets" ON public.analytics_widgets FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read preferences" ON public.dashboard_preferences FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write preferences" ON public.dashboard_preferences FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read reports" ON public.analytics_reports FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write reports" ON public.analytics_reports FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read schedules" ON public.report_schedules FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write schedules" ON public.report_schedules FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read saved filters" ON public.saved_filters FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write saved filters" ON public.saved_filters FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read system health" ON public.system_health_metrics FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write system health" ON public.system_health_metrics FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super Admins read audit events" ON public.audit_events FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins write audit events" ON public.audit_events FOR ALL USING (public.is_super_admin());

-- Seed Default Dashboard
INSERT INTO public.analytics_dashboards (id, name, description, is_system_default) VALUES 
('00000000-0000-0000-0000-000000000001', 'Executive Overview', 'Primary platform overview for super admins', true)
ON CONFLICT DO NOTHING;

-- Seed Default Widgets for the Executive Dashboard
INSERT INTO public.analytics_widgets (dashboard_id, widget_type, data_source, title, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'kpi_card', 'total_users', 'Total Users', 10),
('00000000-0000-0000-0000-000000000001', 'kpi_card', 'active_users', 'Active Users', 20),
('00000000-0000-0000-0000-000000000001', 'kpi_card', 'total_donations', 'Total Donations', 30),
('00000000-0000-0000-0000-000000000001', 'line_chart', 'user_growth', 'User Growth Trend', 40),
('00000000-0000-0000-0000-000000000001', 'pie_chart', 'department_distribution', 'Users by Department', 50)
ON CONFLICT DO NOTHING;
