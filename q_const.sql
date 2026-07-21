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
