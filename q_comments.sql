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
