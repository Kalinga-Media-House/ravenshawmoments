import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FacultyRepository } from "@/repositories/department/faculty.repository";
import { FacultyService } from "@/services/department/faculty.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new FacultyService(new FacultyRepository({ supabase }));
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const service = await getService();
    const data = await service.listFaculty(params.slug);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);
    
    const service = await getService();
    const faculty = await service.createFaculty(departmentId, params.slug, payload);
    return jsonResponse(faculty, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
