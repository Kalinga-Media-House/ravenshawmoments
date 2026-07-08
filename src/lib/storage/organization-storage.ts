// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/organization-storage.ts
// Purpose   : Universal Organization Ecosystem Storage Engine Consuming Shared Platform
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { UNIVERSAL_FILE_RULES, generatePlatformStoragePath } from "@/features/shared";
import { uploadFileToBucket, BaseUploadResult } from "./base-storage";

export const ORGANIZATION_STORAGE_BUCKET = "organizations";
export type OrganizationUploadResult = BaseUploadResult;

export async function uploadOrganizationLogo(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const filePath = generatePlatformStoragePath(orgId, "logos", file.name);
  return uploadFileToBucket(
    supabase,
    ORGANIZATION_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadOrganizationCover(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const filePath = generatePlatformStoragePath(orgId, "covers", file.name);
  return uploadFileToBucket(
    supabase,
    ORGANIZATION_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadOrganizationGalleryImage(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const filePath = generatePlatformStoragePath(orgId, "gallery", file.name);
  return uploadFileToBucket(
    supabase,
    ORGANIZATION_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
}

export async function uploadOrganizationDocument(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const filePath = generatePlatformStoragePath(orgId, "documents", file.name);
  return uploadFileToBucket(
    supabase,
    ORGANIZATION_STORAGE_BUCKET,
    filePath,
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES,
    UNIVERSAL_FILE_RULES.MAX_DOCUMENT_BYTES
  );
}
