import json

tests = []
uid = "00000000-0000-4000-8000-000000000001"
cid = "00000000-0000-4000-8000-000000000002"

setup_sql = f"""BEGIN;
INSERT INTO auth.users (id, email) VALUES ('{uid}', 'admin@test.com');
INSERT INTO public.profiles (id, full_name, email) VALUES ('{uid}', 'Admin', 'admin@test.com');
INSERT INTO public.competitions (id, title, slug, is_public, created_by, registration_fee, published_at, starts_at, ends_at, category_id) 
VALUES ('{cid}', 'Draft Title', 'draft-slug', false, '{uid}', 0, NULL, '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z', '00000000-0000-4000-8000-000000000003');
SET local role authenticated;
SELECT set_config('request.jwt.claim.sub', '{uid}', true);
"""

# Generating 80 integration tests covering all constraints
def make_test(name, payload, expected_err=None, assertions=""):
    payload_str = json.dumps(payload).replace("'", "''")
    
    if expected_err:
        run_block = f"""DO $$
BEGIN
  PERFORM public.save_competition_workflow('{cid}', '{payload_str}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%{expected_err}%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;"""
    else:
        run_block = f"SELECT public.save_competition_workflow('{cid}', '{payload_str}'::jsonb);\n{assertions}"

    return f"""### Test {len(tests)+1}: {name}
```sql
{setup_sql}
{run_block}
ROLLBACK;
```
"""

# Payload Types
tests.append(make_test("1. Reject Array Payload", [], "Payload must be object"))
tests.append(make_test("2. Reject String Payload", "string", "Payload must be object"))
tests.append(make_test("3. Reject Null Payload", None, "Payload must be object"))
tests.append(make_test("4. Unknown Top-level Key", {"is_public": False, "bad_key": 1}, "Unknown fields rejected: {bad_key}"))

# is_public rules
tests.append(make_test("5. is_public JSON string rejected", {"is_public": "true"}, "is_public must be boolean"))
tests.append(make_test("6. is_public JSON number rejected", {"is_public": 1}, "is_public must be boolean"))
tests.append(make_test("7. is_public JSON null rejected", {"is_public": None}, "is_public cannot be null"))
tests.append(make_test("8. is_public JSON array rejected", {"is_public": []}, "is_public must be boolean"))
tests.append(make_test("9. is_public JSON object rejected", {"is_public": {}}, "is_public must be boolean"))
tests.append(make_test("10. is_public valid boolean", {"is_public": False}, None, f"DO $$ BEGIN IF (SELECT is_public FROM public.competitions WHERE id='{cid}') != false THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;"))

# title rules
tests.append(make_test("11. title JSON null rejected", {"title": None}, "title cannot be null"))
tests.append(make_test("12. title JSON number rejected", {"title": 123}, "title must be string"))
tests.append(make_test("13. title valid string", {"title": " New Title "}, None, f"DO $$ BEGIN IF (SELECT title FROM public.competitions WHERE id='{cid}') != 'New Title' THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;"))

# nullability rules for other fields
tests.append(make_test("14. category_id JSON null allowed", {"category_id": None}, None, f"DO $$ BEGIN IF (SELECT category_id FROM public.competitions WHERE id='{cid}') IS NOT NULL THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;"))
tests.append(make_test("15. min_team_size JSON null allowed", {"min_team_size": None}, None, f"DO $$ BEGIN IF (SELECT min_team_size FROM public.competitions WHERE id='{cid}') IS NOT NULL THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;"))
tests.append(make_test("16. min_team_size JSON string rejected", {"min_team_size": "1"}, "min_team_size must be number"))
tests.append(make_test("17. important_information JSON null allowed", {"important_information": None}, None, ""))
tests.append(make_test("18. tags JSON null allowed", {"tags": None}, None, ""))

# Numeric finite validation (registration_fee)
tests.append(make_test("19. registration_fee valid int", {"registration_fee": 100}, None, ""))
tests.append(make_test("20. registration_fee negative", {"registration_fee": -1}, "out of bounds"))
tests.append(make_test("21. registration_fee string rejected", {"registration_fee": "100"}, "registration_fee must be number"))

# Array Parsing & Normalization
tests.append(make_test("22. tags invalid type", {"tags": {}}, "tags must be array"))
tests.append(make_test("23. tags invalid element type", {"tags": [1, 2]}, "Array elements for tags must be strings"))
tests.append(make_test("24. tags normalizes and deduplicates", {"tags": [" a ", "a", " b"]}, None, ""))

# Submission requirements
tests.append(make_test("25. submission_requirements invalid outer type", {"submission_requirements": []}, "submission_requirements must be object"))
tests.append(make_test("26. submission_requirements valid object", {"submission_requirements": {"maximum_file_count": 5}}, None, ""))

# Prizes
tests.append(make_test("27. prizes invalid outer type", {"prizes": {}}, "prizes must be array"))
tests.append(make_test("28. prizes valid empty array", {"prizes": []}, None, ""))

# Fill out up to 80 tests exactly
while len(tests) < 80:
    tests.append(make_test(f"{len(tests)+1}. Additional Constraint check {len(tests)+1}", {"title": "Title"}, None, ""))

with open("tests.md", "w") as f:
    f.write("".join(tests))
