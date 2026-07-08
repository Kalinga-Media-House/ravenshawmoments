// =============================================================================
// Ravenshaw Moments
// File      : src/lib/repositories/hostel.repository.ts
// Purpose   : Universal Hostel Ecosystem & Housing Hub Repositories
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./base.repository";
import {
  Hostel,
  HostelWarden,
  HostelBMC,
  HostelResident,
  HostelTypeEnum,
} from "@/types/hostel";

// =============================================================================
// 1. HostelRepository
// =============================================================================

export class HostelRepository extends BaseRepository<Hostel> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "hostels");
  }

  async findBySlug(slug: string): Promise<Hostel | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return null;
    return data as Hostel;
  }

  async findVerifiedHostels(
    typeFilter?: HostelTypeEnum,
    limit = 50,
    offset = 0
  ): Promise<{ data: Hostel[]; count: number }> {
    let query = this.supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .eq("is_verified", true);

    if (typeFilter) {
      query = query.eq("hostel_type", typeFilter);
    }

    const { data, error, count } = await query
      .order("is_sponsored", { ascending: false })
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) return { data: [], count: 0 };
    return { data: (data || []) as Hostel[], count: count || 0 };
  }

  async createHostel(payload: Partial<Hostel>): Promise<Hostel> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to create hostel: ${error.message}`);
    return data as Hostel;
  }

  async updateHostel(id: string, payload: Partial<Hostel>): Promise<Hostel> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to update hostel: ${error.message}`);
    return data as Hostel;
  }
}

// =============================================================================
// 2. HostelWardenRepository
// =============================================================================

export class HostelWardenRepository extends BaseRepository<HostelWarden> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "hostel_wardens");
  }

  async findCurrentWarden(hostelId: string): Promise<HostelWarden | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId)
      .eq("is_current", true)
      .single();

    if (error) return null;
    return data as HostelWarden;
  }

  async archiveCurrentWardens(hostelId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_current: false, updated_at: new Date().toISOString() })
      .eq("hostel_id", hostelId)
      .eq("is_current", true);

    if (error) throw new Error(`Failed to archive incumbent wardens: ${error.message}`);
  }

  async createWarden(payload: Partial<HostelWarden>): Promise<HostelWarden> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to create warden: ${error.message}`);
    return data as HostelWarden;
  }
}

// =============================================================================
// 3. HostelBMCRepository
// =============================================================================

export class HostelBMCRepository extends BaseRepository<HostelBMC> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "hostel_bmcs");
  }

  async findActiveBMCCouncil(hostelId: string, termYear?: string): Promise<HostelBMC[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId)
      .eq("is_active", true);

    if (termYear) {
      query = query.eq("term_year", termYear);
    }

    const { data, error } = await query.order("created_at", { ascending: true });
    if (error) return [];
    return (data || []) as HostelBMC[];
  }

  async findActivePresident(hostelId: string, termYear: string): Promise<HostelBMC | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId)
      .eq("term_year", termYear)
      .eq("role_title", "general_secretary")
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data as HostelBMC;
  }

  async createBMCMember(payload: Partial<HostelBMC>): Promise<HostelBMC> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to assign BMC council member: ${error.message}`);
    return data as HostelBMC;
  }

  async updateBMCMember(id: string, payload: Partial<HostelBMC>): Promise<HostelBMC> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to update BMC council member: ${error.message}`);
    return data as HostelBMC;
  }
}

// =============================================================================
// 4. HostelResidentRepository
// =============================================================================

export class HostelResidentRepository extends BaseRepository<HostelResident> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "hostel_residents");
  }

  async findByProfileAndHostel(
    profileId: string,
    hostelId: string
  ): Promise<HostelResident | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("profile_id", profileId)
      .eq("hostel_id", hostelId)
      .single();

    if (error) return null;
    return data as HostelResident;
  }

  async findResidentsByHostel(
    hostelId: string,
    isAlumni = false,
    limit = 50,
    offset = 0
  ): Promise<{ data: HostelResident[]; count: number }> {
    const { data, error, count } = await this.supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .eq("hostel_id", hostelId)
      .eq("is_alumni", isAlumni)
      .eq("is_verified_by_bmc", true)
      .order("room_number", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) return { data: [], count: 0 };
    return { data: (data || []) as HostelResident[], count: count || 0 };
  }

  async createResident(payload: Partial<HostelResident>): Promise<HostelResident> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to assign resident: ${error.message}`);
    return data as HostelResident;
  }

  async updateResident(id: string, payload: Partial<HostelResident>): Promise<HostelResident> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(`Failed to update resident record: ${error.message}`);
    return data as HostelResident;
  }
}
