import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (s3ClientInstance) {
    return s3ClientInstance;
  }

  const endpoint = env.CLOUDFLARE_R2_ENDPOINT || `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  s3ClientInstance = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  return s3ClientInstance;
}
