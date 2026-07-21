-- =============================================================================
-- Ravenshaw Moments
-- Migration : 062_competition_judging_and_teams.sql
-- Version   : 2.0.0 (Enterprise)
-- =============================================================================
-- PURPOSE
-- Competition Judging, Teams, Sponsors, Certificates, Announcements
-- =============================================================================

BEGIN;

-- 2. Teams
CREATE TABLE IF NOT EXISTS public.competition_teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_name varchar(250) NOT NULL,
    leader_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_status text NOT NULL DEFAULT 'pending' CHECK (team_status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(competition_id, team_name)
);

DROP TABLE IF EXISTS public.competition_team_members CASCADE;
CREATE TABLE public.competition_team_members (
    team_id uuid NOT NULL REFERENCES public.competition_teams(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (team_id, profile_id)
);

-- Note: We add team_id to competition_registrations if they register as a team
ALTER TABLE public.competition_registrations
ADD COLUMN team_id uuid REFERENCES public.competition_teams(id) ON DELETE SET NULL;

-- 3. Judges
CREATE TABLE IF NOT EXISTS public.competition_judges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(competition_id, profile_id)
);

-- 4. Evaluation Criteria
CREATE TABLE IF NOT EXISTS public.competition_evaluation_criteria (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    name varchar(250) NOT NULL,
    description text,
    max_score integer NOT NULL DEFAULT 10,
    weightage numeric(5,2) NOT NULL DEFAULT 1.00,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Evaluations (Scores)
CREATE TABLE IF NOT EXISTS public.competition_evaluations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id uuid NOT NULL REFERENCES public.competition_judges(id) ON DELETE CASCADE,
    registration_id uuid REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
    team_id uuid REFERENCES public.competition_teams(id) ON DELETE CASCADE,
    criteria_id uuid NOT NULL REFERENCES public.competition_evaluation_criteria(id) ON DELETE CASCADE,
    score numeric(5,2) NOT NULL,
    remarks text,
    evaluated_at timestamptz NOT NULL DEFAULT now(),
    -- Can either evaluate a registration (individual) or a team, not both
    CHECK ((registration_id IS NOT NULL AND team_id IS NULL) OR (registration_id IS NULL AND team_id IS NOT NULL)),
    UNIQUE(judge_id, registration_id, criteria_id),
    UNIQUE(judge_id, team_id, criteria_id)
);

-- 6. Sponsors
CREATE TABLE IF NOT EXISTS public.competition_sponsors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    name varchar(250) NOT NULL,
    tier text NOT NULL DEFAULT 'partner' CHECK (tier IN ('title', 'gold', 'silver', 'bronze', 'partner')),
    website text,
    logo_path text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Certificates
CREATE TABLE IF NOT EXISTS public.competition_certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    certificate_type text NOT NULL, -- 'winner', 'participant', 'judge', etc.
    file_path text NOT NULL,
    issued_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(competition_id, profile_id, certificate_type)
);

-- 8. Announcements
CREATE TABLE IF NOT EXISTS public.competition_announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    title varchar(250) NOT NULL,
    content text NOT NULL,
    published_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Triggers for updated_at
CREATE TRIGGER handle_updated_at_competition_teams
    BEFORE UPDATE ON public.competition_teams
    FOR EACH ROW
    EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER handle_updated_at_competition_evaluation_criteria
    BEFORE UPDATE ON public.competition_evaluation_criteria
    FOR EACH ROW
    EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER handle_updated_at_competition_sponsors
    BEFORE UPDATE ON public.competition_sponsors
    FOR EACH ROW
    EXECUTE FUNCTION app.set_updated_at();

CREATE TRIGGER handle_updated_at_competition_announcements
    BEFORE UPDATE ON public.competition_announcements
    FOR EACH ROW
    EXECUTE FUNCTION app.set_updated_at();

-- 10. RLS Policies
ALTER TABLE public.competition_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_announcements ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Public Read competition_teams" ON public.competition_teams FOR SELECT USING (true);
CREATE POLICY "Public Read competition_team_members" ON public.competition_team_members FOR SELECT USING (true);
CREATE POLICY "Public Read competition_sponsors" ON public.competition_sponsors FOR SELECT USING (true);
CREATE POLICY "Public Read competition_announcements" ON public.competition_announcements FOR SELECT USING (true);

-- Allow Admin All
CREATE POLICY "Admin All competition_teams" ON public.competition_teams FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_team_members" ON public.competition_team_members FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_judges" ON public.competition_judges FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_evaluation_criteria" ON public.competition_evaluation_criteria FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_evaluations" ON public.competition_evaluations FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_sponsors" ON public.competition_sponsors FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_certificates" ON public.competition_certificates FOR ALL USING (app.is_admin_or_super());
CREATE POLICY "Admin All competition_announcements" ON public.competition_announcements FOR ALL USING (app.is_admin_or_super());

-- Allow Participant Insert (Team Leaders)
CREATE POLICY "Participant Insert Team" ON public.competition_teams FOR INSERT WITH CHECK (auth.uid() = leader_profile_id);
CREATE POLICY "Participant Update Team" ON public.competition_teams FOR UPDATE USING (auth.uid() = leader_profile_id);
CREATE POLICY "Participant Insert Team Member" ON public.competition_team_members FOR INSERT WITH CHECK (auth.uid() IN (SELECT leader_profile_id FROM public.competition_teams WHERE id = competition_team_members.team_id));

-- Allow Judge Read/Insert Evaluations
CREATE POLICY "Judge Select Evaluations" ON public.competition_evaluations FOR SELECT USING (judge_id IN (SELECT id FROM public.competition_judges WHERE profile_id = auth.uid()) OR app.is_admin_or_super());
CREATE POLICY "Judge Insert Evaluations" ON public.competition_evaluations FOR INSERT WITH CHECK (judge_id IN (SELECT id FROM public.competition_judges WHERE profile_id = auth.uid()));
CREATE POLICY "Judge Update Evaluations" ON public.competition_evaluations FOR UPDATE USING (judge_id IN (SELECT id FROM public.competition_judges WHERE profile_id = auth.uid()));

-- Allow Profile Owner Read Certificates
CREATE POLICY "Owner Read Certificates" ON public.competition_certificates FOR SELECT USING (profile_id = auth.uid());

COMMIT;
