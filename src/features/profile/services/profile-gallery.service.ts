// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/profile-gallery.service.ts
// Purpose   : Personal Gallery Management Service (50-Image Quota & Storage)
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/repositories/profile.repository";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types";
import { uploadGalleryImage, deleteStorageFile } from "@/lib/storage";

export const profileGalleryService = {
  /**
   * Uploads an image to the user's gallery while coordinating storage and quota rules.
   */
  uploadGalleryImageService: async (
    authUserId: string,
    file: File,
    caption?: string
  ): Promise<ApiResponse<{ media_file_id: string; gallery_item_id: string; media_url: string }>> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const profile = await repo.findByAuthUserId(authUserId);
    if (!profile) {
      return { success: false, error: { code: "PROFILE_NOT_FOUND", message: "Profile not found." } };
    }

    let album = await repo.findProfileGalleryAlbum(String(profile.id));
    if (!album) {
      album = await repo.createProfileGalleryAlbum(String(profile.id));
    }

    // @ts-ignore
    return await uploadGalleryImage(supabase, String(profile.id), String(album.id), file, caption);
  },

  /**
   * Deletes a gallery image after verifying ownership.
   */
  deleteGalleryImageService: async (authUserId: string, galleryItemId: string): Promise<ApiResponse<void>> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const profile = await repo.findByAuthUserId(authUserId);
    if (!profile) {
      return { success: false, error: { code: "PROFILE_NOT_FOUND", message: "Profile not found." } };
    }

    const item = await repo.getGalleryItemById(galleryItemId);
    const albums = item?.gallery_albums as unknown as { entity_id: string } | { entity_id: string }[] | null;
    const albumOwnerId = Array.isArray(albums) ? albums[0]?.entity_id : albums?.entity_id;

    if (!item || !albumOwnerId || albumOwnerId !== String(profile.id)) {
      logger.warn(`Service: Unauthorized gallery deletion attempt by ${authUserId} on ${galleryItemId}`);
      return { success: false, error: { code: "FORBIDDEN", message: "You do not own this image." } };
    }

    const media = await repo.getMediaFileById(String(item.media_file_id));
    await repo.deleteGalleryItem(galleryItemId);

    if (media && media.storage_bucket && media.storage_path) {
      // @ts-ignore
      await deleteStorageFile(supabase, String(media.storage_bucket), String(media.storage_path), String(item.media_file_id));
    }

    logger.info(`Service: Gallery item ${galleryItemId} deleted by owner ${profile.id}`);
    return { success: true };
  },
};
