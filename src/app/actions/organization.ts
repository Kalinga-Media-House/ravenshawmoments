"use server";

// =============================================================================
// Ravenshaw Moments
// File      : src/app/actions/organization.ts
// Purpose   : Server Actions for the Organization Ecosystem
// =============================================================================

import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { 
  OrganizationService, 
  MemberService, 
  OfficeBearerService, 
  AdvisorService,
  OrganizationNotFoundError,
  OrganizationBusinessRuleError 
} from "@/features/organization/services";
import {
  createOrganizationSchema,
  CreateOrganizationPayload,
  createOrganizationMemberSchema,
  CreateOrganizationMemberPayload,
  createOrganizationAdvisorSchema,
  CreateOrganizationAdvisorPayload,
} from "@/lib/validation/organization-system";
import { Organization, OrganizationMember, OrganizationAdvisor, OrganizationTypeEnum } from "@/types/organization";
import { ApiResponse } from "@/types";

// =============================================================================
// Helper for Error Formatting
// =============================================================================

function formatError(error: unknown): ApiResponse<never> {
  if (error instanceof OrganizationNotFoundError) {
    return { success: false, error: { code: "NOT_FOUND", message: error.message } };
  }
  if (error instanceof OrganizationBusinessRuleError) {
    return { success: false, error: { code: "BUSINESS_RULE_VIOLATION", message: error.message } };
  }
  logger.error("OrganizationAction: Unexpected error", { error });
  return { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } };
}

// =============================================================================
// 1. Organization Actions
// =============================================================================

export async function getPublicOrganizationBySlug(slug: string): Promise<ApiResponse<Organization>> {
  try {
    const org = await OrganizationService.getOrganizationBySlug(slug);
    return { success: true, data: org };
  } catch (error) {
    return formatError(error);
  }
}

export async function listOrganizationsByType(orgType: OrganizationTypeEnum): Promise<ApiResponse<Organization[]>> {
  try {
    const orgs = await OrganizationService.listOrganizationsByType(orgType);
    return { success: true, data: orgs };
  } catch (error) {
    return formatError(error);
  }
}

export async function listAllActiveOrganizationsAction(): Promise<ApiResponse<Organization[]>> {
  try {
    const orgs = await OrganizationService.listAllActiveOrganizations();
    return { success: true, data: orgs };
  } catch (error) {
    return formatError(error);
  }
}

export async function createOrganization(payload: CreateOrganizationPayload): Promise<ApiResponse<Organization>> {
  try {
    const parsed = createOrganizationSchema.parse(payload);
    const org = await OrganizationService.createOrganization(parsed);
    revalidatePath("/organizations");
    return { success: true, data: org };
  } catch (error) {
    return formatError(error);
  }
}

// =============================================================================
// 2. Member Actions
// =============================================================================

export async function listActiveMembers(orgId: string): Promise<ApiResponse<OrganizationMember[]>> {
  try {
    const members = await MemberService.listActiveMembers(orgId);
    return { success: true, data: members };
  } catch (error) {
    return formatError(error);
  }
}

export async function addMember(payload: CreateOrganizationMemberPayload): Promise<ApiResponse<OrganizationMember>> {
  try {
    const parsed = createOrganizationMemberSchema.parse(payload);
    const member = await MemberService.addMember(parsed);
    revalidatePath(`/dashboard/organizations/${parsed.org_id}/members`);
    return { success: true, data: member };
  } catch (error) {
    return formatError(error);
  }
}

// =============================================================================
// 3. Office Bearer Actions
// =============================================================================

export async function listOfficeBearers(orgId: string): Promise<ApiResponse<OrganizationMember[]>> {
  try {
    const bearers = await OfficeBearerService.listOfficeBearers(orgId);
    return { success: true, data: bearers };
  } catch (error) {
    return formatError(error);
  }
}

export async function assignOfficeBearer(payload: CreateOrganizationMemberPayload): Promise<ApiResponse<OrganizationMember>> {
  try {
    const parsed = createOrganizationMemberSchema.parse(payload);
    const bearer = await OfficeBearerService.assignOfficeBearer(parsed);
    revalidatePath(`/dashboard/organizations/${parsed.org_id}/bearers`);
    return { success: true, data: bearer };
  } catch (error) {
    return formatError(error);
  }
}

// =============================================================================
// 4. Advisor Actions
// =============================================================================

export async function listCurrentAdvisors(orgId: string): Promise<ApiResponse<OrganizationAdvisor[]>> {
  try {
    const advisors = await AdvisorService.listCurrentAdvisors(orgId);
    return { success: true, data: advisors };
  } catch (error) {
    return formatError(error);
  }
}

export async function assignAdvisor(payload: CreateOrganizationAdvisorPayload): Promise<ApiResponse<OrganizationAdvisor>> {
  try {
    const parsed = createOrganizationAdvisorSchema.parse(payload);
    const advisor = await AdvisorService.assignAdvisor(parsed);
    revalidatePath(`/dashboard/organizations/${parsed.org_id}/advisors`);
    return { success: true, data: advisor };
  } catch (error) {
    return formatError(error);
  }
}

export async function updateOrganizationAction(id: string, payload: any): Promise<ApiResponse<Organization>> {
  try {
    const org = await OrganizationService.updateOrganization(id, payload);
    revalidatePath(`/dashboard/organizations/${id}`);
    revalidatePath(`/dashboard/organizations/${id}/settings`);
    return { success: true, data: org };
  } catch (error) {
    return formatError(error);
  }
}

export async function getOrganizationByIdAction(id: string): Promise<ApiResponse<Organization>> {
  try {
    const org = await OrganizationService.getOrganizationById(id);
    return { success: true, data: org };
  } catch (error) {
    return formatError(error);
  }
}

export async function getMyOrganizationsAction(): Promise<ApiResponse<OrganizationMember[]>> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    
    const memberships = await OrganizationService.getMyOrganizations(user.id);
    return { success: true, data: memberships };
  } catch (error) {
    return formatError(error);
  }
}

export async function removeMemberAction(memberId: string, orgId: string): Promise<ApiResponse<void>> {
  try {
    await MemberService.removeMember(memberId);
    revalidatePath(`/dashboard/organizations/${orgId}/members`);
    return { success: true, data: undefined };
  } catch (error) {
    return formatError(error);
  }
}

export async function updateMemberRoleAction(memberId: string, orgId: string, role: string, designation?: string): Promise<ApiResponse<OrganizationMember>> {
  try {
    const updated = await MemberService.updateMemberRole(memberId, role, designation);
    revalidatePath(`/dashboard/organizations/${orgId}/members`);
    return { success: true, data: updated };
  } catch (error) {
    return formatError(error);
  }
}

export async function removeAdvisorAction(advisorId: string, orgId: string): Promise<ApiResponse<void>> {
  try {
    await AdvisorService.removeAdvisor(advisorId);
    revalidatePath(`/dashboard/organizations/${orgId}/advisors`);
    return { success: true, data: undefined };
  } catch (error) {
    return formatError(error);
  }
}
