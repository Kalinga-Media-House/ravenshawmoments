-- =============================================================================
-- Ravenshaw Moments
-- Migration : 050_fix_external_participant_trigger.sql
-- =============================================================================
-- PURPOSE
-- Fixes the handle_new_user() trigger to correctly map the frontend registration
-- value 'external_participant' (and legacy alias 'external') to the canonical
-- profile_type enum value 'external_participant'.
--
-- ROOT CAUSE
-- Migration 048 checked for role = 'external' but the frontend sends
-- 'external_participant'. This caused non-Ravenshaw signups to silently
-- receive profile_type = 'student' (the default fallback).
--
-- This migration is idempotent and safe for re-execution.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_full_name varchar(150);
    v_base_slug varchar(180);
    v_slug varchar(180);
    v_slug_counter integer := 1;
    v_email citext;
    v_profile_type public.profile_type;
    v_gender public.gender_type;
BEGIN
    -- Extract values from raw_user_meta_data safely
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User');
    v_email := NEW.email;
    
    -- Map profile type from frontend registration metadata
    -- The canonical enum value is 'external_participant'.
    -- Accept both 'external_participant' (current frontend) and 'external' (legacy alias).
    IF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
        v_profile_type := 'teacher';
    ELSIF NEW.raw_user_meta_data->>'role' = 'alumni' THEN
        v_profile_type := 'alumni';
    ELSIF NEW.raw_user_meta_data->>'role' = 'external_participant'
       OR NEW.raw_user_meta_data->>'role' = 'external' THEN
        v_profile_type := 'external_participant';
    ELSE
        v_profile_type := 'student';
    END IF;

    -- Map gender correctly
    IF NEW.raw_user_meta_data->>'gender' = 'male' THEN
        v_gender := 'male';
    ELSIF NEW.raw_user_meta_data->>'gender' = 'female' THEN
        v_gender := 'female';
    ELSIF NEW.raw_user_meta_data->>'gender' = 'other' THEN
        v_gender := 'other';
    ELSE
        v_gender := 'prefer_not_to_say';
    END IF;

    -- Generate a clean base slug from full_name
    v_base_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]+', '-', 'g'));
    v_base_slug := trim(both '-' from v_base_slug);
    IF v_base_slug = '' THEN
        v_base_slug := 'user';
    END IF;

    -- Ensure unique slug
    v_slug := v_base_slug;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = v_slug) LOOP
        v_slug := v_base_slug || '-' || v_slug_counter;
        v_slug_counter := v_slug_counter + 1;
    END LOOP;

    -- Insert the new profile
    INSERT INTO public.profiles (
        auth_user_id,
        full_name,
        email,
        slug,
        profile_type,
        gender
    ) VALUES (
        NEW.id,
        v_full_name,
        v_email,
        v_slug,
        v_profile_type,
        v_gender
    );

    RETURN NEW;
END;
$$;

-- Recreate the trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
