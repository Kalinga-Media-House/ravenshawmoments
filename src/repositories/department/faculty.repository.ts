import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

export class FacultyRepository extends BaseRepository<Database["public"]["Tables"]["department_teachers"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "department_teachers";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async getByDepartmentSlug(slug: string) {
    // Attempting to call specific RPC if it exists, fallback to standard RLS query
    const { data, error } = await this.context.supabase
      .rpc("department_get_faculty", { p_slug: slug });

    if (error) {
      // Fallback to normalized table fetch relying on RLS
      const { data: fallbackData, error: fallbackError } = await this.context.supabase
        .from("department_teachers")
        .select(`
          *,
          profiles!inner(*),
          departments!inner(id, slug)
        `)
        .eq("departments.slug", slug)
        .eq("status", "active")
        .is("deleted_at", null);

      if (fallbackError) {
        throw new DatabaseError(`Failed to fetch faculty for department ${slug}`, fallbackError);
      }
      return fallbackData;
    }

    return data;
  }


}
