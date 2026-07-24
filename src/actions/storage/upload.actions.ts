"use server";

import { getUploadService, type UploadResult } from "@/services/storage/upload.service";
import { StorageService } from "@/services/storage/storage.service";
import { SignedUrlService } from "@/services/storage/signed-url.service";
import { StorageRepository } from "@/repositories/storage/storage.repository";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/auth/guards/require-auth";
import { Database } from "@/types/database.types";
import type { R2Folder } from "@/lib/storage/storage.constants";
import { UPLOAD_RULES, type UploadRuleSet } from "@/lib/storage/storage.constants";
import { generateStorageKey, generateFlatStorageKey } from "@/lib/storage/validation";

// ---------------------------------------------------------------------------
// Signed URL Generation (for client-side direct uploads)
// ---------------------------------------------------------------------------

/**
 * Generates a signed URL for direct client-to-R2 uploads.
 * Requires authentication.
 */
export async function generateUploadUrlAction(
  folder: R2Folder,
  entityId: string | undefined,
  originalFilename: string,
  contentType: string
) {
  try {
    const user = await requireAuth();
    const storageService = new StorageService();
    const signedUrlService = new SignedUrlService();

    const bucket = storageService.getBucket();
    const storagePath = entityId
      ? generateStorageKey(folder, entityId, originalFilename)
      : generateFlatStorageKey(folder, originalFilename);
    const uploadUrl = await signedUrlService.getSignedUploadUrl(
      bucket,
      storagePath,
      contentType
    );
    const publicUrl = storageService.getPublicUrl(storagePath);

    return {
      success: true,
      data: {
        uploadUrl,
        publicUrl,
        storagePath,
        bucket,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// Metadata Sync (after client-side upload completes)
// ---------------------------------------------------------------------------

/**
 * Saves media metadata to the database AFTER a successful client-side upload.
 * Requires authentication.
 */
export async function syncMediaMetadataAction(params: {
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  media_type: Database["public"]["Enums"]["media_type"];
  is_public?: boolean;
  alt_text?: string;
  caption?: string;
}) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const storageRepo = new StorageRepository(supabase);
    const storageService = new StorageService();
    const bucket = storageService.getBucket();

    const mediaRecord = await storageRepo.insertMediaRecord({
      storage_bucket: bucket,
      storage_path: params.storage_path,
      original_filename: params.original_filename,
      mime_type: params.mime_type,
      file_size_bytes: params.file_size_bytes,
      media_type: params.media_type,
      is_public: params.is_public ?? true,
      public_id: params.storage_path,
      owner_profile_id: user.id,
    });

    return { success: true, data: mediaRecord };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// Delete Media
// ---------------------------------------------------------------------------

/**
 * Deletes a media file from both R2 and DB.
 * Requires authentication.
 */
export async function deleteMediaAction(
  mediaId: string,
  storagePath: string
) {
  try {
    await requireAuth();
    const uploadService = await getUploadService();
    await uploadService.deleteFile(mediaId, storagePath);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// Server-Side Upload (for server-generated files or small uploads)
// ---------------------------------------------------------------------------

/**
 * Server action for direct server-side upload via FormData.
 * Requires authentication. Validates file before upload.
 */
export async function uploadFileAction(formData: FormData) {
  try {
    const user = await requireAuth();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as R2Folder;
    const mediaType = formData.get("mediaType") as Database["public"]["Enums"]["media_type"];
    const entityId = formData.get("entityId") as string | undefined;

    if (!file || !folder || !mediaType) {
      throw new Error("Missing required fields: file, folder, mediaType");
    }

    const uploadService = await getUploadService();
    const result = await uploadService.uploadFile({
      folder,
      entityId: entityId || undefined,
      file,
      originalFilename: file.name,
      mimeType: file.type,
      mediaType,
      altText: (formData.get("altText") as string) || undefined,
      caption: (formData.get("caption") as string) || undefined,
      isPublic: formData.get("isPublic") !== "false",
      ownerProfileId: user.id,
    });

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
