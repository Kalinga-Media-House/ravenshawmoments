"use server";

import { createClient } from "../../lib/supabase/server";
import { GalleryRepository } from "../../repositories/department/gallery.repository";
import { GalleryService } from "../../services/department/gallery.service";
import { requireDepartmentPermission } from "../../auth/guards/require-department-permission";
import { PERMISSIONS } from "../../lib/constants";
import type { ActionResult } from "../action.types";
import { z } from "zod";

const albumSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  cover_media_id: z.string().uuid().optional(),
});

async function getService() {
  const supabase = await createClient();
  // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
  return new GalleryService(new GalleryRepository({ supabase }));
}

export async function createAlbum(departmentId: string, slug: string, payload: unknown): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const data = albumSchema.parse(payload);
    const service = await getService();
    const album = await service.createAlbum(departmentId, slug, data);
    return { success: true, data: album };
  } catch (error: any) {
    if (error.name === "ZodError") return { success: false, error: "Validation failed", validationErrors: error.flatten().fieldErrors };
    return { success: false, error: error.message };
  }
}

export async function uploadGalleryMedia(departmentId: string, slug: string, albumId: string, mediaId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const service = await getService();
    const item = await service.uploadMedia(departmentId, slug, albumId, { mediaId });
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryMedia(departmentId: string, slug: string, galleryItemId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const service = await getService();
    await service.deleteMedia(departmentId, slug, galleryItemId);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishGallery(departmentId: string, slug: string, albumId: string): Promise<ActionResult<any>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const service = await getService();
    const album = await service.publishGallery(departmentId, slug, albumId);
    return { success: true, data: album };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderGallery(departmentId: string, slug: string, albumId: string, items: { id: string, order: number }[]): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const service = await getService();
    await service.reorderGallery(departmentId, slug, albumId, items);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAlbums(slug: string): Promise<ActionResult<any[]>> {
  try {
    const service = await getService();
    const albums = await service.listAlbums(slug);
    return { success: true, data: albums || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAlbum(departmentId: string, slug: string, albumId: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from("gallery_albums")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", albumId);
    if (error) throw error;
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAlbumStatus(departmentId: string, slug: string, albumId: string, status: string): Promise<ActionResult<boolean>> {
  try {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from("gallery_albums")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", albumId);
    if (error) throw error;
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
