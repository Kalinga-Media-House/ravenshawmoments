import re

with open("tests.md", "r") as f:
    content = f.read()

# Extract all SQL blocks
blocks = re.findall(r"```sql\n(.*?)```", content, re.DOTALL)

with open("tests/integration/045_competition_atomic_save.test.sql", "w", encoding="utf-8") as f:
    f.write("-- 045_competition_atomic_save.test.sql\n\n")
    for block in blocks:
        f.write(block.strip() + "\n\n")
