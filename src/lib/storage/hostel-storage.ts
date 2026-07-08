// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/hostel-storage.ts
// Purpose   : Universal Hostel Ecosystem Storage Engine Consuming Shared Platform
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { validateStorageFile } from "./index";
import {
  UNIVERSAL_FILE_RULES,
  generatePlatformStoragePath,
} from "@/features/shared";

export const HOSTEL_STORAGE_BUCKET = "hostels";

export interface HostelUploadResult {
  filePath: string;
  publicUrl: string;
}

/**
 * Uploads a hostel logo image.
 */
export async function uploadHostelLogo(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(hostelId, "logos", file.name);

  const { error: uploadError } = await supabase.storage
    .from(HOSTEL_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "UPLOAD_FAILED", message: uploadError.message },
    };
  }

  const { data } = supabase.storage.from(HOSTEL_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads a hostel banner / cover image.
 */
export async function uploadHostelCoverImage(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(hostelId, "covers", file.name);

  const { error: uploadError } = await supabase.storage
    .from(HOSTEL_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "UPLOAD_FAILED", message: uploadError.message },
    };
  }

  const { data } = supabase.storage.from(HOSTEL_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads a hostel gallery photo.
 */
export async function uploadHostelGalleryImage(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(hostelId, "gallery", file.name);

  const { error: uploadError } = await supabase.storage
    .from(HOSTEL_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "UPLOAD_FAILED", message: uploadError.message },
    };
  }

  const { data } = supabase.storage.from(HOSTEL_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads a hostel document (e.g. BMC notices, rulebooks, certificates).
 */
export async function uploadHostelDocument(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES,
    UNIVERSAL_FILE_RULES.MAX_DOCUMENT_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(hostelId, "documents", file.name);

  const { error: uploadError } = await supabase.storage
    .from(HOSTEL_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "UPLOAD_FAILED", message: uploadError.message },
    };
  }

  const { data } = supabase.storage.from(HOSTEL_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Deletes a file from the hostel storage bucket.
 */
export async function deleteHostelFile(
  supabase: SupabaseClient,
  filePath: string,
  bucket = HOSTEL_STORAGE_BUCKET
): Promise<ApiResponse<void>> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) {
    return {
      success: false,
      error: { code: "DELETE_FAILED", message: error.message },
    };
  }
  return { success: true };
}
