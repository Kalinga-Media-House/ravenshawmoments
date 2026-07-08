// =============================================================================
// Ravenshaw Moments
// File      : src/app/actions/hostel.ts
// Purpose   : Universal Hostel Ecosystem & Housing Hub Thin Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types";
import { USER_ROLES } from "@/constants";
import {
  Hostel,
  HostelWarden,
  HostelBMC,
  HostelResident,
  HostelTypeEnum,
} from "@/types/hostel";
import {
  createHostelSchema,
  updateHostelSchema,
  createHostelWardenSchema,
  createHostelBMCSchema,
  createHostelResidentSchema,
  CreateHostelPayload,
  UpdateHostelPayload,
  CreateHostelWardenPayload,
  CreateHostelBMCPayload,
  CreateHostelResidentPayload,
} from "@/lib/validation/hostel-system";
import {
  HostelService,
  HostelWardenService,
  HostelBMCService,
  HostelResidentService,
  HostelNotFoundError,
  HostelBusinessRuleError,
} from "@/features/hostel/services";

// ============================================================================
// Internal Authentication & RBAC Helper
// ============================================================================

type AuthResult =
  | { success: true; userId: string; email?: string }
  | { success: false; error: { code: string; message: string } };

async function verifyHostelAuth(requireAdmin = false): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("HostelAction: Unauthorized anonymous request rejected.");
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required to perform hostel operations.",
      },
    };
  }

  if (!requireAdmin) {
    return { success: true, userId: user.id, email: user.email };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== USER_ROLES.SUPER_ADMIN) {
    logger.warn(`HostelAction: Access denied for non-admin user ${user.id}`);
    return {
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Super Admin privileges required for this hostel administrative action.",
      },
    };
  }

  return { success: true, userId: user.id, email: user.email };
}

// ============================================================================
// Public Queries (Read-Only)
// ============================================================================

/**
 * Retrieves a verified active hostel profile by slug.
 */
export async function getPublicHostelBySlug(slug: string): Promise<ApiResponse<Hostel>> {
  try {
    const hostel = await HostelService.getHostelBySlug(slug);
    return { success: true, data: hostel };
  } catch (error) {
    logger.error("HostelAction: Error in getPublicHostelBySlug", { error });
    if (error instanceof HostelNotFoundError) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: error.message },
      };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load hostel details." },
    };
  }
}

/**
 * Lists verified hostels with pagination and optional type filtering.
 */
export async function listPublicHostels(
  typeFilter?: HostelTypeEnum,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<{ hostels: Hostel[]; totalCount: number; page: number }>> {
  try {
    const offset = (page - 1) * pageSize;
    const { data, count } = await HostelService.listVerifiedHostels(typeFilter, pageSize, offset);
    return {
      success: true,
      data: { hostels: data, totalCount: count, page },
    };
  } catch (error) {
    logger.error("HostelAction: Error in listPublicHostels", { error });
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to list hostel directory." },
    };
  }
}

/**
 * Lists verified residents or alumni for a hostel.
 */
export async function listHostelResidents(
  hostelId: string,
  isAlumni = false,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<{ residents: HostelResident[]; totalCount: number }>> {
  try {
    const offset = (page - 1) * pageSize;
    const { data, count } = await HostelResidentService.listHostelResidents(
      hostelId,
      isAlumni,
      pageSize,
      offset
    );
    return {
      success: true,
      data: { residents: data, totalCount: count },
    };
  } catch (error) {
    logger.error("HostelAction: Error in listHostelResidents", { error });
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve hostel roster." },
    };
  }
}

// ============================================================================
// Authenticated Operations
// ============================================================================

/**
 * Creates a new university or housing hub hostel profile (Super Admin only).
 */
export async function createHostel(payload: CreateHostelPayload): Promise<ApiResponse<Hostel>> {
  try {
    const auth = await verifyHostelAuth(true);
    if (!auth.success) return { success: false, error: auth.error };

    const validated = createHostelSchema.parse(payload);
    const hostel = await HostelService.createHostel(validated);
    return { success: true, data: hostel };
  } catch (error) {
    logger.error("HostelAction: Error in createHostel", { error });
    if (error instanceof HostelBusinessRuleError) {
      return { success: false, error: { code: "BUSINESS_RULE_VIOLATION", message: error.message } };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create hostel profile." },
    };
  }
}

/**
 * Updates an existing hostel profile (Super Admin only).
 */
export async function updateHostel(
  hostelId: string,
  payload: UpdateHostelPayload
): Promise<ApiResponse<Hostel>> {
  try {
    const auth = await verifyHostelAuth(true);
    if (!auth.success) return { success: false, error: auth.error };

    const validated = updateHostelSchema.parse(payload);
    const updated = await HostelService.updateHostel(hostelId, validated);
    return { success: true, data: updated };
  } catch (error) {
    logger.error("HostelAction: Error in updateHostel", { error });
    if (error instanceof HostelNotFoundError) {
      return { success: false, error: { code: "NOT_FOUND", message: error.message } };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update hostel profile." },
    };
  }
}

/**
 * Assigns an incumbent warden to a hostel (Super Admin only).
 */
export async function assignHostelWarden(
  payload: CreateHostelWardenPayload
): Promise<ApiResponse<HostelWarden>> {
  try {
    const auth = await verifyHostelAuth(true);
    if (!auth.success) return { success: false, error: auth.error };

    const validated = createHostelWardenSchema.parse(payload);
    const warden = await HostelWardenService.assignCurrentWarden(validated);
    return { success: true, data: warden };
  } catch (error) {
    logger.error("HostelAction: Error in assignHostelWarden", { error });
    if (error instanceof HostelNotFoundError) {
      return { success: false, error: { code: "NOT_FOUND", message: error.message } };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to assign incumbent warden." },
    };
  }
}

/**
 * Assigns a student to the Hostel BMC Council (Super Admin only).
 */
export async function assignHostelBMCMember(
  payload: CreateHostelBMCPayload
): Promise<ApiResponse<HostelBMC>> {
  try {
    const auth = await verifyHostelAuth(true);
    if (!auth.success) return { success: false, error: auth.error };

    const validated = createHostelBMCSchema.parse(payload);
    const member = await HostelBMCService.assignBMCMember(validated);
    return { success: true, data: member };
  } catch (error) {
    logger.error("HostelAction: Error in assignHostelBMCMember", { error });
    if (error instanceof HostelBusinessRuleError) {
      return { success: false, error: { code: "BUSINESS_RULE_VIOLATION", message: error.message } };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to assign BMC council member." },
    };
  }
}

/**
 * Registers a student as a hostel resident or alumni.
 */
export async function registerHostelResident(
  payload: CreateHostelResidentPayload
): Promise<ApiResponse<HostelResident>> {
  try {
    const auth = await verifyHostelAuth(false);
    if (!auth.success) return { success: false, error: auth.error };

    const validated = createHostelResidentSchema.parse(payload);
    const resident = await HostelResidentService.assignResident(validated);
    return { success: true, data: resident };
  } catch (error) {
    logger.error("HostelAction: Error in registerHostelResident", { error });
    if (error instanceof HostelBusinessRuleError) {
      return { success: false, error: { code: "BUSINESS_RULE_VIOLATION", message: error.message } };
    }
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to register hostel resident." },
    };
  }
}
