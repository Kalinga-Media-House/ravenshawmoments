import { BaseRepository } from "../base.repository";
import { Database } from "@/types/database.types";
import { DatabaseError } from "@/lib/errors";

export type HostelRow = Database["public"]["Tables"]["hostels"]["Row"];

export class HostelRepository extends BaseRepository<HostelRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostels";

  async getBySlug(slug: string): Promise<HostelRow | null> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError(`Failed to fetch hostel by slug ${slug}`, error);
    }

    return data as HostelRow;
  }
}
