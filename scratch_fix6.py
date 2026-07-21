import sys

with open('build_sql.py', 'r') as f:
    content = f.read()

# Remove the invalid fields from v_allowed
invalid_fields = ["'venue_url', ", "'venue_address', ", "'contact_email', ", "'contact_phone', ", "'contact_website', ", "'social_links', ", "'tags', "]
for field in invalid_fields:
    content = content.replace(field, '')

with open('build_sql.py', 'w') as f:
    f.write(content)

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    tcontent = f.read()

# We need to remove the test block for 'tags must be array'
import re

# find DO $$ ... tags must be array ... END $$;
pattern = re.compile(r'DO \$\$.*?tags must be array.*?END \$\$;', re.DOTALL)
tcontent = pattern.sub('-- Removed tags test', tcontent)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write(tcontent)

