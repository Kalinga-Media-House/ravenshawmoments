v_eff_title text;
v_eff_slug text;
v_eff_category_id uuid;
v_eff_short_description text;
v_eff_description text;
v_eff_rules text;
v_eff_important_information jsonb;
v_eff_competition_level text;
v_eff_competition_mode text;
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
v_eff_venue_url text;
v_eff_venue_address text;
v_eff_contact_email text;
v_eff_contact_phone text;
v_eff_contact_website text;
v_eff_social_links jsonb;
v_eff_tags jsonb;
v_eff_is_public boolean;
v_eff_scheduled_publish_at timestamptz;
v_eff_allow_team boolean;
v_eff_eligible_participant_types jsonb;
v_eff_submission_requirements jsonb;
v_eff_eligibility_configuration jsonb;


  IF p_payload ? 'title' THEN
    IF jsonb_typeof(p_payload->'title') = 'null' THEN
      RAISE EXCEPTION 'title cannot be null';
    ELSIF jsonb_typeof(p_payload->'title') != 'string' THEN
      RAISE EXCEPTION 'title must be string';
    ELSE
      v_eff_title := NULLIF(TRIM(p_payload->>'title'), '');
      
      -- cast string appropriately
      v_eff_title := v_eff_title::text;
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
      v_eff_slug := NULLIF(TRIM(p_payload->>'slug'), '');
      
      -- cast string appropriately
      v_eff_slug := v_eff_slug::text;
    END IF;
  ELSE
    v_eff_slug := v_stored.slug;
  END IF;
        

  IF p_payload ? 'category_id' THEN
    IF jsonb_typeof(p_payload->'category_id') = 'null' THEN
      v_eff_category_id := NULL;
    ELSIF jsonb_typeof(p_payload->'category_id') != 'string' THEN
      RAISE EXCEPTION 'category_id must be string';
    ELSE
      v_eff_category_id := NULLIF(TRIM(p_payload->>'category_id'), '');
      
      -- cast string appropriately
      v_eff_category_id := v_eff_category_id::uuid;
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
      v_eff_short_description := NULLIF(TRIM(p_payload->>'short_description'), '');
      
      -- cast string appropriately
      v_eff_short_description := v_eff_short_description::text;
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
      v_eff_description := NULLIF(TRIM(p_payload->>'description'), '');
      
      -- cast string appropriately
      v_eff_description := v_eff_description::text;
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
      v_eff_rules := NULLIF(TRIM(p_payload->>'rules'), '');
      
      -- cast string appropriately
      v_eff_rules := v_eff_rules::text;
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
      v_eff_competition_level := NULLIF(TRIM(p_payload->>'competition_level'), '');
      
      -- cast string appropriately
      v_eff_competition_level := v_eff_competition_level::text;
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
      v_eff_competition_mode := NULLIF(TRIM(p_payload->>'competition_mode'), '');
      
      -- cast string appropriately
      v_eff_competition_mode := v_eff_competition_mode::text;
    END IF;
  ELSE
    v_eff_competition_mode := v_stored.competition_mode;
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
      v_eff_starts_at := NULLIF(TRIM(p_payload->>'starts_at'), '');
      
      -- cast string appropriately
      v_eff_starts_at := v_eff_starts_at::timestamptz;
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
      v_eff_ends_at := NULLIF(TRIM(p_payload->>'ends_at'), '');
      
      -- cast string appropriately
      v_eff_ends_at := v_eff_ends_at::timestamptz;
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
      v_eff_registration_open_at := NULLIF(TRIM(p_payload->>'registration_open_at'), '');
      
      -- cast string appropriately
      v_eff_registration_open_at := v_eff_registration_open_at::timestamptz;
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
      v_eff_registration_close_at := NULLIF(TRIM(p_payload->>'registration_close_at'), '');
      
      -- cast string appropriately
      v_eff_registration_close_at := v_eff_registration_close_at::timestamptz;
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
      v_eff_registration_approval_mode := NULLIF(TRIM(p_payload->>'registration_approval_mode'), '');
      
      -- cast string appropriately
      v_eff_registration_approval_mode := v_eff_registration_approval_mode::text;
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
      v_eff_certificate_delivery_method := NULLIF(TRIM(p_payload->>'certificate_delivery_method'), '');
      
      -- cast string appropriately
      v_eff_certificate_delivery_method := v_eff_certificate_delivery_method::text;
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
      v_eff_featured_media_id := NULLIF(TRIM(p_payload->>'featured_media_id'), '');
      
      -- cast string appropriately
      v_eff_featured_media_id := v_eff_featured_media_id::uuid;
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
      v_eff_department_id := NULLIF(TRIM(p_payload->>'department_id'), '');
      
      -- cast string appropriately
      v_eff_department_id := v_eff_department_id::uuid;
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
      v_eff_hostel_id := NULLIF(TRIM(p_payload->>'hostel_id'), '');
      
      -- cast string appropriately
      v_eff_hostel_id := v_eff_hostel_id::uuid;
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
      v_eff_organization_id := NULLIF(TRIM(p_payload->>'organization_id'), '');
      
      -- cast string appropriately
      v_eff_organization_id := v_eff_organization_id::uuid;
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
      v_eff_venue_name := NULLIF(TRIM(p_payload->>'venue_name'), '');
      
      -- cast string appropriately
      v_eff_venue_name := v_eff_venue_name::text;
    END IF;
  ELSE
    v_eff_venue_name := v_stored.venue_name;
  END IF;
        

  IF p_payload ? 'venue_url' THEN
    IF jsonb_typeof(p_payload->'venue_url') = 'null' THEN
      v_eff_venue_url := NULL;
    ELSIF jsonb_typeof(p_payload->'venue_url') != 'string' THEN
      RAISE EXCEPTION 'venue_url must be string';
    ELSE
      v_eff_venue_url := NULLIF(TRIM(p_payload->>'venue_url'), '');
      
      -- cast string appropriately
      v_eff_venue_url := v_eff_venue_url::text;
    END IF;
  ELSE
    v_eff_venue_url := v_stored.venue_url;
  END IF;
        

  IF p_payload ? 'venue_address' THEN
    IF jsonb_typeof(p_payload->'venue_address') = 'null' THEN
      v_eff_venue_address := NULL;
    ELSIF jsonb_typeof(p_payload->'venue_address') != 'string' THEN
      RAISE EXCEPTION 'venue_address must be string';
    ELSE
      v_eff_venue_address := NULLIF(TRIM(p_payload->>'venue_address'), '');
      
      -- cast string appropriately
      v_eff_venue_address := v_eff_venue_address::text;
    END IF;
  ELSE
    v_eff_venue_address := v_stored.venue_address;
  END IF;
        

  IF p_payload ? 'contact_email' THEN
    IF jsonb_typeof(p_payload->'contact_email') = 'null' THEN
      v_eff_contact_email := NULL;
    ELSIF jsonb_typeof(p_payload->'contact_email') != 'string' THEN
      RAISE EXCEPTION 'contact_email must be string';
    ELSE
      v_eff_contact_email := NULLIF(TRIM(p_payload->>'contact_email'), '');
      
      -- cast string appropriately
      v_eff_contact_email := v_eff_contact_email::text;
    END IF;
  ELSE
    v_eff_contact_email := v_stored.contact_email;
  END IF;
        

  IF p_payload ? 'contact_phone' THEN
    IF jsonb_typeof(p_payload->'contact_phone') = 'null' THEN
      v_eff_contact_phone := NULL;
    ELSIF jsonb_typeof(p_payload->'contact_phone') != 'string' THEN
      RAISE EXCEPTION 'contact_phone must be string';
    ELSE
      v_eff_contact_phone := NULLIF(TRIM(p_payload->>'contact_phone'), '');
      
      -- cast string appropriately
      v_eff_contact_phone := v_eff_contact_phone::text;
    END IF;
  ELSE
    v_eff_contact_phone := v_stored.contact_phone;
  END IF;
        

  IF p_payload ? 'contact_website' THEN
    IF jsonb_typeof(p_payload->'contact_website') = 'null' THEN
      v_eff_contact_website := NULL;
    ELSIF jsonb_typeof(p_payload->'contact_website') != 'string' THEN
      RAISE EXCEPTION 'contact_website must be string';
    ELSE
      v_eff_contact_website := NULLIF(TRIM(p_payload->>'contact_website'), '');
      
      -- cast string appropriately
      v_eff_contact_website := v_eff_contact_website::text;
    END IF;
  ELSE
    v_eff_contact_website := v_stored.contact_website;
  END IF;
        

  IF p_payload ? 'social_links' THEN
    IF jsonb_typeof(p_payload->'social_links') = 'null' THEN
      v_eff_social_links := NULL;
    ELSIF jsonb_typeof(p_payload->'social_links') != 'array' THEN
      RAISE EXCEPTION 'social_links must be array';
    ELSE
      v_eff_social_links := p_payload->'social_links';
    END IF;
  ELSE
    v_eff_social_links := v_stored.social_links;
  END IF;
        

  IF p_payload ? 'tags' THEN
    IF jsonb_typeof(p_payload->'tags') = 'null' THEN
      v_eff_tags := NULL;
    ELSIF jsonb_typeof(p_payload->'tags') != 'array' THEN
      RAISE EXCEPTION 'tags must be array';
    ELSE
      v_eff_tags := p_payload->'tags';
    END IF;
  ELSE
    v_eff_tags := v_stored.tags;
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
      v_eff_scheduled_publish_at := NULLIF(TRIM(p_payload->>'scheduled_publish_at'), '');
      
      -- cast string appropriately
      v_eff_scheduled_publish_at := v_eff_scheduled_publish_at::timestamptz;
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
        