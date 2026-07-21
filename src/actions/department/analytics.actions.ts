"use server";

import { createClient } from "../../lib/supabase/server";
import { AnalyticsRepository } from "../../repositories/department/analytics.repository";
import { AnalyticsService } from "../../services/department/analytics.service";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  return new AnalyticsService(new AnalyticsRepository({ supabase }));
}

export async function getDepartmentStatistics(slug: string): Promise<ActionResult<any>> {
  try {
    const service = await getService();
    const stats = await service.getDepartmentStats(slug);
    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStatisticsByLevel(level: string): Promise<ActionResult<any>> {
  try {
    const service = await getService();
    const stats = await service.getStatsByLevel(level);
    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}