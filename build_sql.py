import os
import json

fields = [
    {"key": "title", "db": "title", "db_t": "text", "json_t": "string", "null": "Err", "estr": "NULL", "norm": "TRIM"},
    {"key": "slug", "db": "slug", "db_t": "text", "json_t": "string", "null": "Err", "estr": "NULL", "norm": "LOWER(TRIM)"},
    {"key": "category_id", "db": "category_id", "db_t": "uuid", "json_t": "string", "null": "Err", "estr": "NULL", "norm": "UUID"},
    {"key": "short_description", "db": "short_description", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "description", "db": "description", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "rules", "db": "rules", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "important_information", "db": "important_information", "db_t": "jsonb", "json_t": "array", "null": "NULL", "estr": "N/A", "norm": "ARRAY_TRIM"},
    {"key": "competition_level", "db": "competition_level", "db_t": "public.competition_level", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "competition_mode", "db": "mode", "db_t": "public.competition_mode", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "min_team_size", "db": "min_team_size", "db_t": "integer", "json_t": "number", "null": "NULL", "estr": "N/A", "norm": "validate_finite_numeric"},
    {"key": "max_team_size", "db": "max_team_size", "db_t": "integer", "json_t": "number", "null": "NULL", "estr": "N/A", "norm": "validate_finite_numeric"},
    {"key": "starts_at", "db": "starts_at", "db_t": "timestamptz", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TIMESTAMPTZ"},
    {"key": "ends_at", "db": "ends_at", "db_t": "timestamptz", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TIMESTAMPTZ"},
    {"key": "registration_open_at", "db": "registration_open_at", "db_t": "timestamptz", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TIMESTAMPTZ"},
    {"key": "registration_close_at", "db": "registration_close_at", "db_t": "timestamptz", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TIMESTAMPTZ"},
    {"key": "registration_fee", "db": "registration_fee", "db_t": "numeric", "json_t": "number", "null": "NULL", "estr": "N/A", "norm": "validate_finite_numeric"},
    {"key": "registration_approval_mode", "db": "registration_approval_mode", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "waitlist_enabled", "db": "waitlist_enabled", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "participation_certificate_enabled", "db": "participation_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "merit_certificate_enabled", "db": "merit_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "winner_certificate_enabled", "db": "winner_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "certificate_verification_enabled", "db": "certificate_verification_enabled", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "certificate_delivery_method", "db": "certificate_delivery_method", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "featured_media_id", "db": "featured_media_id", "db_t": "uuid", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "UUID"},
    {"key": "department_id", "db": "department_id", "db_t": "uuid", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "UUID"},
    {"key": "hostel_id", "db": "hostel_id", "db_t": "uuid", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "UUID"},
    {"key": "organization_id", "db": "organization_id", "db_t": "uuid", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "UUID"},
    {"key": "venue_name", "db": "venue_name", "db_t": "text", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TRIM"},
    {"key": "is_public", "db": "is_public", "db_t": "boolean", "json_t": "boolean", "null": "Err", "estr": "N/A", "norm": "BOOL"},
    {"key": "scheduled_publish_at", "db": "scheduled_publish_at", "db_t": "timestamptz", "json_t": "string", "null": "NULL", "estr": "NULL", "norm": "TIMESTAMPTZ"},
    {"key": "allow_team", "db": "allow_team", "db_t": "boolean", "json_t": "boolean", "null": "NULL", "estr": "N/A", "norm": "BOOL"},
    {"key": "eligible_participant_types", "db": "eligible_participant_types", "db_t": "jsonb", "json_t": "array", "null": "NULL", "estr": "N/A", "norm": "ARRAY_TRIM"},
    {"key": "submission_requirements", "db": "submission_requirements", "db_t": "jsonb", "json_t": "object", "null": "NULL", "estr": "N/A", "norm": "OBJECT"},
    {"key": "eligibility_configuration", "db": "eligibility_configuration", "db_t": "jsonb", "json_t": "object", "null": "NULL", "estr": "N/A", "norm": "OPAQUE"}
]

sql = """-- 045_competition_atomic_save.sql
BEGIN;

CREATE OR REPLACE FUNCTION public.validate_finite_numeric(p_val jsonb, p_min numeric, p_max numeric, p_scale int)
RETURNS numeric
LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  v_num numeric;
BEGIN
  IF jsonb_typeof(p_val) != 'number' THEN
    RAISE EXCEPTION 'Value must be a number';
  END IF;
  v_num := (p_val#>>'{}')::numeric;
  IF v_num = 'NaN'::numeric OR v_num = 'Infinity'::numeric OR v_num = '-Infinity'::numeric THEN
    RAISE EXCEPTION 'Number must be finite';
  END IF;
  IF v_num < p_min OR v_num > p_max THEN
    RAISE EXCEPTION 'Number % out of bounds [%, %]', v_num, p_min, p_max;
  END IF;
  IF trunc(v_num, p_scale) != v_num THEN
    RAISE EXCEPTION 'Number exceeds maximum scale %', p_scale;
  END IF;
  RETURN v_num;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_finite_numeric(jsonb, numeric, numeric, int) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.save_competition_workflow(
  p_competition_id uuid,
  p_payload jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET lock_timeout = '5s'
AS $$
DECLARE
  v_stored public.competitions%ROWTYPE;
  v_is_admin boolean;
  
  v_allowed text[] := ARRAY['title', 'slug', 'category_id', 'short_description', 'description', 'rules', 'important_information', 'competition_level', 'competition_mode', 'min_team_size', 'max_team_size', 'starts_at', 'ends_at', 'registration_open_at', 'registration_close_at', 'registration_fee', 'registration_approval_mode', 'waitlist_enabled', 'participation_certificate_enabled', 'merit_certificate_enabled', 'winner_certificate_enabled', 'certificate_verification_enabled', 'certificate_delivery_method', 'featured_media_id', 'department_id', 'hostel_id', 'organization_id', 'venue_name', 'is_public', 'scheduled_publish_at', 'allow_team', 'eligible_participant_types', 'submission_requirements', 'refund_configuration', 'prizes', 'eligibility_configuration'];
  v_unknown text[];
  v_published_at timestamptz;
"""

for f in fields:
    sql += f"  v_eff_{f['key']} {f['db_t']};\n"

sql += """
BEGIN
  v_is_admin := public.is_competition_admin(p_competition_id);
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Forbidden: Must be competition admin.'; END IF;

  SELECT * INTO v_stored FROM public.competitions WHERE id = p_competition_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Competition not found.'; END IF;
  
  IF jsonb_typeof(p_payload) != 'object' THEN RAISE EXCEPTION 'Payload must be object.'; END IF;
  SELECT array_agg(k) INTO v_unknown FROM jsonb_object_keys(p_payload) k WHERE k != ALL(v_allowed);
  IF array_length(v_unknown, 1) > 0 THEN RAISE EXCEPTION 'Unknown fields rejected: %', v_unknown; END IF;
"""

for f in fields:
    vname = f"v_eff_{f['key']}"
    if f["json_t"] == "string":
        null_err = f"RAISE EXCEPTION '{f['key']} cannot be null';" if f["null"] == "Err" else f"{vname} := NULL;"
        sql += f"""
  IF p_payload ? '{f['key']}' THEN
    IF jsonb_typeof(p_payload->'{f['key']}') = 'null' THEN
      {null_err}
    ELSIF jsonb_typeof(p_payload->'{f['key']}') != 'string' THEN
      RAISE EXCEPTION '{f['key']} must be string';
    ELSE
      {vname} := NULLIF(TRIM(p_payload->>'{f['key']}'), '')::{f['db_t']};
    END IF;
  ELSE
    {vname} := v_stored.{f['db']};
  END IF;
"""
    elif f["json_t"] == "number":
        sql += f"""
  IF p_payload ? '{f['key']}' THEN
    IF jsonb_typeof(p_payload->'{f['key']}') = 'null' THEN
      {vname} := NULL;
    ELSIF jsonb_typeof(p_payload->'{f['key']}') != 'number' THEN
      RAISE EXCEPTION '{f['key']} must be number';
    ELSE
      {vname} := public.validate_finite_numeric(p_payload->'{f['key']}', 0, 999999999, 2)::{f['db_t']};
    END IF;
  ELSE
    {vname} := v_stored.{f['db']};
  END IF;
"""
    elif f["json_t"] == "boolean":
        null_err = f"RAISE EXCEPTION '{f['key']} cannot be null';" if f["null"] == "Err" else f"{vname} := NULL;"
        sql += f"""
  IF p_payload ? '{f['key']}' THEN
    IF jsonb_typeof(p_payload->'{f['key']}') = 'null' THEN
      {null_err}
    ELSIF jsonb_typeof(p_payload->'{f['key']}') != 'boolean' THEN
      RAISE EXCEPTION '{f['key']} must be boolean';
    ELSE
      {vname} := (p_payload->>'{f['key']}')::boolean;
    END IF;
  ELSE
    {vname} := v_stored.{f['db']};
  END IF;
"""
    elif f["json_t"] in ("array", "object"):
        sql += f"""
  IF p_payload ? '{f['key']}' THEN
    IF jsonb_typeof(p_payload->'{f['key']}') = 'null' THEN
      {vname} := NULL;
    ELSIF jsonb_typeof(p_payload->'{f['key']}') != '{f['json_t']}' THEN
      RAISE EXCEPTION '{f['key']} must be {f['json_t']}';
    ELSE
      {vname} := p_payload->'{f['key']}';
    END IF;
  ELSE
    {vname} := v_stored.{f['db']};
  END IF;
"""

sql += """
  -- Lifecycle logic
  IF v_eff_is_public THEN
    v_published_at := COALESCE(v_stored.published_at, now());
  ELSE
    v_published_at := NULL;
    v_eff_scheduled_publish_at := NULL;
  END IF;

  UPDATE public.competitions
  SET """

update_cols = []
for f in fields:
    update_cols.append(f"{f['db']} = v_eff_{f['key']}")
sql += ",\n      ".join(update_cols)
sql += ",\n      published_at = v_published_at\n  WHERE id = p_competition_id;\n"

sql += """
  -- Handle prizes if present
  IF p_payload ? 'prizes' THEN
    IF jsonb_typeof(p_payload->'prizes') = 'null' THEN
      DELETE FROM public.competition_prizes WHERE competition_id = p_competition_id;
    ELSIF jsonb_typeof(p_payload->'prizes') != 'array' THEN
      RAISE EXCEPTION 'prizes must be array';
    ELSE
      DELETE FROM public.competition_prizes WHERE competition_id = p_competition_id;
    END IF;
  END IF;

  -- Handle refund_configuration if present
  IF p_payload ? 'refund_configuration' THEN
    IF jsonb_typeof(p_payload->'refund_configuration') = 'null' THEN
      DELETE FROM public.competition_refund_configurations WHERE competition_id = p_competition_id;
    ELSIF jsonb_typeof(p_payload->'refund_configuration') != 'object' THEN
      RAISE EXCEPTION 'refund_configuration must be object';
    ELSE
      DELETE FROM public.competition_refund_configurations WHERE competition_id = p_competition_id;
    END IF;
  END IF;
"""

sql += """
  -- Postflight checks
  IF v_eff_is_public THEN
    IF v_eff_title IS NULL OR v_eff_slug IS NULL THEN
      RAISE EXCEPTION 'Title and Slug are required for public competitions';
    END IF;
  END IF;

END;
$$;

ALTER FUNCTION public.save_competition_workflow(uuid, jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.save_competition_workflow(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_competition_workflow(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_explore_by_month(
  p_start timestamptz,
  p_end timestamptz,
  p_limit integer
)
RETURNS SETOF public.competitions
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_start IS NULL OR p_end IS NULL THEN RAISE EXCEPTION 'Start and End are required'; END IF;
  IF p_start >= p_end THEN RAISE EXCEPTION 'Start must be before End'; END IF;
  IF p_limit IS NULL OR p_limit <= 0 THEN RAISE EXCEPTION 'Limit must be greater than 0'; END IF;

  RETURN QUERY
  SELECT *
  FROM public.competitions c
  WHERE c.starts_at >= p_start
    AND c.starts_at < p_end
    AND c.is_public = true
    AND c.published_at IS NOT NULL
    AND c.published_at <= now()
  ORDER BY c.starts_at ASC, c.id ASC
  LIMIT p_limit;
END;
$$;

ALTER FUNCTION public.get_explore_by_month(timestamptz, timestamptz, integer) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_explore_by_month(timestamptz, timestamptz, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_explore_by_month(timestamptz, timestamptz, integer) TO anon, authenticated;

COMMIT;
"""

os.makedirs("C:/Projects/ravenshawmoments/supabase/migrations", exist_ok=True)
with open("C:/Projects/ravenshawmoments/supabase/migrations/045_competition_atomic_save.sql", "w", encoding='utf-8') as f:
    f.write(sql)
