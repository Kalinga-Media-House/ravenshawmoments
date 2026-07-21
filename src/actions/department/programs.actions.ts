"use server";

import { createClient } from "../../lib/supabase/server";
import { ProgramRepository } from "../../repositories/department/program.repository";
import { ProgramService } from "../../services/department/program.service";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new ProgramService(new ProgramRepository({ supabase }));
}

export async function getPrograms(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const programs = await service.listPrograms(slug);
    return { success: true, data: programs || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

