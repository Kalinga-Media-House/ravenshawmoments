import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GalleryRepository } from "@/repositories/department/gallery.repository";
import { GalleryService } from "@/services/department/gallery.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new GalleryService(new GalleryRepository({ supabase }));
}

export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    
    const service = await getService();
    const album = await service.createAlbum(departmentId, params.slug, payload);
    return jsonResponse(album, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
