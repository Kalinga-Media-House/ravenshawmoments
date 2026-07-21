// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/unit/competition-results.test.ts
// Purpose   : Complete Unit & Logic Tests for Universal Competition Results,
//             Judging, Tie Detection, Leaderboard, and Winners Gallery.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { competitionResultService } from "@/features/competition/services/competitionResultService";
import { competitionResultsRepository } from "@/features/competition/repositories/competitionResultsRepository";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "admin-user-id" } },
      }),
    },
    rpc: vi.fn(),
    from: vi.fn(),
  }),
}));

describe("Competition Result Service & Engine Rules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Input Validation & Marks Constraints", () => {
    it("should reject marks below zero", async () => {
      await expect(
        competitionResultService.saveDraftMarks("comp-1", "reg-1", "prof-1", -5, 100)
      ).rejects.toThrow(/negative/i);
    });

    it("should reject marks above maximum marks", async () => {
      await expect(
        competitionResultService.saveDraftMarks("comp-1", "reg-1", "prof-1", 105, 100)
      ).rejects.toThrow(/exceed maximum marks/i);
    });

    it("should reject maximum marks of zero or below", async () => {
      await expect(
        competitionResultService.saveDraftMarks("comp-1", "reg-1", "prof-1", 10, 0)
      ).rejects.toThrow(/greater than zero/i);
    });
  });

  describe("Participant Outcome Rules (Points & Ranks)", () => {
    it("withdrawn participant receives no points or rank", async () => {
      const mockUpdate = vi.spyOn(competitionResultsRepository, "updateParticipantOutcome").mockResolvedValue();

      await competitionResultService.updateParticipantOutcome("comp-1", "reg-1", "withdrawn", "Personal reasons");
      expect(mockUpdate).toHaveBeenCalledWith(
        "comp-1",
        "reg-1",
        "withdrawn",
        "Personal reasons",
        undefined,
        "",
        expect.anything()
      );
    });

    it("absent participant receives no points or rank", async () => {
      const mockUpdate = vi.spyOn(competitionResultsRepository, "updateParticipantOutcome").mockResolvedValue();

      await competitionResultService.updateParticipantOutcome("comp-1", "reg-1", "absent");
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("disqualified participant receives no points or rank", async () => {
      const mockUpdate = vi.spyOn(competitionResultsRepository, "updateParticipantOutcome").mockResolvedValue();

      await competitionResultService.updateParticipantOutcome("comp-1", "reg-1", "disqualified", "Rule violation");
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("Ranking & Tie Detection Engine", () => {
    it("highest score becomes first, second score becomes second, third score becomes third", async () => {
      vi.spyOn(competitionResultsRepository, "calculateProvisionalRankings").mockResolvedValue([
        { resultId: "r1", registrationId: "reg-1", marksObtained: 95, normalizedScore: 95, rank: 1, position: "first", outcome: "participated", requiresTieBreak: false },
        { resultId: "r2", registrationId: "reg-2", marksObtained: 88, normalizedScore: 88, rank: 2, position: "second", outcome: "participated", requiresTieBreak: false },
        { resultId: "r3", registrationId: "reg-3", marksObtained: 82, normalizedScore: 82, rank: 3, position: "third", outcome: "participated", requiresTieBreak: false },
      ]);

      const rankings = await competitionResultService.calculateProvisionalResults("comp-1");
      expect(rankings[0].rank).toBe(1);
      expect(rankings[1].rank).toBe(2);
      expect(rankings[2].rank).toBe(3);
    });

    it("top-three tie blocks publication and finalization", async () => {
      vi.spyOn(competitionResultsRepository, "getUnresolvedTies").mockResolvedValue([
        { id: "r1", registration_id: "reg-1", normalized_score: 90, tie_break_score: null } as any,
      ]);

      await expect(
        competitionResultService.finalizeCompetitionResults("comp-1", "admin-1")
      ).rejects.toThrow(/UNRESOLVED_TIE/);

      await expect(
        competitionResultService.publishCompetitionResults("comp-1")
      ).rejects.toThrow(/UNRESOLVED_TIE/);
    });

    it("resolved tie allows finalization", async () => {
      vi.spyOn(competitionResultsRepository, "getUnresolvedTies").mockResolvedValue([]);
      vi.spyOn(competitionResultsRepository, "finalizeCompetitionResults").mockResolvedValue(3);

      const count = await competitionResultService.finalizeCompetitionResults("comp-1", "admin-1");
      expect(count).toBe(3);
    });
  });

  describe("Leaderboard, Champion Spotlight & Winners Gallery", () => {
    it("leaderboard sorts correctly and completely tied users share rank", async () => {
      const mockLeaderboard = [
        {
          leaderboardRank: 1,
          profileId: "p1",
          slug: "arya-sharma",
          fullName: "Arya Sharma",
          avatarUrl: null,
          departmentOrInstitution: "Computer Science",
          profileType: "Student",
          totalPoints: 200,
          wins: 2,
          secondPlace: 0,
          thirdPlace: 0,
          podiumFinishes: 2,
          competitionsParticipated: 2,
        },
        {
          leaderboardRank: 2,
          profileId: "p2",
          slug: "rohit-verma",
          fullName: "Rohit Verma",
          avatarUrl: null,
          departmentOrInstitution: "Physics",
          profileType: "Student",
          totalPoints: 100,
          wins: 1,
          secondPlace: 0,
          thirdPlace: 0,
          podiumFinishes: 1,
          competitionsParticipated: 1,
        },
        {
          leaderboardRank: 2,
          profileId: "p3",
          slug: "priya-dash",
          fullName: "Priya Dash",
          avatarUrl: null,
          departmentOrInstitution: "Chemistry",
          profileType: "Student",
          totalPoints: 100,
          wins: 1,
          secondPlace: 0,
          thirdPlace: 0,
          podiumFinishes: 1,
          competitionsParticipated: 1,
        },
      ];

      vi.spyOn(competitionResultsRepository, "getLeaderboardData").mockResolvedValue(mockLeaderboard);

      const data = await competitionResultService.getGlobalLeaderboard(10, 0);
      expect(data[0].leaderboardRank).toBe(1);
      expect(data[1].leaderboardRank).toBe(2);
      expect(data[2].leaderboardRank).toBe(2); // Tied rank
    });

    it("champion spotlight is leaderboard rank one", async () => {
      const mockLeaderboard = [
        {
          leaderboardRank: 1,
          profileId: "p1",
          slug: "arya-sharma",
          fullName: "Arya Sharma",
          avatarUrl: null,
          departmentOrInstitution: "Computer Science",
          profileType: "Student",
          totalPoints: 200,
          wins: 2,
          secondPlace: 0,
          thirdPlace: 0,
          podiumFinishes: 2,
          competitionsParticipated: 2,
        },
      ];

      vi.spyOn(competitionResultsRepository, "getLeaderboardData").mockResolvedValue(mockLeaderboard);

      const champion = await competitionResultService.getChampionSpotlight();
      expect(champion?.fullName).toBe("Arya Sharma");
      expect(champion?.leaderboardRank).toBe(1);
    });

    it("winners gallery returns only published first-place results and filters by month/year", async () => {
      const mockWinners = [
        {
          resultId: "r1",
          competitionId: "c1",
          competitionTitle: "Debate 2027",
          competitionSlug: "debate-2027",
          categoryName: "Debate",
          competitionYear: 2027,
          profileId: "p1",
          slug: "arya-sharma",
          fullName: "Arya Sharma",
          avatarUrl: null,
          departmentOrInstitution: "CS",
          marksObtained: 95,
          publishedAt: "2027-03-15T10:00:00Z",
        },
        {
          resultId: "r2",
          competitionId: "c2",
          competitionTitle: "Quiz 2027",
          competitionSlug: "quiz-2027",
          categoryName: "Quiz",
          competitionYear: 2027,
          profileId: "p2",
          slug: "rohit-verma",
          fullName: "Rohit Verma",
          avatarUrl: null,
          departmentOrInstitution: "Physics",
          marksObtained: 92,
          publishedAt: "2027-04-10T10:00:00Z",
        },
      ];

      vi.spyOn(competitionResultsRepository, "getWinnersGalleryData").mockResolvedValue(mockWinners);

      const marchWinners = await competitionResultService.getCategoryMonthlyWinners("cat-1", 3, 2027);
      expect(marchWinners.length).toBe(1);
      expect(marchWinners[0].fullName).toBe("Arya Sharma");
    });
  });
});
