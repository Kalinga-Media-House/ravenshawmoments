// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/index.ts
// Purpose   : Universal Profile System Supabase Storage Engine & Upload Helpers
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { PROFILE_FILE_RULES } from "@/lib/validation/profile-system";

/**
 * Validates file MIME type and file size in bytes against security rules.
 */
export function validateStorageFile(
  file: File,
  allowedMimes: readonly string[],
  maxSizeBytes: number
): ApiResponse<void> {
  if (!file || !(file instanceof File)) {
    return {
      success: false,
      error: { code: "INVALID_FILE", message: "No valid file provided for upload." },
    };
  }

  if (!allowedMimes.includes(file.type)) {
    return {
      success: false,
      error: {
        code: "UNSUPPORTED_MIME_TYPE",
        message: `File type ${file.type} is not supported. Allowed types: ${allowedMimes.join(", ")}`,
      },
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      success: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: `File size exceeds the maximum limit of ${maxMb} MB.`,
      },
    };
  }

  return { success: true };
}

/**
 * Sanitizes original filenames to ASCII alphanumeric characters, hyphens, and underscores,
 * preventing directory traversal, URL encoding bugs, and duplicate collision attacks.
 */
export function sanitizeStorageFilename(originalName: string): string {
  const parts = originalName.split(".");
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || "bin" : "bin";
  const base = parts
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, "-") // replace special chars
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 50);

  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${base || "file"}-${timestamp}-${randomStr}.${ext}`;
}

/**
 * Uploads a profile avatar image to the restricted `profile-images` private bucket.
 */
export async function uploadProfileAvatar(
  supabase: SupabaseClient,
  profileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  const validation = validateStorageFile(
    file,
    PROFILE_FILE_RULES.ALLOWED_IMAGE_MIMES,
    PROFILE_FILE_RULES.MAX_IMAGE_SIZE_BYTES
  );
  if (!validation.success) return validation as ApiResponse<never>;

  const sanitizedName = sanitizeStorageFilename(file.name);
  const storagePath = `${profileId}/avatar/${sanitizedName}`;
  const bucket = "profile-images";

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "STORAGE_UPLOAD_ERROR", message: uploadError.message },
    };
  }

  // Register file metadata in media_files
  const { data: mediaRecord, error: mediaError } = await supabase
    .from("media_files")
    .insert({
      owner_profile_id: profileId,
      storage_bucket: bucket,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type,
      media_type: "image",
      file_size_bytes: file.size,
      is_public: false,
    })
    .select("id")
    .single();

  if (mediaError || !mediaRecord) {
    // Rollback storage upload on database metadata error
    await supabase.storage.from(bucket).remove([storagePath]);
    return {
      success: false,
      error: { code: "METADATA_INSERT_ERROR", message: mediaError?.message || "Failed to save file metadata." },
    };
  }

  // Generate private signed URL (1 year expiry for internal avatar display)
  const { data: signedData, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, 31536000);

  const media_url = signedData?.signedUrl || "";
  if (signError || !media_url) {
    return {
      success: false,
      error: { code: "SIGNED_URL_ERROR", message: "Uploaded successfully but failed to generate access URL." },
    };
  }

  return {
    success: true,
    data: {
      media_file_id: mediaRecord.id,
      media_url,
      storage_path: storagePath,
    },
  };
}

/**
 * Uploads an image to the public `gallery` bucket while enforcing the hard 50-image quota.
 */
export async function uploadGalleryImage(
  supabase: SupabaseClient,
  profileId: string,
  albumId: string,
  file: File,
  caption?: string
): Promise<ApiResponse<{ media_file_id: string; gallery_item_id: string; media_url: string }>> {
  const validation = validateStorageFile(
    file,
    PROFILE_FILE_RULES.ALLOWED_IMAGE_MIMES,
    PROFILE_FILE_RULES.MAX_IMAGE_SIZE_BYTES
  );
  if (!validation.success) return validation as ApiResponse<never>;

  // Enforce maximum 50 gallery images limit
  const { count, error: countErr } = await supabase
    .from("gallery_items")
    .select("id", { count: "exact", head: true })
    .eq("gallery_album_id", albumId);

  if (countErr) {
    return {
      success: false,
      error: { code: "QUOTA_CHECK_ERROR", message: "Failed to verify current gallery quota." },
    };
  }

  if (count !== null && count >= PROFILE_FILE_RULES.MAX_GALLERY_QUOTA) {
    return {
      success: false,
      error: {
        code: "QUOTA_EXCEEDED",
        message: `Maximum gallery limit of ${PROFILE_FILE_RULES.MAX_GALLERY_QUOTA} images reached. Delete an existing image before uploading.`,
      },
    };
  }

  const sanitizedName = sanitizeStorageFilename(file.name);
  const storagePath = `profiles/${profileId}/${sanitizedName}`;
  const bucket = "gallery";

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "86400",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "STORAGE_UPLOAD_ERROR", message: uploadError.message },
    };
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const media_url = publicUrlData.publicUrl;

  // Insert metadata in media_files
  const { data: mediaRecord, error: mediaError } = await supabase
    .from("media_files")
    .insert({
      owner_profile_id: profileId,
      storage_bucket: bucket,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type,
      media_type: "image",
      file_size_bytes: file.size,
      is_public: true,
    })
    .select("id")
    .single();

  if (mediaError || !mediaRecord) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return {
      success: false,
      error: { code: "METADATA_INSERT_ERROR", message: mediaError?.message || "Failed to register media." },
    };
  }

  // Link into gallery_items
  const { data: itemRecord, error: itemError } = await supabase
    .from("gallery_items")
    .insert({
      gallery_album_id: albumId,
      media_file_id: mediaRecord.id,
      caption: caption || null,
      display_order: (count || 0) + 1,
      uploaded_by: profileId,
    })
    .select("id")
    .single();

  if (itemError || !itemRecord) {
    await supabase.storage.from(bucket).remove([storagePath]);
    await supabase.from("media_files").delete().eq("id", mediaRecord.id);
    return {
      success: false,
      error: { code: "GALLERY_ITEM_ERROR", message: itemError?.message || "Failed to link image to gallery." },
    };
  }

  return {
    success: true,
    data: {
      media_file_id: mediaRecord.id,
      gallery_item_id: itemRecord.id,
      media_url,
    },
  };
}

/**
 * Uploads a contribution proof document to the private `contribution-proofs` bucket.
 */
export async function uploadContributionProofFile(
  supabase: SupabaseClient,
  profileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; storage_path: string }>> {
  const validation = validateStorageFile(
    file,
    PROFILE_FILE_RULES.ALLOWED_DOC_MIMES,
    PROFILE_FILE_RULES.MAX_DOCUMENT_SIZE_BYTES
  );
  if (!validation.success) return validation as ApiResponse<never>;

  const sanitizedName = sanitizeStorageFilename(file.name);
  const storagePath = `${profileId}/proofs/${sanitizedName}`;
  const bucket = "contribution-proofs";

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "STORAGE_UPLOAD_ERROR", message: uploadError.message },
    };
  }

  const mediaType = file.type.startsWith("image/") ? "image" : "document";
  const { data: mediaRecord, error: mediaError } = await supabase
    .from("media_files")
    .insert({
      owner_profile_id: profileId,
      storage_bucket: bucket,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type,
      media_type: mediaType,
      file_size_bytes: file.size,
      is_public: false,
    })
    .select("id")
    .single();

  if (mediaError || !mediaRecord) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return {
      success: false,
      error: { code: "METADATA_INSERT_ERROR", message: mediaError?.message || "Failed to register proof document." },
    };
  }

  return {
    success: true,
    data: {
      media_file_id: mediaRecord.id,
      storage_path: storagePath,
    },
  };
}

/**
 * Safely removes a file from Supabase Storage and flags or deletes its database metadata.
 */
export async function deleteStorageFile(
  supabase: SupabaseClient,
  bucket: string,
  storagePath: string,
  mediaFileId?: string
): Promise<ApiResponse<void>> {
  const { error: storageError } = await supabase.storage.from(bucket).remove([storagePath]);
  if (storageError) {
    return {
      success: false,
      error: { code: "STORAGE_DELETE_ERROR", message: storageError.message },
    };
  }

  if (mediaFileId) {
    const { error: dbError } = await supabase
      .from("media_files")
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq("id", mediaFileId);

    if (dbError) {
      return {
        success: false,
        error: { code: "DB_CLEANUP_ERROR", message: dbError.message },
      };
    }
  }

  return { success: true };
}

export * from "./department-storage";
