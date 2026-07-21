import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelBmcRow = Database["public"]["Tables"]["hostel_bmcs"]["Row"];

export class HostelBmcRepository extends BaseRepository<HostelBmcRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_bmcs";

  async getBmcMembersByHostelId(hostelId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, profile:profile_id(*)")
      .eq("hostel_id", hostelId)
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (error) throw new Error("Failed to fetch BMC members.");
    return data;
  }
}
