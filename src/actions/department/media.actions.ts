"use server";

import { createClient } from "../../lib/supabase/server";
import { MediaRepository } from "../../repositories/department/media.repository";
import { MediaService } from "../../services/department/media.service";
import { SignedUrlService } from "../../storage/r2/signed-url.service";
import { requireAuth } from "../../auth/guards/require-auth";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const uploadSchema = z.object({
  bucket: z.string().min(1),
  file: z.instanceof(File),
});

async function getMediaService() {
  const supabase = await createClient();
  return new MediaService(new MediaRepository({ supabase }));
}

export async function uploadMedia(payload: FormData): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const file = payload.get("file") as File;
    const bucket = payload.get("bucket") as string;
    
    uploadSchema.parse({ bucket, file });
    
    const service = await getMediaService();
    const media = await service.uploadMedia(file, bucket, user.id);
    return { success: true, data: media };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMedia(fileKey: string): Promise<ActionResult<boolean>> {
  try {
    await requireAuth();
    const service = await getMediaService();
    await service.deleteMedia(fileKey);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function generateSignedUrl(bucket: string, key: string, isUpload = false): Promise<ActionResult<string>> {
  try {
    await requireAuth();
    const service = new SignedUrlService();
    const config = { bucket, key, expiresInSeconds: 3600 };
    
    const url = isUpload 
      ? await service.generateUploadUrl(config)
      : await service.generateDownloadUrl(config);
      
    return { success: true, data: url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
