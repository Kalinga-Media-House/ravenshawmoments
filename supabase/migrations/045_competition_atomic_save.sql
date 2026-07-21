-- 045_competition_atomic_save.sql
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
  
  v_allowed text[] := ARRAY['title', 'slug', 'category_id', 'short_description', 'description', 'rules', 'important_information', 'competition_level', 'competition_mode', 'min_team_size', 'max_team_size', 'starts_at', 'ends_at', 'registration_open_at', 'registration_close_at', 'registration_fee', 'registration_approval_mode', 'waitlist_enabled', 'participation_certificate_enabled', 'merit_certificate_enabled', 'winner_certificate_enabled', 'certificate_verification_enabled', 'certificate_delivery_method', 'featured_media_id', 'department_id', 'hostel_id', 'organization_id', 'venue_name', 'is_public', 'scheduled_publish_at', 'allow_team', 'eligible_participant_types', 'submission_requirements', 'refund_configuration', 'prizes', 'eligibility_configuration', 'external_participants_allowed', 'external_participation_level'];
  v_unknown text[];
  v_published_at timestamptz;
  v_eff_title text;
  v_eff_slug text;
  v_eff_category_id uuid;
  v_eff_short_description text;
  v_eff_description text;
  v_eff_rules text;
  v_eff_important_information jsonb;
  v_eff_competition_level public.competition_level;
  v_eff_competition_mode public.competition_mode;
  v_eff_min_team_size integer;
  v_eff_max_team_size integer;
  v_eff_starts_at timestamptz;
  v_eff_ends_at timestamptz;
  v_eff_registration_open_at timestamptz;
  v_eff_registration_close_at timestamptz;
  v_eff_registration_fee numeric;
  v_eff_registration_approval_mode text;
  v_eff_waitlist_enabled boolean;
  v_eff_participation_certificate_enabled boolean;
  v_eff_merit_certificate_enabled boolean;
  v_eff_winner_certificate_enabled boolean;
  v_eff_certificate_verification_enabled boolean;
  v_eff_certificate_delivery_method text;
  v_eff_featured_media_id uuid;
  v_eff_department_id uuid;
  v_eff_hostel_id uuid;
  v_eff_organization_id uuid;
  v_eff_venue_name text;
  v_eff_is_public boolean;
  v_eff_scheduled_publish_at timestamptz;
  v_eff_allow_team boolean;
  v_eff_eligible_participant_types jsonb;
  v_eff_submission_requirements jsonb;
  v_eff_eligibility_configuration jsonb;
  v_eff_external_participants_allowed boolean;
  v_eff_external_participation_level text;

BEGIN
  v_is_admin := public.is_competition_admin(p_competition_id);
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Forbidden: Must be competition admin.'; END IF;

  SELECT * INTO v_stored FROM public.competitions WHERE id = p_competition_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Competition not found.'; END IF;
  
  IF jsonb_typeof(p_payload) != 'object' THEN RAISE EXCEPTION 'Payload must be object.'; END IF;
  SELECT array_agg(k) INTO v_unknown FROM jsonb_object_keys(p_payload) k WHERE k != ALL(v_allowed);
  IF array_length(v_unknown, 1) > 0 THEN RAISE EXCEPTION 'Unknown fields rejected: %', v_unknown; END IF;

  IF p_payload ? 'title' THEN
    IF jsonb_typeof(p_payload->'title') = 'null' THEN
      RAISE EXCEPTION 'title cannot be null';
    ELSIF jsonb_typeof(p_payload->'title') != 'string' THEN
      RAISE EXCEPTION 'title must be string';
    ELSE
      v_eff_title := NULLIF(TRIM(p_payload->>'title'), '')::text;
    END IF;
  ELSE
    v_eff_title := v_stored.title;
  END IF;

  IF p_payload ? 'slug' THEN
    IF jsonb_typeof(p_payload->'slug') = 'null' THEN
      RAISE EXCEPTION 'slug cannot be null';
    ELSIF jsonb_typeof(p_payload->'slug') != 'string' THEN
      RAISE EXCEPTION 'slug must be string';
    ELSE
      v_eff_slug := NULLIF(TRIM(p_payload->>'slug'), '')::text;
    END IF;
  ELSE
    v_eff_slug := v_stored.slug;
  END IF;

  IF p_payload ? 'category_id' THEN
    IF jsonb_typeof(p_payload->'category_id') = 'null' THEN
      RAISE EXCEPTION 'category_id cannot be null';
    ELSIF jsonb_typeof(p_payload->'category_id') != 'string' THEN
      RAISE EXCEPTION 'category_id must be string';
    ELSE
      v_eff_category_id := NULLIF(TRIM(p_payload->>'category_id'), '')::uuid;
    END IF;
  ELSE
    v_eff_category_id := v_stored.category_id;
  END IF;

  IF p_payload ? 'short_description' THEN
    IF jsonb_typeof(p_payload->'short_description') = 'null' THEN
      v_eff_short_description := NULL;
    ELSIF jsonb_typeof(p_payload->'short_description') != 'string' THEN
      RAISE EXCEPTION 'short_description must be string';
    ELSE
      v_eff_short_description := NULLIF(TRIM(p_payload->>'short_description'), '')::text;
    END IF;
  ELSE
    v_eff_short_description := v_stored.short_description;
  END IF;

  IF p_payload ? 'description' THEN
    IF jsonb_typeof(p_payload->'description') = 'null' THEN
      v_eff_description := NULL;
    ELSIF jsonb_typeof(p_payload->'description') != 'string' THEN
      RAISE EXCEPTION 'description must be string';
    ELSE
      v_eff_description := NULLIF(TRIM(p_payload->>'description'), '')::text;
    END IF;
  ELSE
    v_eff_description := v_stored.description;
  END IF;

  IF p_payload ? 'rules' THEN
    IF jsonb_typeof(p_payload->'rules') = 'null' THEN
      v_eff_rules := NULL;
    ELSIF jsonb_typeof(p_payload->'rules') != 'string' THEN
      RAISE EXCEPTION 'rules must be string';
    ELSE
      v_eff_rules := NULLIF(TRIM(p_payload->>'rules'), '')::text;
    END IF;
  ELSE
    v_eff_rules := v_stored.rules;
  END IF;

  IF p_payload ? 'important_information' THEN
    IF jsonb_typeof(p_payload->'important_information') = 'null' THEN
      v_eff_important_information := NULL;
    ELSIF jsonb_typeof(p_payload->'important_information') != 'array' THEN
      RAISE EXCEPTION 'important_information must be array';
    ELSE
      v_eff_important_information := p_payload->'important_information';
    END IF;
  ELSE
    v_eff_important_information := v_stored.important_information;
  END IF;

  IF p_payload ? 'competition_level' THEN
    IF jsonb_typeof(p_payload->'competition_level') = 'null' THEN
      v_eff_competition_level := NULL;
    ELSIF jsonb_typeof(p_payload->'competition_level') != 'string' THEN
      RAISE EXCEPTION 'competition_level must be string';
    ELSE
      v_eff_competition_level := NULLIF(TRIM(p_payload->>'competition_level'), '')::public.competition_level;
    END IF;
  ELSE
    v_eff_competition_level := v_stored.competition_level;
  END IF;

  IF p_payload ? 'competition_mode' THEN
    IF jsonb_typeof(p_payload->'competition_mode') = 'null' THEN
      v_eff_competition_mode := NULL;
    ELSIF jsonb_typeof(p_payload->'competition_mode') != 'string' THEN
      RAISE EXCEPTION 'competition_mode must be string';
    ELSE
      v_eff_competition_mode := NULLIF(TRIM(p_payload->>'competition_mode'), '')::public.competition_mode;
    END IF;
  ELSE
    v_eff_competition_mode := v_stored.mode;
  END IF;

  IF p_payload ? 'min_team_size' THEN
    IF jsonb_typeof(p_payload->'min_team_size') = 'null' THEN
      v_eff_min_team_size := NULL;
    ELSIF jsonb_typeof(p_payload->'min_team_size') != 'number' THEN
      RAISE EXCEPTION 'min_team_size must be number';
    ELSE
      v_eff_min_team_size := public.validate_finite_numeric(p_payload->'min_team_size', 0, 999999999, 2)::integer;
    END IF;
  ELSE
    v_eff_min_team_size := v_stored.min_team_size;
  END IF;

  IF p_payload ? 'max_team_size' THEN
    IF jsonb_typeof(p_payload->'max_team_size') = 'null' THEN
      v_eff_max_team_size := NULL;
    ELSIF jsonb_typeof(p_payload->'max_team_size') != 'number' THEN
      RAISE EXCEPTION 'max_team_size must be number';
    ELSE
      v_eff_max_team_size := public.validate_finite_numeric(p_payload->'max_team_size', 0, 999999999, 2)::integer;
    END IF;
  ELSE
    v_eff_max_team_size := v_stored.max_team_size;
  END IF;

  IF p_payload ? 'starts_at' THEN
    IF jsonb_typeof(p_payload->'starts_at') = 'null' THEN
      v_eff_starts_at := NULL;
    ELSIF jsonb_typeof(p_payload->'starts_at') != 'string' THEN
      RAISE EXCEPTION 'starts_at must be string';
    ELSE
      v_eff_starts_at := NULLIF(TRIM(p_payload->>'starts_at'), '')::timestamptz;
    END IF;
  ELSE
    v_eff_starts_at := v_stored.starts_at;
  END IF;

  IF p_payload ? 'ends_at' THEN
    IF jsonb_typeof(p_payload->'ends_at') = 'null' THEN
      v_eff_ends_at := NULL;
    ELSIF jsonb_typeof(p_payload->'ends_at') != 'string' THEN
      RAISE EXCEPTION 'ends_at must be string';
    ELSE
      v_eff_ends_at := NULLIF(TRIM(p_payload->>'ends_at'), '')::timestamptz;
    END IF;
  ELSE
    v_eff_ends_at := v_stored.ends_at;
  END IF;

  IF p_payload ? 'registration_open_at' THEN
    IF jsonb_typeof(p_payload->'registration_open_at') = 'null' THEN
      v_eff_registration_open_at := NULL;
    ELSIF jsonb_typeof(p_payload->'registration_open_at') != 'string' THEN
      RAISE EXCEPTION 'registration_open_at must be string';
    ELSE
      v_eff_registration_open_at := NULLIF(TRIM(p_payload->>'registration_open_at'), '')::timestamptz;
    END IF;
  ELSE
    v_eff_registration_open_at := v_stored.registration_open_at;
  END IF;

  IF p_payload ? 'registration_close_at' THEN
    IF jsonb_typeof(p_payload->'registration_close_at') = 'null' THEN
      v_eff_registration_close_at := NULL;
    ELSIF jsonb_typeof(p_payload->'registration_close_at') != 'string' THEN
      RAISE EXCEPTION 'registration_close_at must be string';
    ELSE
      v_eff_registration_close_at := NULLIF(TRIM(p_payload->>'registration_close_at'), '')::timestamptz;
    END IF;
  ELSE
    v_eff_registration_close_at := v_stored.registration_close_at;
  END IF;

  IF p_payload ? 'registration_fee' THEN
    IF jsonb_typeof(p_payload->'registration_fee') = 'null' THEN
      v_eff_registration_fee := NULL;
    ELSIF jsonb_typeof(p_payload->'registration_fee') != 'number' THEN
      RAISE EXCEPTION 'registration_fee must be number';
    ELSE
      v_eff_registration_fee := public.validate_finite_numeric(p_payload->'registration_fee', 0, 999999999, 2)::numeric;
    END IF;
  ELSE
    v_eff_registration_fee := v_stored.registration_fee;
  END IF;

  IF p_payload ? 'registration_approval_mode' THEN
    IF jsonb_typeof(p_payload->'registration_approval_mode') = 'null' THEN
      v_eff_registration_approval_mode := NULL;
    ELSIF jsonb_typeof(p_payload->'registration_approval_mode') != 'string' THEN
      RAISE EXCEPTION 'registration_approval_mode must be string';
    ELSE
      v_eff_registration_approval_mode := NULLIF(TRIM(p_payload->>'registration_approval_mode'), '')::text;
    END IF;
  ELSE
    v_eff_registration_approval_mode := v_stored.registration_approval_mode;
  END IF;

  IF p_payload ? 'waitlist_enabled' THEN
    IF jsonb_typeof(p_payload->'waitlist_enabled') = 'null' THEN
      v_eff_waitlist_enabled := NULL;
    ELSIF jsonb_typeof(p_payload->'waitlist_enabled') != 'boolean' THEN
      RAISE EXCEPTION 'waitlist_enabled must be boolean';
    ELSE
      v_eff_waitlist_enabled := (p_payload->>'waitlist_enabled')::boolean;
    END IF;
  ELSE
    v_eff_waitlist_enabled := v_stored.waitlist_enabled;
  END IF;

  IF p_payload ? 'participation_certificate_enabled' THEN
    IF jsonb_typeof(p_payload->'participation_certificate_enabled') = 'null' THEN
      v_eff_participation_certificate_enabled := NULL;
    ELSIF jsonb_typeof(p_payload->'participation_certificate_enabled') != 'boolean' THEN
      RAISE EXCEPTION 'participation_certificate_enabled must be boolean';
    ELSE
      v_eff_participation_certificate_enabled := (p_payload->>'participation_certificate_enabled')::boolean;
    END IF;
  ELSE
    v_eff_participation_certificate_enabled := v_stored.participation_certificate_enabled;
  END IF;

  IF p_payload ? 'merit_certificate_enabled' THEN
    IF jsonb_typeof(p_payload->'merit_certificate_enabled') = 'null' THEN
      v_eff_merit_certificate_enabled := NULL;
    ELSIF jsonb_typeof(p_payload->'merit_certificate_enabled') != 'boolean' THEN
      RAISE EXCEPTION 'merit_certificate_enabled must be boolean';
    ELSE
      v_eff_merit_certificate_enabled := (p_payload->>'merit_certificate_enabled')::boolean;
    END IF;
  ELSE
    v_eff_merit_certificate_enabled := v_stored.merit_certificate_enabled;
  END IF;

  IF p_payload ? 'winner_certificate_enabled' THEN
    IF jsonb_typeof(p_payload->'winner_certificate_enabled') = 'null' THEN
      v_eff_winner_certificate_enabled := NULL;
    ELSIF jsonb_typeof(p_payload->'winner_certificate_enabled') != 'boolean' THEN
      RAISE EXCEPTION 'winner_certificate_enabled must be boolean';
    ELSE
      v_eff_winner_certificate_enabled := (p_payload->>'winner_certificate_enabled')::boolean;
    END IF;
  ELSE
    v_eff_winner_certificate_enabled := v_stored.winner_certificate_enabled;
  END IF;

  IF p_payload ? 'certificate_verification_enabled' THEN
    IF jsonb_typeof(p_payload->'certificate_verification_enabled') = 'null' THEN
      v_eff_certificate_verification_enabled := NULL;
    ELSIF jsonb_typeof(p_payload->'certificate_verification_enabled') != 'boolean' THEN
      RAISE EXCEPTION 'certificate_verification_enabled must be boolean';
    ELSE
      v_eff_certificate_verification_enabled := (p_payload->>'certificate_verification_enabled')::boolean;
    END IF;
  ELSE
    v_eff_certificate_verification_enabled := v_stored.certificate_verification_enabled;
  END IF;

  IF p_payload ? 'certificate_delivery_method' THEN
    IF jsonb_typeof(p_payload->'certificate_delivery_method') = 'null' THEN
      v_eff_certificate_delivery_method := NULL;
    ELSIF jsonb_typeof(p_payload->'certificate_delivery_method') != 'string' THEN
      RAISE EXCEPTION 'certificate_delivery_method must be string';
    ELSE
      v_eff_certificate_delivery_method := NULLIF(TRIM(p_payload->>'certificate_delivery_method'), '')::text;
    END IF;
  ELSE
    v_eff_certificate_delivery_method := v_stored.certificate_delivery_method;
  END IF;

  IF p_payload ? 'featured_media_id' THEN
    IF jsonb_typeof(p_payload->'featured_media_id') = 'null' THEN
      v_eff_featured_media_id := NULL;
    ELSIF jsonb_typeof(p_payload->'featured_media_id') != 'string' THEN
      RAISE EXCEPTION 'featured_media_id must be string';
    ELSE
      v_eff_featured_media_id := NULLIF(TRIM(p_payload->>'featured_media_id'), '')::uuid;
    END IF;
  ELSE
    v_eff_featured_media_id := v_stored.featured_media_id;
  END IF;

  IF p_payload ? 'department_id' THEN
    IF jsonb_typeof(p_payload->'department_id') = 'null' THEN
      v_eff_department_id := NULL;
    ELSIF jsonb_typeof(p_payload->'department_id') != 'string' THEN
      RAISE EXCEPTION 'department_id must be string';
    ELSE
      v_eff_department_id := NULLIF(TRIM(p_payload->>'department_id'), '')::uuid;
    END IF;
  ELSE
    v_eff_department_id := v_stored.department_id;
  END IF;

  IF p_payload ? 'hostel_id' THEN
    IF jsonb_typeof(p_payload->'hostel_id') = 'null' THEN
      v_eff_hostel_id := NULL;
    ELSIF jsonb_typeof(p_payload->'hostel_id') != 'string' THEN
      RAISE EXCEPTION 'hostel_id must be string';
    ELSE
      v_eff_hostel_id := NULLIF(TRIM(p_payload->>'hostel_id'), '')::uuid;
    END IF;
  ELSE
    v_eff_hostel_id := v_stored.hostel_id;
  END IF;

  IF p_payload ? 'organization_id' THEN
    IF jsonb_typeof(p_payload->'organization_id') = 'null' THEN
      v_eff_organization_id := NULL;
    ELSIF jsonb_typeof(p_payload->'organization_id') != 'string' THEN
      RAISE EXCEPTION 'organization_id must be string';
    ELSE
      v_eff_organization_id := NULLIF(TRIM(p_payload->>'organization_id'), '')::uuid;
    END IF;
  ELSE
    v_eff_organization_id := v_stored.organization_id;
  END IF;

  IF p_payload ? 'venue_name' THEN
    IF jsonb_typeof(p_payload->'venue_name') = 'null' THEN
      v_eff_venue_name := NULL;
    ELSIF jsonb_typeof(p_payload->'venue_name') != 'string' THEN
      RAISE EXCEPTION 'venue_name must be string';
    ELSE
      v_eff_venue_name := NULLIF(TRIM(p_payload->>'venue_name'), '')::text;
    END IF;
  ELSE
    v_eff_venue_name := v_stored.venue_name;
  END IF;

  IF p_payload ? 'is_public' THEN
    IF jsonb_typeof(p_payload->'is_public') = 'null' THEN
      RAISE EXCEPTION 'is_public cannot be null';
    ELSIF jsonb_typeof(p_payload->'is_public') != 'boolean' THEN
      RAISE EXCEPTION 'is_public must be boolean';
    ELSE
      v_eff_is_public := (p_payload->>'is_public')::boolean;
    END IF;
  ELSE
    v_eff_is_public := v_stored.is_public;
  END IF;

  IF p_payload ? 'scheduled_publish_at' THEN
    IF jsonb_typeof(p_payload->'scheduled_publish_at') = 'null' THEN
      v_eff_scheduled_publish_at := NULL;
    ELSIF jsonb_typeof(p_payload->'scheduled_publish_at') != 'string' THEN
      RAISE EXCEPTION 'scheduled_publish_at must be string';
    ELSE
      v_eff_scheduled_publish_at := NULLIF(TRIM(p_payload->>'scheduled_publish_at'), '')::timestamptz;
    END IF;
  ELSE
    v_eff_scheduled_publish_at := v_stored.scheduled_publish_at;
  END IF;

  IF p_payload ? 'allow_team' THEN
    IF jsonb_typeof(p_payload->'allow_team') = 'null' THEN
      v_eff_allow_team := NULL;
    ELSIF jsonb_typeof(p_payload->'allow_team') != 'boolean' THEN
      RAISE EXCEPTION 'allow_team must be boolean';
    ELSE
      v_eff_allow_team := (p_payload->>'allow_team')::boolean;
    END IF;
  ELSE
    v_eff_allow_team := v_stored.allow_team;
  END IF;

  IF p_payload ? 'eligible_participant_types' THEN
    IF jsonb_typeof(p_payload->'eligible_participant_types') = 'null' THEN
      v_eff_eligible_participant_types := NULL;
    ELSIF jsonb_typeof(p_payload->'eligible_participant_types') != 'array' THEN
      RAISE EXCEPTION 'eligible_participant_types must be array';
    ELSE
      v_eff_eligible_participant_types := p_payload->'eligible_participant_types';
    END IF;
  ELSE
    v_eff_eligible_participant_types := v_stored.eligible_participant_types;
  END IF;

  IF p_payload ? 'submission_requirements' THEN
    IF jsonb_typeof(p_payload->'submission_requirements') = 'null' THEN
      v_eff_submission_requirements := NULL;
    ELSIF jsonb_typeof(p_payload->'submission_requirements') != 'object' THEN
      RAISE EXCEPTION 'submission_requirements must be object';
    ELSE
      v_eff_submission_requirements := p_payload->'submission_requirements';
    END IF;
  ELSE
    v_eff_submission_requirements := v_stored.submission_requirements;
  END IF;

  IF p_payload ? 'eligibility_configuration' THEN
    IF jsonb_typeof(p_payload->'eligibility_configuration') = 'null' THEN
      v_eff_eligibility_configuration := NULL;
    ELSIF jsonb_typeof(p_payload->'eligibility_configuration') != 'object' THEN
      RAISE EXCEPTION 'eligibility_configuration must be object';
    ELSE
      v_eff_eligibility_configuration := p_payload->'eligibility_configuration';
    END IF;
  ELSE
    v_eff_eligibility_configuration := v_stored.eligibility_configuration;
  END IF;

  IF p_payload ? 'external_participants_allowed' THEN
    IF jsonb_typeof(p_payload->'external_participants_allowed') = 'null' THEN
      v_eff_external_participants_allowed := false;
    ELSIF jsonb_typeof(p_payload->'external_participants_allowed') != 'boolean' THEN
      RAISE EXCEPTION 'external_participants_allowed must be boolean';
    ELSE
      v_eff_external_participants_allowed := (p_payload->>'external_participants_allowed')::boolean;
    END IF;
  ELSE
    v_eff_external_participants_allowed := v_stored.external_participants_allowed;
  END IF;

  IF p_payload ? 'external_participation_level' THEN
    IF jsonb_typeof(p_payload->'external_participation_level') = 'null' THEN
      v_eff_external_participation_level := NULL;
    ELSIF jsonb_typeof(p_payload->'external_participation_level') != 'string' THEN
      RAISE EXCEPTION 'external_participation_level must be string';
    ELSE
      v_eff_external_participation_level := NULLIF(TRIM(p_payload->>'external_participation_level'), '')::text;
    END IF;
  ELSE
    v_eff_external_participation_level := v_stored.external_participation_level;
  END IF;

  -- Lifecycle logic
  IF v_eff_is_public THEN
    v_published_at := COALESCE(v_stored.published_at, now());
  ELSE
    v_published_at := NULL;
    v_eff_scheduled_publish_at := NULL;
  END IF;

  UPDATE public.competitions
  SET title = v_eff_title,
      slug = v_eff_slug,
      category_id = v_eff_category_id,
      short_description = v_eff_short_description,
      description = v_eff_description,
      rules = v_eff_rules,
      important_information = v_eff_important_information,
      competition_level = v_eff_competition_level,
      mode = v_eff_competition_mode,
      min_team_size = v_eff_min_team_size,
      max_team_size = v_eff_max_team_size,
      starts_at = v_eff_starts_at,
      ends_at = v_eff_ends_at,
      registration_open_at = v_eff_registration_open_at,
      registration_close_at = v_eff_registration_close_at,
      registration_fee = v_eff_registration_fee,
      registration_approval_mode = v_eff_registration_approval_mode,
      waitlist_enabled = v_eff_waitlist_enabled,
      participation_certificate_enabled = v_eff_participation_certificate_enabled,
      merit_certificate_enabled = v_eff_merit_certificate_enabled,
      winner_certificate_enabled = v_eff_winner_certificate_enabled,
      certificate_verification_enabled = v_eff_certificate_verification_enabled,
      certificate_delivery_method = v_eff_certificate_delivery_method,
      featured_media_id = v_eff_featured_media_id,
      department_id = v_eff_department_id,
      hostel_id = v_eff_hostel_id,
      organization_id = v_eff_organization_id,
      venue_name = v_eff_venue_name,
      is_public = v_eff_is_public,
      scheduled_publish_at = v_eff_scheduled_publish_at,
      allow_team = v_eff_allow_team,
      eligible_participant_types = v_eff_eligible_participant_types,
      submission_requirements = v_eff_submission_requirements,
      eligibility_configuration = v_eff_eligibility_configuration,
      external_participants_allowed = v_eff_external_participants_allowed,
      external_participation_level = v_eff_external_participation_level,
      published_at = v_published_at
  WHERE id = p_competition_id;

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
