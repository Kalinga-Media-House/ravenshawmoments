import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

export class StudentRepository extends BaseRepository<Database["public"]["Tables"]["department_students"]["Row"]> {
  protected tableName: keyof Database["public"]["Tables"] = "department_students";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async getByDepartmentSlug(slug: string) {
    const { data, error } = await this.context.supabase
      .rpc("department_get_students", { p_slug: slug });

    if (error) {
      const { data: fallbackData, error: fallbackError } = await this.context.supabase
        .from("department_students")
        .select(`
          *,
          profiles!inner(*),
          departments!inner(id, slug)
        `)
        .eq("departments.slug", slug)
        .eq("status", "active")
        .is("deleted_at", null);

      if (fallbackError) {
        throw new DatabaseError(`Failed to fetch students for department ${slug}`, fallbackError);
      }
      return fallbackData;
    }

    return data;
  }

  async getByLevelAndStream(level: string, filters?: { stream?: string, batch_year?: string, search?: string }) {
    let query = this.context.supabase
      .from("profiles")
      .select(`
        id as profile_id,
        id,
        auth_user_id,
        full_name,
        avatar_url,
        bio,
        level,
        stream,
        batch_year,
        profile_type
      `)
      .eq("profile_type", "student")
      .eq("level", level);

    if (filters?.stream) {
      query = query.eq("stream", filters.stream);
    }
    if (filters?.batch_year) {
      query = query.eq("batch_year", filters.batch_year);
    }
    if (filters?.search) {
      query = query.ilike("full_name", `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new DatabaseError(`Failed to fetch students for level ${level}`, error);
    }

    // Map to ExtendedDepartmentStudent / DepartmentStudent format
    return data.map((profile: any) => ({
      id: profile.id, // fake department_student id
      department_program_id: "rhss-program",
      profile_id: profile.profile_id,
      batch_id: profile.batch_year || "unknown",
      status: "active",
      is_verified_by_cr: true, // Auto-verified for display purposes or handle real verification
      is_featured: false,
      profile: {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        level: profile.level,
        stream: profile.stream,
        profile_type: profile.profile_type,
      },
      batch: { name: profile.batch_year ? `Batch of ${profile.batch_year}` : "Academic Batch" },
      program: { program_name: profile.stream || "General" }
    }));
  }
}
