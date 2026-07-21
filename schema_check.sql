SELECT '--- COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'competitions'
ORDER BY ordinal_position;

SELECT '--- COMMENTS ---' as section;
SELECT
    a.attname AS column_name,
    col_description(a.attrelid, a.attnum) AS comment
FROM
    pg_class c
JOIN
    pg_attribute a ON c.oid = a.attrelid
JOIN
    pg_namespace n ON n.oid = c.relnamespace
WHERE
    n.nspname = 'public'
    AND c.relname = 'competitions'
    AND a.attnum > 0
ORDER BY a.attname;

SELECT '--- CONSTRAINTS ---' as section;
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS definition
FROM
    pg_constraint c
JOIN
    pg_class t ON c.conrelid = t.oid
JOIN
    pg_namespace n ON n.oid = t.relnamespace
WHERE
    t.relname = 'competitions'
    AND n.nspname = 'public'
ORDER BY conname;

SELECT '--- INDEXES ---' as section;
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename = 'competitions'
ORDER BY indexname;

SELECT '--- COUNT ---' as section;
SELECT COUNT(*) FROM public.competitions;

SELECT '--- RLS STATUS ---' as section;
SELECT
    relrowsecurity AS rls_enabled
FROM
    pg_class c
JOIN
    pg_namespace n ON n.oid = c.relnamespace
WHERE
    c.relname = 'competitions'
    AND n.nspname = 'public';

SELECT '--- POLICIES ---' as section;
SELECT
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND tablename = 'competitions'
ORDER BY policyname;
