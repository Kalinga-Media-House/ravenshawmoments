import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

export class AchievementRepository extends BaseRepository<Database["public"]["Tables"]["achievements"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "achievements";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async getByDepartmentSlug(slug: string) {
    const { data, error } = await this.context.supabase
      .rpc("department_get_achievements", { p_slug: slug });

    if (error) {
      const { data: fallbackData, error: fallbackError } = await this.context.supabase
        .from("achievements")
        .select(`
          *,
          departments!inner(id, slug),
          achievement_categories(*),
          achievement_types(*)
        `)
        .eq("departments.slug", slug)
        .eq("entity_type", "department")
        .eq("status", "published")
        .is("deleted_at", null);

      if (fallbackError) {
        throw new DatabaseError(`Failed to fetch achievements for department ${slug}`, fallbackError);
      }
      return fallbackData;
    }

    return data;
  }

  async getByLevel(level: string) {
    // Currently, achievements are not explicitly linked to course levels like "+2"
    // To support RHSS dynamic content without schema changes, return empty or
    // fetch profile-level achievements for users with level = '+2' if supported.
    return [];
  }
}
