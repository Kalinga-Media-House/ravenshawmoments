-- Migration: 029_master_data_seeder.sql
-- Purpose: Seeds official Ravenshaw University Master Data for Departments and Hostels.
-- Note: Uses idempotent UPSERTs and dynamic schema enhancements for metadata.

-- 1. Ensure metadata columns exist (Idempotent)
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS theme_color varchar(20);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS theme_color varchar(20);
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- 2. Upsert Departments
INSERT INTO public.departments (name, slug, description, theme_color, display_order)
VALUES 
  ('Botany', 'botany', 'The Department of Botany focuses on plant sciences, ecology, and biotechnology.', '#4CAF50', 10),
  ('Business Administration', 'business-administration', 'Empowering the next generation of business leaders and managers.', '#2196F3', 20),
  ('Chemistry', 'chemistry', 'A legacy of chemical research, organic synthesis, and analytical excellence.', '#9C27B0', 30),
  ('Commerce', 'commerce', 'Fostering excellence in trade, commerce, and financial studies.', '#FF9800', 40),
  ('Computer Application', 'computer-application', 'Innovating through applied computing, software development, and IT systems.', '#00BCD4', 50),
  ('Computer Science', 'computer-science', 'Advancing the frontiers of algorithms, AI, and computer systems.', '#3F51B5', 60),
  ('Economics', 'economics', 'Analyzing markets, policy, and economic growth patterns.', '#8BC34A', 70),
  ('Education', 'education', 'Shaping educators and pedagogical researchers for tomorrow.', '#FFEB3B', 80),
  ('English', 'english', 'A rich tradition of literature, linguistics, and cultural studies.', '#E91E63', 90),
  ('Geography', 'geography', 'Exploring physical landscapes and human geography.', '#795548', 100),
  ('Geology', 'geology', 'Unearthing the history of the earth, minerals, and resources.', '#607D8B', 110),
  ('Hindi', 'hindi', 'Promoting Hindi literature, poetry, and linguistic heritage.', '#F44336', 120),
  ('History', 'history', 'Preserving the past to understand the present and future.', '#795548', 130),
  ('Information Technology Management', 'information-technology-management', 'Bridging technology and business management strategies.', '#009688', 140),
  ('Journalism and Mass Communication', 'journalism-and-mass-communication', 'Training the voices and storytellers of the modern media era.', '#FF5722', 150),
  ('Mathematics', 'mathematics', 'The queen of sciences, focusing on pure and applied mathematical research.', '#3F51B5', 160),
  ('Odia', 'odia', 'Celebrating the rich cultural and literary heritage of Odisha.', '#FF9800', 170),
  ('Philosophy', 'philosophy', 'Exploring fundamental questions of existence, knowledge, and ethics.', '#9C27B0', 180),
  ('Physics', 'physics', 'Unlocking the laws of nature, from quantum mechanics to astrophysics.', '#2196F3', 190),
  ('Political Science', 'political-science', 'Analyzing governance, political behavior, and international relations.', '#F44336', 200),
  ('Psychology', 'psychology', 'Understanding the human mind, behavior, and cognitive processes.', '#E91E63', 210),
  ('Sanskrit', 'sanskrit', 'Studying ancient texts, philosophy, and classical linguistics.', '#FFC107', 220),
  ('Sociology', 'sociology', 'Examining social structures, relationships, and human societies.', '#8BC34A', 230),
  ('Statistics', 'statistics', 'The science of data collection, analysis, and interpretation.', '#00BCD4', 240),
  ('Zoology', 'zoology', 'Studying animal biology, evolution, and ecological conservation.', '#4CAF50', 250)
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    description = COALESCE(public.departments.description, EXCLUDED.description),
    theme_color = EXCLUDED.theme_color,
    display_order = EXCLUDED.display_order;

-- 3. Upsert Hostels
INSERT INTO public.hostels (name, hostel_type, slug, description, theme_color, display_order)
VALUES
  ('EAST HOSTEL', 'boys', 'east-hostel', 'Historic boys hostel known for its vibrant student culture.', '#2196F3', 10),
  ('WEST HOSTEL', 'boys', 'west-hostel', 'A legacy boys hostel fostering strong brotherhood.', '#3F51B5', 20),
  ('JC HOSTEL', 'boys', 'jc-hostel', 'Jagannath Chhatrabas - a hub of academic excellence.', '#00BCD4', 30),
  ('NEW HOSTEL', 'boys', 'new-hostel', 'Modern amenities for the growing student population.', '#4CAF50', 40),
  ('NEW PG HOSTEL', 'boys', 'new-pg-hostel', 'Dedicated accommodation for postgraduate scholars.', '#8BC34A', 50),
  ('DHARMAPADA HOSTEL', 'boys', 'dharmapada-hostel', 'Named after the legendary Odia architect Dharmapada.', '#FF9800', 60),
  ('LALITGIRI HOSTEL', 'boys', 'lalitgiri-hostel', 'Inspired by the ancient Buddhist heritage site.', '#795548', 70),
  
  ('Parija', 'girls', 'parija-hostel', 'Named after the eminent scientist Dr. Prana Krushna Parija.', '#E91E63', 80),
  ('Kathajodi', 'girls', 'kathajodi-hostel', 'A vibrant girls hostel named after the historic river.', '#9C27B0', 90),
  ('Bhargabi', 'girls', 'bhargabi-hostel', 'Fostering a nurturing and secure environment for women.', '#F44336', 100),
  ('Devi', 'girls', 'devi-hostel', 'Empowering female students through community and heritage.', '#FF5722', 110),
  ('Daya', 'girls', 'daya-hostel', 'A peaceful and academically enriching hostel space.', '#009688', 120),
  ('Mahanadi', 'girls', 'mahanadi-hostel', 'The largest girls hostel, representing the mighty river.', '#607D8B', 130)
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    hostel_type = EXCLUDED.hostel_type,
    description = COALESCE(public.hostels.description, EXCLUDED.description),
    theme_color = EXCLUDED.theme_color,
    display_order = EXCLUDED.display_order;
