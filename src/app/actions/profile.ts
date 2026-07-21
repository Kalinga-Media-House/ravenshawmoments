// =============================================================================
// Ravenshaw Moments
// File      : src/app/actions/profile.ts
// Purpose   : Universal Profile System Production-Ready Server Actions
//             Delegates strictly to Service Layer (3-Tier Architecture)
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeText } from "@/lib/sanitize";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types";
import { profileService } from "@/features/profile/services";


/**
 * Legacy Profile onboarding action preserved for baseline compatibility.
 */
export async function createProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Action: Unauthorized profile creation attempt.");
    redirect("/login");
  }

  try {
    const rawInput = {
      full_name: sanitizeText(String(formData.get("full_name") || "")),
      username: sanitizeText(String(formData.get("username") || "")),
      bio: sanitizeText(String(formData.get("bio") || "")),
      level: user.user_metadata?.level,
      stream: user.user_metadata?.stream,
      department_name: user.user_metadata?.department,
      batch_year: user.user_metadata?.batch,
      profile_type: user.user_metadata?.role,
      university_name: user.user_metadata?.university_name,
    };

    await profileService.createProfile(user.id, user.email, rawInput);
  } catch (err: unknown) {
    logger.error("Action: Error in createProfile", err);
    throw err;
  }

  redirect("/dashboard");
}

/**
 * Updates basic identity and biography information via Service Layer.
 */
export async function updateBasicProfile(formData: FormData): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const rawInput = {
      full_name: sanitizeText(String(formData.get("full_name") || "")),
      username: sanitizeText(String(formData.get("username") || "")).replace(/^@+/, "").toLowerCase(),
      bio: sanitizeText(String(formData.get("bio") || "")),
      gender: formData.get("gender") ? String(formData.get("gender")) : undefined,
      date_of_birth: formData.get("date_of_birth") ? String(formData.get("date_of_birth")) : undefined,
    };

    await profileService.updateBasicProfile(user.id, rawInput);
    return { success: true };
  } catch (err: unknown) {
    logger.error("Action: Error in updateBasicProfile", err);
    const message = err instanceof Error ? err.message : "Invalid form submission.";
    return { success: false, error: { code: "VALIDATION_ERROR", message } };
  }
}

/**
 * Updates private academic enrollment records via Service Layer.
 */
export async function updateAcademicProfile(formData: FormData): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const rawInput = {
      department_id: String(formData.get("department_id") || ""),
      batch_id: String(formData.get("batch_id") || ""),
      roll_number: sanitizeText(String(formData.get("roll_number") || "")),
      registration_number: sanitizeText(String(formData.get("registration_number") || "")),
      date_of_birth: formData.get("date_of_birth") ? String(formData.get("date_of_birth")) : undefined,
    };

    await profileService.updateAcademicProfile(user.id, rawInput);
    return { success: true };
  } catch (err: unknown) {
    logger.error("Action: Error in updateAcademicProfile", err);
    const message = err instanceof Error ? err.message : "Invalid academic record inputs.";
    return { success: false, error: { code: "VALIDATION_ERROR", message } };
  }
}

/**
 * Updates user-controlled privacy toggles via Service Layer.
 */
export async function updatePrivacySettings(formData: FormData): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const rawInput = {
      profile_visibility: String(formData.get("profile_visibility") || "public"),
      email_visibility: String(formData.get("email_visibility") || "private"),
      phone_visibility: String(formData.get("phone_visibility") || "private"),
      dob_visibility: String(formData.get("dob_visibility") || "private"),
      gallery_visibility: String(formData.get("gallery_visibility") || "public"),
      achievements_visibility: String(formData.get("achievements_visibility") || "public"),
    };

    await profileService.updatePrivacySettings(user.id, rawInput);
    return { success: true };
  } catch (err: unknown) {
    logger.error("Action: Error in updatePrivacySettings", err);
    const message = err instanceof Error ? err.message : "Invalid privacy settings.";
    return { success: false, error: { code: "VALIDATION_ERROR", message } };
  }
}

/**
 * Submits an existing student Roll Number claim request via Service Layer.
 */
export async function claimStudentProfile(formData: FormData): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const rawInput = {
      roll_number: sanitizeText(String(formData.get("roll_number") || "")),
      registration_number: sanitizeText(String(formData.get("registration_number") || "")),
      supporting_document_url: String(formData.get("supporting_document_url") || ""),
    };

    await profileService.claimProfile(user.id, rawInput);
    return { success: true };
  } catch (err: unknown) {
    logger.error("Action: Error in claimStudentProfile", err);
    const message = err instanceof Error ? err.message : "Invalid claim details.";
    return { success: false, error: { code: "VALIDATION_ERROR", message } };
  }
}

/**
 * Uploads an image to the user's personal gallery via Service Layer.
 */
export async function uploadProfileGalleryImageAction(
  formData: FormData
): Promise<ApiResponse<{ media_file_id: string; gallery_item_id: string; media_url: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const file = formData.get("file") as File | null;
    const caption = sanitizeText(String(formData.get("caption") || ""));

    if (!file || !(file instanceof File)) {
      return { success: false, error: { code: "NO_FILE", message: "An image file is required." } };
    }

    return await profileService.uploadGalleryImageService(user.id, file, caption);
  } catch (err: unknown) {
    logger.error("Action: Runtime error in uploadProfileGalleryImageAction", err);
    return { success: false, error: { code: "SERVER_ERROR", message: "Unexpected upload failure." } };
  }
}

/**
 * Safely removes a gallery image via Service Layer.
 */
export async function deleteProfileGalleryImageAction(galleryItemId: string): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    return await profileService.deleteGalleryImageService(user.id, galleryItemId);
  } catch (err: unknown) {
    logger.error("Action: Error in deleteProfileGalleryImageAction", err);
    return { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete image." } };
  }
}

/**
 * Submits a private supporting contribution proof document via Service Layer.
 */
export async function submitContributionProofAction(
  formData: FormData
): Promise<ApiResponse<{ proof_id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } };
  }

  try {
    const file = formData.get("file") as File | null;
    const title = sanitizeText(String(formData.get("title") || ""));
    const description = sanitizeText(String(formData.get("description") || ""));
    const amountStr = formData.get("amount_reference");
    const amount_reference = amountStr ? parseFloat(String(amountStr)) : undefined;

    if (!file || !(file instanceof File)) {
      return { success: false, error: { code: "NO_FILE", message: "A supporting proof document is required." } };
    }

    const rawInput = { title, description, amount_reference };
    return await profileService.submitContributionProofService(user.id, file, rawInput);
  } catch (err: unknown) {
    logger.error("Action: Error in submitContributionProofAction", err);
    const message = err instanceof Error ? err.message : "Invalid proof submission.";
    return { success: false, error: { code: "VALIDATION_ERROR", message } };
  }
}