"use server";

import { createClient } from "@/lib/supabase/server";
import { UNIVERSAL_FILE_RULES, isAllowedImageType, generatePlatformStoragePath } from "@/features/shared/media";
import { STORAGE_BUCKETS, USER_ROLES } from "@/constants";

export async function uploadCompetitionCoverImage(formData: FormData): Promise<{ success: boolean; message: string; mediaId?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    // @ts-ignore
    if (!profile || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MODERATOR].includes(profile.role as any)) {
      return { success: false, message: "Forbidden" };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Validation
    if (file.size > UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES) {
      return { success: false, message: "File exceeds maximum size of 5MB" };
    }
    if (!isAllowedImageType(file.type)) {
      return { success: false, message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Generate path
    const storagePath = generatePlatformStoragePath(user.id, "competitions", file.name);

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.GALLERY)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, message: "Failed to upload file to storage" };
    }

    // Persist to media_files
    const { data: mediaRecord, error: dbError } = await supabase
      .from("media_files")
      .insert({
        // @ts-ignore
        storage_bucket: STORAGE_BUCKETS.GALLERY,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
        uploaded_by: user.id,
      })
      .select("id")
      .single();

    if (dbError || !mediaRecord) {
      console.error("Database insert error:", dbError);
      // Attempt cleanup (ignoring errors)
      await supabase.storage.from(STORAGE_BUCKETS.GALLERY).remove([storagePath]);
      return { success: false, message: "Failed to create media record" };
    }

    // @ts-ignore
    return { success: true, message: "Upload successful", mediaId: mediaRecord.id };
  } catch (error: any) {
    console.error("Unexpected upload error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
