import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResponse } from "@/types";
import { validateStorageFile } from "./index";

export interface BaseUploadResult {
  filePath: string;
  publicUrl: string;
}

export async function uploadFileToBucket(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  file: File,
  allowedMimes: readonly string[],
  maxBytes: number,
  isPublic = true
): Promise<ApiResponse<BaseUploadResult>> {
  const validation = validateStorageFile(file, allowedMimes, maxBytes);
  if (!validation.success) return { success: false, error: validation.error };

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: isPublic ? "86400" : "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: { code: "UPLOAD_FAILED", message: uploadError.message },
    };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return {
    success: true,
    data: { filePath, publicUrl: data.publicUrl },
  };
}
