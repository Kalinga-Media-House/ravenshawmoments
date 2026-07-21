-- =============================================================================
-- Ravenshaw Moments
-- Migration : 064_seed_hostels.sql
-- Purpose   : Seed the 13 foundational hostels
-- =============================================================================

INSERT INTO public.hostels (name, slug, hostel_type, description, is_active, is_verified, is_sponsored, capacity)
VALUES 
-- Boys Hostels
('East Hostel', 'east-hostel', 'boys', 'One of the oldest and most prestigious boys hostels of Ravenshaw University.', true, true, false, 250),
('West Hostel', 'west-hostel', 'boys', 'A historic hostel known for its vibrant student culture.', true, true, false, 250),
('JC Hostel', 'jc-hostel', 'boys', 'Jagannath Chhatrabas (JC) Hostel providing excellent accommodation for UG and PG students.', true, true, false, 300),
('New Hostel', 'new-hostel', 'boys', 'A recently established boys hostel with modern amenities.', true, true, false, 400),
('New PG Hostel', 'new-pg-hostel', 'boys', 'Dedicated accommodation for Post Graduate male scholars.', true, true, false, 200),
('Dharmapada Hostel', 'dharmapada-hostel', 'boys', 'A boys hostel dedicated to academic excellence.', true, true, false, 250),
('Lalitgiri Hostel', 'lalitgiri-hostel', 'boys', 'Named after the famous Buddhist site, a serene boys hostel.', true, true, false, 300),

-- Girls Hostels
('Parija Hostel', 'parija-hostel', 'girls', 'Named after eminent scientist Pranakrushna Parija, a premier girls hostel.', true, true, false, 350),
('Kathajodi Hostel', 'kathajodi-hostel', 'girls', 'A vibrant girls hostel situated near the historic Kathajodi river.', true, true, false, 400),
('Bhargabi Hostel', 'bhargabi-hostel', 'girls', 'Dedicated girls hostel providing a safe and nurturing environment.', true, true, false, 300),
('Devi Hostel', 'devi-hostel', 'girls', 'A modern girls hostel with excellent facilities.', true, true, false, 350),
('Daya Hostel', 'daya-hostel', 'girls', 'Named after the Daya river, offering great accommodation for girls.', true, true, false, 250),
('Mahanadi Hostel', 'mahanadi-hostel', 'girls', 'A large and well-equipped girls hostel.', true, true, false, 500)

ON CONFLICT (slug) DO NOTHING;
