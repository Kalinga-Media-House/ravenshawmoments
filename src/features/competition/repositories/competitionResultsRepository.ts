// =============================================================================
// Ravenshaw Moments
// File      : src/features/competition/repositories/competitionResultsRepository.ts
// Purpose   : Low-Level Database Access Repository for Competition Results,
//             Judging, Leaderboard, Winners Gallery, and Champion Spotlight.
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import {
  CompetitionResultRecord,
  CompetitionResultParticipant,
  ProvisionalRanking,
  LeaderboardEntry,
  WinnerGalleryEntry,
  ChampionSpotlightEntry,
  CompetitionPosition,
  CompetitionParticipantOutcome,
  CompetitionResultStatus,
} from "../types/results";

export class CompetitionResultsRepository {
  /**
   * Retrieves a competition by ID.
   */
  async getCompetitionById(competitionId: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("id", competitionId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Retrieves a competition by slug.
   */
  async getCompetitionBySlug(slug: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Retrieves approved registrations for a competition along with profile details.
   */
  async getApprovedRegistrations(competitionId: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("competition_registrations")
      .select(`
        id,
        competition_id,
        profile_id,
        registration_status,
        profiles (
          id,
          slug,
          full_name,
          profile_type
        )
      `)
      .eq("competition_id", competitionId)
      .in("registration_status", ["registered", "submitted"]);

    if (error) {
      throw new Error(`Database error in getApprovedRegistrations: ${error.message}`);
    }
    return data || [];
  }

  /**
   * Retrieves existing result records for a competition merged with all approved eligible registrations.
   */
  async getExistingResultRecords(
    competitionId: string,
    supabase: SupabaseClient
  ): Promise<CompetitionResultParticipant[]> {
    // 1) Fetch existing result records
    const { data: resultRows, error: resultErr } = await supabase
      .from("competition_results")
      .select(`
        id,
        registration_id,
        profile_id,
        marks_obtained,
        maximum_marks,
        normalized_score,
        rank,
        position,
        outcome,
        result_status,
        requires_tie_break,
        tie_break_score
      `)
      .eq("competition_id", competitionId);

    if (resultErr && resultErr.code !== "PGRST116") {
      throw new Error(`Database error in getExistingResultRecords: ${resultErr.message}`);
    }

    const resultMap = new Map<string, any>();
    (resultRows || []).forEach((r: any) => {
      resultMap.set(r.registration_id, r);
    });

    // 2) Fetch approved eligible registrations
    const registrations = await this.getApprovedRegistrations(competitionId, supabase);

    return registrations.map((reg: any) => {
      const profile = reg?.profiles || {};
      const row = resultMap.get(reg.id);

      return {
        resultId: row?.id || "",
        registrationId: reg.id,
        profileId: reg.profile_id || "",
        fullName: profile.full_name || "Unknown Participant",
        slug: profile.slug || "",
        departmentOrInstitution: "Ravenshaw University",
        marksObtained: row?.marks_obtained !== undefined && row?.marks_obtained !== null ? Number(row.marks_obtained) : null,
        maximumMarks: Number(row?.maximum_marks || 100),
        normalizedScore: row?.normalized_score !== undefined && row?.normalized_score !== null ? Number(row.normalized_score) : null,
        rank: row?.rank !== undefined && row?.rank !== null ? Number(row.rank) : null,
        position: (row?.position || "participant") as any,
        outcome: (row?.outcome || "eligible") as any,
        resultStatus: (row?.result_status || "draft") as any,
        requiresTieBreak: Boolean(row?.requires_tie_break),
        tieBreakScore: row?.tie_break_score !== undefined && row?.tie_break_score !== null ? Number(row.tie_break_score) : null,
      };
    });
  }

  /**
   * Saves or updates draft participant marks in `competition_results`.
   */
  async saveDraftParticipantMarks(
    competitionId: string,
    registrationId: string,
    profileId: string | null,
    marksObtained: number,
    maximumMarks: number,
    evaluatorId: string,
    supabase: SupabaseClient
  ): Promise<void> {
    const normalizedScore = Number(((marksObtained / maximumMarks) * 100).toFixed(2));

    const { error } = await supabase
      .from("competition_results")
      .upsert(
        {
          competition_id: competitionId,
          registration_id: registrationId,
          profile_id: profileId,
          marks_obtained: marksObtained,
          maximum_marks: maximumMarks,
          normalized_score: normalizedScore,
          outcome: "eligible",
          result_status: "draft",
          evaluated_by: evaluatorId,
          evaluated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "competition_id,registration_id" }
      );

    if (error) {
      throw new Error(`Database error in saveDraftParticipantMarks: ${error.message}`);
    }
  }

  /**
   * Saves or updates draft marks for multiple participants in a single PostgreSQL transaction.
   */
  async saveBulkDraftParticipantMarks(
    competitionId: string,
    entries: {
      registrationId: string;
      profileId: string | null;
      marksObtained: number;
      maximumMarks: number;
      remarks?: string;
    }[],
    evaluatorId: string,
    supabase: SupabaseClient
  ): Promise<void> {
    if (entries.length === 0) return;

    const now = new Date().toISOString();
    const rows = entries.map((entry) => {
      const normalizedScore = Number(
        ((entry.marksObtained / entry.maximumMarks) * 100).toFixed(2)
      );
      return {
        competition_id: competitionId,
        registration_id: entry.registrationId,
        profile_id: entry.profileId,
        marks_obtained: entry.marksObtained,
        maximum_marks: entry.maximumMarks,
        normalized_score: normalizedScore,
        remarks: entry.remarks || null,
        outcome: "eligible",
        result_status: "draft",
        evaluated_by: evaluatorId,
        evaluated_at: now,
        updated_at: now,
      };
    });

    const { error } = await supabase
      .from("competition_results")
      .upsert(rows, { onConflict: "competition_id,registration_id" });

    if (error) {
      throw new Error(`Database error in saveBulkDraftParticipantMarks: ${error.message}`);
    }
  }

  /**
   * Updates operational outcome for a participant (e.g. participated, disqualified, withdrawn, absent).
   */
  async updateParticipantOutcome(
    competitionId: string,
    registrationId: string,
    outcome: CompetitionParticipantOutcome,
    reason: string | undefined,
    notes: string | undefined,
    evaluatorId: string,
    supabase: SupabaseClient
  ): Promise<void> {
    const payload: Record<string, any> = {
      outcome,
      updated_at: new Date().toISOString(),
    };

    if (outcome === "disqualified" || outcome === "withdrawn" || outcome === "absent") {
      payload.rank = null;
      payload.position = "participant";
      payload.leaderboard_points = 0;
    }

    const { error } = await supabase
      .from("competition_results")
      .update(payload)
      .eq("competition_id", competitionId)
      .eq("registration_id", registrationId);

    if (error) {
      throw new Error(`Database error in updateParticipantOutcome: ${error.message}`);
    }
  }

  /**
   * Invokes Stage A RPC `calculate_competition_rankings` to calculate provisional ranks.
   */
  async calculateProvisionalRankings(
    competitionId: string,
    supabase: SupabaseClient
  ): Promise<ProvisionalRanking[]> {
    const { data, error } = await supabase.rpc("calculate_competition_rankings", {
      p_competition_id: competitionId,
    });

    if (error) {
      throw new Error(`Database error in calculateProvisionalRankings: ${error.message}`);
    }

    return (data || []).map((item: any) => {
      const rk = item.rank !== null ? Number(item.rank) : null;
      const pos =
        item.position ||
        (rk === 1 ? "first" : rk === 2 ? "second" : rk === 3 ? "third" : "participant");
      return {
        resultId: item.result_id,
        registrationId: item.registration_id,
        marksObtained: item.marks_obtained !== null ? Number(item.marks_obtained) : null,
        normalizedScore: item.normalized_score !== null ? Number(item.normalized_score) : null,
        rank: rk,
        position: pos,
        outcome: item.outcome as CompetitionParticipantOutcome,
        requiresTieBreak: Boolean(item.requires_tie_break),
      };
    });
  }

  /**
   * Retrieves results requiring tie resolution.
   */
  async getUnresolvedTies(competitionId: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("competition_results")
      .select(`
        id,
        registration_id,
        marks_obtained,
        normalized_score,
        tie_break_score,
        competition_registrations!inner (
          profile_id,
          profiles:profile_id ( full_name )
        )
      `)
      .eq("competition_id", competitionId)
      .eq("requires_tie_break", true);

    if (error) {
      throw new Error(`Database error in getUnresolvedTies: ${error.message}`);
    }
    return data || [];
  }

  /**
   * Resolves a top-three tie by recording tie break score.
   */
  async resolveTie(
    competitionId: string,
    registrationId: string,
    tieBreakScore: number,
    notes: string | undefined,
    supabase: SupabaseClient
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("resolve_competition_tie", {
      p_competition_id: competitionId,
      p_registration_id: registrationId,
      p_tie_break_score: tieBreakScore,
      p_notes: notes || null,
    });

    if (error) {
      throw new Error(`Database error in resolveTie: ${error.message}`);
    }
    return Boolean(data);
  }

  /**
   * Finalizes competition results by setting status to 'finalized'.
   */
  async finalizeCompetitionResults(
    competitionId: string,
    finalizerId: string,
    supabase: SupabaseClient
  ): Promise<number> {
    const { data, error } = await supabase
      .from("competition_results")
      .update({
        result_status: "finalized",
        finalized_by: finalizerId,
        finalized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("competition_id", competitionId)
      .eq("result_status", "evaluated")
      .select("id");

    if (error) {
      throw new Error(`Database error in finalizeCompetitionResults: ${error.message}`);
    }
    return data?.length || 0;
  }

  /**
   * Publishes competition results using Stage A verified idempotent RPC.
   */
  async publishCompetitionResults(
    competitionId: string,
    supabase: SupabaseClient
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("finalize_and_publish_competition_results", {
      p_competition_id: competitionId,
    });

    if (error) {
      throw new Error(`Database error in publishCompetitionResults: ${error.message}`);
    }
    return Boolean(data);
  }

  /**
   * Retrieves published results for a competition.
   */
  async getPublishedResults(
    competitionId: string,
    supabase: SupabaseClient
  ): Promise<CompetitionResultParticipant[]> {
    const { data, error } = await supabase
      .from("competition_results")
      .select(`
        id,
        registration_id,
        marks_obtained,
        maximum_marks,
        normalized_score,
        rank,
        position,
        outcome,
        result_status,
        requires_tie_break,
        tie_break_score,
        competition_registrations!inner (
          id,
          profile_id,
          profiles:profile_id (
            id,
            slug,
            full_name
          )
        )
      `)
      .eq("competition_id", competitionId)
      .eq("result_status", "published")
      .order("rank", { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Database error in getPublishedResults: ${error.message}`);
    }

    return (data || []).map((row: any) => {
      const reg = row.competition_registrations;
      const profile = reg?.profiles || {};
      return {
        resultId: row.id,
        registrationId: row.registration_id,
        profileId: reg?.profile_id || "",
        fullName: profile.full_name || "Unknown Participant",
        slug: profile.slug || "",
        departmentOrInstitution: "Ravenshaw University",
        marksObtained: row.marks_obtained !== null ? Number(row.marks_obtained) : null,
        maximumMarks: Number(row.maximum_marks || 100),
        normalizedScore: row.normalized_score !== null ? Number(row.normalized_score) : null,
        rank: row.rank !== null ? Number(row.rank) : null,
        position: row.position as CompetitionPosition,
        outcome: row.outcome as CompetitionParticipantOutcome,
        resultStatus: row.result_status as CompetitionResultStatus,
        requiresTieBreak: Boolean(row.requires_tie_break),
        tieBreakScore: row.tie_break_score !== null ? Number(row.tie_break_score) : null,
      };
    });
  }

  /**
   * Retrieves point rules from `competition_point_rules`.
   */
  async getCompetitionPointRules(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("competition_point_rules")
      .select("*")
      .eq("is_active", true);

    if (error) {
      throw new Error(`Database error in getCompetitionPointRules: ${error.message}`);
    }
    return data || [];
  }

  /**
   * Calls Stage A RPC `get_competition_leaderboard`.
   */
  async getLeaderboardData(
    limit: number,
    offset: number,
    categoryId: string | null,
    level: string | null,
    supabase: SupabaseClient
  ): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase.rpc("get_competition_leaderboard", {
      p_limit: limit,
      p_offset: offset,
      p_category_id: categoryId || null,
      p_competition_level: level || null,
    });

    if (error) {
      throw new Error(`Database error in getLeaderboardData: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      leaderboardRank: Number(row.leaderboard_rank),
      profileId: row.profile_id,
      slug: row.slug,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      departmentOrInstitution: row.department_or_institution,
      profileType: row.profile_type || "Student",
      totalPoints: Number(row.total_points || 0),
      wins: Number(row.wins || 0),
      secondPlace: Number(row.second_place || 0),
      thirdPlace: Number(row.third_place || 0),
      podiumFinishes: Number(row.podium_finishes || 0),
      competitionsParticipated: Number(row.competitions_participated || 0),
    }));
  }

  /**
   * Calls Stage A RPC `get_competition_winners_gallery`.
   */
  async getWinnersGalleryData(
    limit: number,
    offset: number,
    categoryId: string | null,
    competitionId: string | null,
    year: number | null,
    supabase: SupabaseClient
  ): Promise<WinnerGalleryEntry[]> {
    const { data, error } = await supabase.rpc("get_competition_winners_gallery", {
      p_limit: limit,
      p_offset: offset,
      p_category_id: categoryId || null,
      p_competition_id: competitionId || null,
      p_year: year || null,
    });

    if (error) {
      throw new Error(`Database error in getWinnersGalleryData: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      resultId: row.result_id,
      competitionId: row.competition_id,
      competitionTitle: row.competition_title,
      competitionSlug: row.competition_slug,
      categoryName: row.category_name,
      competitionYear: Number(row.competition_year),
      profileId: row.profile_id,
      slug: row.slug,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      departmentOrInstitution: row.department_or_institution,
      marksObtained: row.marks_obtained !== null ? Number(row.marks_obtained) : null,
      publishedAt: row.published_at,
    }));
  }
}

export const competitionResultsRepository = new CompetitionResultsRepository();
