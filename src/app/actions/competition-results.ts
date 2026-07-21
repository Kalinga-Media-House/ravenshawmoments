// =============================================================================
// Ravenshaw Moments
// File      : src/app/actions/competition-results.ts
// Purpose   : Secure Production-Ready Server Actions for Universal Competition
//             Result Management, Judging, Finalization, Publication & Queries.
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types";
import { logger } from "@/lib/logger";
import { competitionResultService } from "@/features/competition/services/competitionResultService";
import {
  CompetitionResultParticipant,
  ProvisionalRanking,
  LeaderboardEntry,
  WinnerGalleryEntry,
  ChampionSpotlightEntry,
  CompetitionParticipantOutcome,
} from "@/features/competition/types/results";

/**
 * Helper to verify server-side authentication and competition admin permissions.
 */
async function verifyCompetitionAdmin(competitionId: string): Promise<{ userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED: Authentication required to manage competition results.");
  }

  // Check database RLS/admin check function
  // @ts-ignore
  const { data: isAdmin, error } = await supabase.rpc("is_competition_admin", {
    p_competition_id: competitionId,
  });

  if (error || !isAdmin) {
    throw new Error("FORBIDDEN: You do not have authorization to manage results for this competition.");
  }

  return { userId: user.id };
}

/**
 * Saves draft marks for a competition participant.
 */
export async function saveCompetitionMarksAction(
  competitionId: string,
  registrationId: string,
  profileId: string | null,
  marksObtained: number,
  maximumMarks: number = 100,
  remarks?: string
): Promise<ApiResponse> {
  try {
    const { userId } = await verifyCompetitionAdmin(competitionId);

    await competitionResultService.saveDraftMarks(
      competitionId,
      registrationId,
      profileId,
      marksObtained,
      maximumMarks,
      remarks,
      userId
    );

    return { success: true };
  } catch (err: any) {
    logger.error("Action: Error in saveCompetitionMarksAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "VALIDATION_ERROR",
        message: err.message || "Failed to save draft marks.",
      },
    };
  }
}

/**
 * Saves draft marks for multiple competition participants in one single atomic transaction.
 */
export async function saveBulkCompetitionMarksAction(
  competitionId: string,
  entries: {
    registrationId: string;
    profileId: string | null;
    marksObtained: number;
    maximumMarks: number;
    remarks?: string;
  }[]
): Promise<ApiResponse<{ savedCount: number }>> {
  try {
    const { userId } = await verifyCompetitionAdmin(competitionId);

    await competitionResultService.saveBulkDraftMarks(
      competitionId,
      entries,
      userId
    );

    return { success: true, data: { savedCount: entries.length } };
  } catch (err: any) {
    logger.error("Action: Error in saveBulkCompetitionMarksAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "VALIDATION_ERROR",
        message: err.message || "Failed to save bulk draft marks.",
      },
    };
  }
}

/**
 * Updates operational outcome (e.g. participated, disqualified, withdrawn, absent).
 */
export async function updateParticipantOutcomeAction(
  competitionId: string,
  registrationId: string,
  outcome: CompetitionParticipantOutcome,
  reason?: string,
  notes?: string
): Promise<ApiResponse> {
  try {
    const { userId } = await verifyCompetitionAdmin(competitionId);

    await competitionResultService.updateParticipantOutcome(
      competitionId,
      registrationId,
      outcome,
      reason,
      notes,
      userId
    );

    return { success: true };
  } catch (err: any) {
    logger.error("Action: Error in updateParticipantOutcomeAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "OPERATION_FAILED",
        message: err.message || "Failed to update participant outcome.",
      },
    };
  }
}

/**
 * Calculates provisional competition rankings.
 */
export async function calculateCompetitionResultsAction(
  competitionId: string
): Promise<ApiResponse<ProvisionalRanking[]>> {
  try {
    await verifyCompetitionAdmin(competitionId);

    const rankings = await competitionResultService.calculateProvisionalResults(competitionId);
    return { success: true, data: rankings };
  } catch (err: any) {
    logger.error("Action: Error in calculateCompetitionResultsAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "CALCULATION_ERROR",
        message: err.message || "Failed to calculate provisional results.",
      },
    };
  }
}

/**
 * Resolves a top-three competition tie.
 */
export async function resolveCompetitionTieAction(
  competitionId: string,
  registrationId: string,
  tieBreakScore: number,
  notes?: string
): Promise<ApiResponse<boolean>> {
  try {
    await verifyCompetitionAdmin(competitionId);

    const resolved = await competitionResultService.resolveTie(
      competitionId,
      registrationId,
      tieBreakScore,
      notes
    );

    return { success: true, data: resolved };
  } catch (err: any) {
    logger.error("Action: Error in resolveCompetitionTieAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "TIE_RESOLUTION_ERROR",
        message: err.message || "Failed to resolve tie.",
      },
    };
  }
}

/**
 * Finalizes competition results.
 */
export async function finalizeCompetitionResultsAction(
  competitionId: string
): Promise<ApiResponse<{ finalizedCount: number }>> {
  try {
    const { userId } = await verifyCompetitionAdmin(competitionId);

    const finalizedCount = await competitionResultService.finalizeCompetitionResults(
      competitionId,
      userId
    );

    return { success: true, data: { finalizedCount } };
  } catch (err: any) {
    logger.error("Action: Error in finalizeCompetitionResultsAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "FINALIZATION_ERROR",
        message: err.message || "Failed to finalize competition results.",
      },
    };
  }
}

/**
 * Publishes competition results and awards ledger points idempotently.
 */
export async function publishCompetitionResultsAction(
  competitionId: string
): Promise<ApiResponse<{ published: boolean }>> {
  try {
    await verifyCompetitionAdmin(competitionId);

    const published = await competitionResultService.publishCompetitionResults(competitionId);

    // Revalidate affected cache paths
    revalidatePath("/competitions");
    revalidatePath("/competitions/[slug]", "page");

    return { success: true, data: { published } };
  } catch (err: any) {
    logger.error("Action: Error in publishCompetitionResultsAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "PUBLICATION_ERROR",
        message: err.message || "Failed to publish competition results.",
      },
    };
  }
}

/**
 * Retrieves existing competition results for admin/management view.
 */
export async function getCompetitionResultsAction(
  competitionId: string
): Promise<ApiResponse<CompetitionResultParticipant[]>> {
  try {
    await verifyCompetitionAdmin(competitionId);
    const results = await competitionResultService.getCompetitionResults(competitionId);
    return { success: true, data: results };
  } catch (err: any) {
    logger.error("Action: Error in getCompetitionResultsAction", err);
    return {
      success: false,
      error: {
        code: err.message?.split(":")[0] || "FETCH_ERROR",
        message: err.message || "Failed to retrieve competition results.",
      },
    };
  }
}

/**
 * Public action to query universal competition leaderboard.
 */
export async function getPublicLeaderboardAction(
  limit: number = 50,
  offset: number = 0,
  categoryId: string | null = null,
  level: string | null = null
): Promise<ApiResponse<LeaderboardEntry[]>> {
  try {
    const entries = await competitionResultService.getGlobalLeaderboard(
      limit,
      offset,
      categoryId,
      level
    );
    return { success: true, data: entries };
  } catch (err: any) {
    logger.error("Action: Error in getPublicLeaderboardAction", err);
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to load leaderboard data.",
      },
    };
  }
}

/**
 * Public action to query Champion Spotlight.
 */
export async function getPublicChampionSpotlightAction(): Promise<
  ApiResponse<ChampionSpotlightEntry | null>
> {
  try {
    const champion = await competitionResultService.getChampionSpotlight();
    return { success: true, data: champion };
  } catch (err: any) {
    logger.error("Action: Error in getPublicChampionSpotlightAction", err);
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to load Champion Spotlight.",
      },
    };
  }
}

/**
 * Public action to query Winners Gallery.
 */
export async function getPublicWinnersGalleryAction(
  limit: number = 5,
  offset: number = 0,
  categoryId: string | null = null,
  competitionId: string | null = null,
  year: number | null = null
): Promise<ApiResponse<WinnerGalleryEntry[]>> {
  try {
    const entries = await competitionResultService.getWinnersGallery(
      limit,
      offset,
      categoryId,
      competitionId,
      year
    );
    return { success: true, data: entries };
  } catch (err: any) {
    logger.error("Action: Error in getPublicWinnersGalleryAction", err);
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to load Winners Gallery.",
      },
    };
  }
}
