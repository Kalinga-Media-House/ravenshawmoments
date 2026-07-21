import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompetitionCategoryPortalService } from "../../services/competitionCategoryPortalService";
import { getCategoryPortalTheme } from "../../components/portal/CategoryThemeRegistry";

// Mock Supabase Server Client
const selectMock = vi.fn();
const eqMock = vi.fn();
const singleMock = vi.fn();
const orderMock = vi.fn();
const limitMock = vi.fn();
const inMock = vi.fn();
const rpcMock = vi.fn();

vi.mock("@/lib/supabase/server", () => {
  const chainable = {
    select: vi.fn(() => chainable),
    eq: vi.fn((k, v) => { eqMock(k, v); return chainable; }),
    in: vi.fn((k, v) => { inMock(k, v); return chainable; }),
    not: vi.fn(() => chainable),
    lte: vi.fn(() => chainable),
    or: vi.fn(() => chainable),
    order: vi.fn(() => chainable),
    limit: vi.fn(() => chainable),
    single: vi.fn(() => singleMock()),
    then: (cb: any) => Promise.resolve(singleMock()).then(cb)
  };
  return {
    createClient: vi.fn(async () => ({
      from: vi.fn(() => chainable),
      rpc: async (fnName: string, params: any) => rpcMock(fnName, params)
    }))
  };
});

describe("CompetitionCategoryPortalService & Theme Registry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Category Resolution & Level Validation", () => {
    it("should resolve valid category by lowercase trimmed slug", async () => {
      singleMock.mockResolvedValueOnce({
        data: {
          id: "cat-1",
          name: "Graphic Design",
          slug: "graphic-design",
          description: "Design competitions",
          display_order: 10,
          is_active: true
        },
        error: null
      });

      const result = await CompetitionCategoryPortalService.getCategoryBySlug(" Graphic-Design ");
      expect(result).not.toBeNull();
      expect(result?.slug).toBe("graphic-design");
      expect(eqMock).toHaveBeenCalledWith("slug", "graphic-design");
      expect(eqMock).toHaveBeenCalledWith("is_active", true);
    });

    it("should return null for unknown category slug", async () => {
      singleMock.mockResolvedValueOnce({
        data: null,
        error: { message: "Not found" }
      });

      const result = await CompetitionCategoryPortalService.getCategoryBySlug("non-existent-slug");
      expect(result).toBeNull();
    });

    it("should validate canonical competition levels strictly against enum values", () => {
      expect(CompetitionCategoryPortalService.validateCanonicalLevel("university")).toBe("university");
      expect(CompetitionCategoryPortalService.validateCanonicalLevel("DEPARTMENT")).toBe("department");
      expect(CompetitionCategoryPortalService.validateCanonicalLevel("state")).toBe("state");
      expect(CompetitionCategoryPortalService.validateCanonicalLevel("invalid_level")).toBeUndefined();
      expect(CompetitionCategoryPortalService.validateCanonicalLevel("")).toBeUndefined();
    });
  });

  describe("Active Categories Retrieval", () => {
    it("should return active categories mapped to the domain model", async () => {
      const { CompetitionCategoryPortalService } = await import("../../services/competitionCategoryPortalService");
      const { CompetitionCategoryPortalRepository } = await import("../../data/competitionCategoryPortalRepository");
      
      const mockRecords = [
        { id: "1", name: "B Cat", slug: "b-cat", description: null, display_order: 10, is_active: true },
        { id: "2", name: "A Cat", slug: "a-cat", description: "desc", display_order: 20, is_active: true }
      ];
      
      const getActiveSpy = vi.spyOn(CompetitionCategoryPortalRepository.prototype, 'getActiveCategories')
        .mockResolvedValue(mockRecords);

      const result = await CompetitionCategoryPortalService.getActiveCategories();

      expect(getActiveSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        name: "B Cat",
        slug: "b-cat",
        description: null,
        displayOrder: 10
      });
      expect(result[1]).toEqual({
        id: "2",
        name: "A Cat",
        slug: "a-cat",
        description: "desc",
        displayOrder: 20
      });
      
      getActiveSpy.mockRestore();
    });

    it("should propagate repository failures transparently without swallowing", async () => {
      const { CompetitionCategoryPortalService } = await import("../../services/competitionCategoryPortalService");
      const { CompetitionCategoryPortalRepository } = await import("../../data/competitionCategoryPortalRepository");
      
      const dbError = new Error("Database error fetching active categories", { cause: { message: "Network fail" } });
      const getActiveSpy = vi.spyOn(CompetitionCategoryPortalRepository.prototype, 'getActiveCategories')
        .mockRejectedValue(dbError);

      await expect(CompetitionCategoryPortalService.getActiveCategories()).rejects.toThrow("Database error fetching active categories");
      
      try {
        await CompetitionCategoryPortalService.getActiveCategories();
      } catch (e: any) {
        expect(e.cause?.message).toBe("Network fail");
      }

      getActiveSpy.mockRestore();
    });
  });

  describe("Category Theme Registry", () => {
    it("should resolve curated icons for original 12 categories", () => {
      expect(getCategoryPortalTheme("graphic-design").iconName).toBe("Palette");
      expect(getCategoryPortalTheme("debate").iconName).toBe("MessageSquare");
    });

    it("should resolve explicit semantic mappings for known categories", () => {
      expect(getCategoryPortalTheme("anchoring").iconName).toBe("Mic");
      expect(getCategoryPortalTheme("coding").iconName).toBe("Code");
      expect(getCategoryPortalTheme("app-development").iconName).toBe("Smartphone");
      expect(getCategoryPortalTheme("chess").iconName).toBe("Gamepad2");
      expect(getCategoryPortalTheme("business-plan").iconName).toBe("Briefcase");
      expect(getCategoryPortalTheme("drama-skit-play").iconName).toBe("Theater");
    });

    it("should return deterministic generic fallback Award for future unknown categories", () => {
      expect(getCategoryPortalTheme("brand-new-future-category").iconName).toBe("Award");
    });

    it("should adhere strictly to dark-maroon premium visual system for unknown categories", () => {
      const theme = getCategoryPortalTheme("brand-new-future-category");
      expect(theme.primaryColor).toBe("#4A0E17");
      expect(theme.accentColor).toBe("#D4AF37");
      expect(theme.backgroundColor).toBe("#2B070E");
    });
  });

  describe("Active Competition Registration Resolution", () => {
    it("should return free registration status correctly", async () => {
      singleMock.mockResolvedValueOnce({
        data: [
          {
            id: "comp-1",
            slug: "debate-championship",
            title: "Ravenshaw Debate Open",
            registration_fee: 0
          }
        ],
        error: null
      });

      const comp = await CompetitionCategoryPortalService.getActiveCompetitionForCategory("cat-1");
      expect(comp?.feeLabel).toBe("Free");
      expect(comp?.isPaid).toBe(false);
    });

    it("should return paid competition with fee label without activating payment checkout", async () => {
      singleMock.mockResolvedValueOnce({
        data: [
          {
            id: "comp-2",
            slug: "paid-championship",
            title: "National Hackathon",
            description: "Coding event",
            competition_level: "national",
            registration_open_at: new Date(Date.now() - 3600000).toISOString(),
            registration_close_at: new Date(Date.now() + 86400000).toISOString(),
            registration_fee: 150
          }
        ],
        error: null
      });

      const comp = await CompetitionCategoryPortalService.getActiveCompetitionForCategory("cat-2");
      expect(comp?.feeLabel).toBe("₹150");
      expect(comp?.isPaid).toBe(true);
    });
  });

  describe("Category Winners Resolution", () => {
    const mockRpcRow = {
      edition_year: 2026,
      edition_month: 6,
      edition_date: "2026-06-15T10:00:00Z",
      competition_id: "comp-1",
      competition_slug: "june-coding",
      competition_title: "June Coding Clash",
      competition_level: "university",
      result_id: "res-1",
      result_outcome: "first",
      profile_id: "user-1",
      profile_slug: "user-1",
      full_name: "Biswa Ranjan",
      public_affiliation: "Computer Science",
      is_external: false
    };

    it("should retrieve and shape the latest category winners edition via RPC", async () => {
      rpcMock.mockResolvedValueOnce({
        data: [mockRpcRow],
        error: null
      });

      const result = await CompetitionCategoryPortalService.getLatestCategoryWinners("cat-code");
      
      expect(rpcMock).toHaveBeenCalledWith("get_latest_category_winners", {
        p_category_id: "cat-code"
      });

      expect(result).not.toBeNull();
      expect(result?.editionYear).toBe(2026);
      expect(result?.editionMonth).toBe(6);
      expect(result?.levelGroups).toHaveLength(1);
      expect(result?.levelGroups[0].level).toBe("university");
      expect(result?.levelGroups[0].competitions).toHaveLength(1);
      expect(result?.levelGroups[0].competitions[0].competitionTitle).toBe("June Coding Clash");
      expect(result?.levelGroups[0].competitions[0].podium).toHaveLength(1);
      expect(result?.levelGroups[0].competitions[0].podium[0].displayName).toBe("Biswa Ranjan");
    });

    it("should handle empty RPC response for latest category winners gracefully", async () => {
      rpcMock.mockResolvedValueOnce({
        data: [],
        error: null
      });

      const result = await CompetitionCategoryPortalService.getLatestCategoryWinners("cat-code");
      expect(result).toBeNull();
    });

    it("should propagate errors thrown by the repository for latest category winners", async () => {
      rpcMock.mockResolvedValueOnce({
        data: null,
        error: { message: "Database timeout" }
      });

      await expect(CompetitionCategoryPortalService.getLatestCategoryWinners("cat-code")).rejects.toThrow("Database error fetching latest winners: Database timeout");
    });

    it("should retrieve and shape archive category winners via RPC", async () => {
      rpcMock.mockResolvedValueOnce({
        data: [
          mockRpcRow,
          {
            ...mockRpcRow,
            competition_id: "comp-2",
            competition_title: "Department Coding Challenge",
            competition_level: "department",
            result_id: "res-2"
          }
        ],
        error: null
      });

      const response = await CompetitionCategoryPortalService.getCategoryWinnersArchive("cat-code", {
        year: 2026,
        month: 6,
        level: "university"
      });

      expect(rpcMock).toHaveBeenCalledWith("get_category_winners_archive", {
        p_category_id: "cat-code",
        p_year: 2026,
        p_month: 6,
        p_level: "university",
        p_limit: 100,
        p_offset: 0
      });

      expect(response.edition?.editionYear).toBe(2026);
      expect(response.edition?.levelGroups).toHaveLength(2); // 'university' and 'department' from the mock
      expect(response.returnedRowCount).toBe(2);
      expect(response.effectiveLimit).toBe(100);
    });

    it("should propagate errors thrown by the repository for archive winners", async () => {
      rpcMock.mockResolvedValueOnce({
        data: null,
        error: { message: "Permission Denied" }
      });

      await expect(CompetitionCategoryPortalService.getCategoryWinnersArchive("cat-code", {
        year: 2026,
        month: 6
      })).rejects.toThrow("Database error fetching archive winners: Permission Denied");
    });
  });

  describe("Category Leaderboard RPC Invocation", () => {
    it("should invoke get_competition_leaderboard RPC with p_category_id", async () => {
      rpcMock.mockResolvedValueOnce({
        data: [
          {
            leaderboard_rank: 1,
            profile_id: "user-1",
            full_name: "Biswa Ranjan",
            total_points: 150,
            wins: 2,
            second_place: 1,
            third_place: 0,
            podium_finishes: 3,
            competitions_participated: 4
          }
        ],
        error: null
      });

      const leaderboard = await CompetitionCategoryPortalService.getCategoryLeaderboard("cat-1", 50);
      expect(rpcMock).toHaveBeenCalledWith("get_competition_leaderboard", {
        p_limit: 50,
        p_offset: 0,
        p_category_id: "cat-1"
      });
      expect(leaderboard[0].fullName).toBe("Biswa Ranjan");
    });
  });
});
