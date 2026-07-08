// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/hostel-storage.ts
// Purpose   : Universal Hostel Ecosystem Storage Engine Consuming Shared Platform
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { UNIVERSAL_FILE_RULES, generatePlatformStoragePath } from "@/features/shared";
import { uploadFileToBucket, BaseUploadResult } from "./base-storage";

export const HOSTEL_STORAGE_BUCKET = "hostels";
export type HostelUploadResult = BaseUploadResult;

export async function uploadHostelLogo(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const filePath = generatePlatformStoragePath(hostelId, "logos", file.name);
  return uploadFileToBucket(
    supabase,
    HOSTEL_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadHostelCover(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const filePath = generatePlatformStoragePath(hostelId, "covers", file.name);
  return uploadFileToBucket(
    supabase,
    HOSTEL_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadHostelGalleryImage(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const filePath = generatePlatformStoragePath(hostelId, "gallery", file.name);
  return uploadFileToBucket(
    supabase,
    HOSTEL_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadHostelDocument(
  supabase: SupabaseClient,
  hostelId: string,
  file: File
): Promise<ApiResponse<HostelUploadResult>> {
  const filePath = generatePlatformStoragePath(hostelId, "documents", file.name);
  return uploadFileToBucket(
    supabase,
    HOSTEL_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES,
    UNIVERSAL_FILE_RULES.MAX_DOCUMENT_BYTES
  );
}
