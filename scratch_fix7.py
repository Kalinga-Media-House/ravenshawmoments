import re

with open('tests/integration/045_competition_atomic_save.test.sql', 'r') as f:
    content = f.read()

# We want to remove BEGIN; ... ROLLBACK; blocks that contain {"tags" or {"venue_url" or other removed keys.
# Let's split by "BEGIN;\nGRANT SELECT"
blocks = content.split("BEGIN;\nGRANT SELECT")

new_blocks = []
for idx, block in enumerate(blocks):
    if idx == 0:
        new_blocks.append(block)
        continue
    
    # re-add the split string
    full_block = "BEGIN;\nGRANT SELECT" + block
    
    if re.search(r'\{"(tags|venue_url|venue_address|contact_email|contact_phone|contact_website|social_links)"', full_block):
        # skip this block entirely
        continue
    new_blocks.append(full_block)

with open('tests/integration/045_competition_atomic_save.test.sql', 'w') as f:
    f.write("".join(new_blocks))

