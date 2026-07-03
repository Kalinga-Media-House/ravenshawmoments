-- =============================================================================
-- Ravenshaw Moments
-- Migration : 001_database_foundation.sql
-- Version   : 1.0.0
-- Author    : Kalinga Media House
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS storage_helpers;

CREATE OR REPLACE FUNCTION app.utc_now()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
SELECT timezone('utc', now());
$$;

CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := app.utc_now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.slugify(input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE s text;
BEGIN
  s := lower(trim(input));
  s := regexp_replace(s,'[^a-z0-9]+','-','g');
  s := regexp_replace(s,'-+','-','g');
  s := trim(both '-' FROM s);
  RETURN s;
END;
$$;

CREATE OR REPLACE FUNCTION app.normalize_email(email text)
RETURNS citext
LANGUAGE sql
IMMUTABLE
AS $$
SELECT lower(trim(email))::citext;
$$;

CREATE OR REPLACE FUNCTION app.generate_public_id(prefix text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN upper(prefix)||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
END;
$$;

CREATE OR REPLACE FUNCTION app.clean_text(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
SELECT trim(regexp_replace(value,'\s+',' ','g'));
$$;

CREATE OR REPLACE FUNCTION app.is_valid_email(email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

CREATE OR REPLACE FUNCTION app.username_length_ok(username text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT length(username) BETWEEN 3 AND 40;
$$;

CREATE OR REPLACE FUNCTION app.password_length_ok(password text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT length(password) BETWEEN 8 AND 128;
$$;

CREATE OR REPLACE FUNCTION app.allowed_image_mime(mime text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT mime IN ('image/jpeg','image/png','image/webp','image/heif','image/heic');
$$;

CREATE OR REPLACE FUNCTION app.image_size_ok(size_bytes bigint)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT size_bytes <= 10485760;
$$;

COMMENT ON SCHEMA app IS 'Reusable helper functions';
COMMENT ON SCHEMA audit IS 'Audit schema';
COMMENT ON SCHEMA storage_helpers IS 'Storage helper schema';

COMMIT;
