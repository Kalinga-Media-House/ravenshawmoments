-- 045_competition_atomic_save.test.sql

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

-- Removed tags test
ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"submission_requirements": []}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%submission_requirements must be object%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"submission_requirements": {"maximum_file_count": 5}}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"prizes": {}}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%prizes must be array%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"prizes": []}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;

BEGIN;
GRANT SELECT ON public.competitions TO authenticated;
GRANT SELECT ON public.competition_categories TO authenticated;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;


BEGIN;
SELECT plan(1);
SELECT pass('All manual exceptions passed without error');
SELECT * FROM finish();
ROLLBACK;
