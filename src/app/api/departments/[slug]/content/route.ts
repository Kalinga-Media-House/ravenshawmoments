import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContentRepository } from "@/repositories/department/content.repository";
import { ContentService } from "@/services/department/content.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new ContentService(new ContentRepository({ supabase }));
}

export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    
    const service = await getService();
    const section = await service.createSection(departmentId, params.slug, payload);
    return jsonResponse(section, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
