import {
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getR2Client } from "./r2.client";
import { StorageError, NotFoundError } from "../../lib/errors";
import type { UploadOptions, UploadResult } from "./r2.types";
import { env } from "../../lib/env";

export class R2Service {
  private client = getR2Client();

  private getPublicUrl(key: string): string {
    return `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;
  }

  async uploadObject(buffer: Buffer, options: UploadOptions): Promise<UploadResult> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: options.bucket,
          Key: options.key,
          Body: buffer,
          ContentType: options.contentType,
          CacheControl: options.cacheControl || "public, max-age=31536000",
          Metadata: options.metadata,
        })
      );

      return {
        key: options.key,
        url: this.getPublicUrl(options.key),
        size: buffer.length,
        mimeType: options.contentType,
        bucket: options.bucket,
      };
    } catch (error) {
      throw new StorageError("Failed to upload object to R2", error as Record<string, any>);
    }
  }

  async deleteObject(bucket: string, key: string): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      throw new StorageError(`Failed to delete object ${key}`, error as Record<string, any>);
    }
  }

  async copyObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    try {
      await this.client.send(
        new CopyObjectCommand({
          CopySource: `${sourceBucket}/${sourceKey}`,
          Bucket: destBucket,
          Key: destKey,
        })
      );
      return true;
    } catch (error) {
      throw new StorageError(`Failed to copy object ${sourceKey} to ${destKey}`, error as Record<string, any>);
    }
  }

  async moveObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    await this.copyObject(sourceBucket, sourceKey, destBucket, destKey);
    await this.deleteObject(sourceBucket, sourceKey);
    return true;
  }

  async objectExists(bucket: string, key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === "NotFound") {
        return false;
      }
      throw new StorageError(`Failed to verify existence of ${key}`, error as Record<string, any>);
    }
  }

  async getObjectMetadata(bucket: string, key: string) {
    try {
      const result = await this.client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        metadata: result.Metadata,
        lastModified: result.LastModified,
      };
    } catch (error: any) {
      if (error.name === "NotFound") {
        throw new NotFoundError(`Object ${key} not found`);
      }
      throw new StorageError(`Failed to retrieve metadata for ${key}`, error as Record<string, any>);
    }
  }
}
