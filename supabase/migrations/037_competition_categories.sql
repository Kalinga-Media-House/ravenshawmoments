-- =============================================================================
-- Ravenshaw Moments
-- Migration : 037_competition_categories.sql
-- =============================================================================
-- PURPOSE
-- Centralized expansion of competition categories, matching the unified list
-- defined in the frontend. Uses ON CONFLICT DO NOTHING to preserve existing
-- categories (e.g., 'Culture', 'Debate') and prevent duplicate entries on retry.
-- =============================================================================

BEGIN;

INSERT INTO public.competition_categories (name)
VALUES
  ('Debate'),
  ('Quiz'),
  ('Essay Writing'),
  ('Creative Writing'),
  ('Short Story Writing'),
  ('Poetry'),
  ('Speech'),
  ('Extempore'),
  ('Elocution'),
  ('Public Speaking'),
  ('Anchoring'),
  ('Model United Nations (MUN)'),
  ('Painting'),
  ('Drawing'),
  ('Sketching'),
  ('Poster Making'),
  ('Digital Art'),
  ('Graphic Design'),
  ('Rangoli'),
  ('Photography'),
  ('Singing'),
  ('Instrumental Music'),
  ('Dance'),
  ('Theatre'),
  ('Mono Acting'),
  ('Stand-up Comedy'),
  ('Mimicry'),
  ('Coding'),
  ('Hackathon'),
  ('Web Development'),
  ('App Development'),
  ('UI/UX Design'),
  ('Science & Innovation'),
  ('Robotics'),
  ('Business Plan'),
  ('Entrepreneurship'),
  ('Film Making'),
  ('Short Film'),
  ('Videography'),
  ('Video Editing'),
  ('Reel Making'),
  ('Documentary'),
  ('Podcast'),
  ('General Knowledge'),
  ('Literature'),
  ('Culture & Heritage'),
  ('History'),
  ('Environment'),
  ('Social Awareness'),
  ('Sports'),
  ('Esports'),
  ('Chess')
ON CONFLICT (name) DO NOTHING;

COMMIT;
