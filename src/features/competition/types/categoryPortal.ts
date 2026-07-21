import { CompetitionLevel } from "./competition";

export interface CompetitionCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export type CompetitionDirectoryCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
};

export interface CategoryTheme {
  iconName: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  isDarkTheme?: boolean;
}

export interface CategoryActiveCompetition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  level: CompetitionLevel;
  statusLabel: "Registration Open" | "Upcoming" | "Registration Closed";
  registrationOpenAt: string | null;
  registrationCloseAt: string | null;
  competitionDate: string | null;
  venueOrMode: string;
  eligibilitySummary: string;
  feeLabel: string;
  isPaid: boolean;
  coverImage: string;
}

export interface CategoryWinnerPodium {
  resultId: string;
  outcome: "first" | "second" | "third";
  profileId: string | null;
  profileSlug: string | null;
  displayName: string;
  publicAffiliation: string;
  isExternal: boolean;
}

export interface CategoryWinnerCompetitionGroup {
  competitionId: string;
  competitionSlug: string;
  competitionTitle: string;
  competitionLevel: CanonicalCompetitionLevel;
  podium: CategoryWinnerPodium[];
}

export interface CategoryWinnerLevelGroup {
  level: CanonicalCompetitionLevel;
  competitions: CategoryWinnerCompetitionGroup[];
}

export interface CategoryWinnerEdition {
  editionYear: number;
  editionMonth: number;
  editionDate: string;
  levelGroups: CategoryWinnerLevelGroup[];
}

export type CanonicalCompetitionLevel =
  | "department"
  | "hostel"
  | "university"
  | "inter_university"
  | "district"
  | "state"
  | "national";

export interface CategoryWinnerArchiveFilters {
  year?: number;
  month?: number;
  level?: CanonicalCompetitionLevel;
  limit?: number;
  offset?: number;
}

export interface CategoryWinnerArchiveResponse {
  edition: CategoryWinnerEdition | null;
  requestedLimit: number;
  effectiveLimit: number;
  offset: number;
  returnedRowCount: number;
}

export interface PortalCategoryLeaderboardEntry {
  rank: number;
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
