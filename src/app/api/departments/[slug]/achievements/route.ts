import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AchievementRepository } from "@/repositories/department/achievement.repository";
import { AchievementService } from "@/services/department/achievement.service";
import { requireDepartmentPermission } from "@/auth/guards/require-department-permission";
import { PERMISSIONS } from "@/lib/constants";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  // @ts-ignore
  return new AchievementService(new AchievementRepository({ supabase }));
}

export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const payload = await request.json();
    const departmentId = payload.departmentId;
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);
    
    const service = await getService();
    const achievement = await service.createAchievement(departmentId, params.slug, payload);
    return jsonResponse(achievement, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
