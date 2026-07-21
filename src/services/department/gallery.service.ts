import { revalidateTag } from "next/cache";
import { GalleryRepository } from "../../repositories/department/gallery.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS, CONTENT_STATUS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class GalleryService {
  constructor(private readonly repository: GalleryRepository) {}

  async listAlbums(slug: string) {
    return await this.repository.getByDepartmentSlug(slug);
  }

  async createAlbum(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);

    const album = await this.repository.create({
      ...payload,
      entity_type: "department",
      entity_id: departmentId,
    });
    
    revalidateTag(CacheTags.DEPARTMENT_GALLERY(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return album;
  }

  async uploadMedia(departmentId: string, slug: string, albumId: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);
    // Note: Media Service handles actual Cloudflare R2 upload.
    // This just connects a Media record to the Gallery Album.
    const item = await this.repository.getClient().from("gallery_items").insert({
      gallery_album_id: albumId,
      media_file_id: payload.mediaId,
      display_order: payload.displayOrder || 0
    });
    
    revalidateTag(CacheTags.DEPARTMENT_GALLERY(slug), "default");
    
    return item;
  }

  async deleteMedia(departmentId: string, slug: string, galleryItemId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);

    await this.repository.getClient().from("gallery_items").delete().eq("id", galleryItemId);
    
    revalidateTag(CacheTags.DEPARTMENT_GALLERY(slug), "default");
    
    return true;
  }

  async reorderGallery(departmentId: string, slug: string, albumId: string, items: { id: string, order: number }[]) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);

    // Using transaction-like Promise.all for now
    await Promise.all(
      items.map((item) =>
        this.repository.getClient()
          .from("gallery_items")
          .update({ display_order: item.order })
          .eq("id", item.id)
      )
    );
    
    revalidateTag(CacheTags.DEPARTMENT_GALLERY(slug), "default");
    
    return true;
  }

  async publishGallery(departmentId: string, slug: string, albumId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_GALLERY_MANAGE);

    const album = await this.repository.update(albumId, { is_featured: true });
    
    revalidateTag(CacheTags.DEPARTMENT_GALLERY(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return album;
  }
}
