import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

type HostelRow = Database["public"]["Tables"]["hostel_residents"]["Row"];
export type HostelAssignment = HostelRow;

export class HostelRepository extends BaseRepository<HostelRow> {
  protected tableName: keyof Database["public"]["Tables"] = "hostel_residents";

  async findByProfileId(profileId: string): Promise<HostelRow[]> {
    const { data, error } = await this.supabase
      .from("hostel_residents")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch hostel assignments: ${error.message}`, error);
    }

    return (data as any) || [];
  }

  async getCurrentAssignment(profileId: string): Promise<HostelRow | null> {
    const { data, error } = await this.supabase
      .from("hostel_residents")
      .select("*")
      .eq("profile_id", profileId)
      .eq("is_alumni", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError(`Failed to fetch current hostel assignment: ${error.message}`, error);
    }

    return data as any;
  }

  async getHistory(profileId: string): Promise<HostelRow[]> {
    const { data, error } = await this.supabase
      .from("hostel_residents")
      .select("*")
      .eq("profile_id", profileId)
      .eq("is_alumni", false)
      .order("end_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch hostel history: ${error.message}`, error);
    }

    return (data as any) || [];
  }
}
