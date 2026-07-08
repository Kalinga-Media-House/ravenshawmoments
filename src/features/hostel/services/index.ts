// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/services/index.ts
// Purpose   : Universal Hostel Ecosystem Service Layer & Business Rule Enforcement
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  HostelRepository,
  HostelWardenRepository,
  HostelBMCRepository,
  HostelResidentRepository,
} from "@/lib/repositories";
import {
  Hostel,
  HostelWarden,
  HostelBMC,
  HostelResident,
  HostelTypeEnum,
} from "@/types/hostel";
import {
  CreateHostelPayload,
  UpdateHostelPayload,
  CreateHostelWardenPayload,
  CreateHostelBMCPayload,
  CreateHostelResidentPayload,
} from "@/lib/validation/hostel-system";

// =============================================================================
// Typed Application Errors
// =============================================================================

export class HostelNotFoundError extends Error {
  constructor(message = "Hostel or accommodation record not found.") {
    super(message);
    this.name = "HostelNotFoundError";
  }
}

export class HostelBusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HostelBusinessRuleError";
  }
}

// =============================================================================
// 1. HostelService
// =============================================================================

export class HostelService {
  /**
   * Retrieves a verified active hostel by its unique slug.
   */
  static async getHostelBySlug(slug: string): Promise<Hostel> {
    const supabase = await createClient();
    const repo = new HostelRepository(supabase);

    const hostel = await repo.findBySlug(slug);
    if (!hostel || !hostel.is_active) {
      logger.warn(`HostelService: Hostel not found or inactive for slug: ${slug}`);
      throw new HostelNotFoundError("Hostel not found or inactive.");
    }

    return hostel;
  }

  /**
   * Lists verified hostels filtered by type (university or private sponsored).
   */
  static async listVerifiedHostels(
    typeFilter?: HostelTypeEnum,
    limit = 50,
    offset = 0
  ): Promise<{ data: Hostel[]; count: number }> {
    const supabase = await createClient();
    const repo = new HostelRepository(supabase);
    return await repo.findVerifiedHostels(typeFilter, limit, offset);
  }

  /**
   * Creates a new university or housing hub hostel profile.
   */
  static async createHostel(payload: CreateHostelPayload): Promise<Hostel> {
    const supabase = await createClient();
    const repo = new HostelRepository(supabase);

    // Business Rule: Ensure slug uniqueness
    const existing = await repo.findBySlug(payload.slug);
    if (existing) {
      throw new HostelBusinessRuleError(
        `A hostel with slug '${payload.slug}' already exists.`
      );
    }

    const hostel = await repo.createHostel({
      ...payload,
      is_verified: false,
      is_sponsored: false,
      is_active: true,
    });

    logger.info(`HostelService: Created hostel ${hostel.name} (${hostel.id})`);
    return hostel;
  }

  /**
   * Updates an existing hostel profile.
   */
  static async updateHostel(id: string, payload: UpdateHostelPayload): Promise<Hostel> {
    const supabase = await createClient();
    const repo = new HostelRepository(supabase);

    const existing = await repo.findById(id);
    if (!existing) throw new HostelNotFoundError("Hostel to update not found.");

    const updated = await repo.updateHostel(id, payload);
    logger.info(`HostelService: Updated hostel ${updated.id}`);
    return updated;
  }
}

// =============================================================================
// 2. HostelWardenService
// =============================================================================

export class HostelWardenService {
  /**
   * Assigns a new incumbent warden to a hostel.
   * Business Rule: Only ONE active warden allowed per hostel. Automatically archives current incumbent.
   */
  static async assignCurrentWarden(payload: CreateHostelWardenPayload): Promise<HostelWarden> {
    const supabase = await createClient();
    const hostelRepo = new HostelRepository(supabase);
    const wardenRepo = new HostelWardenRepository(supabase);

    const hostel = await hostelRepo.findById(payload.hostel_id);
    if (!hostel) throw new HostelNotFoundError("Target hostel does not exist.");

    // Business Rule: Archive existing incumbent warden
    if (payload.is_current) {
      await wardenRepo.archiveCurrentWardens(payload.hostel_id);
    }

    const warden = await wardenRepo.createWarden({
      ...payload,
      is_current: payload.is_current ?? true,
    });

    logger.info(
      `HostelWardenService: Assigned ${warden.name} as current warden for hostel ${payload.hostel_id}`
    );
    return warden;
  }
}

// =============================================================================
// 3. HostelBMCService
// =============================================================================

export class HostelBMCService {
  /**
   * Assigns a student to the Hostel Block Management Committee / Council.
   * Business Rule: Only ONE active President (`general_secretary`) allowed per hostel term year.
   */
  static async assignBMCMember(payload: CreateHostelBMCPayload): Promise<HostelBMC> {
    const supabase = await createClient();
    const hostelRepo = new HostelRepository(supabase);
    const bmcRepo = new HostelBMCRepository(supabase);

    const hostel = await hostelRepo.findById(payload.hostel_id);
    if (!hostel) throw new HostelNotFoundError("Target hostel does not exist.");

    // Business Rule: Validate term session format (e.g. "2025-2026")
    if (!payload.term_year || payload.term_year.trim().length < 4) {
      throw new HostelBusinessRuleError("A valid academic term session year is required.");
    }

    // Business Rule: Only ONE active General Secretary / President per term
    if (payload.role_title === "general_secretary") {
      const existingPres = await bmcRepo.findActivePresident(
        payload.hostel_id,
        payload.term_year
      );
      if (existingPres && existingPres.profile_id !== payload.profile_id) {
        throw new HostelBusinessRuleError(
          `Hostel already has an active General Secretary for term ${payload.term_year}.`
        );
      }
    }

    const member = await bmcRepo.createBMCMember({
      ...payload,
      is_active: true,
    });

    logger.info(
      `HostelBMCService: Assigned profile ${payload.profile_id} to role ${payload.role_title} for term ${payload.term_year}`
    );
    return member;
  }
}

// =============================================================================
// 4. HostelResidentService
// =============================================================================

export class HostelResidentService {
  /**
   * Assigns a student as a resident of a hostel.
   * Business Rule: Prevent duplicate residency records for the same profile in the hostel.
   */
  static async assignResident(payload: CreateHostelResidentPayload): Promise<HostelResident> {
    const supabase = await createClient();
    const hostelRepo = new HostelRepository(supabase);
    const residentRepo = new HostelResidentRepository(supabase);

    const hostel = await hostelRepo.findById(payload.hostel_id);
    if (!hostel || !hostel.is_active) {
      throw new HostelNotFoundError("Target hostel does not exist or is inactive.");
    }

    // Business Rule: Check for duplicate residency
    const existing = await residentRepo.findByProfileAndHostel(
      payload.profile_id,
      payload.hostel_id
    );
    if (existing) {
      throw new HostelBusinessRuleError(
        "This student is already registered as a resident or alumni of this hostel."
      );
    }

    const resident = await residentRepo.createResident({
      ...payload,
      is_verified_by_bmc: false, // Requires BMC or Admin verification
    });

    logger.info(
      `HostelResidentService: Assigned resident profile ${payload.profile_id} to hostel ${payload.hostel_id}`
    );
    return resident;
  }

  /**
   * Lists verified current residents or alumni of a hostel.
   */
  static async listHostelResidents(
    hostelId: string,
    isAlumni = false,
    limit = 50,
    offset = 0
  ): Promise<{ data: HostelResident[]; count: number }> {
    const supabase = await createClient();
    const repo = new HostelResidentRepository(supabase);
    return await repo.findResidentsByHostel(hostelId, isAlumni, limit, offset);
  }
}
