import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "./r2.client";
import { StorageError } from "../../lib/errors";
import type { SignedUrlConfig } from "./r2.types";

export class SignedUrlService {
  private client = getR2Client();

  async generateUploadUrl(config: SignedUrlConfig): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: config.key,
        ContentType: config.contentType,
      });

      return await getSignedUrl(this.client, command, { expiresIn: config.expiresInSeconds });
    } catch (error) {
      throw new StorageError("Failed to generate signed upload URL", error as Record<string, any>);
    }
  }

  async generateDownloadUrl(config: SignedUrlConfig): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: config.key,
      });

      return await getSignedUrl(this.client, command, { expiresIn: config.expiresInSeconds });
    } catch (error) {
      throw new StorageError("Failed to generate signed download URL", error as Record<string, any>);
    }
  }
}
