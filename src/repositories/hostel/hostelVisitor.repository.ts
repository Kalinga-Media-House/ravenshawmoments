import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelVisitorRow = Database["public"]["Tables"]["hostel_visitors"]["Row"];

export class HostelVisitorRepository extends BaseRepository<HostelVisitorRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_visitors";

  async getVisitorsByHostelId(hostelId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, host_profile:host_profile_id(*), approved_by_profile:approved_by(*)")
      .eq("hostel_id", hostelId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch visitors.");
    return data;
  }

  async getVisitorsByProfileId(profileId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, hostel:hostel_id(*)")
      .eq("host_profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch profile visitors.");
    return data;
  }
}
