"use server";

import { createClient } from "@/lib/supabase/server";
import { verifySuperAdmin, verifyPlatformAdmin } from "@/lib/authorization";
import { logger } from "@/lib/logger";

// ============================================================================
// Types
// ============================================================================

interface RoleActionResult {
  success: boolean;
  error?: string;
}

interface UserWithRoles {
  id: string;
  fullName: string;
  username: string;
  email: string;
  profileType: string;
  platformRoles: { code: string; name: string; isActive: boolean; assignmentId: string }[];
}

// ============================================================================
// Search Users (Platform Admin)
// ============================================================================

export async function searchUsersForRoleManagement(
  query: string
): Promise<{ success: boolean; users: UserWithRoles[]; error?: string }> {
  try {
    const auth = await verifyPlatformAdmin();
    if (!auth.authorized) {
      return { success: false, users: [], error: auth.error };
    }

    if (!query || query.trim().length < 2) {
      return { success: false, users: [], error: "Search query must be at least 2 characters." };
    }

    const supabase = await createClient();
    const searchTerm = `%${query.trim()}%`;

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, username, email, profile_type")
      .or(`full_name.ilike.${searchTerm},username.ilike.${searchTerm},email.ilike.${searchTerm}`)
      .limit(20);

    if (error) {
      logger.error("RoleManagement: Error searching users", { error });
      return { success: false, users: [], error: "Failed to search users." };
    }

    const users: UserWithRoles[] = [];

    for (const profile of profiles || []) {
      const { data: roleAssignments } = await supabase
        .from("profile_roles")
        .select("id, is_active, roles!inner(code, name)")
        // @ts-ignore
        .eq("profile_id", profile.id);

      const platformRoles = (roleAssignments || [])
        .filter((ra: any) => {
          const code = (ra.roles as any).code;
          return ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(code);
        })
        .map((ra: any) => ({
          code: (ra.roles as any).code as string,
          name: (ra.roles as any).name as string,
          isActive: ra.is_active as boolean,
          assignmentId: ra.id as string,
        }));

      users.push({
        // @ts-ignore
        id: profile.id,
        // @ts-ignore
        fullName: profile.full_name || "",
        // @ts-ignore
        username: profile.username || "",
        // @ts-ignore
        email: profile.email || "",
        // @ts-ignore
        profileType: profile.profile_type || "member",
        platformRoles,
      });
    }

    return { success: true, users };
  } catch (err: any) {
    logger.error("RoleManagement: Unexpected error in searchUsers", { error: err });
    return { success: false, users: [], error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Assign ADMIN Role (SUPER_ADMIN only)
// ============================================================================

export async function assignAdminRole(targetProfileId: string): Promise<RoleActionResult> {
  try {
    const auth = await verifySuperAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    if (!targetProfileId) {
      return { success: false, error: "Target profile ID is required." };
    }

    const supabase = await createClient();

    // Get ADMIN role ID
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("code", "ADMIN")
      .single();

    if (roleError || !adminRole) {
      return { success: false, error: "ADMIN role not found in the system." };
    }

    // Check if user already has an active ADMIN role
    const { data: existingAssignment } = await supabase
      .from("profile_roles")
      .select("id, is_active")
      .eq("profile_id", targetProfileId)
      // @ts-ignore
      .eq("role_id", adminRole.id)
      .eq("is_active", true)
      .maybeSingle();

    if (existingAssignment) {
      return { success: false, error: "This user already has an active ADMIN role." };
    }

    // Fetch previous roles for audit
    const { data: previousRoles } = await supabase
      .from("profile_roles")
      .select("roles!inner(code, name), is_active")
      .eq("profile_id", targetProfileId);

    const previousRoleData = (previousRoles || []).map((pr: any) => ({
      code: (pr.roles as any).code,
      name: (pr.roles as any).name,
      isActive: pr.is_active,
    }));

    // Insert the role assignment
    const { error: insertError } = await supabase
      .from("profile_roles")
      .insert({
        // @ts-ignore
        profile_id: targetProfileId,
        // @ts-ignore
        role_id: adminRole.id,
        assigned_by: auth.profileId,
        is_active: true,
      });

    if (insertError) {
      logger.error("RoleManagement: Error assigning ADMIN role", { error: insertError });
      return { success: false, error: insertError.message || "Failed to assign ADMIN role." };
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: auth.profileId,
      action: "ADMIN_ROLE_ASSIGNED",
      entity_type: "profile",
      entity_id: targetProfileId,
      old_data: { roles: previousRoleData },
      new_data: {
        roles: [...previousRoleData, { code: "ADMIN", name: "Admin", isActive: true }],
      },
    });

    logger.info("RoleManagement: ADMIN role assigned", {
      actorId: auth.profileId,
      targetId: targetProfileId,
    });

    return { success: true };
  } catch (err: any) {
    logger.error("RoleManagement: Unexpected error in assignAdminRole", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}

// ============================================================================
// Revoke ADMIN Role (SUPER_ADMIN only)
// ============================================================================

export async function revokeAdminRole(targetProfileId: string): Promise<RoleActionResult> {
  try {
    const auth = await verifySuperAdmin();
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    if (!targetProfileId) {
      return { success: false, error: "Target profile ID is required." };
    }

    const supabase = await createClient();

    // Get ADMIN role ID
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("code", "ADMIN")
      .single();

    if (roleError || !adminRole) {
      return { success: false, error: "ADMIN role not found in the system." };
    }

    // Find active ADMIN role assignment
    const { data: existingAssignment } = await supabase
      .from("profile_roles")
      .select("id, is_active")
      .eq("profile_id", targetProfileId)
      // @ts-ignore
      .eq("role_id", adminRole.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!existingAssignment) {
      return { success: false, error: "This user does not have an active ADMIN role." };
    }

    // Fetch previous roles for audit
    const { data: previousRoles } = await supabase
      .from("profile_roles")
      .select("roles!inner(code, name), is_active")
      .eq("profile_id", targetProfileId);

    const previousRoleData = (previousRoles || []).map((pr: any) => ({
      code: (pr.roles as any).code,
      name: (pr.roles as any).name,
      isActive: pr.is_active,
    }));

    // Deactivate the role assignment (soft-revoke)
    const { error: updateError } = await supabase
      .from("profile_roles")
      // @ts-ignore
      .update({ is_active: false })
      // @ts-ignore
      .eq("id", existingAssignment.id);

    if (updateError) {
      logger.error("RoleManagement: Error revoking ADMIN role", { error: updateError });
      return { success: false, error: updateError.message || "Failed to revoke ADMIN role." };
    }

    // Audit log
    const newRoleData = previousRoleData.map((r: any) =>
      r.code === "ADMIN" ? { ...r, isActive: false } : r
    );

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: auth.profileId,
      action: "ADMIN_ROLE_REVOKED",
      entity_type: "profile",
      entity_id: targetProfileId,
      old_data: { roles: previousRoleData },
      new_data: { roles: newRoleData },
    });

    logger.info("RoleManagement: ADMIN role revoked", {
      actorId: auth.profileId,
      targetId: targetProfileId,
    });

    return { success: true };
  } catch (err: any) {
    logger.error("RoleManagement: Unexpected error in revokeAdminRole", { error: err });
    return { success: false, error: err.message || "Unexpected error." };
  }
}
