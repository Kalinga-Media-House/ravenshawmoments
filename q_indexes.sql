SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename = 'competitions'
ORDER BY indexname;
