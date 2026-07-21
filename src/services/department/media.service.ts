import { MediaRepository } from "../../repositories/department/media.repository";
import { StorageError } from "../../lib/errors";
import { env } from "../../lib/env";
// Assuming @aws-sdk/client-s3 is installed
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { generateId } from "../../lib/utils";

export class MediaService {
  private s3Client: S3Client;

  constructor(private readonly repository: MediaRepository) {
    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadMedia(file: File, bucketName: string, uploadedBy: string) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${generateId()}.${fileExtension}`;
    const key = `${bucketName}/${fileName}`;

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: env.CLOUDFLARE_R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      // Register metadata in Supabase
      const url = `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`; // Replace with actual public URL pattern
      
      const mediaRecord = await this.repository.registerMedia({
        url,
        bucket_name: bucketName,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy,
      });

      return mediaRecord;
    } catch (error: any) {
      throw new StorageError("Failed to upload media to Cloudflare R2", error as any);
    }
  }

  async deleteMedia(fileKey: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.CLOUDFLARE_R2_BUCKET,
          Key: fileKey,
        })
      );
      // Soft deletion of metadata is handled by specific module repositories
      return true;
    } catch (error: any) {
      throw new StorageError(`Failed to delete media ${fileKey} from R2`, error as any);
    }
  }
}
