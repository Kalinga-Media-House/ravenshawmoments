import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";
import { RepositoryContext } from "../repository.types";

export class ContentRepository extends BaseRepository<Database["public"]["Tables"]["content_items"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "content_items";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }
  
  private context: { supabase: any };

  async getSectionsByDepartmentSlug(slug: string) {
    // CMS Sections are natively returned in the department_get_public_page payload,
    // but if requested individually:
    const { data, error } = await this.context.supabase
      .from("content_items")
      .select(`*, departments!inner(id, slug)`)
      .eq("departments.slug", slug)
      .eq("entity_type", "department")
      .eq("content_type", "page_section")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("display_order", { ascending: true });

    if (error) {
      throw new DatabaseError(`Failed to fetch content sections for department ${slug}`, error);
    }
    return data;
  }
}
