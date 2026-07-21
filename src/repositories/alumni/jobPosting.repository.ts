import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { BaseRepository } from "../base.repository";

type JobPostingRow = Database["public"]["Tables"]["alumni_job_postings"]["Row"];
type JobPostingInsert = Database["public"]["Tables"]["alumni_job_postings"]["Insert"];
type JobPostingUpdate = Database["public"]["Tables"]["alumni_job_postings"]["Update"];

export class JobPostingRepository { protected supabase: SupabaseClient<Database>;
  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async getJob(id: string): Promise<JobPostingRow | null> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_job_postings")
      .select(`
        *,
        profiles!inner(
          id, full_name, 
          alumni_profiles(linkedin_url)
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createJob(job: JobPostingInsert): Promise<JobPostingRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_job_postings")
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateJob(id: string, postedBy: string, updates: JobPostingUpdate): Promise<JobPostingRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_job_postings")
      .update(updates)
      .eq("id", id)
      .eq("posted_by", postedBy)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteJob(id: string, postedBy: string): Promise<void> {
    const { error } = await (this.supabase as any)
      .from("alumni_job_postings")
      .delete()
      .eq("id", id)
      .eq("posted_by", postedBy);

    if (error) throw error;
  }

  async getActiveJobs(options?: { search?: string; type?: string; location?: string }) {
    let query = (this.supabase as any)
      .from("alumni_job_postings")
      .select(`
        *,
        profiles!inner(
          id, full_name, 
        )
      `)
      .eq("status", "active")
      .gte("expiry_date", new Date().toISOString());

    if (options?.type) {
      query = query.eq("employment_type", options.type);
    }
    if (options?.location) {
      query = query.ilike("location", `%${options.location}%`);
    }
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,company.ilike.%${options.search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async getJobsByProfile(profileId: string) {
    const { data, error } = await (this.supabase as any)
      .from("alumni_job_postings")
      .select("*")
      .eq("posted_by", profileId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
}
