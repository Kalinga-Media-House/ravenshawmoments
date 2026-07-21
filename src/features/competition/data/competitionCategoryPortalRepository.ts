import { SupabaseClient } from "@supabase/supabase-js";

import { CanonicalCompetitionLevel, CompetitionCategoryRecord } from "../types/categoryPortal";

export interface CategoryWinnerRpcRow {
  edition_year: number;
  edition_month: number;
  edition_date: string;
  competition_id: string;
  competition_slug: string;
  competition_title: string;
  competition_level: CanonicalCompetitionLevel;
  result_id: string;
  result_outcome: "first" | "second" | "third";
  profile_id: string | null;
  profile_slug: string | null;
  full_name: string;
  public_affiliation: string;
  is_external: boolean;
}

export class CompetitionCategoryPortalRepository {
  constructor(private supabase: SupabaseClient<any>) {}

  async getActiveCategories(): Promise<CompetitionCategoryRecord[]> {
    const { data, error } = await this.supabase
      .from("competition_categories")
      .select("id, name, slug, description, display_order, is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching active categories:", error);
      throw new Error(`Database error fetching active categories: ${error.message}`, { cause: error });
    }

    return (data || []) as CompetitionCategoryRecord[];
  }

  async getLatestCategoryWinners(
    categoryId: string
  ): Promise<CategoryWinnerRpcRow[]> {
    const { data, error } = await this.supabase.rpc(
      "get_latest_category_winners",
      {
        p_category_id: categoryId,
      }
    );

    if (error) {
      console.error("Error fetching latest category winners:", error);
      throw new Error(`Database error fetching latest winners: ${error.message}`, { cause: error });
    }

    return (data || []) as unknown as CategoryWinnerRpcRow[];
  }

  async getCategoryWinnersArchive(
    categoryId: string,
    year: number,
    month: number,
    level?: CanonicalCompetitionLevel,
    limit: number = 100,
    offset: number = 0
  ): Promise<CategoryWinnerRpcRow[]> {
    const { data, error } = await this.supabase.rpc(
      "get_category_winners_archive",
      {
        p_category_id: categoryId,
        p_year: year,
        p_month: month,
        p_level: level || null,
        p_limit: limit,
        p_offset: offset,
      }
    );

    if (error) {
      console.error("Error fetching category winners archive:", error);
      throw new Error(`Database error fetching archive winners: ${error.message}`, { cause: error });
    }

    return (data || []) as unknown as CategoryWinnerRpcRow[];
  }
}
