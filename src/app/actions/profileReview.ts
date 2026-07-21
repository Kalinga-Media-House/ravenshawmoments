"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfileAdminPermissions } from "@/lib/authorization/profile-review";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function verifyProfileAction(targetProfileId: string, note?: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canVerifyProfile) {
    return { success: false, error: "You are not authorized to verify this profile." };
  }

  try {
    // @ts-ignore
    const { error: updateError } = await supabase.from("profiles").update({ profile_status: "verified", is_verified: true }).eq("id", targetProfileId);
    if (updateError) throw updateError;

    const { error: vrError } = await supabase.from("verification_requests").insert({
        // @ts-ignore
        profile_id: targetProfileId,
        requested_by: targetProfileId,
        // @ts-ignore
        reviewer_id: actorProfile.id,
        verification_status: "approved",
        remarks: note || "Verified by admin",
        reviewed_at: new Date().toISOString()
      });
    if (vrError) logger.warn("Failed to insert verification_request log", vrError);

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_VERIFIED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      new_data: { is_verified: true, note }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: "Profile successfully verified." };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error verifying profile." };
  }
}

export async function rejectVerificationAction(targetProfileId: string, reason: string): Promise<ActionResponse> {
  if (!reason) return { success: false, error: "Rejection reason is required." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canRejectVerification) {
    return { success: false, error: "You are not authorized to reject this profile." };
  }

  try {
    const { error: vrError } = await supabase.from("verification_requests").insert({
        // @ts-ignore
        profile_id: targetProfileId,
        requested_by: targetProfileId,
        // @ts-ignore
        reviewer_id: actorProfile.id,
        verification_status: "rejected",
        remarks: reason,
        reviewed_at: new Date().toISOString()
      });
    if (vrError) throw vrError;

    // @ts-ignore
    await supabase.from("profiles").update({ profile_status: "rejected" }).eq("id", targetProfileId);

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_VERIFICATION_REJECTED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      new_data: { reason }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: "Profile verification rejected." };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error rejecting profile." };
  }
}

export async function requestCorrectionAction(targetProfileId: string, category: string, message: string): Promise<ActionResponse> {
  if (!message) return { success: false, error: "Correction message is required." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canRequestCorrection) {
    return { success: false, error: "You are not authorized to request corrections." };
  }

  try {
    const { error: crError } = await supabase.from("profile_correction_requests").insert({
        // @ts-ignore
        profile_id: targetProfileId,
        // @ts-ignore
        requested_by: actorProfile.id,
        category: category,
        message: message,
        status: "OPEN"
      });
    if (crError) throw crError;

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_CORRECTION_REQUESTED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      new_data: { category, message }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: "Correction request submitted successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error requesting correction." };
  }
}

export async function suspendProfileAction(targetProfileId: string, reason: string, expiresAt?: string): Promise<ActionResponse> {
  if (!reason) return { success: false, error: "Suspension reason is required." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canSuspend) {
    return { success: false, error: "You are not authorized to suspend this profile." };
  }

  try {
    const { data: targetProfile, error: getErr } = await supabase.from("profiles").select("profile_status").eq("id", targetProfileId).single();
    if (getErr || !targetProfile) throw getErr || new Error("Profile not found");
    // @ts-ignore
    if (targetProfile.profile_status === "suspended") return { success: false, error: "Profile is already suspended." };

    // @ts-ignore
    const previousStatus = targetProfile.profile_status;

    // @ts-ignore
    const { error: updateError } = await supabase.from("profiles").update({ 
          profile_status: "suspended",
          previous_profile_status: previousStatus,
          // @ts-ignore
          suspended_by: actorProfile.id,
          suspended_at: new Date().toISOString(),
          suspension_reason: reason,
          suspension_expires_at: expiresAt || null
      }).eq("id", targetProfileId);
    if (updateError) throw updateError;

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_SUSPENDED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      old_data: { profile_status: previousStatus },
      new_data: { profile_status: "suspended", reason, expiresAt }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: "Profile successfully suspended." };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error suspending profile." };
  }
}

export async function restoreProfileAction(targetProfileId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canRestore) {
    return { success: false, error: "You are not authorized to restore this profile." };
  }

  try {
    const { data: targetProfile, error: getErr } = await supabase.from("profiles").select("profile_status, previous_profile_status").eq("id", targetProfileId).single();
    if (getErr || !targetProfile) throw getErr || new Error("Profile not found");
    // @ts-ignore
    if (targetProfile.profile_status !== "suspended" && targetProfile.profile_status !== "archived") {
        return { success: false, error: "Profile is not suspended or archived." };
    }

    // @ts-ignore
    const prev = targetProfile.previous_profile_status;
    if (!prev || prev === "suspended" || prev === "archived") {
        return { success: false, error: "Cannot determine a safe previous status to restore to. Super Admin intervention required." };
    }

    // @ts-ignore
    const { error: updateError } = await supabase.from("profiles").update({ 
          profile_status: prev,
          previous_profile_status: null,
          // @ts-ignore
          restored_by: actorProfile.id,
          restored_at: new Date().toISOString()
      }).eq("id", targetProfileId);
    if (updateError) throw updateError;

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_RESTORED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      // @ts-ignore
      old_data: { profile_status: targetProfile.profile_status },
      new_data: { profile_status: prev }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: `Profile successfully restored to '${prev}'.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error restoring profile." };
  }
}

export async function softDeleteProfileAction(targetProfileId: string, reason: string): Promise<ActionResponse> {
  if (!reason) return { success: false, error: "Deletion reason is required." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.canSoftDelete) {
    return { success: false, error: "You are not authorized to soft-delete this profile." };
  }

  try {
    const { data: targetProfile, error: getErr } = await supabase.from("profiles").select("profile_status").eq("id", targetProfileId).single();
    if (getErr || !targetProfile) throw getErr || new Error("Profile not found");
    // @ts-ignore
    if (targetProfile.profile_status === "archived") return { success: false, error: "Profile is already archived." };

    // @ts-ignore
    const previousStatus = targetProfile.profile_status;
    // @ts-ignore
    const { error: updateError } = await supabase.from("profiles").update({ 
          profile_status: "archived",
          previous_profile_status: previousStatus,
          deleted_at: new Date().toISOString(),
          // @ts-ignore
          deleted_by: actorProfile.id,
          deletion_reason: reason
      }).eq("id", targetProfileId);
    if (updateError) throw updateError;

    await supabase.from("audit_logs").insert({
      // @ts-ignore
      actor_profile_id: actorProfile.id,
      action: "PROFILE_SOFT_DELETED",
      entity_type: "profiles",
      entity_id: targetProfileId,
      old_data: { profile_status: previousStatus },
      new_data: { profile_status: "archived", reason }
    });

    revalidatePath(`/admin/roles/profiles/${targetProfileId}`);
    return { success: true, message: "Profile successfully soft-deleted (archived)." };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error soft-deleting profile." };
  }
}

export async function permanentlyDeleteProfileAction(targetProfileId: string, reason: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!actorProfile) return { success: false, error: "Actor profile not found." };

  // @ts-ignore
  const auth = await getProfileAdminPermissions(actorProfile.id, targetProfileId);
  if (!auth.success || !auth.permissions?.isSuperAdmin) {
    return { success: false, error: "You are not authorized to permanently delete this profile." };
  }

  return { success: false, message: "Permanent deletion is currently unavailable until the platform-wide deletion policy is configured." };
}
