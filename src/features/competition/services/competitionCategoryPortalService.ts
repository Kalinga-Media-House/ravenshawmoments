import { createClient } from "@/lib/supabase/server";
import {
  CompetitionCategoryRecord,
  CategoryActiveCompetition,
  CategoryWinnerEdition,
  CategoryWinnerLevelGroup,
  CategoryWinnerCompetitionGroup,
  CategoryWinnerPodium,
  CanonicalCompetitionLevel,
  CategoryWinnerArchiveFilters,
  CategoryWinnerArchiveResponse,
  PortalCategoryLeaderboardEntry,
  CompetitionDirectoryCategory
} from "../types/categoryPortal";
import { CompetitionCategoryPortalRepository, CategoryWinnerRpcRow } from "../data/competitionCategoryPortalRepository";
import { getCompetitionFallbackImage } from "../utils/images";

const CANONICAL_LEVELS: CanonicalCompetitionLevel[] = [
  "department",
  "hostel",
  "university",
  "inter_university",
  "district",
  "state",
  "national"
];

const LEVEL_DISPLAY_LABELS: Record<string, string> = {
  department: "Department Level",
  hostel: "Hostel Level",
  university: "University Level",
  inter_university: "Inter-University Level",
  district: "District Level",
  state: "State Level",
  national: "National Level"
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export class CompetitionCategoryPortalService {
  static async getCategoryBySlug(slug: string): Promise<CompetitionCategoryRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("competition_categories")
      .select("id, name, slug, description, display_order, is_active")
      .eq("slug", slug.toLowerCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as CompetitionCategoryRecord;
  }

  static async getActiveCompetitionForCategory(
    categoryId: string,
    categoryName?: string
  ): Promise<CategoryActiveCompetition | null> {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data: competitions, error } = await supabase
      .from("competitions")
      .select(`
        id,
        slug,
        title,
        description,
        competition_level,
        registration_open_at,
        registration_close_at,
        competition_date,
        venue,
        eligibility_rules,
        registration_fee,
        cover_image_url
      `)
      .eq("category_id", categoryId)
      .order("registration_close_at", { ascending: false, nullsFirst: false })
      .limit(10);

    if (error || !competitions || competitions.length === 0) {
      return null;
    }

    // Prefer open registrations first, then upcoming
    const openComp = competitions.find((c) => {
      // @ts-ignore
      const openAt = c.registration_open_at ? new Date(c.registration_open_at) : new Date(0);
      // @ts-ignore
      const closeAt = c.registration_close_at ? new Date(c.registration_close_at) : new Date("2099-12-31");
      const currentDate = new Date(now);
      return currentDate >= openAt && currentDate <= closeAt;
    });

    const selectedComp = openComp || competitions[0];

    // @ts-ignore
    const openAt = selectedComp.registration_open_at ? new Date(selectedComp.registration_open_at) : null;
    // @ts-ignore
    const closeAt = selectedComp.registration_close_at ? new Date(selectedComp.registration_close_at) : null;
    const currentDate = new Date(now);

    let statusLabel: "Registration Open" | "Upcoming" | "Registration Closed" = "Registration Closed";
    if (openAt && currentDate < openAt) {
      statusLabel = "Upcoming";
    } else if (closeAt && currentDate <= closeAt) {
      statusLabel = "Registration Open";
    } else if (!closeAt && (!openAt || currentDate >= openAt)) {
      statusLabel = "Registration Open";
    }

    // @ts-ignore
    const feeAmount = typeof selectedComp.registration_fee === "number" ? selectedComp.registration_fee : 0;
    const isPaid = feeAmount > 0;
    const feeLabel = isPaid ? `₹${feeAmount}` : "Free";

    return {
      // @ts-ignore
      id: selectedComp.id,
      // @ts-ignore
      slug: selectedComp.slug,
      // @ts-ignore
      title: selectedComp.title,
      // @ts-ignore
      shortDescription: selectedComp.description?.substring(0, 160) || "",
      // @ts-ignore
      level: selectedComp.competition_level || "University",
      statusLabel,
      // @ts-ignore
      registrationOpenAt: selectedComp.registration_open_at || null,
      // @ts-ignore
      registrationCloseAt: selectedComp.registration_close_at || null,
      // @ts-ignore
      competitionDate: selectedComp.competition_date || null,
      // @ts-ignore
      venueOrMode: selectedComp.venue || "Offline",
      // @ts-ignore
      eligibilitySummary: selectedComp.eligibility_rules || "Open to all participants",
      feeLabel,
      isPaid,
      // @ts-ignore
      coverImage: selectedComp.cover_image_url || getCompetitionFallbackImage(categoryName)
    };
  }

  /**
   * Helper to map flat RPC rows into the UI domain model hierarchy
   */
  private static transformRpcRowsToDomain(rows: CategoryWinnerRpcRow[]): CategoryWinnerEdition | null {
    if (!rows || rows.length === 0) return null;

    const edition = rows[0]; // All rows in the set belong to the exact same edition year/month
    
    // Group by level
    const levelMap = new Map<CanonicalCompetitionLevel, CategoryWinnerRpcRow[]>();
    for (const row of rows) {
      if (!levelMap.has(row.competition_level)) {
        levelMap.set(row.competition_level, []);
      }
      levelMap.get(row.competition_level)!.push(row);
    }

    const levelGroups: CategoryWinnerLevelGroup[] = Array.from(levelMap.entries()).map(([level, levelRows]) => {
      // Group by competition ID
      const compMap = new Map<string, CategoryWinnerRpcRow[]>();
      for (const row of levelRows) {
        if (!compMap.has(row.competition_id)) {
          compMap.set(row.competition_id, []);
        }
        compMap.get(row.competition_id)!.push(row);
      }

      const competitions: CategoryWinnerCompetitionGroup[] = Array.from(compMap.entries()).map(([compId, compRows]) => {
        const compRef = compRows[0];
        const podium: CategoryWinnerPodium[] = compRows.map(r => ({
          resultId: r.result_id,
          outcome: r.result_outcome,
          profileId: r.profile_id,
          profileSlug: r.profile_slug,
          displayName: r.full_name,
          publicAffiliation: r.public_affiliation,
          isExternal: r.is_external
        }));

        return {
          competitionId: compRef.competition_id,
          competitionSlug: compRef.competition_slug,
          competitionTitle: compRef.competition_title,
          competitionLevel: compRef.competition_level,
          podium
        };
      });

      return {
        level,
        competitions
      };
    });

    return {
      editionYear: edition.edition_year,
      editionMonth: edition.edition_month,
      editionDate: edition.edition_date,
      levelGroups
    };
  }

  static async getLatestCategoryWinners(categoryId: string): Promise<CategoryWinnerEdition | null> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new CompetitionCategoryPortalRepository(supabase);
    const rows = await repo.getLatestCategoryWinners(categoryId);
    return this.transformRpcRowsToDomain(rows);
  }

  static async getCategoryWinnersArchive(
    categoryId: string,
    filters: CategoryWinnerArchiveFilters
  ): Promise<CategoryWinnerArchiveResponse> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new CompetitionCategoryPortalRepository(supabase);
    
    const limit = filters.limit ?? 100;
    const offset = filters.offset ?? 0;
    
    const rows = await repo.getCategoryWinnersArchive(
      categoryId,
      filters.year || new Date().getFullYear(),
      filters.month || new Date().getMonth() + 1,
      filters.level,
      limit,
      offset
    );

    const edition = this.transformRpcRowsToDomain(rows);

    return {
      edition,
      requestedLimit: limit,
      effectiveLimit: Math.min(Math.max(limit, 1), 500),
      offset: Math.max(offset, 0),
      returnedRowCount: rows.length
    };
  }

  static async getCategoryLeaderboard(
    categoryId: string,
    limit: number = 50
  ): Promise<PortalCategoryLeaderboardEntry[]> {
    const supabase = await createClient();

    // @ts-ignore
    const { data, error } = await supabase.rpc("get_competition_leaderboard", {
      p_limit: limit,
      p_offset: 0,
      p_category_id: categoryId
    });

    if (error || !data) {
      return [];
    }

    // @ts-ignore
    return data.map((entry: any) => ({
      rank: Number(entry.leaderboard_rank || 0),
      profileId: entry.profile_id || "",
      slug: entry.slug || "",
      fullName: entry.full_name || "Participant",
      avatarUrl: entry.avatar_url || null,
      departmentOrInstitution: entry.department_or_institution || "Ravenshaw University",
      profileType: entry.profile_type || "Student",
      totalPoints: Number(entry.total_points || 0),
      wins: Number(entry.wins || 0),
      secondPlace: Number(entry.second_place || 0),
      thirdPlace: Number(entry.third_place || 0),
      podiumFinishes: Number(entry.podium_finishes || 0),
      competitionsParticipated: Number(entry.competitions_participated || 0)
    }));
  }

  static async getActiveCategories(): Promise<CompetitionDirectoryCategory[]> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new CompetitionCategoryPortalRepository(supabase);
    const records = await repo.getActiveCategories();
    return records.map((record) => ({
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      displayOrder: record.display_order,
    }));
  }

  static validateCanonicalLevel(levelInput?: string): CanonicalCompetitionLevel | undefined {
    if (!levelInput) return undefined;
    const normalized = levelInput.toLowerCase().trim() as CanonicalCompetitionLevel;
    return CANONICAL_LEVELS.includes(normalized) ? normalized : undefined;
  }
}
