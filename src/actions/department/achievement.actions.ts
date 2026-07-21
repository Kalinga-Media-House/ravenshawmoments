"use server";

import { createClient } from "../../lib/supabase/server";
import { AchievementRepository } from "../../repositories/department/achievement.repository";
import { AchievementService } from "../../services/department/achievement.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const achievementSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  achievement_date: z.string(),
  type_id: z.string().uuid(),
  category_id: z.string().uuid(),
});

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new AchievementService(new AchievementRepository({ supabase }));
}

export async function createAchievement(departmentId: string, slug: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);
    const data = achievementSchema.parse(payload);
    const service = await getService();
    const achievement = await service.createAchievement(departmentId, slug, data);
    return { success: true, data: achievement };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function updateAchievement(departmentId: string, slug: string, achievementId: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);
    const data = achievementSchema.partial().parse(payload);
    const service = await getService();
    const achievement = await service.updateAchievement(departmentId, slug, achievementId, data);
    return { success: true, data: achievement };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function deleteAchievement(departmentId: string, slug: string, achievementId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);
    const service = await getService();
    await service.deleteAchievement(departmentId, slug, achievementId);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishAchievement(departmentId: string, slug: string, achievementId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);
    const service = await getService();
    const achievement = await service.publishAchievement(departmentId, slug, achievementId);
    return { success: true, data: achievement };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAchievements(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const achievements = await service.listAchievements(slug);
    return { success: true, data: achievements || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
