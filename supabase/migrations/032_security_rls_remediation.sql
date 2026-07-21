-- =============================================================================
-- Ravenshaw Moments
-- Migration : 032_security_rls_remediation.sql
-- Purpose   : Comprehensive RLS Remediation for 44 Unprotected Tables
-- =============================================================================

BEGIN;

-- 1. Enable RLS on all identified unprotected tables
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tag_map ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.gallery_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verification_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_receipts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_event_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profile_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_announcements ENABLE ROW LEVEL SECURITY;

-- 2. Master Data Policies (Public Read, Admin Write)
DO $$ 
DECLARE 
  table_name text;
  tables text[] := ARRAY['academic_sessions', 'course_levels', 'department_programs', 'batches', 'facilities', 'leadership_roles', 'teacher_designations', 'competition_categories', 'achievement_categories'];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON %I', table_name);
    
    EXECUTE format('
      CREATE POLICY "Public Read Access" ON %I 
      FOR SELECT USING (true);
    ', table_name);
    
    EXECUTE format('
      CREATE POLICY "Admin Write Access" ON %I 
      FOR ALL TO authenticated 
      USING (app.is_admin_or_super()) 
      WITH CHECK (app.is_admin_or_super());
    ', table_name);
  END LOOP;
END $$;

-- 3. Media & Content Policies
DROP POLICY IF EXISTS "Public Read Access" ON public.media_files;
DROP POLICY IF EXISTS "Owner Write Access" ON public.media_files;
DROP POLICY IF EXISTS "Admin Write Access" ON public.media_files;

CREATE POLICY "Public Read Access" ON public.media_files 
FOR SELECT USING (is_public = true OR app.is_admin_or_super() OR auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = owner_profile_id));

CREATE POLICY "Owner Write Access" ON public.media_files 
FOR ALL TO authenticated USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = owner_profile_id)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = owner_profile_id));

CREATE POLICY "Admin Write Access" ON public.media_files 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DROP POLICY IF EXISTS "Public Read Access" ON public.media_variants;
DROP POLICY IF EXISTS "System Write Access" ON public.media_variants;
CREATE POLICY "Public Read Access" ON public.media_variants FOR SELECT USING (true);
CREATE POLICY "System Write Access" ON public.media_variants FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DROP POLICY IF EXISTS "Public Read Access" ON public.attachments;
DROP POLICY IF EXISTS "Owner Write Access" ON public.attachments;
DROP POLICY IF EXISTS "Admin Write Access" ON public.attachments;

CREATE POLICY "Public Read Access" ON public.attachments 
FOR SELECT USING (true);

CREATE POLICY "Owner Write Access" ON public.attachments 
FOR ALL TO authenticated USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles p JOIN public.media_files m ON m.owner_profile_id = p.id WHERE m.id = media_file_id)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.profiles p JOIN public.media_files m ON m.owner_profile_id = p.id WHERE m.id = media_file_id));

CREATE POLICY "Admin Write Access" ON public.attachments 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DROP POLICY IF EXISTS "Public Read Access" ON public.content_items;
DROP POLICY IF EXISTS "Admin Write Access" ON public.content_items;

CREATE POLICY "Public Read Access" ON public.content_items 
FOR SELECT USING (is_published = true OR app.is_admin_or_super() OR auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = author_profile_id));

CREATE POLICY "Admin Write Access" ON public.content_items 
FOR ALL TO authenticated USING (app.is_admin_or_super()) WITH CHECK (app.is_admin_or_super());

DO $$ 
DECLARE 
  table_name text;
  tables text[] := ARRAY['content_revisions', 'content_tags', 'content_tag_map'];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON %I', table_name);
    
    EXECUTE format('
      CREATE POLICY "Public Read Access" ON %I 
      FOR SELECT USING (true);
    ', table_name);
    
    EXECUTE format('
      CREATE POLICY "Admin Write Access" ON %I 
      FOR ALL TO authenticated 
      USING (app.is_admin_or_super()) 
      WITH CHECK (app.is_admin_or_super());
    ', table_name);
  END LOOP;
END $$;

-- 4. Admin Only Tables
DO $$ 
DECLARE 
  table_name text;
  tables text[] := ARRAY[
    'gallery_collaborators', 'achievement_documents', 
    'payment_transactions', 'payment_refunds', 'certificate_templates', 
    'certificate_verification_logs', 'donation_receipts', 
    'reports', 'notification_preferences', 'email_notification_queue', 
    'push_notification_queue', 'system_settings', 'audit_logs', 
    'moderation_queue'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin Only Access" ON %I', table_name);
    
    EXECUTE format('
      CREATE POLICY "Admin Only Access" ON %I 
      FOR ALL TO authenticated 
      USING (app.is_admin_or_super()) 
      WITH CHECK (app.is_admin_or_super());
    ', table_name);
  END LOOP;
END $$;

-- 5. Public Read Data
DO $$ 
DECLARE 
  table_name text;
  tables text[] := ARRAY['competitions', 'competition_results', 'donation_campaigns', 'admin_announcements', 'timeline_events', 'timeline_event_links', 'timeline_reactions', 'timeline_comments'];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON %I', table_name);
    
    EXECUTE format('
      CREATE POLICY "Public Read Access" ON %I 
      FOR SELECT USING (true);
    ', table_name);
    
    EXECUTE format('
      CREATE POLICY "Admin Write Access" ON %I 
      FOR ALL TO authenticated 
      USING (app.is_admin_or_super()) 
      WITH CHECK (app.is_admin_or_super());
    ', table_name);
  END LOOP;
END $$;

-- 6. Owner Data (Competitions and Social)
DO $$ 
DECLARE 
  table_name text;
  tables text[] := ARRAY['competition_registrations', 'competition_team_members', 'entity_follows', 'bookmarks'];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Owner Read Access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Owner Write Access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON %I', table_name);
    
    EXECUTE format('
      CREATE POLICY "Owner Read Access" ON %I 
      FOR SELECT TO authenticated
      USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = profile_id) OR app.is_admin_or_super());
    ', table_name);
    
    EXECUTE format('
      CREATE POLICY "Owner Write Access" ON %I 
      FOR ALL TO authenticated 
      USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = profile_id)) 
      WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = profile_id));
    ', table_name);

    EXECUTE format('
      CREATE POLICY "Admin Write Access" ON %I 
      FOR ALL TO authenticated 
      USING (app.is_admin_or_super()) 
      WITH CHECK (app.is_admin_or_super());
    ', table_name);
  END LOOP;
END $$;

-- 6b. Owner Data (competition_submissions uses registration_id)
DO $$ 
DECLARE 
  table_name text := 'competition_submissions';
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS "Owner Read Access" ON %I', table_name);
  EXECUTE format('DROP POLICY IF EXISTS "Owner Write Access" ON %I', table_name);
  EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON %I', table_name);
  
  EXECUTE format('
    CREATE POLICY "Owner Read Access" ON %I 
    FOR SELECT TO authenticated
    USING (auth.uid() IN (SELECT p.auth_user_id FROM public.profiles p JOIN public.competition_registrations r ON r.profile_id = p.id WHERE r.id = registration_id) OR app.is_admin_or_super());
  ', table_name);
  
  EXECUTE format('
    CREATE POLICY "Owner Write Access" ON %I 
    FOR ALL TO authenticated 
    USING (auth.uid() IN (SELECT p.auth_user_id FROM public.profiles p JOIN public.competition_registrations r ON r.profile_id = p.id WHERE r.id = registration_id)) 
    WITH CHECK (auth.uid() IN (SELECT p.auth_user_id FROM public.profiles p JOIN public.competition_registrations r ON r.profile_id = p.id WHERE r.id = registration_id));
  ', table_name);

  EXECUTE format('
    CREATE POLICY "Admin Write Access" ON %I 
    FOR ALL TO authenticated 
    USING (app.is_admin_or_super()) 
    WITH CHECK (app.is_admin_or_super());
  ', table_name);
END $$;

-- profile_follows (Custom due to follower_profile_id)
DROP POLICY IF EXISTS "Owner Read Access" ON public.profile_follows;
DROP POLICY IF EXISTS "Owner Write Access" ON public.profile_follows;

CREATE POLICY "Owner Read Access" ON public.profile_follows 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = follower_profile_id) OR auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = following_profile_id) OR app.is_admin_or_super());

CREATE POLICY "Owner Write Access" ON public.profile_follows 
FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = follower_profile_id)) 
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = follower_profile_id));

-- 7. Protection of Sensitive Profile Columns
REVOKE SELECT (email, phone, date_of_birth, gender) ON public.profiles FROM public, anon, authenticated;
GRANT INSERT (email, phone, date_of_birth, gender) ON public.profiles TO authenticated;
GRANT UPDATE (email, phone, date_of_birth, gender) ON public.profiles TO authenticated;

DROP FUNCTION IF EXISTS public.get_private_profile_fields(uuid);

CREATE OR REPLACE FUNCTION public.get_private_profile_fields(p_profile_id uuid)
RETURNS TABLE (
  email citext,
  phone varchar,
  date_of_birth date,
  gender gender_type
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    auth.uid() = (SELECT auth_user_id FROM public.profiles WHERE id = p_profile_id)
    OR app.is_admin_or_super()
  ) THEN
    RAISE EXCEPTION 'Access Denied';
  END IF;

  RETURN QUERY
  SELECT p.email, p.phone, p.date_of_birth, p.gender
  FROM public.profiles p
  WHERE p.id = p_profile_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_private_profile_fields(uuid) TO authenticated;

COMMIT;
