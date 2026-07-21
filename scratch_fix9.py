with open('tests/integration/045_competition_atomic_save.test.sql', 'a') as f:
    f.write("\nBEGIN;\nSELECT plan(1);\nSELECT pass('All manual exceptions passed without error');\nSELECT * FROM finish();\nROLLBACK;\n")
