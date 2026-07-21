import sys

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    content = f.read()

content = content.replace(
    "INSERT INTO public.competition_categories (id, name) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category') ON CONFLICT DO NOTHING;",
    "INSERT INTO public.competition_categories (id, name, slug) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category', 'test-category') ON CONFLICT DO NOTHING;"
)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(content)
