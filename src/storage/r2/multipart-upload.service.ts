import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getR2Client } from "./r2.client";
import { StorageError } from "../../lib/errors";
import type { MultipartUploadConfig, MultipartUploadPart } from "./r2.types";

export class MultipartUploadService {
  private client = getR2Client();

  async initiateUpload(config: MultipartUploadConfig): Promise<string> {
    try {
      const command = new CreateMultipartUploadCommand({
        Bucket: config.bucket,
        Key: config.key,
        ContentType: config.contentType,
      });
      const response = await this.client.send(command);
      
      if (!response.UploadId) {
        throw new Error("UploadId not returned from R2");
      }
      
      return response.UploadId;
    } catch (error) {
      throw new StorageError("Failed to initiate multipart upload", error as Record<string, any>);
    }
  }

  async uploadPart(config: MultipartUploadConfig, uploadId: string, partNumber: number, buffer: Buffer): Promise<MultipartUploadPart> {
    try {
      const command = new UploadPartCommand({
        Bucket: config.bucket,
        Key: config.key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: buffer,
      });
      
      const response = await this.client.send(command);
      
      if (!response.ETag) {
        throw new Error("ETag not returned from R2 part upload");
      }
      
      return { partNumber, eTag: response.ETag };
    } catch (error) {
      throw new StorageError(`Failed to upload part ${partNumber}`, error as Record<string, any>);
    }
  }

  async completeUpload(config: MultipartUploadConfig, uploadId: string, parts: MultipartUploadPart[]): Promise<boolean> {
    try {
      // S3 requires parts to be sorted ascending by partNumber
      const sortedParts = [...parts].sort((a, b) => a.partNumber - b.partNumber);
      
      const command = new CompleteMultipartUploadCommand({
        Bucket: config.bucket,
        Key: config.key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts.map(p => ({
            PartNumber: p.partNumber,
            ETag: p.eTag,
          }))
        }
      });
      
      await this.client.send(command);
      return true;
    } catch (error) {
      throw new StorageError("Failed to complete multipart upload", error as Record<string, any>);
    }
  }

  async abortUpload(config: MultipartUploadConfig, uploadId: string): Promise<boolean> {
    try {
      const command = new AbortMultipartUploadCommand({
        Bucket: config.bucket,
        Key: config.key,
        UploadId: uploadId,
      });
      
      await this.client.send(command);
      return true;
    } catch (error) {
      throw new StorageError("Failed to abort multipart upload", error as Record<string, any>);
    }
  }
}
