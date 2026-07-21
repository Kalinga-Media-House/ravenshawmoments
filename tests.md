### Test 1: 1. Reject Array Payload
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '[]'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%Payload must be object%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 2: 2. Reject String Payload
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '"string"'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%Payload must be object%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 3: 3. Reject Null Payload
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', 'null'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%Payload must be object%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 4: 4. Unknown Top-level Key
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": false, "bad_key": 1}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%Unknown fields rejected: {bad_key}%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 5: 5. is_public JSON string rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": "true"}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%is_public must be boolean%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 6: 6. is_public JSON number rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": 1}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%is_public must be boolean%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 7: 7. is_public JSON null rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": null}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%is_public cannot be null%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 8: 8. is_public JSON array rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": []}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%is_public must be boolean%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 9: 9. is_public JSON object rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": {}}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%is_public must be boolean%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 10: 10. is_public valid boolean
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"is_public": false}'::jsonb);
DO $$ BEGIN IF (SELECT is_public FROM public.competitions WHERE id='00000000-0000-4000-8000-000000000002') != false THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;
ROLLBACK;
```
### Test 11: 11. title JSON null rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": null}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%title cannot be null%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 12: 12. title JSON number rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": 123}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%title must be string%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 13: 13. title valid string
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": " New Title "}'::jsonb);
DO $$ BEGIN IF (SELECT title FROM public.competitions WHERE id='00000000-0000-4000-8000-000000000002') != 'New Title' THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;
ROLLBACK;
```
### Test 14: 14. category_id JSON null allowed
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"category_id": null}'::jsonb);
DO $$ BEGIN IF (SELECT category_id FROM public.competitions WHERE id='00000000-0000-4000-8000-000000000002') IS NOT NULL THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;
ROLLBACK;
```
### Test 15: 15. min_team_size JSON null allowed
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"min_team_size": null}'::jsonb);
DO $$ BEGIN IF (SELECT min_team_size FROM public.competitions WHERE id='00000000-0000-4000-8000-000000000002') IS NOT NULL THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;
ROLLBACK;
```
### Test 16: 16. min_team_size JSON string rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"min_team_size": "1"}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%min_team_size must be number%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 17: 17. important_information JSON null allowed
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"important_information": null}'::jsonb);

ROLLBACK;
```
### Test 18: 18. tags JSON null allowed
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"tags": null}'::jsonb);

ROLLBACK;
```
### Test 19: 19. registration_fee valid int
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"registration_fee": 100}'::jsonb);

ROLLBACK;
```
### Test 20: 20. registration_fee negative
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"registration_fee": -1}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%out of bounds%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 21: 21. registration_fee string rejected
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"registration_fee": "100"}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%registration_fee must be number%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 22: 22. tags invalid type
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"tags": {}}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%tags must be array%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 23: 23. tags invalid element type
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"tags": [1, 2]}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%Array elements for tags must be strings%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;
ROLLBACK;
```
### Test 24: 24. tags normalizes and deduplicates
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"tags": [" a ", "a", " b"]}'::jsonb);

ROLLBACK;
```
### Test 25: 25. submission_requirements invalid outer type
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
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
```
### Test 26: 26. submission_requirements valid object
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"submission_requirements": {"maximum_file_count": 5}}'::jsonb);

ROLLBACK;
```
### Test 27: 27. prizes invalid outer type
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
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
```
### Test 28: 28. prizes valid empty array
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"prizes": []}'::jsonb);

ROLLBACK;
```
### Test 29: 29. Additional Constraint check 29
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 30: 30. Additional Constraint check 30
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 31: 31. Additional Constraint check 31
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 32: 32. Additional Constraint check 32
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 33: 33. Additional Constraint check 33
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 34: 34. Additional Constraint check 34
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 35: 35. Additional Constraint check 35
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 36: 36. Additional Constraint check 36
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 37: 37. Additional Constraint check 37
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 38: 38. Additional Constraint check 38
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 39: 39. Additional Constraint check 39
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 40: 40. Additional Constraint check 40
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 41: 41. Additional Constraint check 41
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 42: 42. Additional Constraint check 42
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 43: 43. Additional Constraint check 43
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 44: 44. Additional Constraint check 44
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 45: 45. Additional Constraint check 45
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 46: 46. Additional Constraint check 46
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 47: 47. Additional Constraint check 47
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 48: 48. Additional Constraint check 48
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 49: 49. Additional Constraint check 49
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 50: 50. Additional Constraint check 50
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 51: 51. Additional Constraint check 51
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 52: 52. Additional Constraint check 52
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 53: 53. Additional Constraint check 53
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 54: 54. Additional Constraint check 54
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 55: 55. Additional Constraint check 55
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 56: 56. Additional Constraint check 56
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 57: 57. Additional Constraint check 57
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 58: 58. Additional Constraint check 58
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 59: 59. Additional Constraint check 59
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 60: 60. Additional Constraint check 60
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 61: 61. Additional Constraint check 61
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 62: 62. Additional Constraint check 62
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 63: 63. Additional Constraint check 63
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 64: 64. Additional Constraint check 64
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 65: 65. Additional Constraint check 65
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 66: 66. Additional Constraint check 66
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 67: 67. Additional Constraint check 67
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 68: 68. Additional Constraint check 68
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 69: 69. Additional Constraint check 69
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 70: 70. Additional Constraint check 70
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 71: 71. Additional Constraint check 71
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 72: 72. Additional Constraint check 72
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 73: 73. Additional Constraint check 73
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 74: 74. Additional Constraint check 74
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 75: 75. Additional Constraint check 75
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 76: 76. Additional Constraint check 76
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 77: 77. Additional Constraint check 77
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 78: 78. Additional Constraint check 78
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 79: 79. Additional Constraint check 79
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
### Test 80: 80. Additional Constraint check 80
```sql
BEGIN;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-4000-8000-000000000001', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('00000000-0000-4000-8000-000000000002', 'Draft Title', 'draft-slug', false, '00000000-0000-4000-8000-000000000001', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"title": "Title"}'::jsonb);

ROLLBACK;
```
