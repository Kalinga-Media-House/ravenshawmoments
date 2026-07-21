"use server";

import { createClient } from "../../lib/supabase/server";
import { SearchRepository } from "../../repositories/department/search.repository";
import { SearchService } from "../../services/department/search.service";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  return new SearchService(new SearchRepository({ supabase }));
}

export async function departmentSearch(query: string): Promise<ActionResult<any>> {
  try {
    const service = await getService();
    const data = await service.searchDepartments(query);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
