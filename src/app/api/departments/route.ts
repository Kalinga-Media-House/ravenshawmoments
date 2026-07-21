import { NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { DepartmentRepository } from "../../../repositories/department/department.repository";
import { DepartmentService } from "../../../services/department/department.service";
import { requireAdmin } from "../../../auth/guards/require-admin";
import { createDepartmentSchema } from "../../../lib/validation/department";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new DepartmentService(new DepartmentRepository({ supabase }));
}

export async function GET(request: NextRequest) {
  try {
    const service = await getService();
    const data = await service.getDepartmentOverview();
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = createDepartmentSchema.parse(payload);
    
    const supabase = await createClient();
    // @ts-ignore
    const repo = new DepartmentRepository({ supabase });
    const department = await repo.create(data);
    
    return jsonResponse(department, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
