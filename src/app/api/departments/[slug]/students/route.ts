import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { StudentRepository } from "@/repositories/department/student.repository";
import { StudentService } from "@/services/department/student.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new StudentService(new StudentRepository({ supabase }));
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const service = await getService();
    const data = await service.listStudents(params.slug);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const { departmentId, studentId, action } = payload;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    
    const service = await getService();
    let result;
    
    if (action === "approve") result = await service.approveStudent(departmentId, params.slug, studentId);
    else if (action === "reject") result = await service.rejectStudent(departmentId, params.slug, studentId);
    else throw new Error("Invalid action");
    
    return jsonResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
