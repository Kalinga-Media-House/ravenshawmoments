import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

export class GalleryRepository extends BaseRepository<Database["public"]["Tables"]["gallery_items"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "gallery_items";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async getByDepartmentSlug(slug: string) {
    const { data, error } = await this.context.supabase
      .rpc("department_get_gallery", { p_slug: slug });

    if (error) {
      const { data: fallbackData, error: fallbackError } = await this.context.supabase
        .from("gallery_albums")
        .select(`
          *,
          departments!inner(id, slug),
          gallery_items(*, media_files(*))
        `)
        .eq("departments.slug", slug)
        .eq("entity_type", "department")
        .eq("status", "published")
        .is("deleted_at", null);

      if (fallbackError) {
        throw new DatabaseError(`Failed to fetch gallery for department ${slug}`, fallbackError);
      }
      return fallbackData;
    }

    return data;
  }

  async getByLevel(level: string) {
    // Currently, gallery albums are not explicitly linked to course levels like "+2"
    // Return empty to support RHSS dynamic content without schema changes
    return [];
  }
}
