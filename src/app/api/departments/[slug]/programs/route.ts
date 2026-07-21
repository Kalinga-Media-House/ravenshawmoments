import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProgramRepository } from "@/repositories/department/program.repository";
import { ProgramService } from "@/services/department/program.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new ProgramService(new ProgramRepository({ supabase }));
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const service = await getService();
    const data = await service.listPrograms(params.slug);
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
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);
    
    const service = await getService();
    const program = await service.createProgram(departmentId, params.slug, payload);
    return jsonResponse(program, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
