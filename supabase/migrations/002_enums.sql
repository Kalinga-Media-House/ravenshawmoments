-- =============================================================================
-- Ravenshaw Moments
-- Migration : 002_enums.sql
-- Version   : 1.0.0
-- Author    : Kalinga Media House
-- =============================================================================
-- PURPOSE
-- Centralized PostgreSQL ENUM types used across the application.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Profile
-- -----------------------------------------------------------------------------
CREATE TYPE profile_type AS ENUM (
    'student',
    'teacher',
    'alumni',
    'external_participant',
    'admin',
    'super_admin'
);

CREATE TYPE profile_status AS ENUM (
    'unclaimed',
    'pending',
    'active',
    'suspended',
    'archived'
);

-- -----------------------------------------------------------------------------
-- Gender
-- -----------------------------------------------------------------------------
CREATE TYPE gender_type AS ENUM (
    'male',
    'female',
    'other',
    'prefer_not_to_say'
);

-- -----------------------------------------------------------------------------
-- Visibility
-- -----------------------------------------------------------------------------
CREATE TYPE visibility_type AS ENUM (
    'public',
    'ravenshaw_only',
    'private'
);

-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------
CREATE TYPE verification_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

-- -----------------------------------------------------------------------------
-- Hostel
-- -----------------------------------------------------------------------------
CREATE TYPE hostel_type AS ENUM (
    'boys',
    'girls'
);

-- -----------------------------------------------------------------------------
-- Course
-- -----------------------------------------------------------------------------
CREATE TYPE course_level_type AS ENUM (
    'plus_two',
    'ug',
    'pg',
    'phd'
);

CREATE TYPE academic_status AS ENUM (
    'studying',
    'completed',
    'discontinued'
);

-- -----------------------------------------------------------------------------
-- Content
-- -----------------------------------------------------------------------------
CREATE TYPE content_type AS ENUM (
    'news',
    'event',
    'announcement',
    'annual_function',
    'voice_of_ravenshaw',
    'blog'
);

-- -----------------------------------------------------------------------------
-- Entity
-- -----------------------------------------------------------------------------
CREATE TYPE entity_type AS ENUM (
    'university',
    'department',
    'hostel',
    'organization',
    'profile',
    'competition',
    'campaign',
    'gallery_album',
    'content'
);

-- -----------------------------------------------------------------------------
-- Competition
-- -----------------------------------------------------------------------------
CREATE TYPE competition_status AS ENUM (
    'draft',
    'registration_open',
    'registration_closed',
    'submission_open',
    'submission_closed',
    'judging',
    'completed',
    'cancelled'
);

CREATE TYPE registration_status AS ENUM (
    'pending_payment',
    'registered',
    'submitted',
    'withdrawn',
    'disqualified'
);

-- -----------------------------------------------------------------------------
-- Payment
-- -----------------------------------------------------------------------------
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'paid',
    'failed',
    'cancelled',
    'refunded'
);

CREATE TYPE payment_provider AS ENUM (
    'razorpay',
    'cashfree',
    'phonepe',
    'stripe',
    'manual'
);

-- -----------------------------------------------------------------------------
-- Certificates
-- -----------------------------------------------------------------------------
CREATE TYPE certificate_type AS ENUM (
    'winner',
    'runner_up',
    'second_runner_up',
    'participation',
    'appreciation',
    'volunteer',
    'organizer',
    'judge',
    'speaker',
    'special_recognition'
);

-- -----------------------------------------------------------------------------
-- Donations
-- -----------------------------------------------------------------------------
CREATE TYPE donation_visibility AS ENUM (
    'public',
    'public_hide_amount',
    'anonymous'
);

-- -----------------------------------------------------------------------------
-- Media
-- -----------------------------------------------------------------------------
CREATE TYPE media_type AS ENUM (
    'image',
    'video',
    'document'
);

-- -----------------------------------------------------------------------------
-- Approval
-- -----------------------------------------------------------------------------
CREATE TYPE approval_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

-- -----------------------------------------------------------------------------
-- Reactions
-- -----------------------------------------------------------------------------
CREATE TYPE reaction_type AS ENUM (
    'like',
    'love',
    'celebrate',
    'support'
);

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------
CREATE TYPE notification_type AS ENUM (
    'system',
    'competition',
    'verification',
    'achievement',
    'donation',
    'general'
);

COMMIT;
