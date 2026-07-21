import sys

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    content = f.read()

content = content.replace(
    'INSERT INTO public.profiles',
    "INSERT INTO public.competition_categories (id, name) VALUES ('00000000-0000-4000-8000-000000000003', 'Test Category') ON CONFLICT DO NOTHING;\nINSERT INTO public.profiles"
)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(content)
