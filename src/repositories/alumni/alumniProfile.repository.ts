import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { BaseRepository } from "../base.repository";

type AlumniProfileRow = Database["public"]["Tables"]["alumni_profiles"]["Row"];
type AlumniProfileInsert = Database["public"]["Tables"]["alumni_profiles"]["Insert"];
type AlumniProfileUpdate = Database["public"]["Tables"]["alumni_profiles"]["Update"];

type AlumniEmploymentRow = Database["public"]["Tables"]["alumni_employment"]["Row"];
type AlumniEmploymentInsert = Database["public"]["Tables"]["alumni_employment"]["Insert"];
type AlumniEmploymentUpdate = Database["public"]["Tables"]["alumni_employment"]["Update"];

type AlumniEducationRow = Database["public"]["Tables"]["alumni_education"]["Row"];
type AlumniEducationInsert = Database["public"]["Tables"]["alumni_education"]["Insert"];
type AlumniEducationUpdate = Database["public"]["Tables"]["alumni_education"]["Update"];

export class AlumniProfileRepository { protected supabase: SupabaseClient<Database>;
  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  // ALUMNI PROFILE

  async getProfile(profileId: string): Promise<AlumniProfileRow | null> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_profiles")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async upsertProfile(profile: AlumniProfileInsert): Promise<AlumniProfileRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_profiles")
      .upsert(profile, { onConflict: "profile_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVerifiedProfiles(options?: {
    search?: string;
    departmentId?: string;
    batchId?: string;
    industry?: string;
    location?: string;
  }) {
    let query = (this.supabase as any)
      .from("alumni_profiles")
      .select(`
        *,
        profiles!inner(
          id,
          full_name,
          batch_year,
          department_name
        )
      `)
      .eq("verification_status", "verified")
      .eq("profile_visibility", "public");

    if (options?.departmentId) {
      query = query.eq("profiles.department_id", options.departmentId);
    }
    if (options?.batchId) {
      query = query.eq("profiles.batch_id", options.batchId);
    }
    if (options?.industry) {
      query = query.ilike("industry", `%${options.industry}%`);
    }
    if (options?.location) {
      query = query.ilike("location", `%${options.location}%`);
    }
    if (options?.search) {
      query = query.or(`full_name.ilike.%${options.search}%,company.ilike.%${options.search}%,current_position.ilike.%${options.search}%`, { foreignTable: "profiles" });
    }

    const { data, error } = await query.order("verification_date", { ascending: false });
    if (error) throw error;
    return data;
  }

  async getPendingProfiles() {
    const { data, error } = await (this.supabase as any)
      .from("alumni_profiles")
      .select(`
        *,
        profiles!inner(
          id,
          full_name,
          email,
          batch_year,
          department_name
        )
      `)
      .eq("verification_status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateVerificationStatus(profileId: string, status: "pending" | "verified" | "rejected", adminId: string) {
    const { data, error } = await (this.supabase as any)
      .from("alumni_profiles")
      .update({
        verification_status: status,
        verified_by: status === "verified" ? adminId : null,
        verification_date: status === "verified" ? new Date().toISOString() : null
      })
      .eq("profile_id", profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // EMPLOYMENT

  async getEmployment(alumniId: string): Promise<AlumniEmploymentRow[]> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_employment")
      .select("*")
      .eq("alumni_id", alumniId)
      .order("is_current", { ascending: false })
      .order("end_date", { ascending: false, nullsFirst: true })
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  }

  async addEmployment(employment: AlumniEmploymentInsert): Promise<AlumniEmploymentRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_employment")
      .insert(employment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEmployment(id: string, alumniId: string, updates: AlumniEmploymentUpdate): Promise<AlumniEmploymentRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_employment")
      .update(updates)
      .eq("id", id)
      .eq("alumni_id", alumniId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEmployment(id: string, alumniId: string): Promise<void> {
    const { error } = await (this.supabase as any)
      .from("alumni_employment")
      .delete()
      .eq("id", id)
      .eq("alumni_id", alumniId);

    if (error) throw error;
  }

  // EDUCATION

  async getEducation(alumniId: string): Promise<AlumniEducationRow[]> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_education")
      .select("*")
      .eq("alumni_id", alumniId)
      .order("end_date", { ascending: false, nullsFirst: true })
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  }

  async addEducation(education: AlumniEducationInsert): Promise<AlumniEducationRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_education")
      .insert(education)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEducation(id: string, alumniId: string, updates: AlumniEducationUpdate): Promise<AlumniEducationRow> {
    const { data, error } = await (this.supabase as any)
      .from("alumni_education")
      .update(updates)
      .eq("id", id)
      .eq("alumni_id", alumniId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEducation(id: string, alumniId: string): Promise<void> {
    const { error } = await (this.supabase as any)
      .from("alumni_education")
      .delete()
      .eq("id", id)
      .eq("alumni_id", alumniId);

    if (error) throw error;
  }
}
