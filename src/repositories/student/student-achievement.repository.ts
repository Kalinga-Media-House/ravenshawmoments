import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

type AchievementRow = Database["public"]["Tables"]["achievements"]["Row"];
export type Achievement = AchievementRow;

export class StudentAchievementRepository extends BaseRepository<AchievementRow> {
  protected tableName: keyof Database["public"]["Tables"] = "achievements";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async findByProfileId(profileId: string): Promise<AchievementRow[]> {
    const { data, error } = await this.supabase
      .from("achievements")
      .select("*, achievement_recipients!inner(*)")
      .eq("achievement_recipients.profile_id", profileId)
      .order("achievement_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch achievements: ${error.message}`, error);
    }

    return (data as any) || [];
  }

  async findByCategory(profileId: string, categoryId: string): Promise<AchievementRow[]> {
    const { data, error } = await this.supabase
      .from("achievements")
      .select("*, achievement_recipients!inner(*)")
      .eq("achievement_recipients.profile_id", profileId)
      .eq("category_id", categoryId)
      .order("achievement_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch achievements by category: ${error.message}`, error);
    }

    return (data as any) || [];
  }
}
