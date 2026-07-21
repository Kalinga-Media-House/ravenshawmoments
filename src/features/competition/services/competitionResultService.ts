// =============================================================================
// Ravenshaw Moments
// File      : src/features/competition/services/competitionResultService.ts
// Purpose   : Production-Ready Service Layer for Universal Competition Results,
//             Ranking, Tie Resolution, Publication, and Public Data Access.
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { competitionResultsRepository } from "../repositories/competitionResultsRepository";
import {
  CompetitionResultParticipant,
  ProvisionalRanking,
  TieGroup,
  LeaderboardEntry,
  ChampionSpotlightEntry,
  WinnerGalleryEntry,
  CompetitionParticipantOutcome,
} from "../types/results";
import { logger } from "@/lib/logger";

export class CompetitionResultService {
  /**
   * Saves draft marks for a participant after validating constraints.
   */
  async saveDraftMarks(
    competitionId: string,
    registrationId: string,
    profileId: string | null,
    marksObtained: number,
    maximumMarks: number = 100,
    remarks?: string,
    evaluatorId: string = ""
  ): Promise<void> {
    if (marksObtained < 0) {
      throw new Error("VALIDATION_ERROR: Marks obtained cannot be negative.");
    }
    if (maximumMarks <= 0) {
      throw new Error("VALIDATION_ERROR: Maximum marks must be greater than zero.");
    }
    if (marksObtained > maximumMarks) {
      throw new Error("VALIDATION_ERROR: Marks obtained cannot exceed maximum marks.");
    }

    const supabase = await createClient();

    // Verify competition exists
    // @ts-ignore
    const comp = await competitionResultsRepository.getCompetitionById(competitionId, supabase);
    if (!comp) {
      throw new Error("COMPETITION_NOT_FOUND: Specified competition does not exist.");
    }

    await competitionResultsRepository.saveDraftParticipantMarks(
      competitionId,
      registrationId,
      profileId,
      marksObtained,
      maximumMarks,
      evaluatorId,
      // @ts-ignore
      supabase
    );

    logger.info(`Draft marks saved for registration ${registrationId} in competition ${competitionId}`);
  }

  /**
   * Saves draft marks for multiple participants atomically in one database transaction.
   */
  async saveBulkDraftMarks(
    competitionId: string,
    entries: {
      registrationId: string;
      profileId: string | null;
      marksObtained: number;
      maximumMarks: number;
      remarks?: string;
    }[],
    evaluatorId: string = ""
  ): Promise<void> {
    if (!entries || entries.length === 0) return;

    for (const entry of entries) {
      if (entry.marksObtained < 0) {
        throw new Error("VALIDATION_ERROR: Marks obtained cannot be negative.");
      }
      if (entry.maximumMarks <= 0) {
        throw new Error("VALIDATION_ERROR: Maximum marks must be greater than zero.");
      }
      if (entry.marksObtained > entry.maximumMarks) {
        throw new Error("VALIDATION_ERROR: Marks obtained cannot exceed maximum marks.");
      }
    }

    const supabase = await createClient();

    // Verify competition exists
    // @ts-ignore
    const comp = await competitionResultsRepository.getCompetitionById(competitionId, supabase);
    if (!comp) {
      throw new Error("COMPETITION_NOT_FOUND: Specified competition does not exist.");
    }

    await competitionResultsRepository.saveBulkDraftParticipantMarks(
      competitionId,
      entries,
      evaluatorId,
      // @ts-ignore
      supabase
    );

    logger.info(`Bulk draft marks saved for ${entries.length} participants in competition ${competitionId}`);
  }

  /**
   * Updates operational outcome for a participant.
   */
  async updateParticipantOutcome(
    competitionId: string,
    registrationId: string,
    outcome: CompetitionParticipantOutcome,
    reason?: string,
    notes?: string,
    evaluatorId: string = ""
  ): Promise<void> {
    const supabase = await createClient();
    await competitionResultsRepository.updateParticipantOutcome(
      competitionId,
      registrationId,
      outcome,
      reason,
      notes,
      evaluatorId,
      // @ts-ignore
      supabase
    );

    logger.info(`Participant outcome updated to ${outcome} for registration ${registrationId}`);
  }

  /**
   * Calculates provisional rankings deterministically.
   */
  async calculateProvisionalResults(competitionId: string): Promise<ProvisionalRanking[]> {
    const supabase = await createClient();
    // @ts-ignore
    return await competitionResultsRepository.calculateProvisionalRankings(competitionId, supabase);
  }

  /**
   * Returns current provisional rankings.
   */
  async getProvisionalRanking(competitionId: string): Promise<CompetitionResultParticipant[]> {
    const supabase = await createClient();
    // @ts-ignore
    return await competitionResultsRepository.getExistingResultRecords(competitionId, supabase);
  }

  /**
   * Retrieves any top-three ties that require resolution.
   */
  async getUnresolvedTies(competitionId: string): Promise<TieGroup[]> {
    const supabase = await createClient();
    // @ts-ignore
    const rows = await competitionResultsRepository.getUnresolvedTies(competitionId, supabase);

    const groupMap = new Map<number, any[]>();
    for (const row of rows) {
      const score = Number(row.normalized_score || 0);
      if (!groupMap.has(score)) {
        groupMap.set(score, []);
      }
      groupMap.get(score)!.push({
        resultId: row.id,
        registrationId: row.registration_id,
        fullName: (row.competition_registrations as any)?.profiles?.full_name || "Participant",
        marksObtained: row.marks_obtained !== null ? Number(row.marks_obtained) : null,
        normalizedScore: row.normalized_score !== null ? Number(row.normalized_score) : null,
        tieBreakScore: row.tie_break_score !== null ? Number(row.tie_break_score) : null,
      });
    }

    const tieGroups: TieGroup[] = [];
    groupMap.forEach((participants, normalizedScore) => {
      tieGroups.push({ normalizedScore, participants });
    });

    return tieGroups;
  }

  /**
   * Resolves a top-three tie.
   */
  async resolveTie(
    competitionId: string,
    registrationId: string,
    tieBreakScore: number,
    notes?: string
  ): Promise<boolean> {
    const supabase = await createClient();
    return await competitionResultsRepository.resolveTie(
      competitionId,
      registrationId,
      tieBreakScore,
      notes,
      // @ts-ignore
      supabase
    );
  }

  /**
   * Finalizes competition results.
   */
  async finalizeCompetitionResults(competitionId: string, finalizerId: string): Promise<number> {
    const supabase = await createClient();

    // Verify no unresolved ties remain before finalizing
    // @ts-ignore
    const unresolved = await competitionResultsRepository.getUnresolvedTies(competitionId, supabase);
    if (unresolved.length > 0) {
      throw new Error("UNRESOLVED_TIE: Cannot finalize results with unresolved top-three ties.");
    }

    return await competitionResultsRepository.finalizeCompetitionResults(
      competitionId,
      finalizerId,
      // @ts-ignore
      supabase
    );
  }

  /**
   * Publishes competition results and awards idempotent point ledger entries.
   */
  async publishCompetitionResults(competitionId: string): Promise<boolean> {
    const supabase = await createClient();

    // @ts-ignore
    const unresolved = await competitionResultsRepository.getUnresolvedTies(competitionId, supabase);
    if (unresolved.length > 0) {
      throw new Error("UNRESOLVED_TIE: Cannot publish results with unresolved top-three ties.");
    }

    // @ts-ignore
    return await competitionResultsRepository.publishCompetitionResults(competitionId, supabase);
  }

  /**
   * Retrieves existing results for a competition.
   */
  async getCompetitionResults(competitionId: string): Promise<CompetitionResultParticipant[]> {
    const supabase = await createClient();
    // @ts-ignore
    return await competitionResultsRepository.getExistingResultRecords(competitionId, supabase);
  }

  /**
   * Retrieves public global leaderboard data from the authoritative ledger.
   */
  async getGlobalLeaderboard(
    limit: number = 50,
    offset: number = 0,
    categoryId: string | null = null,
    level: string | null = null
  ): Promise<LeaderboardEntry[]> {
    const supabase = await createClient();
    return await competitionResultsRepository.getLeaderboardData(
      limit,
      offset,
      categoryId,
      level,
      // @ts-ignore
      supabase
    );
  }

  /**
   * Retrieves the current Champion Spotlight (top ranked participant).
   */
  async getChampionSpotlight(): Promise<ChampionSpotlightEntry | null> {
    const entries = await this.getGlobalLeaderboard(1, 0);
    if (!entries || entries.length === 0) {
      return null;
    }
    const top = entries[0];
    return {
      profileId: top.profileId,
      slug: top.slug,
      fullName: top.fullName,
      avatarUrl: top.avatarUrl,
      departmentOrInstitution: top.departmentOrInstitution,
      leaderboardRank: top.leaderboardRank,
      totalPoints: top.totalPoints,
      wins: top.wins,
    };
  }

  /**
   * Retrieves Winners Gallery data (published first place entries).
   */
  async getWinnersGallery(
    limit: number = 5,
    offset: number = 0,
    categoryId: string | null = null,
    competitionId: string | null = null,
    year: number | null = null
  ): Promise<WinnerGalleryEntry[]> {
    const supabase = await createClient();
    return await competitionResultsRepository.getWinnersGalleryData(
      limit,
      offset,
      categoryId,
      competitionId,
      year,
      // @ts-ignore
      supabase
    );
  }

  /**
   * Retrieves category-specific leaderboard foundation.
   */
  async getCategoryLeaderboard(
    categoryId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<LeaderboardEntry[]> {
    return await this.getGlobalLeaderboard(limit, offset, categoryId);
  }

  /**
   * Retrieves category monthly winners foundation.
   */
  async getCategoryMonthlyWinners(
    categoryId: string,
    month: number,
    year: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<WinnerGalleryEntry[]> {
    const supabase = await createClient();
    const winners = await competitionResultsRepository.getWinnersGalleryData(
      limit,
      offset,
      categoryId,
      null,
      year,
      // @ts-ignore
      supabase
    );

    // Filter by month (1-12) based on publishedAt
    return winners.filter((w) => {
      if (!w.publishedAt) return false;
      const date = new Date(w.publishedAt);
      return date.getMonth() + 1 === month;
    });
  }
}

export const competitionResultService = new CompetitionResultService();
