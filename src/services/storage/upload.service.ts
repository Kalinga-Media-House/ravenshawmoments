// =============================================================================
// Ravenshaw Moments
// File      : src/services/storage/upload.service.ts
// Purpose   : Upload orchestration — validation, R2 upload, DB metadata, logging
// =============================================================================

import { StorageService } from "./storage.service";
import { StorageRepository, type MediaFileRow } from "@/repositories/storage/storage.repository";
import { Database } from "@/types/database.types";
import { createClient } from "@/lib/supabase/server";
import {
  validateUploadFile,
  generateStorageKey,
  generateFlatStorageKey,
  extractExtension,
  computeSha256,
  logUpload,
  type UploadLogEntry,
} from "@/lib/storage/validation";
import type { R2Folder, UploadRuleSet } from "@/lib/storage/storage.constants";
import { UPLOAD_RULES } from "@/lib/storage/storage.constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UploadFileParams {
  /** R2 folder prefix (e.g. "avatars", "gallery", "departments") */
  folder: R2Folder;
  /** Entity ID used as sub-folder (profileId, departmentId, etc.) */
  entityId?: string;
  /** The file to upload */
  file: File | Blob;
  /** Original filename (used for extension extraction and logging) */
  originalFilename: string;
  /** MIME type of the file */
  mimeType: string;
  /** Media type enum for the database */
  mediaType: Database["public"]["Enums"]["media_type"];
  /** Upload validation rules (defaults to IMAGE rules) */
  uploadRules?: UploadRuleSet;
  /** Alt text for accessibility */
  altText?: string;
  /** Caption for display */
  caption?: string;
  /** Whether the file is publicly accessible (default: true) */
  isPublic?: boolean;
  /** Owner profile ID */
  ownerProfileId?: string;
}

export interface UploadResult {
  /** The media_files database record */
  mediaRecord: MediaFileRow;
  /** Public URL for the uploaded file */
  publicUrl: string;
  /** Storage path (object key) in R2 */
  storagePath: string;
}

// ---------------------------------------------------------------------------
// UploadService
// ---------------------------------------------------------------------------

export class UploadService {
  constructor(
    private storageService: StorageService,
    private storageRepository: StorageRepository
  ) {}

  /**
   * Validates, uploads a file to R2, computes checksum, and registers metadata
   * in the `media_files` table.
   *
   * This is THE single upload entry point for the entire platform.
   */
  async uploadFile(params: UploadFileParams): Promise<UploadResult> {
    const {
      folder,
      entityId,
      file,
      originalFilename,
      mimeType,
      mediaType,
      uploadRules,
      altText,
      caption,
      isPublic = true,
      ownerProfileId,
    } = params;

    const startTime = Date.now();
    const rules = uploadRules || this.inferRules(mediaType);

    // 1. Validate file
    const validation = validateUploadFile(file, originalFilename, rules);
    if (!validation.valid) {
      logUpload({
        userId: ownerProfileId || "unknown",
        originalFilename,
        mimeType,
        sizeBytes: file.size,
        storagePath: "",
        folder,
        status: "validation_failed",
        error: validation.error,
        timestamp: new Date().toISOString(),
      });
      throw new Error(validation.error);
    }

    // 2. Generate storage key
    const storagePath = entityId
      ? generateStorageKey(folder, entityId, originalFilename)
      : generateFlatStorageKey(folder, originalFilename);

    // 3. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Compute SHA-256 checksum
    const checksum = await computeSha256(buffer);

    // 5. Upload to R2
    try {
      await this.storageService.uploadToR2(storagePath, buffer, mimeType);
    } catch (error: any) {
      logUpload({
        userId: ownerProfileId || "unknown",
        originalFilename,
        mimeType,
        sizeBytes: file.size,
        storagePath,
        folder,
        status: "upload_failed",
        error: error.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    // 6. Register metadata in database
    const bucket = this.storageService.getBucket();
    const ext = extractExtension(originalFilename);

    let mediaRecord: MediaFileRow;
    try {
      mediaRecord = await this.storageRepository.insertMediaRecord({
        storage_bucket: bucket,
        storage_path: storagePath,
        original_filename: originalFilename,
        mime_type: mimeType,
        file_extension: ext || undefined,
        file_size_bytes: file.size,
        media_type: mediaType,
        is_public: isPublic,
        public_id: storagePath,
        alt_text: altText,
        caption: caption,
        owner_profile_id: ownerProfileId,
        checksum_sha256: checksum,
      });
    } catch (error: any) {
      // Rollback R2 upload on metadata failure
      try {
        await this.storageService.deleteFromR2(storagePath);
      } catch {
        // Best-effort rollback; log but don't mask the original error
      }
      logUpload({
        userId: ownerProfileId || "unknown",
        originalFilename,
        mimeType,
        sizeBytes: file.size,
        storagePath,
        folder,
        status: "metadata_failed",
        error: error.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`Failed to register media metadata: ${error.message}`);
    }

    // 7. Log success
    const publicUrl = this.storageService.getPublicUrl(storagePath);
    logUpload({
      userId: ownerProfileId || "unknown",
      originalFilename,
      mimeType,
      sizeBytes: file.size,
      storagePath,
      folder,
      status: "success",
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });

    return { mediaRecord, publicUrl, storagePath };
  }

  /**
   * Deletes a file from both R2 and the database.
   */
  async deleteFile(mediaId: string, storagePath: string): Promise<void> {
    // 1. Delete from R2
    await this.storageService.deleteFromR2(storagePath);

    // 2. Soft-delete in DB (or hard delete)
    await this.storageRepository.deleteMediaRecord(mediaId);
  }

  /**
   * Generates the public URL for a given storage path.
   */
  getPublicUrl(storagePath: string): string {
    return this.storageService.getPublicUrl(storagePath);
  }

  /**
   * Infers the upload rule set from the media type.
   */
  private inferRules(mediaType: Database["public"]["Enums"]["media_type"]): UploadRuleSet {
    switch (mediaType) {
      case "image":
        return UPLOAD_RULES.IMAGE;
      case "video":
        return UPLOAD_RULES.VIDEO;
      case "document":
        return UPLOAD_RULES.DOCUMENT;
      default:
        return UPLOAD_RULES.ANY_MEDIA;
    }
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a properly wired UploadService instance for use in Server Actions.
 */
export async function getUploadService(): Promise<UploadService> {
  const supabase = await createClient();
  const storageRepo = new StorageRepository(supabase);
  const storageService = new StorageService();
  return new UploadService(storageService, storageRepo);
}
