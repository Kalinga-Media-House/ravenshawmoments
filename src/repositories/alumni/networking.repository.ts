import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { BaseRepository } from "../base.repository";

type ConnectionRow = Database["public"]["Tables"]["alumni_connections"]["Row"];

export class NetworkingRepository { protected supabase: SupabaseClient<Database>;
  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async sendRequest(requesterId: string, recipientId: string): Promise<ConnectionRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_connections")
      .insert({ requester_id: requesterId, recipient_id: recipientId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRequestStatus(id: string, recipientId: string, status: "accepted" | "rejected"): Promise<ConnectionRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_connections")
      .update({ status })
      .eq("id", id)
      .eq("recipient_id", recipientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getConnections(profileId: string) {
    const { data, error } = await (this.supabase as any)
      .from("alumni_connections")
      .select(`
        *,
        requester:profiles!alumni_connections_requester_id_fkey(
          id, full_name, 
          alumni_profiles(current_position, company)
        ),
        recipient:profiles!alumni_connections_recipient_id_fkey(
          id, full_name, 
          alumni_profiles(current_position, company)
        )
      `)
      .or(`requester_id.eq.${profileId},recipient_id.eq.${profileId}`)
      .eq("status", "accepted");

    if (error) throw error;
    return data;
  }

  async getPendingRequests(profileId: string) {
    const { data, error } = await (this.supabase as any)
      .from("alumni_connections")
      .select(`
        *,
        requester:profiles!alumni_connections_requester_id_fkey(
          id, full_name, 
          alumni_profiles(current_position, company)
        )
      `)
      .eq("recipient_id", profileId)
      .eq("status", "pending");

    if (error) throw error;
    return data;
  }
}
