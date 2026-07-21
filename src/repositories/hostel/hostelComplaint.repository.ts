import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelComplaintRow = Database["public"]["Tables"]["hostel_complaints"]["Row"];

export class HostelComplaintRepository extends BaseRepository<HostelComplaintRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_complaints";

  async getComplaintsByHostelId(hostelId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, profile:profile_id(*), assigned_to:assigned_to_profile_id(*)")
      .eq("hostel_id", hostelId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch complaints.");
    return data;
  }

  async getComplaintsByProfileId(profileId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, hostel:hostel_id(*), assigned_to:assigned_to_profile_id(*)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch profile complaints.");
    return data;
  }
}
