// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/department-storage.ts
// Purpose   : Universal Department Ecosystem Storage Wrappers & Media Helpers
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { UNIVERSAL_FILE_RULES, generatePlatformStoragePath } from "@/features/shared";
import { uploadFileToBucket, BaseUploadResult } from "./base-storage";
import { deleteStorageFile } from "./index";

export const DEPARTMENT_FILE_RULES = {
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
  MAX_DOCUMENT_SIZE_BYTES: 25 * 1024 * 1024,
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"] as const,
  ALLOWED_DOC_MIMES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ] as const,
  ALLOWED_PUB_MIMES: ["application/pdf"] as const,
  MAX_GALLERY_QUOTA: 100,
} as const;

export type DepartmentUploadResult = BaseUploadResult;

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
  const filePath = `departments/${departmentId}/${folderSubpath}/${file.name}`;
  
  const uploadRes = await uploadFileToBucket(
    supabase,
    bucket,
    filePath,
    file,
    allowedMimes,
    maxSizeBytes,
    isPublic
  );

  if (!uploadRes.success) return uploadRes as ApiResponse<never>;

  // Simulate inserting into media_files (as it was in original logic)
  const { data: insertData, error: insertError } = await supabase
    .from("media_files")
    .insert({
      uploader_id: uploaderProfileId,
      bucket_name: bucket,
      storage_path: uploadRes.data.filePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      public_url: uploadRes.data.publicUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    await deleteStorageFile(supabase, bucket, uploadRes.data.filePath);
    return { success: false, error: { code: "DB_INSERT_FAILED", message: insertError.message } };
  }

  return {
    success: true,
    data: {
      media_file_id: insertData.id,
      media_url: uploadRes.data.publicUrl,
      storage_path: uploadRes.data.filePath,
    },
  };
}

export async function uploadDepartmentLogo(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
) {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "logos",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES
  );
}

export async function uploadDepartmentCover(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
) {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "covers",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES
  );
}

export async function uploadDepartmentGalleryImage(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File
) {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    "gallery",
    DEPARTMENT_FILE_RULES.ALLOWED_IMAGE_MIMES,
    DEPARTMENT_FILE_RULES.MAX_IMAGE_SIZE_BYTES
  );
}

export async function uploadDepartmentDocument(
  supabase: SupabaseClient,
  departmentId: string,
  uploaderProfileId: string,
  file: File,
  subFolder = "documents"
) {
  return uploadDepartmentMediaHelper(
    supabase,
    departmentId,
    uploaderProfileId,
    file,
    subFolder,
    DEPARTMENT_FILE_RULES.ALLOWED_DOC_MIMES,
    DEPARTMENT_FILE_RULES.MAX_DOCUMENT_SIZE_BYTES,
    "documents"
  );
}
