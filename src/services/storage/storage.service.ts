// =============================================================================
// Ravenshaw Moments
// File      : src/services/storage/storage.service.ts
// Purpose   : Cloudflare R2 communication layer — upload, delete, URL generation
// =============================================================================

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { env } from "@/lib/env";

export class StorageService {
  /**
   * Uploads raw binary data to Cloudflare R2.
   *
   * @param key         - The object key (storage path) in the bucket
   * @param body        - The file content as Buffer or Uint8Array
   * @param contentType - MIME type for the object
   * @param metadata    - Optional custom metadata to attach to the object
   */
  async uploadToR2(
    key: string,
    body: Buffer | Uint8Array,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<void> {
    const s3Client = getR2Client();
    const bucket = env.CLOUDFLARE_R2_BUCKET;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
      ...(metadata && { Metadata: metadata }),
    });

    try {
      await s3Client.send(command);
    } catch (error: any) {
      throw new Error(`Failed to upload object to R2 [key=${key}]: ${error.message}`);
    }
  }

  /**
   * Deletes an object from Cloudflare R2.
   */
  async deleteFromR2(key: string): Promise<void> {
    const s3Client = getR2Client();
    const bucket = env.CLOUDFLARE_R2_BUCKET;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch (error: any) {
      throw new Error(`Failed to delete object from R2 [key=${key}]: ${error.message}`);
    }
  }

  /**
   * Constructs the public URL for an R2 object.
   * Uses the configured `CLOUDFLARE_R2_PUBLIC_URL` (e.g. https://media.ravenshawmoments.com).
   */
  getPublicUrl(key: string): string {
    const base = env.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, "");
    const path = key.startsWith("/") ? key.slice(1) : key;
    return `${base}/${path}`;
  }

  /**
   * Returns the configured bucket name.
   */
  getBucket(): string {
    return env.CLOUDFLARE_R2_BUCKET;
  }
}
