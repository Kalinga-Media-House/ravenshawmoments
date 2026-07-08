// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/organization-storage.ts
// Purpose   : Universal Organization Ecosystem Storage Engine Consuming Shared Platform
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { validateStorageFile } from "./index";
import {
  UNIVERSAL_FILE_RULES,
  generatePlatformStoragePath,
} from "@/features/shared";

export const ORGANIZATION_STORAGE_BUCKET = "organizations";

export interface OrganizationUploadResult {
  filePath: string;
  publicUrl: string;
}

/**
 * Uploads an organization logo image.
 */
export async function uploadOrganizationLogo(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(orgId, "logos", file.name);

  const { error: uploadError } = await supabase.storage
    .from(ORGANIZATION_STORAGE_BUCKET)
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

  const { data } = supabase.storage.from(ORGANIZATION_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads an organization cover image.
 */
export async function uploadOrganizationCover(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(orgId, "covers", file.name);

  const { error: uploadError } = await supabase.storage
    .from(ORGANIZATION_STORAGE_BUCKET)
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

  const { data } = supabase.storage.from(ORGANIZATION_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads an organization gallery image (e.g. for events, achievements).
 */
export async function uploadOrganizationGalleryImage(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES,
    UNIVERSAL_FILE_RULES.MAX_IMAGE_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(orgId, "gallery", file.name);

  const { error: uploadError } = await supabase.storage
    .from(ORGANIZATION_STORAGE_BUCKET)
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

  const { data } = supabase.storage.from(ORGANIZATION_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}

/**
 * Uploads an organization document (e.g. for notices, annual reports).
 */
export async function uploadOrganizationDocument(
  supabase: SupabaseClient,
  orgId: string,
  file: File
): Promise<ApiResponse<OrganizationUploadResult>> {
  const validation = validateStorageFile(
    file,
    UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES,
    UNIVERSAL_FILE_RULES.MAX_DOCUMENT_BYTES
  );
  if (!validation.success) return { success: false, error: validation.error };

  const filePath = generatePlatformStoragePath(orgId, "documents", file.name);

  const { error: uploadError } = await supabase.storage
    .from(ORGANIZATION_STORAGE_BUCKET)
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

  const { data } = supabase.storage.from(ORGANIZATION_STORAGE_BUCKET).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}
