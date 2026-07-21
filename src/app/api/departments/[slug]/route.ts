import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DepartmentRepository } from "@/repositories/department/department.repository";
import { DepartmentService } from "@/services/department/department.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { updateDepartmentSchema } from "@/lib/validation/department";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new DepartmentService(new DepartmentRepository({ supabase }));
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const service = await getService();
    const data = await service.getDepartmentPage(params.slug);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE);
    
    const data = updateDepartmentSchema.parse(payload);
    const service = await getService();
    const updated = await service.updateDepartment(departmentId, params.slug, data);
    
    return jsonResponse(updated, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE);
    
    const service = await getService();
    await service.archiveDepartment(departmentId, params.slug);
    
    return jsonResponse({ deleted: true }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
