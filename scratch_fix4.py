import sys

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    content = f.read()

content = content.replace(
    'BEGIN;',
    'BEGIN;\nGRANT SELECT ON public.competitions TO authenticated;\nGRANT SELECT ON public.competition_categories TO authenticated;'
)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(content)
