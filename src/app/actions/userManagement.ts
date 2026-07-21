"use server";

import { createClient } from "@/lib/supabase/server";
import { isProfileVerified } from "@/lib/utils/permissions";
import { verifySuperAdmin, verifyPlatformAdmin } from "@/lib/authorization";
import { logger } from "@/lib/logger";

// ============================================================================
// Types
// ============================================================================

export interface OverviewCounts {
  totalUsers: number;
  totalAdmins: number;
  totalCRs: number;
  totalBMCs: number;
  pendingVerifications: number;
  unclaimedProfiles: number;
  externalParticipants: number;
}

// ============================================================================
// Overview Counts
// ============================================================================

export async function getManagementOverviewCounts(): Promise<{ success: boolean; counts?: OverviewCounts; error?: string }> {
  try {
    const auth = await verifySuperAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    // 1. Total Registered Users (where auth_user_id is not null and not soft deleted)
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .not("auth_user_id", "is", null)
      .is("deleted_at", null);

    // 2. Active Admins (SUPER_ADMIN or ADMIN)
    const { count: totalAdmins } = await supabase
      .from("profile_roles")
      .select("id, roles!inner(code)", { count: "exact", head: true })
      .eq("is_active", true)
      .in("roles.code", ["SUPER_ADMIN", "ADMIN"]);

    // 3. Active CRs
    const { count: totalCRs } = await supabase
      .from("profile_roles")
      .select("id, roles!inner(code)", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("roles.code", "DEPARTMENT_CR");

    // 4. Active BMCs
    const { count: totalBMCs } = await supabase
      .from("profile_roles")
      .select("id, roles!inner(code)", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("roles.code", "HOSTEL_BMC");

    // 5. Pending Verifications
    const { count: pendingVerifications } = await supabase
      .from("verification_requests")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending");

    // 6. Unclaimed Profiles
    const { count: unclaimedProfiles } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_profile_claimed", false)
      .is("deleted_at", null)
      .neq("profile_status", "archived");

    // 7. External Participants
    const { count: externalParticipants } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .is("deleted_at", null);

    return {
      success: true,
      counts: {
        totalUsers: totalUsers || 0,
        totalAdmins: totalAdmins || 0,
        totalCRs: totalCRs || 0,
        totalBMCs: totalBMCs || 0,
        pendingVerifications: pendingVerifications || 0,
        unclaimedProfiles: unclaimedProfiles || 0,
        externalParticipants: externalParticipants || 0,
      }
    };
  } catch (err: any) {
    logger.error("userManagement: Error fetching overview counts", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Administrative Members
// ============================================================================

export interface AdminMember {
  assignmentId: string;
  profileId: string;
  fullName: string;
  username: string | null;
  profileType: string;
  isVerified: boolean;
  status: string;
  roleCode: string;
  roleName: string;
  assignedAt: string;
  departmentName?: string;
  hostelName?: string;
  avatarUrl?: string | null;
}

export async function getAdministrativeMembers(
  roleFilter: "ALL" | "ADMIN" | "CR" | "BMC" = "ALL",
  page: number = 1,
  pageSize: number = 50
): Promise<{ success: boolean; members?: AdminMember[]; total?: number; error?: string }> {
  try {
    const auth = await verifySuperAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();
    
    let query = supabase
      .from("profile_roles")
      .select(`
        id,
        starts_at,
        is_active,
        roles!inner(code, name),
        profiles!profile_roles_profile_id_fkey!inner(id, full_name, username, profile_type, is_verified, profile_status, profile_media_id),
        departments(name),
        hostels(name)
      `, { count: "exact" })
      .eq("is_active", true);

    if (roleFilter === "ADMIN") {
      query = query.in("roles.code", ["SUPER_ADMIN", "ADMIN"]);
    } else if (roleFilter === "CR") {
      query = query.eq("roles.code", "DEPARTMENT_CR");
    } else if (roleFilter === "BMC") {
      query = query.eq("roles.code", "HOSTEL_BMC");
    } else {
      query = query.in("roles.code", ["SUPER_ADMIN", "ADMIN", "DEPARTMENT_CR", "HOSTEL_BMC"]);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.order("starts_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Members Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error fetching admin members", { error });
      return { success: false, error: "Failed to fetch administrative members." };
    }

    const members: AdminMember[] = (data || []).map((row: any) => ({
      assignmentId: row.id,
      profileId: row.profiles.id,
      fullName: row.profiles.full_name,
      username: row.profiles.username,
      profileType: row.profiles.profile_type,
      isVerified: isProfileVerified(row.profiles),
      status: row.profiles.profile_status,
      roleCode: row.roles.code,
      roleName: row.roles.name,
      assignedAt: row.starts_at,
      departmentName: row.departments?.name,
      hostelName: row.hostels?.name,
    }));

    return { success: true, members, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in getAdministrativeMembers", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// User Directory (Search & Explore)
// ============================================================================

export interface UserSearchResult {
  id: string;
  fullName: string;
  username: string | null;
  email: string | null;
  profileType: string;
  rollNumber: string | null;
  isVerified: boolean;
  status: string;
  isProfileClaimed: boolean;
  platformRoles: { code: string; name: string }[];
}

export interface UserSearchFilters {
  query?: string;
  communityIdentity?: string; // 'ALL', 'student', 'alumni', 'teacher'
  adminRole?: string; // 'ALL', 'SUPER_ADMIN', 'ADMIN', 'CR', 'BMC', 'NONE'
  verification?: string; // 'ALL', 'verified', 'pending', 'rejected', 'unverified'
  claimStatus?: string; // 'ALL', 'claimed', 'unclaimed'
  page?: number;
  pageSize?: number;
}

export async function searchAndExploreUsers(
  filters: UserSearchFilters
): Promise<{ success: boolean; users?: UserSearchResult[]; total?: number; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();
    let queryBuilder = supabase.from("profiles").select(`
      id,
      full_name,
      username,
      email,
      profile_type,
      is_verified,
      profile_status,
      is_profile_claimed,
      education_records!education_records_profile_id_fkey(roll_number, is_primary),
      profile_roles!profile_roles_profile_id_fkey(roles(code, name), is_active)
    `, { count: "exact" });

    // 1. Text Search (Name, Username, Email, Roll Number)
    if (filters.query && filters.query.trim().length > 0) {
      const searchTerm = filters.query.trim();
      const likeTerm = `%${searchTerm}%`;

      // Step A: Search profiles
      const { data: pData } = await supabase.from("profiles").select("id")
        .or(`full_name.ilike.${likeTerm},username.ilike.${likeTerm},email.ilike.${likeTerm}`)
        .limit(200);
      
      // Step B: Search education records for roll number
      const { data: eData } = await supabase.from("education_records").select("profile_id")
        .ilike("roll_number", likeTerm)
        .limit(200);

      const matchingIds = new Set<string>();
      // @ts-ignore
      pData?.forEach(p => matchingIds.add(p.id));
      // @ts-ignore
      eData?.forEach(e => matchingIds.add(e.profile_id));

      if (matchingIds.size === 0) {
        return { success: true, users: [], total: 0 };
      }
      
      queryBuilder = queryBuilder.in("id", Array.from(matchingIds));
    }

    // 2. Community Identity Filter
    if (filters.communityIdentity && filters.communityIdentity !== "ALL") {
      queryBuilder = queryBuilder.eq("profile_type", filters.communityIdentity.toLowerCase());
    }

    // 3. Claim Status Filter
    if (filters.claimStatus && filters.claimStatus !== "ALL") {
      queryBuilder = queryBuilder.eq("is_profile_claimed", filters.claimStatus === "claimed");
    }

    // 4. Verification Filter
    if (filters.verification && filters.verification !== "ALL") {
      if (filters.verification === "verified") {
        queryBuilder = queryBuilder.eq("is_verified", true);
      } else if (filters.verification === "unverified") {
        queryBuilder = queryBuilder.eq("is_verified", false);
      }
      // Note: 'pending' and 'rejected' are better queried via verification_requests, 
      // but for simple user search, we filter by is_verified.
    }

    // Always exclude deleted
    queryBuilder = queryBuilder.is("deleted_at", null);

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    queryBuilder = queryBuilder.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error("[User Directory Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error searching users", { error });
      return { success: false, error: "Failed to search users." };
    }

    let users: UserSearchResult[] = (data || []).map((row: any) => {
      // Find primary roll number
      const edu = Array.isArray(row.education_records) ? row.education_records : [];
      const primaryEdu = edu.find((e: any) => e.is_primary) || edu[0];
      
      // Extract active roles
      const pRoles = Array.isArray(row.profile_roles) ? row.profile_roles : [];
      const activeRoles = pRoles
        .filter((pr: any) => pr.is_active && pr.roles)
        .map((pr: any) => ({
          code: pr.roles.code,
          name: pr.roles.name
        }));

      // Hide email if caller is not Super Admin and it's not their profile?
      // For now, since they are Platform Admins, they can see emails in admin center.
      // But we can mask it if needed.

      return {
        id: row.id,
        fullName: row.full_name,
        username: row.username,
        email: row.email,
        profileType: row.profile_type,
        rollNumber: primaryEdu?.roll_number || null,
        isVerified: isProfileVerified(row),
        status: row.profile_status,
        isProfileClaimed: row.is_profile_claimed,
        platformRoles: activeRoles,
      };
    });

    // 5. Admin Role Filter (post-filtering due to complex join)
    if (filters.adminRole && filters.adminRole !== "ALL") {
      if (filters.adminRole === "NONE") {
        users = users.filter(u => u.platformRoles.length === 0);
      } else {
        users = users.filter(u => u.platformRoles.some(r => r.code === filters.adminRole));
      }
      // Note: this breaks exact total count if we post-filter, but it's acceptable for this UI or we can do it via a subquery.
    }

    return { success: true, users, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in searchAndExploreUsers", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Profile Verification Center
// ============================================================================

export interface VerificationRequest {
  id: string;
  profileId: string;
  fullName: string;
  username: string | null;
  profileType: string;
  status: string;
  requestedAt: string;
}

export async function getPendingVerifications(
  page: number = 1,
  pageSize: number = 20
): Promise<{ success: boolean; requests?: VerificationRequest[]; total?: number; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("verification_requests")
      .select(`
        id,
        created_at,
        verification_status,
        profiles!verification_requests_profile_id_fkey!inner(id, full_name, username, profile_type)
      `, { count: "exact" })
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("[Profile Verification Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error fetching verifications", { error });
      return { success: false, error: "Failed to fetch verifications." };
    }

    const requests: VerificationRequest[] = (data || []).map((row: any) => ({
      id: row.id,
      profileId: row.profiles.id,
      fullName: row.profiles.full_name,
      username: row.profiles.username,
      profileType: row.profiles.profile_type,
      status: row.verification_status,
      requestedAt: row.created_at,
    }));

    return { success: true, requests, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in getPendingVerifications", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Unclaimed Profiles & Claims
// ============================================================================

export interface UnclaimedProfile {
  id: string;
  fullName: string;
  profileType: string;
  rollNumber: string | null;
  status: string;
  hasPendingClaim: boolean;
}

export async function getUnclaimedProfiles(
  page: number = 1,
  pageSize: number = 20
): Promise<{ success: boolean; profiles?: UnclaimedProfile[]; total?: number; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        profile_type,
        profile_status,
        education_records!education_records_profile_id_fkey(roll_number, is_primary),
        profile_claim_requests!profile_claim_requests_profile_id_fkey(verification_status)
      `, { count: "exact" })
      .eq("is_profile_claimed", false)
      .is("deleted_at", null)
      .neq("profile_status", "archived")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Unclaimed Profiles Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error fetching unclaimed profiles", { error });
      return { success: false, error: "Failed to fetch unclaimed profiles." };
    }

    const profiles: UnclaimedProfile[] = (data || []).map((row: any) => {
      const edu = Array.isArray(row.education_records) ? row.education_records : [];
      const primaryEdu = edu.find((e: any) => e.is_primary) || edu[0];
      
      const claims = Array.isArray(row.profile_claim_requests) ? row.profile_claim_requests : [];
      const hasPendingClaim = claims.some((c: any) => c.verification_status === "pending");

      return {
        id: row.id,
        fullName: row.full_name,
        profileType: row.profile_type,
        rollNumber: primaryEdu?.roll_number || null,
        status: row.profile_status,
        hasPendingClaim
      };
    });

    return { success: true, profiles, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in getUnclaimedProfiles", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Audit History
// ============================================================================

export interface AuditLog {
  id: string;
  actorId: string | null;
  actorName: string;
  actorUsername: string | null;
  action: string;
  entityType: string;
  createdAt: string;
}

export async function getAuditHistory(
  page: number = 1,
  pageSize: number = 20
): Promise<{ success: boolean; logs?: AuditLog[]; total?: number; error?: string }> {
  try {
    const auth = await verifySuperAdmin(); // Audit logs strictly Super Admin
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("audit_logs")
      .select(`
        id,
        action,
        entity_type,
        created_at,
        profiles!actor_profile_id(id, full_name, username)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Audit History Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error fetching audit history", { error });
      return { success: false, error: "Failed to fetch audit history." };
    }

    const logs: AuditLog[] = (data || []).map((row: any) => ({
      id: row.id,
      actorId: row.profiles?.id || null,
      actorName: row.profiles?.full_name || "System",
      actorUsername: row.profiles?.username || null,
      action: row.action,
      entityType: row.entity_type,
      createdAt: row.created_at,
    }));

    return { success: true, logs, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in getAuditHistory", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// External Participants
// ============================================================================

export interface ExternalParticipant {
  id: string;
  fullName: string;
  username: string | null;
  email: string | null;
  profileType: string;
  universityName: string | null;
  collegeName: string | null;
  courseLevel: string | null;
  courseName: string | null;
  currentYear: string | null;
  state: string | null;
  isVerified: boolean;
  status: string;
  isProfileClaimed: boolean;
  createdAt: string;
  competitionCount: number;
}

export interface ExternalParticipantFilters {
  query?: string;
  verification?: string; // 'ALL', 'verified', 'unverified'
  accountStatus?: string; // 'ALL', 'active', 'suspended', 'archived'
  courseLevel?: string; // 'ALL', 'plus_two', 'ug', 'pg', 'phd', 'other'
  sortBy?: string; // 'newest', 'oldest', 'name_asc', 'name_desc'
  page?: number;
  pageSize?: number;
}

export interface ExternalParticipantCounts {
  total: number;
  verified: number;
  unverified: number;
  active: number;
  suspended: number;
}

export async function getExternalParticipantCounts(): Promise<{ success: boolean; counts?: ExternalParticipantCounts; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    const { count: total } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .is("deleted_at", null);

    const { count: verified } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .eq("is_verified", true)
      .is("deleted_at", null);

    const { count: unverified } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .eq("is_verified", false)
      .is("deleted_at", null);

    const { count: active } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .eq("profile_status", "active")
      .is("deleted_at", null);

    const { count: suspended } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_type", "external_participant")
      .eq("profile_status", "suspended")
      .is("deleted_at", null);

    return {
      success: true,
      counts: {
        total: total || 0,
        verified: verified || 0,
        unverified: unverified || 0,
        active: active || 0,
        suspended: suspended || 0,
      },
    };
  } catch (err: any) {
    logger.error("userManagement: Error in getExternalParticipantCounts", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

export async function searchExternalParticipants(
  filters: ExternalParticipantFilters
): Promise<{ success: boolean; participants?: ExternalParticipant[]; total?: number; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    // Build base query
    let queryBuilder = supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        username,
        email,
        profile_type,
        university_name,
        is_verified,
        profile_status,
        is_profile_claimed,
        created_at,
        external_participant_profiles!external_participant_profiles_profile_id_fkey(
          college_name,
          course_level,
          course_name,
          current_year,
          state
        ),
        competition_registrations!competition_registrations_profile_id_fkey(id)
      `, { count: "exact" })
      .eq("profile_type", "external_participant")
      .is("deleted_at", null);

    // Text search
    if (filters.query && filters.query.trim().length > 0) {
      const likeTerm = `%${filters.query.trim()}%`;

      // First find matching profile IDs
      const { data: pData } = await supabase
        .from("profiles")
        .select("id")
        .eq("profile_type", "external_participant")
        .is("deleted_at", null)
        .or(`full_name.ilike.${likeTerm},username.ilike.${likeTerm},email.ilike.${likeTerm},university_name.ilike.${likeTerm}`)
        .limit(200);

      // Also search external_participant_profiles.college_name
      const { data: eData } = await supabase
        .from("external_participant_profiles")
        .select("profile_id")
        .ilike("college_name", likeTerm)
        .limit(200);

      const matchingIds = new Set<string>();
      // @ts-ignore
      pData?.forEach((p) => matchingIds.add(p.id));
      // @ts-ignore
      eData?.forEach((e) => matchingIds.add(e.profile_id));

      if (matchingIds.size === 0) {
        return { success: true, participants: [], total: 0 };
      }

      queryBuilder = queryBuilder.in("id", Array.from(matchingIds));
    }

    // Verification filter
    if (filters.verification && filters.verification !== "ALL") {
      queryBuilder = queryBuilder.eq("is_verified", filters.verification === "verified");
    }

    // Account status filter
    if (filters.accountStatus && filters.accountStatus !== "ALL") {
      queryBuilder = queryBuilder.eq("profile_status", filters.accountStatus);
    }

    // Sort
    const sortBy = filters.sortBy || "newest";
    if (sortBy === "oldest") {
      queryBuilder = queryBuilder.order("created_at", { ascending: true });
    } else if (sortBy === "name_asc") {
      queryBuilder = queryBuilder.order("full_name", { ascending: true });
    } else if (sortBy === "name_desc") {
      queryBuilder = queryBuilder.order("full_name", { ascending: false });
    } else {
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error("[External Participants Query Error]", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      logger.error("userManagement: Error searching external participants", { error });
      return { success: false, error: "Failed to search external participants." };
    }

    let participants: ExternalParticipant[] = (data || []).map((row: any) => {
      const extProfile = Array.isArray(row.external_participant_profiles)
        ? row.external_participant_profiles[0]
        : row.external_participant_profiles;
      const compRegs = Array.isArray(row.competition_registrations)
        ? row.competition_registrations
        : [];

      return {
        id: row.id,
        fullName: row.full_name,
        username: row.username,
        email: row.email,
        profileType: row.profile_type,
        universityName: row.university_name,
        collegeName: extProfile?.college_name || null,
        courseLevel: extProfile?.course_level || null,
        courseName: extProfile?.course_name || null,
        currentYear: extProfile?.current_year || null,
        state: extProfile?.state || null,
        isVerified: isProfileVerified(row),
        status: row.profile_status,
        isProfileClaimed: row.is_profile_claimed,
        createdAt: row.created_at,
        competitionCount: compRegs.length,
      };
    });

    // Post-filter by course level if needed (from the joined table)
    if (filters.courseLevel && filters.courseLevel !== "ALL") {
      participants = participants.filter((p) => p.courseLevel === filters.courseLevel);
    }

    return { success: true, participants, total: count || 0 };
  } catch (err: any) {
    logger.error("userManagement: Unexpected error in searchExternalParticipants", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}
