import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardService } from "@/services/department/dashboard.service";
import { AnalyticsService } from "@/services/department/analytics.service";
import { VerificationService } from "@/services/department/verification.service";
import { ContentService } from "@/services/department/content.service";
import { FacultyService } from "@/services/department/faculty.service";
import { AnalyticsRepository } from "@/repositories/department/analytics.repository";
import { ContentRepository } from "@/repositories/department/content.repository";
import { FacultyRepository } from "@/repositories/department/faculty.repository";
import { requireDepartmentAdmin } from "@/auth/guards/require-department-admin";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  return new DashboardService(
    new AnalyticsService(new AnalyticsRepository({ supabase })),
    new VerificationService({ supabase }),
    // @ts-ignore
    new ContentService(new ContentRepository({ supabase })),
    // @ts-ignore
    new FacultyService(new FacultyRepository({ supabase }))
  );
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const url = new URL(request.url);
    const departmentId = url.searchParams.get("departmentId");
    
    if (!departmentId) throw new Error("departmentId query parameter is required");
    
    await requireDepartmentAdmin(departmentId);
    
    const service = await getService();
    const data = await service.getDepartmentDashboard(departmentId, params.slug);
    
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
