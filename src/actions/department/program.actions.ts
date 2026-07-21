"use server";

import { createClient } from "../../lib/supabase/server";
import { ProgramRepository } from "../../repositories/department/program.repository";
import { ProgramService } from "../../services/department/program.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const programSchema = z.object({
  name: z.string().min(3).max(255),
  degree_level: z.string().max(50),
  duration_years: z.number().min(1).max(7),
  total_seats: z.number().min(1).optional(),
});

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new ProgramService(new ProgramRepository({ supabase }));
}

export async function createProgram(departmentId: string, slug: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);
    const data = programSchema.parse(payload);
    const service = await getService();
    const program = await service.createProgram(departmentId, slug, data);
    return { success: true, data: program };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function updateProgram(departmentId: string, slug: string, programId: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);
    const data = programSchema.partial().parse(payload);
    const service = await getService();
    const program = await service.updateProgram(departmentId, slug, programId, data);
    return { success: true, data: program };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function archiveProgram(departmentId: string, slug: string, programId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);
    const service = await getService();
    const program = await service.archiveProgram(departmentId, slug, programId);
    return { success: true, data: program };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
