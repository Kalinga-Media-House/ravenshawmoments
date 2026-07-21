import { NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { VerificationService } from "../../../services/department/verification.service";
import { requireAuth } from "../../../auth/guards/require-auth";
import { requireDepartmentPermission } from "../../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../../lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  return new VerificationService({ supabase });
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const payload = await request.json();
    const { departmentId, studentId, data } = payload;
    
    const service = await getService();
    const verification = await service.submitVerification(departmentId, studentId, data);
    
    return jsonResponse(verification, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const { departmentId, slug, requestId, studentId, action, reason } = payload;
    
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    
    const service = await getService();
    let result;
    
    if (action === "approve") {
      result = await service.approveVerification(departmentId, slug, requestId, studentId);
    } else if (action === "reject") {
      result = await service.rejectVerification(departmentId, slug, requestId, reason || "Rejected");
    } else {
      throw new Error("Invalid action");
    }
    
    return jsonResponse({ success: true, result }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
