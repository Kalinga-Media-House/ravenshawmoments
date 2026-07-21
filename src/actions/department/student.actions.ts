"use server";

import { createClient } from "../../lib/supabase/server";
import { StudentRepository } from "../../repositories/department/student.repository";
import { StudentService } from "../../services/department/student.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new StudentService(new StudentRepository({ supabase }));
}

export async function approveStudent(departmentId: string, slug: string, studentId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    const student = await service.approveStudent(departmentId, slug, studentId);
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectStudent(departmentId: string, slug: string, studentId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    const student = await service.rejectStudent(departmentId, slug, studentId);
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyStudent(departmentId: string, slug: string, studentId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    const student = await service.verifyStudent(departmentId, slug, studentId);
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeStudent(departmentId: string, slug: string, studentId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);
    const service = await getService();
    await service.removeStudent(departmentId, slug, studentId);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
