import sys

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    content = f.read()

content = content.replace(
    "INSERT INTO public.profiles (id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');",
    "INSERT INTO public.profiles (id, auth_user_id, full_name, email, slug) VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Admin', 'admin@test.com', 'admin-test');"
)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(content)
