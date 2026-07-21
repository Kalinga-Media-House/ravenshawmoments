"use server";

import { createClient } from "../../lib/supabase/server";
import { StudentRepository } from "../../repositories/department/student.repository";
import { StudentService } from "../../services/department/student.service";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new StudentService(new StudentRepository({ supabase }));
}

export async function getStudents(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const students = await service.listStudents(slug);
    return { success: true, data: students || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStudentsByLevel(level: string, filters?: { stream?: string, batch_year?: string, search?: string }): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const students = await service.listStudentsByLevel(level, filters);
    return { success: true, data: students || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

