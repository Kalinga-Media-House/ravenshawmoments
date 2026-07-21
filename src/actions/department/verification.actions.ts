"use server";

import { createClient } from "../../lib/supabase/server";
import { VerificationService } from "../../services/department/verification.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { requireAuth } from "../../auth/guards/require-auth";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const verificationSchema = z.object({
  documents: z.array(z.string()),
  notes: z.string().optional(),
});

async function getService() {
  const supabase = await createClient();
  return new VerificationService({ supabase });
}

export async function submitVerification(departmentId: string, studentId: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireAuth();
    const data = verificationSchema.parse(payload);
    const service = await getService();
    const request = await service.submitVerification(departmentId, studentId, data);
    return { success: true, data: request };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function approveVerification(departmentId: string, slug: string, requestId: string, studentId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    await service.approveVerification(departmentId, slug, requestId, studentId);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectVerification(departmentId: string, slug: string, requestId: string, reason: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    await service.rejectVerification(departmentId, slug, requestId, reason);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
