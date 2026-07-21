// =============================================================================
// Ravenshaw Moments
// File      : src/features/organization/services/index.ts
// Purpose   : Universal Organization Ecosystem Service Layer & Business Rule Enforcement
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  OrganizationRepository,
  OrganizationMemberRepository,
  OrganizationAdvisorRepository,
} from "@/lib/repositories";
import {
  Organization,
  OrganizationMember,
  OrganizationAdvisor,
  OrganizationTypeEnum,
} from "@/types/organization";
import {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  CreateOrganizationMemberPayload,
  UpdateOrganizationMemberPayload,
  CreateOrganizationAdvisorPayload,
  UpdateOrganizationAdvisorPayload,
} from "@/lib/validation/organization-system";

// =============================================================================
// Typed Application Errors
// =============================================================================

export class OrganizationNotFoundError extends Error {
  constructor(message = "Organization not found.") {
    super(message);
    this.name = "OrganizationNotFoundError";
  }
}

export class OrganizationBusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationBusinessRuleError";
  }
}

// =============================================================================
// 1. OrganizationService
// =============================================================================

export class OrganizationService {
  static async getOrganizationBySlug(slug: string): Promise<Organization> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationRepository(supabase);

    const org = await repo.findBySlug(slug);
    if (!org) {
      logger.warn(`OrganizationService: Organization not found or inactive for slug: ${slug}`);
      throw new OrganizationNotFoundError();
    }

    return org;
  }

  static async listOrganizationsByType(orgType: OrganizationTypeEnum): Promise<Organization[]> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationRepository(supabase);
    return await repo.findActiveByType(orgType);
  }

  static async listAllActiveOrganizations(): Promise<Organization[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('name', { ascending: true });
    
    if (error) {
      logger.error('OrganizationService: Failed to fetch all active organizations', { error });
      return [];
    }
    return data as Organization[];
  }

  static async createOrganization(payload: CreateOrganizationPayload): Promise<Organization> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationRepository(supabase);

    // Business Rule: Validate uniqueness of slug
    const existing = await repo.findBySlug(payload.slug);
    if (existing) {
      throw new OrganizationBusinessRuleError("An organization with this slug already exists.");
    }

    const org = await repo.create(payload as Partial<Organization>);
    logger.info(`OrganizationService: Created organization ${org.name} (${org.id})`);
    return org;
  }

  static async updateOrganization(id: string, payload: UpdateOrganizationPayload): Promise<Organization> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationRepository(supabase);

    const existing = await repo.findById(id);
    if (!existing) throw new OrganizationNotFoundError();

    const updated = await repo.update(id, payload as Partial<Organization>);
    logger.info(`OrganizationService: Updated organization ${updated.id}`);
    return updated;
  }

  static async getOrganizationById(id: string): Promise<Organization> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationRepository(supabase);
    const org = await repo.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError();
    }
    return org;
  }

  static async getMyOrganizations(profileId: string): Promise<OrganizationMember[]> {
    const supabase = await createClient();
    // @ts-ignore
    const memberRepo = new OrganizationMemberRepository(supabase);
    // Find active memberships for the current user
    const { data, error } = await supabase
      .from('organization_members')
      .select('*, organizations(*)')
      .eq('profile_id', profileId)
      .eq('status', 'active');
    
    if (error) {
      logger.error('Error fetching my organizations', { error });
      return [];
    }
    return data as OrganizationMember[];
  }
}

// =============================================================================
// 2. MemberService
// =============================================================================

export class MemberService {
  static async addMember(payload: CreateOrganizationMemberPayload): Promise<OrganizationMember> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);

    // Validate uniqueness
    const activeMembers = await repo.findActiveMembersByOrg(payload.org_id);
    const existingMember = activeMembers.find((m) => m.profile_id === payload.profile_id && m.status === "active");

    if (existingMember) {
      throw new OrganizationBusinessRuleError("This user is already an active member of the organization.");
    }

    const member = await repo.create(payload as Partial<OrganizationMember>);
    logger.info(`MemberService: Added member ${member.profile_id} to organization ${member.org_id}`);
    return member;
  }

  static async listActiveMembers(orgId: string): Promise<OrganizationMember[]> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);
    return await repo.findActiveMembersByOrg(orgId);
  }

  static async removeMember(memberId: string): Promise<void> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);
    await repo.update(memberId, { status: "past" } as Partial<OrganizationMember>);
  }

  static async updateMemberRole(memberId: string, role: string, designation?: string): Promise<OrganizationMember> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);
    const updated = await repo.update(memberId, { role, designation } as Partial<OrganizationMember>);
    return updated;
  }
}

// =============================================================================
// 3. OfficeBearerService
// =============================================================================

export class OfficeBearerService {
  static async assignOfficeBearer(payload: CreateOrganizationMemberPayload): Promise<OrganizationMember> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);

    // Ensure they are assigning an office bearer
    if (!["executive", "office_bearer"].includes(payload.role)) {
      throw new OrganizationBusinessRuleError("Role must be executive or office_bearer");
    }

    if (!payload.designation) {
      throw new OrganizationBusinessRuleError("Designation is required for office bearers");
    }

    // Business Rule: One President/Secretary per term
    const restrictedDesignations = ["president", "secretary"];
    const designationLower = payload.designation.toLowerCase();
    
    if (restrictedDesignations.includes(designationLower)) {
      const hasExisting = await repo.checkExistingActiveRole(payload.org_id, payload.designation);
      if (hasExisting) {
        throw new OrganizationBusinessRuleError(`The organization already has an active ${payload.designation}`);
      }
    }

    const bearer = await repo.create(payload as Partial<OrganizationMember>);
    logger.info(`OfficeBearerService: Assigned ${payload.designation} to organization ${payload.org_id}`);
    return bearer;
  }

  static async listOfficeBearers(orgId: string): Promise<OrganizationMember[]> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationMemberRepository(supabase);
    return await repo.findOfficeBearersByOrg(orgId);
  }
}

// =============================================================================
// 4. AdvisorService
// =============================================================================

export class AdvisorService {
  static async assignAdvisor(payload: CreateOrganizationAdvisorPayload): Promise<OrganizationAdvisor> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationAdvisorRepository(supabase);

    // Business Rule: One Faculty Advisor 
    const count = await repo.countCurrentAdvisors(payload.org_id);
    if (count >= 1) {
      throw new OrganizationBusinessRuleError("Organization already has an active Faculty Advisor. Please mark the existing one as inactive first.");
    }

    const advisor = await repo.create(payload as Partial<OrganizationAdvisor>);
    logger.info(`AdvisorService: Assigned advisor ${advisor.name} to organization ${advisor.org_id}`);
    return advisor;
  }

  static async listCurrentAdvisors(orgId: string): Promise<OrganizationAdvisor[]> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationAdvisorRepository(supabase);
    return await repo.findCurrentByOrg(orgId);
  }

  static async removeAdvisor(advisorId: string): Promise<void> {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new OrganizationAdvisorRepository(supabase);
    await repo.update(advisorId, { is_current: false, end_date: new Date().toISOString() } as Partial<OrganizationAdvisor>);
  }
}
