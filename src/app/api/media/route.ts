import { NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { MediaRepository } from "../../../repositories/department/media.repository";
import { MediaService } from "../../../services/department/media.service";
import { requireAuth } from "../../../auth/guards/require-auth";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  return new MediaService(new MediaRepository({ supabase }));
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    
    if (!file || !bucket) {
      throw new Error("File and bucket are required");
    }
    
    const service = await getService();
    const media = await service.uploadMedia(file, bucket, user.id);
    
    return jsonResponse(media, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const fileKey = url.searchParams.get("key");
    
    if (!fileKey) {
      throw new Error("File key is required");
    }
    
    const service = await getService();
    await service.deleteMedia(fileKey);
    
    return jsonResponse({ deleted: true }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
