// =============================================================================
// Ravenshaw Moments
// File      : src/features/competition/types/results.ts
// Purpose   : Strict TypeScript definitions for Universal Competition Results,
//             Judging, Leaderboards, Winners Gallery, and Champion Spotlight.
// =============================================================================

export type CompetitionPosition = "first" | "second" | "third" | "participant";

export type CompetitionParticipantOutcome =
  | "eligible"
  | "participated"
  | "first"
  | "second"
  | "third"
  | "disqualified"
  | "withdrawn"
  | "absent";

export type CompetitionResultStatus =
  | "draft"
  | "evaluated"
  | "finalized"
  | "published";

export interface CompetitionResultRecord {
  id: string;
  competition_id: string;
  registration_id: string;
  profile_id?: string | null;
  marks_obtained: number | null;
  maximum_marks: number;
  normalized_score: number | null;
  position: CompetitionPosition;
  outcome: CompetitionParticipantOutcome;
  result_status: CompetitionResultStatus;
  leaderboard_points: number;
  requires_tie_break: boolean;
  tie_break_score: number | null;
  tie_break_notes?: string | null;
  tie_resolved_by?: string | null;
  tie_resolved_at?: string | null;
  evaluated_by?: string | null;
  evaluated_at?: string | null;
  finalized_by?: string | null;
  finalized_at?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompetitionResultParticipant {
  resultId: string;
  registrationId: string;
  profileId: string;
  fullName: string;
  slug: string;
  departmentOrInstitution: string;
  marksObtained: number | null;
  maximumMarks: number;
  normalizedScore: number | null;
  rank: number | null;
  position: CompetitionPosition;
  outcome: CompetitionParticipantOutcome;
  resultStatus: CompetitionResultStatus;
  requiresTieBreak: boolean;
  tieBreakScore: number | null;
  remarks?: string | null;
}

export interface DraftMarksInput {
  registrationId: string;
  marksObtained: number;
  maximumMarks?: number;
  remarks?: string;
}

export interface ParticipantOutcomeInput {
  registrationId: string;
  outcome: "participated" | "disqualified" | "withdrawn" | "absent";
  reason?: string;
  notes?: string;
}

export interface ProvisionalRanking {
  resultId: string;
  registrationId: string;
  marksObtained: number | null;
  normalizedScore: number | null;
  rank: number | null;
  position: CompetitionPosition;
  outcome: CompetitionParticipantOutcome;
  requiresTieBreak: boolean;
}

export interface TieGroup {
  normalizedScore: number;
  participants: {
    resultId: string;
    registrationId: string;
    fullName: string;
    marksObtained: number | null;
    normalizedScore: number | null;
    tieBreakScore: number | null;
  }[];
}

export interface ResultFinalizationResponse {
  success: boolean;
  competitionId: string;
  finalizedCount: number;
  message: string;
}

export interface ResultPublicationResponse {
  success: boolean;
  competitionId: string;
  publishedCount: number;
  message: string;
}

export interface LeaderboardEntry {
  leaderboardRank: number;
  profileId: string;
  slug: string;
  fullName: string;
  avatarUrl: string | null;
  departmentOrInstitution: string;
  profileType: string;
  totalPoints: number;
  wins: number;
  secondPlace: number;
  thirdPlace: number;
  podiumFinishes: number;
  competitionsParticipated: number;
}

export interface WinnerGalleryEntry {
  resultId: string;
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  categoryName: string;
  competitionYear: number;
  profileId: string;
  slug: string;
  fullName: string;
  avatarUrl: string | null;
  departmentOrInstitution: string;
  marksObtained: number | null;
  publishedAt: string | null;
}

export interface ChampionSpotlightEntry {
  profileId: string;
  slug: string;
  fullName: string;
  avatarUrl: string | null;
  departmentOrInstitution: string;
  leaderboardRank: number;
  totalPoints: number;
  wins: number;
}

export interface CategoryLeaderboardEntry extends LeaderboardEntry {
  categoryId: string;
  categoryName?: string;
}

export interface MonthlyWinnerGroup {
  month: number;
  year: number;
  categoryName: string;
  winners: WinnerGalleryEntry[];
}
