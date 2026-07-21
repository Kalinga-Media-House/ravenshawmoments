"use server";

import { createClient } from "../../lib/supabase/server";
import { FacultyRepository } from "../../repositories/department/faculty.repository";
import { FacultyService } from "../../services/department/faculty.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const facultySchema = z.object({
  profile_id: z.string().uuid(),
  status: z.string().optional(),
  designation: z.string().max(100).optional(),
});

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new FacultyService(new FacultyRepository({ supabase }));
}

export async function createFaculty(departmentId: string, slug: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);
    const data = facultySchema.parse(payload);
    const service = await getService();
    const faculty = await service.createFaculty(departmentId, slug, data);
    return { success: true, data: faculty };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function updateFaculty(departmentId: string, slug: string, facultyId: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);
    const data = facultySchema.partial().parse(payload);
    const service = await getService();
    const faculty = await service.updateFaculty(departmentId, slug, facultyId, data);
    return { success: true, data: faculty };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function deleteFaculty(departmentId: string, slug: string, facultyId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);
    const service = await getService();
    await service.deleteFaculty(departmentId, slug, facultyId);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignDesignation(departmentId: string, slug: string, facultyId: string, designation: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);
    if (!designation || designation.length > 100) throw new Error("Invalid designation");
    const service = await getService();
    const faculty = await service.assignDesignation(departmentId, slug, facultyId, designation);
    return { success: true, data: faculty };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFaculty(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const faculty = await service.listFaculty(slug);
    return { success: true, data: faculty || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

