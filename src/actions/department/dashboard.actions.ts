"use server";

import { createClient } from "../../lib/supabase/server";
import { DashboardService } from "../../services/department/dashboard.service";
import { AnalyticsService } from "../../services/department/analytics.service";
import { VerificationService } from "../../services/department/verification.service";
import { ContentService } from "../../services/department/content.service";
import { FacultyService } from "../../services/department/faculty.service";
import { AnalyticsRepository } from "../../repositories/department/analytics.repository";
import { ContentRepository } from "../../repositories/department/content.repository";
import { FacultyRepository } from "../../repositories/department/faculty.repository";
import { requireDepartmentAdmin } from "../../auth/guards/require-department-admin";
import type { ActionResult } from "../action.types";

async function getService() {
  const supabase = await createClient();
  return new DashboardService(
    new AnalyticsService(new AnalyticsRepository({ supabase })),
    new VerificationService({ supabase }),
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    new ContentService(new ContentRepository({ supabase })),
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    new FacultyService(new FacultyRepository({ supabase }))
  );
}

export async function getDashboardData(departmentId: string, slug: string): Promise<ActionResult<any>> {
  try {
    // Verifies the user has admin-level access for this department dashboard
    await requireDepartmentAdmin(departmentId);
    
    const service = await getService();
    const data = await service.getDepartmentDashboard(departmentId, slug);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
