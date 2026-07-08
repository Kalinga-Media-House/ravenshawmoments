// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/department-storage.ts
// Purpose   : Universal Department Ecosystem Storage Wrappers & Media Helpers
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { validateStorageFile, sanitizeStorageFilename, deleteStorageFile } from "./index";

/**
 * Constants and security boundaries for Department media and document uploads.
 */
export const DEPARTMENT_FILE_RULES = {
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB for Logos, Covers, and Gallery images
  MAX_DOCUMENT_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB for Annual Magazines, Journals, and Notice attachments
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"] as const,
  ALLOWED_DOC_MIMES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ] as const,
  ALLOWED_PUB_MIMES: ["application/pdf"] as const, // Strict PDF enforcement for Publications
  MAX_GALLERY_QUOTA: 100, // 100 images per department gallery album
} as const;

/**
 * Internal shared helper to upload a departmental file to Supabase Storage
 * and register its metadata in the universal `media_files` table with transactional rollback.
 */
async function uploadDepartmentMediaHelper(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File,
  folderSubpath: string,
  allowedMimes: readonly string[],
  maxSizeBytes: number,
  bucket = "gallery",
  isPublic = true
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  // 1. Validate file size and MIME type
  const validation = validateStorageFile(file, allowedMimes, maxSizeBytes);
  if (!validation.success) return validation as ApiResponse<never>;

  // 2. Sanitize filename and construct unique storage path
  const sanitizedName = sanitizeStorageFilename(file.name);
  const storagePath = `departments/${departmentId}/${folderSubpath}/${sanitizedName}`;

  // 3. Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: isPublic ? "86400" : "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "STORAGE_UPLOAD_ERROR", message: uploadError.message },
    };
  }

  // 4. Determine media URL (public or private signed)
  let media_url = "";
  if (isPublic) {
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    media_url = publicUrlData.publicUrl;
  } else {
    const { data: signedData, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 31536000); // 1 year expiry for internal docs
    media_url = signedData?.signedUrl || "";
    if (signError || !media_url) {
      await supabase.storage.from(bucket).remove([storagePath]);
      return {
        success: false,
        error: { code: "SIGNED_URL_ERROR", message: "File uploaded but failed to generate signed URL." },
      };
    }
  }

  // 5. Register metadata in `media_files` table
  const mediaType = file.type.startsWith("image/") ? "image" : "document";
  const { data: mediaRecord, error: mediaError } = await supabase
    .from("media_files")
    .insert({
      owner_profile_id: uploaderProfileId,
      storage_bucket: bucket,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type,
      media_type: mediaType,
      file_size_bytes: file.size,
      is_public: isPublic,
    })
    .select("id")
    .single();

  if (mediaError || !mediaRecord) {
    // Transactional rollback of storage asset on DB insert failure (e.g., RLS violation)
    await supabase.storage.from(bucket).remove([storagePath]);
    return {
      success: false,
      error: {
        code: "METADATA_INSERT_ERROR",
        message: mediaError?.message || "Failed to register media metadata in database.",
      },
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

// ============================================================================
// Department-Specific Storage Service Wrappers
// ============================================================================

/**
 * 1. Uploads a Department Logo image to the public `gallery` bucket.
 */
export async function uploadDepartmentLogo(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "logos",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * 2. Uploads a Department Cover Banner image to the public `gallery` bucket.
 */
export async function uploadDepartmentCover(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "covers",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * 3. Uploads a Department Gallery Image, enforcing album quotas and creating a `gallery_items` record.
 */
export async function uploadDepartmentGalleryImage(
  supabase: SupabaseClient,
  departmentId: string,
  albumId: string,
  uploaderProfileId: string,
  file: File,
  caption?: string
): Promise<ApiResponse<{ media_file_id: string; gallery_item_id: string; media_url: string; storage_path: string }>> {
  // Enforce maximum album quota before storage upload
  const { count, error: countErr } = await supabase
    .from("gallery_items")
    .select("id", { count: "exact", head: true })
    .eq("gallery_album_id", albumId);

  if (countErr) {
    return {
      success: false,
      error: { code: "QUOTA_CHECK_ERROR", message: "Failed to verify current album quota." },
    };
  }

  if (count !== null && count >= DEPARTMENT_FILE_RULES.MAX_GALLERY_QUOTA) {
    return {
      success: false,
      error: {
        code: "QUOTA_EXCEEDED",
        message: `Maximum department album quota of ${DEPARTMENT_FILE_RULES.MAX_GALLERY_QUOTA} images reached.`,
      },
    };
  }

  // Upload asset and register in media_files
  const uploadRes = await uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    `gallery/${albumId}`,
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES,
    "gallery",
    true
  );

  if (!uploadRes.success || !uploadRes.data) return uploadRes as ApiResponse<never>;

  // Link asset into gallery_items
  const { data: itemRecord, error: itemError } = await supabase
    .from("gallery_items")
    .insert({
      gallery_album_id: albumId,
      media_file_id: uploadRes.data.media_file_id,
      caption: caption || null,
      display_order: (count || 0) + 1,
      uploaded_by: uploaderProfileId,
    })
    .select("id")
    .single();

  if (itemError || !itemRecord) {
    // Transactional rollback if gallery_items insert fails
    await deleteStorageFile(supabase, "gallery", uploadRes.data.storage_path, uploadRes.data.media_file_id);
    return {
      success: false,
      error: { code: "GALLERY_ITEM_ERROR", message: itemError?.message || "Failed to link image to department gallery." },
    };
  }

  return {
    success: true,
    data: {
      media_file_id: uploadRes.data.media_file_id,
      gallery_item_id: itemRecord.id,
      media_url: uploadRes.data.media_url,
      storage_path: uploadRes.data.storage_path,
    },
  };
}

/**
 * 4. Uploads a Department Notice Attachment (PDF or Image) to the public `gallery` bucket.
 */
export async function uploadDepartmentNoticeAttachment(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "notices",
    DEPARTMENT_FILE_RULES.ALLOWED_DOC_MIMES,
    DEPARTMENT_FILE_RULES.MAX_DOCUMENT_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * 5. Uploads a Department Event Promotional Cover Image to the public `gallery` bucket.
 */
export async function uploadDepartmentEventCover(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "events",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * 6. Uploads a Department Publication Cover Thumbnail Image to the public `gallery` bucket.
 */
export async function uploadDepartmentPublicationCover(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "publications/covers",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * 7. Uploads a Department Publication Document (Strict PDF) up to 25MB.
 */
export async function uploadDepartmentPublicationDocument(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
): Promise<ApiResponse<{ media_file_id: string; media_url: string; storage_path: string }>> {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "publications/documents",
    DEPARTMENT_FILE_RULES.ALLOWED_PUB_MIMES,
    DEPARTMENT_FILE_RULES.MAX_DOCUMENT_SIZE_BYTES,
    "gallery",
    true
  );
}

/**
 * Safely removes a department storage asset and updates its database metadata.
 * Directly wraps the universal deleteStorageFile helper.
 */
export async function deleteDepartmentStorageFile(
  supabase: SupabaseClient,
  bucket: string,
  storagePath: string,
  mediaFileId?: string
): Promise<ApiResponse<void>> {
  return deleteStorageFile(supabase, bucket, storagePath, mediaFileId);
}
