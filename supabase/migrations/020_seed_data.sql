-- =============================================================================
-- Ravenshaw Moments
-- Migration : 020_seed_data.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Initial master data for Ravenshaw Moments.
-- Safe to execute once on a fresh database.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Course Levels
-- ============================================================================
INSERT INTO public.course_levels
(code, display_name, duration_years)
VALUES
('plus_two','Higher Secondary',2),
('ug','Under Graduate',3),
('pg','Post Graduate',2),
('phd','Doctor of Philosophy',5)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Departments (25)
-- ============================================================================
INSERT INTO public.departments(name,slug,is_active)
VALUES
('Botany','botany',true),
('Business Administration','business-administration',true),
('Chemistry','chemistry',true),
('Commerce','commerce',true),
('Computer Application','computer-application',true),
('Computer Science','computer-science',true),
('Economics','economics',true),
('Education','education',true),
('English','english',true),
('Geography','geography',true),
('Geology','geology',true),
('Hindi','hindi',true),
('History','history',true),
('Information Technology Management','information-technology-management',true),
('Journalism and Mass Communication','journalism-and-mass-communication',true),
('Mathematics','mathematics',true),
('Odia','odia',true),
('Philosophy','philosophy',true),
('Physics','physics',true),
('Political Science','political-science',true),
('Psychology','psychology',true),
('Sanskrit','sanskrit',true),
('Sociology','sociology',true),
('Statistics','statistics',true),
('Zoology','zoology',true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Hostels
-- ============================================================================
INSERT INTO public.hostels(name,hostel_type,slug)
VALUES
('East Hostel','boys','east-hostel'),
('West Hostel','boys','west-hostel'),
('JC Hostel','boys','jc-hostel'),
('New Hostel','boys','new-hostel'),
('New PG Hostel','boys','new-pg-hostel'),
('Dharmapada Hostel','boys','dharmapada-hostel'),
('Lalitgiri Hostel','boys','lalitgiri-hostel'),
('Parija Hostel','girls','parija-hostel'),
('Kathajodi Hostel','girls','kathajodi-hostel'),
('Bhargabi Hostel','girls','bhargabi-hostel'),
('Devi Hostel','girls','devi-hostel'),
('Daya Hostel','girls','daya-hostel'),
('Mahanadi Hostel','girls','mahanadi-hostel')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Organizations
-- ============================================================================
INSERT INTO public.organizations(name,slug)
VALUES
('National Cadet Corps','ncc'),
('National Service Scheme','nss'),
('Youth Red Cross','youth-red-cross'),
('Ravenshaw Radio','ravenshaw-radio'),
('Ravenshaw Literary Society','ravenshaw-literary-society'),
('Ravenshaw Film Society','ravenshaw-film-society')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Leadership Roles
-- ============================================================================
INSERT INTO public.leadership_roles(name)
VALUES
('Department CR'),
('Department Admin'),
('Hostel BMC'),
('Hostel Admin'),
('Organization Coordinator'),
('Organization Secretary'),
('Volunteer')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Teacher Designations
-- ============================================================================
INSERT INTO public.teacher_designations(name)
VALUES
('Professor'),
('Associate Professor'),
('Assistant Professor'),
('Guest Faculty'),
('Visiting Faculty')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Competition Categories
-- ============================================================================
INSERT INTO public.competition_categories(name)
VALUES
('Photography'),
('Videography'),
('Graphic Design'),
('Video Editing'),
('Essay Writing'),
('Poetry'),
('Debate'),
('Quiz'),
('Coding'),
('Poster Making')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Achievement Categories
-- ============================================================================
INSERT INTO public.achievement_categories(name)
VALUES
('Academic'),
('Sports'),
('Cultural'),
('Research'),
('Placement'),
('Innovation'),
('Competition'),
('Community Service')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RBAC Roles
-- ============================================================================
INSERT INTO public.roles(code,name,is_system)
VALUES
('SUPER_ADMIN','Super Admin',true),
('ADMIN','Admin',true),
('DEPARTMENT_ADMIN','Department Admin',true),
('DEPARTMENT_CR','Department CR',true),
('HOSTEL_ADMIN','Hostel Admin',true),
('HOSTEL_BMC','Hostel BMC',true),
('TEACHER','Teacher',true),
('STUDENT','Student',true),
('ALUMNI','Alumni',true),
('EXTERNAL_PARTICIPANT','External Participant',true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Basic Permissions
-- ============================================================================
INSERT INTO public.permissions(module,action,code)
VALUES
('PROFILE','CREATE','PROFILE_CREATE'),
('PROFILE','EDIT','PROFILE_EDIT'),
('PROFILE','VERIFY','PROFILE_VERIFY'),
('CONTENT','CREATE','CONTENT_CREATE'),
('CONTENT','PUBLISH','CONTENT_PUBLISH'),
('COMPETITION','MANAGE','COMPETITION_MANAGE'),
('DONATION','MANAGE','DONATION_MANAGE'),
('CERTIFICATE','ISSUE','CERTIFICATE_ISSUE'),
('SYSTEM','MANAGE','SYSTEM_MANAGE')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Default System Settings
-- ============================================================================
INSERT INTO public.system_settings(setting_key,setting_value,description)
VALUES
('site_name','"Ravenshaw Moments"'::jsonb,'Application name'),
('maintenance_mode','false'::jsonb,'Maintenance mode'),
('allow_registration','true'::jsonb,'Enable self registration')
ON CONFLICT DO NOTHING;

COMMIT;
