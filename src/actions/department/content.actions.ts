"use server";

import { createClient } from "../../lib/supabase/server";
import { ContentRepository } from "../../repositories/department/content.repository";
import { ContentService } from "../../services/department/content.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const contentSchema = z.object({
  title: z.string().min(2).max(255),
  content: z.string().min(1),
  display_order: z.number().default(0),
});

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new ContentService(new ContentRepository({ supabase }));
}

export async function createContent(departmentId: string, slug: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    const data = contentSchema.parse(payload);
    const service = await getService();
    const section = await service.createSection(departmentId, slug, data);
    return { success: true, data: section };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function updateContent(departmentId: string, slug: string, sectionId: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    const data = contentSchema.partial().parse(payload);
    const service = await getService();
    const section = await service.updateSection(departmentId, slug, sectionId, data);
    return { success: true, data: section };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function publishContent(departmentId: string, slug: string, sectionId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    const service = await getService();
    const section = await service.publishSection(departmentId, slug, sectionId);
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function archiveContent(departmentId: string, slug: string, sectionId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    const service = await getService();
    const section = await service.archiveSection(departmentId, slug, sectionId);
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderContent(departmentId: string, slug: string, items: { id: string, order: number }[]): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);
    const service = await getService();
    await service.reorderSections(departmentId, slug, items);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getContent(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const content = await service.getSectionsByDepartmentSlug(slug);
    return { success: true, data: content || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
