import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { env } from "@/lib/env";

export class SignedUrlService {
  /**
   * Generates a pre-signed URL for uploading an object directly to R2 from the client.
   */
  async getSignedUploadUrl(bucket: string, key: string, contentType: string, expiresIn = 3600): Promise<string> {
    const s3Client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
    
    return getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Generates a pre-signed URL for downloading a private object.
   */
  async getSignedDownloadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const s3Client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Generates a pre-signed URL for deleting an object. (Less commonly used, but requested).
   */
  async getSignedDeleteUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const s3Client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }
}
