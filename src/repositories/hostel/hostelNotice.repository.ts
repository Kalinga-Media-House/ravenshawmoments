import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelNoticeRow = Database["public"]["Tables"]["hostel_notices"]["Row"];

export class HostelNoticeRepository extends BaseRepository<HostelNoticeRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_notices";

  async getNoticesByHostelId(hostelId: string, onlyPublished: boolean = false): Promise<any[]> {
    let query = (this.supabase as any)
      .from(this.tableName)
      .select("*, author:author_id(*)")
      .eq("hostel_id", hostelId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (onlyPublished) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query;
    if (error) throw new Error("Failed to fetch notices.");
    return data;
  }
}
