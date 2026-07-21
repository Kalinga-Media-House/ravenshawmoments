import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export interface ProfileReviewPermissions {
  canView: boolean;
  canVerifyProfile: boolean;
  canRejectVerification: boolean;
  canRequestCorrection: boolean;
  canReviewClaim: boolean;
  canSuspend: boolean;
  canRestore: boolean;
  canSoftDelete: boolean;
  canPermanentlyDelete: boolean;
  canViewFullAuditHistory: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isDepartmentCR: boolean;
  isHostelBMC: boolean;
}

/**
 * Calculates granular permissions for an actor trying to review/administer a specific target profile.
 * Does NOT accept trusted role hints from the client.
 */
export async function getProfileAdminPermissions(
  actorUserId: string,
  targetProfileId: string
): Promise<{ success: boolean; permissions?: ProfileReviewPermissions; error?: string }> {
  try {
    const supabase = await createClient();

    const defaultPermissions: ProfileReviewPermissions = {
      canView: false,
      canVerifyProfile: false,
      canRejectVerification: false,
      canRequestCorrection: false,
      canReviewClaim: false,
      canSuspend: false,
      canRestore: false,
      canSoftDelete: false,
      canPermanentlyDelete: false,
      canViewFullAuditHistory: false,
      isSuperAdmin: false,
      isAdmin: false,
      isDepartmentCR: false,
      isHostelBMC: false,
    };

    // 1. Fetch Target Profile Details to determine its scope
    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select(`
        id,
        profile_type,
        education_records!education_records_profile_id_fkey(department_program_id, is_primary),
        hostel_memberships!hostel_memberships_profile_id_fkey(hostel_id, is_current)
      `)
      .eq("id", targetProfileId)
      .single();

    if (targetError || !targetProfile) {
      return { success: false, error: "Target profile not found." };
    }

    // 2. Determine Platform Admin Status of the Actor
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return { success: false, error: "Authentication required." };
    }

    // Fetch actor profile to verify identity
    const { data: actorProfile, error: actorError } = await supabase
      .from("profiles")
      .select("id, profile_type")
      .eq("auth_user_id", authUser.id)
      .single();

    if (!actorProfile) {
      return { success: false, error: "Actor profile not found." };
    }

    // Verify the actorUserId matches the resolved profile
    // @ts-ignore
    if (actorProfile.id !== actorUserId) {
      return { success: false, error: "Authentication context mismatch." };
    }

    // Fetch platform roles using the same query as the working /admin/roles page
    const { data: roleAssignments } = await supabase
      .from("profile_roles")
      .select("roles!inner(code)")
      // @ts-ignore
      .eq("profile_id", actorProfile.id)
      .eq("is_active", true);

    const roleCodes = (roleAssignments || []).map((ra: any) => (ra.roles as any).code as string);

    // @ts-ignore
    const isSuperAdmin = roleCodes.includes("SUPER_ADMIN") || actorProfile.profile_type === "super_admin";
    // @ts-ignore
    const isAdmin = isSuperAdmin || roleCodes.includes("ADMIN") || actorProfile.profile_type === "admin";

    if (isSuperAdmin) {
      return {
        success: true,
        permissions: {
          ...defaultPermissions,
          canView: true,
          canVerifyProfile: true,
          canRejectVerification: true,
          canRequestCorrection: true,
          canReviewClaim: true,
          canSuspend: true,
          canRestore: true,
          canSoftDelete: true,
          canPermanentlyDelete: true,
          canViewFullAuditHistory: true,
          isSuperAdmin: true,
        },
      };
    }

    if (isAdmin) {
      // Admins cannot modify Super Admins
      const targetIsSuperAdmin = (targetProfile as any).profile_type === "super_admin";
      
      let targetIsEffectivelySuperAdmin = targetIsSuperAdmin;
      const { data: targetSuperAdminRoles } = await supabase
        .from("profile_roles")
        .select("roles!inner(code)")
        .eq("profile_id", targetProfileId)
        .eq("is_active", true)
        .eq("roles.code", "SUPER_ADMIN");
        
      if (targetSuperAdminRoles && targetSuperAdminRoles.length > 0) {
          targetIsEffectivelySuperAdmin = true;
      }

      if (targetIsEffectivelySuperAdmin) {
         return {
           success: true,
           permissions: {
             ...defaultPermissions,
             canView: true,
             isAdmin: true
           }
         }
      }

      return {
        success: true,
        permissions: {
          ...defaultPermissions,
          canView: true,
          canVerifyProfile: true,
          canRejectVerification: true,
          canRequestCorrection: true,
          canReviewClaim: true,
          canSuspend: true,
          canRestore: true,
          canSoftDelete: true,
          canPermanentlyDelete: false,
          canViewFullAuditHistory: true,
          isAdmin: true,
        },
      };
    }

    // 3. Department CR Scope Verification
    let isAuthorizedCR = false;
    const primaryEd = (targetProfile as any).education_records?.find((e: any) => e.is_primary);
    
    if (primaryEd && primaryEd.department_program_id) {
        const { data: program } = await supabase
            .from("department_programs")
            .select("department_id")
            .eq("id", primaryEd.department_program_id)
            .single();

      // @ts-ignore
      if (program && program.department_id) {
        const { data: crAssignment } = await supabase
          .from("department_crs")
          .select("id")
          .eq("profile_id", actorUserId)
          // @ts-ignore
          .eq("department_id", program.department_id)
          .eq("is_active", true)
          .lte("term_start_date", new Date().toISOString())
          .gte("term_end_date", new Date().toISOString())
          .maybeSingle();

        if (crAssignment) {
          isAuthorizedCR = true;
        }
      }
    }

    if (isAuthorizedCR) {
       return {
         success: true,
         permissions: {
           ...defaultPermissions,
           canView: true,
           canVerifyProfile: true,
           canRejectVerification: true,
           canRequestCorrection: true,
           canReviewClaim: true,
           isDepartmentCR: true
         }
       }
    }

    // 4. Hostel BMC Scope Verification
    let isAuthorizedBMC = false;
    const currentHostel = (targetProfile as any).hostel_memberships?.find((h: any) => h.is_current);

    if (currentHostel && currentHostel.hostel_id) {
      const { data: bmcAssignment } = await supabase
        .from("hostel_bmcs")
        .select("id")
        .eq("profile_id", actorUserId)
        .eq("hostel_id", currentHostel.hostel_id)
        .eq("is_active", true)
        .maybeSingle();

      if (bmcAssignment) {
        isAuthorizedBMC = true;
      }
    }

    if (isAuthorizedBMC) {
       return {
         success: true,
         permissions: {
           ...defaultPermissions,
           canView: true,
           canRequestCorrection: true,
           canReviewClaim: true,
           isHostelBMC: true
         }
       }
    }

    // If reached here, actor has no administrative rights over this target
    return { success: true, permissions: defaultPermissions };

  } catch (error: any) {
    logger.error("Error calculating profile admin permissions", error);
    return { success: false, error: "Server error calculating permissions." };
  }
}
