// =============================================================================
// Ravenshaw Moments
// File      : src/lib/repositories/organization.repository.ts
// Purpose   : Data access layer for Organization Ecosystem
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./base.repository";
import {
  Organization,
  OrganizationMember,
  OrganizationAdvisor,
  OrganizationTypeEnum,
} from "@/types/organization";

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "organizations");
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("is_verified", true)
      .single();

    if (error) return null;
    return data as Organization;
  }

  async findActiveByType(orgType: OrganizationTypeEnum): Promise<Organization[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("org_type", orgType)
      .eq("is_active", true)
      .eq("is_verified", true)
      .order("name", { ascending: true });

    if (error) return [];
    return data as Organization[];
  }

  async create(payload: Partial<Organization>): Promise<Organization> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  }

  async update(id: string, payload: Partial<Organization>): Promise<Organization> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  }
}

export class OrganizationMemberRepository extends BaseRepository<OrganizationMember> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "organization_members");
  }

  async findActiveMembersByOrg(orgId: string): Promise<OrganizationMember[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, profiles(*)")
      .eq("org_id", orgId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as OrganizationMember[];
  }

  async findOfficeBearersByOrg(orgId: string): Promise<OrganizationMember[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, profiles(*)")
      .eq("org_id", orgId)
      .eq("status", "active")
      .in("role", ["executive", "office_bearer"])
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as OrganizationMember[];
  }

  async checkExistingActiveRole(orgId: string, designation: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id")
      .eq("org_id", orgId)
      .eq("status", "active")
      .ilike("designation", designation)
      .limit(1);

    if (error || !data) return false;
    return data.length > 0;
  }

  async create(payload: Partial<OrganizationMember>): Promise<OrganizationMember> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationMember;
  }

  async update(id: string, payload: Partial<OrganizationMember>): Promise<OrganizationMember> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationMember;
  }
}

export class OrganizationAdvisorRepository extends BaseRepository<OrganizationAdvisor> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "organization_advisors");
  }

  async findCurrentByOrg(orgId: string): Promise<OrganizationAdvisor[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, profiles(*)")
      .eq("org_id", orgId)
      .eq("is_current", true)
      .order("start_date", { ascending: false });

    if (error) return [];
    return data as OrganizationAdvisor[];
  }

  async countCurrentAdvisors(orgId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("is_current", true);

    if (error) return 0;
    return count ?? 0;
  }

  async create(payload: Partial<OrganizationAdvisor>): Promise<OrganizationAdvisor> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationAdvisor;
  }

  async update(id: string, payload: Partial<OrganizationAdvisor>): Promise<OrganizationAdvisor> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationAdvisor;
  }
}
