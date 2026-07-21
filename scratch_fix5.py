import sys

with open('build_sql.py', 'r') as f:
    content = f.read()

content = content.replace(
    '{"key": "category_id", "db": "category_id", "db_t": "uuid", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "UUID"}',
    '{"key": "category_id", "db": "category_id", "db_t": "uuid", "json_t": "string", "null": "Err", "estr": "NULL", "norm": "UUID"}'
)

with open('build_sql.py', 'w') as f:
    f.write(content)

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    tcontent = f.read()

# Find the test block for category_id: null
target = """SELECT public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"category_id": null}'::jsonb);
DO $$ BEGIN IF (SELECT category_id FROM public.competitions WHERE id='00000000-0000-4000-8000-000000000002') IS NOT NULL THEN RAISE EXCEPTION 'Assertion failed'; END IF; END $$;"""

replacement = """DO $$
BEGIN
  PERFORM public.save_competition_workflow('00000000-0000-4000-8000-000000000002', '{"category_id": null}'::jsonb);
  RAISE EXCEPTION 'Expected error did not occur';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT ILIKE '%category_id cannot be null%' THEN
    RAISE EXCEPTION 'Wrong error: %', SQLERRM;
  END IF;
END $$;"""

tcontent = tcontent.replace(target, replacement)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(tcontent)

