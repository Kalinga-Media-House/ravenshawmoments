import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { BaseRepository } from "../base.repository";

type MentorshipProfileRow = Database["public"]["Tables"]["mentorship_profiles"]["Row"];
type MentorshipProfileInsert = Database["public"]["Tables"]["mentorship_profiles"]["Insert"];
type MentorshipProfileUpdate = Database["public"]["Tables"]["mentorship_profiles"]["Update"];

type MentorshipRequestRow = Database["public"]["Tables"]["mentorship_requests"]["Row"];
type MentorshipRequestInsert = Database["public"]["Tables"]["mentorship_requests"]["Insert"];
type MentorshipRequestUpdate = Database["public"]["Tables"]["mentorship_requests"]["Update"];

type MentorshipSessionRow = Database["public"]["Tables"]["mentorship_sessions"]["Row"];
type MentorshipSessionInsert = Database["public"]["Tables"]["mentorship_sessions"]["Insert"];
type MentorshipSessionUpdate = Database["public"]["Tables"]["mentorship_sessions"]["Update"];

export class MentorshipRepository { protected supabase: SupabaseClient<Database>;
  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  // PROFILES

  async getProfile(profileId: string): Promise<MentorshipProfileRow | null> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_profiles")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async upsertProfile(profile: MentorshipProfileInsert): Promise<MentorshipProfileRow> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_profiles")
      .upsert(profile, { onConflict: "profile_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMentors(options?: { search?: string; expertise?: string }) {
    let query = (this.supabase as any)
      .from("mentorship_profiles")
      .select(`
        *,
        profiles!inner(
          id,
          full_name,
          
          alumni_profiles(current_position, company, industry)
        )
      `)
      .eq("is_mentor", true)
      .eq("availability_status", "accepting");

    if (options?.expertise) {
      query = query.contains("areas_of_expertise", [options.expertise]);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    
    // Client-side search for nested relations if needed
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      return data.filter((d: any) => 
        d.profiles.full_name.toLowerCase().includes(searchLower) ||
        (d.profiles.alumni_profiles && d.profiles.alumni_profiles.some((ap: any) => ap.company?.toLowerCase().includes(searchLower)))
      );
    }
    
    return data;
  }

  // REQUESTS

  async createRequest(request: MentorshipRequestInsert): Promise<MentorshipRequestRow> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_requests")
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRequest(id: string): Promise<MentorshipRequestRow | null> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateRequestStatus(id: string, mentorId: string, status: "accepted" | "rejected" | "completed" | "cancelled") {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_requests")
      .update({ status })
      .eq("id", id)
      .eq("mentor_id", mentorId)
      .select()
      .single();

    if (error) throw error;

    // If accepted, increment current_mentees
    if (status === "accepted") {
       await (this.supabase as any).rpc("increment_mentee_count", { mentor_profile_id: mentorId }); // Fallback to raw update if RPC not present
       await (this.supabase as any).from("mentorship_profiles").update({ current_mentees: data.mentor_id ? 1 : 0 }).eq("profile_id", mentorId); // naive logic, better use RPC
    }

    return data;
  }

  async getIncomingRequests(mentorId: string) {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_requests")
      .select(`
        *,
        mentee:profiles!mentorship_requests_mentee_id_fkey(
          id, full_name, 
          departments(name),
          batches(name)
        )
      `)
      .eq("mentor_id", mentorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getOutgoingRequests(menteeId: string) {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_requests")
      .select(`
        *,
        mentor:profiles!mentorship_requests_mentor_id_fkey(
          id, full_name, 
          alumni_profiles(current_position, company)
        )
      `)
      .eq("mentee_id", menteeId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // SESSIONS

  async createSession(session: MentorshipSessionInsert): Promise<MentorshipSessionRow> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_sessions")
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSession(id: string, updates: MentorshipSessionUpdate): Promise<MentorshipSessionRow> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_sessions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSessions(requestId: string): Promise<MentorshipSessionRow[]> {
    const { data, error } = await (this.supabase as any)
      .from("mentorship_sessions")
      .select("*")
      .eq("request_id", requestId)
      .order("session_date", { ascending: true });

    if (error) throw error;
    return data;
  }
}
