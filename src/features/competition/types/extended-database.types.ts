export interface CompetitionTeam {
  id: string;
  competition_id: string;
  team_name: string;
  leader_profile_id: string;
  team_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CompetitionTeamMember {
  team_id: string;
  profile_id: string;
  role: 'leader' | 'member';
  joined_at: string;
}

export interface CompetitionJudge {
  id: string;
  competition_id: string;
  profile_id: string;
  assigned_by: string | null;
  assigned_at: string;
}

export interface CompetitionEvaluationCriteria {
  id: string;
  competition_id: string;
  name: string;
  description: string | null;
  max_score: number;
  weightage: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitionEvaluation {
  id: string;
  judge_id: string;
  registration_id: string | null;
  team_id: string | null;
  criteria_id: string;
  score: number;
  remarks: string | null;
  evaluated_at: string;
}

export interface CompetitionSponsor {
  id: string;
  competition_id: string;
  name: string;
  tier: 'title' | 'gold' | 'silver' | 'bronze' | 'partner';
  website: string | null;
  logo_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompetitionCertificate {
  id: string;
  competition_id: string;
  profile_id: string;
  certificate_type: string;
  file_path: string;
  issued_at: string;
}

export interface CompetitionAnnouncement {
  id: string;
  competition_id: string;
  title: string;
  content: string;
  published_by: string | null;
  published_at: string;
  updated_at: string;
}
