import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../lib/env";

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (s3ClientInstance) {
    return s3ClientInstance;
  }

  s3ClientInstance = new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  return s3ClientInstance;
}
