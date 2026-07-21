import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

export class ProgramRepository extends BaseRepository<Database["public"]["Tables"]["department_programs"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "department_programs";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async getByDepartmentSlug(slug: string) {
    const { data, error } = await this.context.supabase
      .rpc("department_get_department_programs", { p_slug: slug });

    if (error) {
      const { data: fallbackData, error: fallbackError } = await this.context.supabase
        .from("department_programs")
        .select(`*, departments!inner(id, slug)`)
        .eq("departments.slug", slug)
        .eq("status", "active")
        .is("deleted_at", null);

      if (fallbackError) {
        throw new DatabaseError(`Failed to fetch department_programs for department ${slug}`, fallbackError);
      }
      return fallbackData;
    }

    return data;
  }
}
