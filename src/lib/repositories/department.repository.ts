// =============================================================================
// Ravenshaw Moments
// File      : src/lib/repositories/department.repository.ts
// Purpose   : Universal Department Ecosystem Repository Layer (Database Encapsulation)
//             No Business Logic | No Validation | No UI | Database Access Only
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./base.repository";

type DbRow = Record<string, unknown>;

// =============================================================================
// Typed Repository Exceptions
// =============================================================================

export class DepartmentRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DepartmentRepositoryError";
  }
}

export class DepartmentOptimisticLockError extends DepartmentRepositoryError {
  constructor(
    message = "Optimistic concurrency check failed: record has been modified by another transaction."
  ) {
    super(message);
    this.name = "DepartmentOptimisticLockError";
  }
}

// =============================================================================
// 1. DepartmentRepository
// =============================================================================

export class DepartmentRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "departments");
  }

  async findBySlug(slug: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("departments")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findBySlug): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async findActive(
    limit = 50,
    offset = 0,
    sortBy = "name",
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findActive): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async searchDepartments(query: string, limit = 20, offset = 0): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,short_name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (searchDepartments): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async createDepartment(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("departments")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (createDepartment): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateDepartment(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("departments").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateDepartment): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Department not found or update failed.");
    }
    return data as DbRow;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("departments")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (softDelete): ${error.message}`);
    }
  }

  async getStatistics(departmentId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_statistics")
      .select("*")
      .eq("department_id", departmentId)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (getStatistics): ${error.message}`);
    }
    return data as DbRow | null;
  }
}

// =============================================================================
// 2. DepartmentCRRepository
// =============================================================================

export class DepartmentCRRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_crs");
  }

  async findByDepartmentId(
    departmentId: string,
    activeOnly = true,
    limit = 50,
    offset = 0
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_crs")
      .select("*, profiles(id, full_name, username, avatar_url, email)")
      .eq("department_id", departmentId);

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query
      .order("term_start_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId CR): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findByProfileId(profileId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("department_crs")
      .select("*, departments(id, name, slug)")
      .eq("profile_id", profileId)
      .eq("is_active", true);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByProfileId CR): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findByDepartmentAndProfile(departmentId: string, profileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_crs")
      .select("*")
      .eq("department_id", departmentId)
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(
        `Repository Error (findByDepartmentAndProfile CR): ${error.message}`
      );
    }
    return data as DbRow | null;
  }

  async createCR(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_crs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (createCR): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateCR(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_crs").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateCR): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("CR record not found or update failed.");
    }
    return data as DbRow;
  }

  async removeCR(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("department_crs")
      .update({ is_active: false, term_end_date: new Date().toISOString().split("T")[0] })
      .eq("id", id);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (removeCR): ${error.message}`);
    }
  }
}

// =============================================================================
// 3. DepartmentTeacherRepository
// =============================================================================

export class DepartmentTeacherRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_teachers");
  }

  async findByDepartmentId(
    departmentId: string,
    activeOnly = true,
    limit = 50,
    offset = 0,
    sortBy = "display_order",
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_teachers")
      .select("*, profiles(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId);

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId Teacher): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findHodByDepartmentId(departmentId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_teachers")
      .select("*, profiles(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId)
      .eq("is_hod", true)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findHodByDepartmentId): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async findByProfileId(profileId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("department_teachers")
      .select("*, departments(id, name, slug)")
      .eq("profile_id", profileId)
      .eq("is_active", true);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByProfileId Teacher): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async addTeacher(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_teachers")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (addTeacher): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateTeacher(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_teachers").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateTeacher): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Teacher record not found or update failed.");
    }
    return data as DbRow;
  }

  async removeTeacher(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("department_teachers")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (removeTeacher): ${error.message}`);
    }
  }
}

// =============================================================================
// 4. DepartmentStudentRepository
// =============================================================================

export class DepartmentStudentRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_students");
  }

  async findByDepartmentId(
    departmentId: string,
    filter?: { batchId?: string; isVerified?: boolean; isFeatured?: boolean },
    limit = 50,
    offset = 0
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_students")
      .select("*, profiles(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId)
      .eq("is_active", true);

    if (filter?.batchId) {
      query = query.eq("batch_id", filter.batchId);
    }
    if (filter?.isVerified !== undefined) {
      query = query.eq("is_verified_by_cr", filter.isVerified);
    }
    if (filter?.isFeatured !== undefined) {
      query = query.eq("is_featured", filter.isFeatured);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId Student): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findByProfileId(profileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_students")
      .select("*, departments(id, name, slug)")
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByProfileId Student): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async addStudent(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_students")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (addStudent): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateStudent(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_students").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateStudent): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Student record not found or update failed.");
    }
    return data as DbRow;
  }

  async verifyStudent(id: string, verifiedBy: string, isVerified: boolean): Promise<DbRow> {
    const updateData: DbRow = {
      is_verified_by_cr: isVerified,
      verified_by: isVerified ? verifiedBy : null,
      verified_at: isVerified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from("department_students")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (verifyStudent): ${error.message}`);
    }
    return data as DbRow;
  }
}

// =============================================================================
// 5. DepartmentNoticeRepository
// =============================================================================

export class DepartmentNoticeRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_notices");
  }

  async findByDepartmentId(
    departmentId: string,
    filter?: { isPublished?: boolean; isPinned?: boolean; targetAudience?: string },
    limit = 50,
    offset = 0,
    sortBy = "published_at",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_notices")
      .select("*, profiles!published_by(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId);

    if (filter?.isPublished !== undefined) {
      query = query.eq("is_published", filter.isPublished);
    }
    if (filter?.isPinned !== undefined) {
      query = query.eq("is_pinned", filter.isPinned);
    }
    if (filter?.targetAudience) {
      query = query.or(`target_audience.eq.all,target_audience.eq.${filter.targetAudience}`);
    }

    const { data, error } = await query
      .order("is_pinned", { ascending: false })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId Notice): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findBySlug(departmentId: string, slug: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_notices")
      .select("*, profiles!published_by(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findBySlug Notice): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async createNotice(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_notices")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (createNotice): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateNotice(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_notices").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateNotice): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Notice record not found or update failed.");
    }
    return data as DbRow;
  }

  async incrementViewCount(id: string): Promise<void> {
    const { error } = await this.supabase.rpc("increment_department_notice_view", {
      notice_uuid: id,
    });
    // Fallback if RPC does not exist
    if (error) {
      const { data: notice } = await this.supabase
        .from("department_notices")
        .select("view_count")
        .eq("id", id)
        .maybeSingle();
      if (notice) {
        await this.supabase
          .from("department_notices")
          .update({ view_count: ((notice.view_count as number) || 0) + 1 })
          .eq("id", id);
      }
    }
  }

  async deleteNotice(id: string): Promise<void> {
    const { error } = await this.supabase.from("department_notices").delete().eq("id", id);
    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (deleteNotice): ${error.message}`);
    }
  }
}

// =============================================================================
// 6. DepartmentEventRepository
// =============================================================================

export class DepartmentEventRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_events");
  }

  async findByDepartmentId(
    departmentId: string,
    filter?: { eventType?: string; isPublished?: boolean; isFeatured?: boolean; upcomingOnly?: boolean },
    limit = 50,
    offset = 0,
    sortBy = "event_start_time",
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_events")
      .select("*, profiles!coordinator_profile_id(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId);

    if (filter?.eventType) {
      query = query.eq("event_type", filter.eventType);
    }
    if (filter?.isPublished !== undefined) {
      query = query.eq("is_published", filter.isPublished);
    }
    if (filter?.isFeatured !== undefined) {
      query = query.eq("is_featured", filter.isFeatured);
    }
    if (filter?.upcomingOnly) {
      query = query.gte("event_end_time", new Date().toISOString());
    }

    const { data, error } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId Event): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findBySlug(departmentId: string, slug: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_events")
      .select("*, profiles!coordinator_profile_id(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findBySlug Event): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async createEvent(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_events")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (createEvent): ${error.message}`);
    }
    return data as DbRow;
  }

  async updateEvent(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_events").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updateEvent): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Event record not found or update failed.");
    }
    return data as DbRow;
  }

  async incrementViewCount(id: string): Promise<void> {
    const { data: event } = await this.supabase
      .from("department_events")
      .select("view_count")
      .eq("id", id)
      .maybeSingle();
    if (event) {
      await this.supabase
        .from("department_events")
        .update({ view_count: ((event.view_count as number) || 0) + 1 })
        .eq("id", id);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await this.supabase.from("department_events").delete().eq("id", id);
    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (deleteEvent): ${error.message}`);
    }
  }
}

// =============================================================================
// 7. DepartmentPublicationRepository
// =============================================================================

export class DepartmentPublicationRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "department_publications");
  }

  async findByDepartmentId(
    departmentId: string,
    filter?: { publicationType?: string; isPublic?: boolean; academicSessionId?: string },
    limit = 50,
    offset = 0,
    sortBy = "publish_date",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<DbRow[]> {
    let query = this.supabase
      .from("department_publications")
      .select("*, profiles!uploaded_by(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId);

    if (filter?.publicationType) {
      query = query.eq("publication_type", filter.publicationType);
    }
    if (filter?.isPublic !== undefined) {
      query = query.eq("is_public", filter.isPublic);
    }
    if (filter?.academicSessionId) {
      query = query.eq("academic_session_id", filter.academicSessionId);
    }

    const { data, error } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findByDepartmentId Publication): ${error.message}`);
    }
    return (data || []) as DbRow[];
  }

  async findBySlug(departmentId: string, slug: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("department_publications")
      .select("*, profiles!uploaded_by(id, full_name, username, avatar_url)")
      .eq("department_id", departmentId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (findBySlug Publication): ${error.message}`);
    }
    return data as DbRow | null;
  }

  async createPublication(payload: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("department_publications")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (createPublication): ${error.message}`);
    }
    return data as DbRow;
  }

  async updatePublication(id: string, payload: DbRow, expectedUpdatedAt?: string): Promise<DbRow> {
    let query = this.supabase.from("department_publications").update(payload).eq("id", id);

    if (expectedUpdatedAt) {
      query = query.eq("updated_at", expectedUpdatedAt);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (updatePublication): ${error.message}`);
    }
    if (!data && expectedUpdatedAt) {
      throw new DepartmentOptimisticLockError();
    }
    if (!data) {
      throw new DepartmentRepositoryError("Publication record not found or update failed.");
    }
    return data as DbRow;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const { data: pub } = await this.supabase
      .from("department_publications")
      .select("download_count")
      .eq("id", id)
      .maybeSingle();
    if (pub) {
      await this.supabase
        .from("department_publications")
        .update({ download_count: ((pub.download_count as number) || 0) + 1 })
        .eq("id", id);
    }
  }

  async deletePublication(id: string): Promise<void> {
    const { error } = await this.supabase.from("department_publications").delete().eq("id", id);
    if (error) {
      throw new DepartmentRepositoryError(`Repository Error (deletePublication): ${error.message}`);
    }
  }
}
