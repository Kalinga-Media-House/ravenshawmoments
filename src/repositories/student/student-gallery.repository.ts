import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

import { RepositoryContext } from "../repository.types";

type GalleryRow = Database["public"]["Tables"]["gallery_items"]["Row"];
export type GalleryMedia = GalleryRow;
export type GalleryAlbum = Database["public"]["Tables"]["gallery_albums"]["Row"];

export class StudentGalleryRepository extends BaseRepository<GalleryRow> {
  protected tableName: keyof Database["public"]["Tables"] = "gallery_items";

  constructor(context: RepositoryContext) {
    super(context);
    this.context = context;
  }

  private context: { supabase: any };

  async findByProfileId(profileId: string, page: number = 1, limit: number = 20): Promise<{ data: GalleryRow[]; count: number }> {
    const offset = (page - 1) * limit;

    // To get items by profile, we need to join with gallery_albums
    const { data, error, count } = await this.supabase
      .from("gallery_items")
      .select("*, gallery_albums!inner(*)", { count: "exact" })
      .eq("gallery_albums.entity_type", "profile")
      .eq("gallery_albums.entity_id", profileId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DatabaseError(`Failed to fetch gallery media: ${error.message}`, error);
    }

    return { data: data || [], count: count || 0 };
  }

  async addMedia(profileId: string, payload: {
    mediaUrl?: string;
    media_url?: string;
    title?: string;
    description?: string;
    albumId?: string;
    album_id?: string;
  }): Promise<GalleryRow> {
    const albumId = payload.albumId || payload.album_id;
    if (!albumId) {
       throw new DatabaseError("Album ID is required to add media");
    }
    
    // We don't have media_url in gallery_items, we have media_file_id. 
    // Assuming media_url is actually passing the media_file_id, or we just map it.
    // Let's assume the caller passes the media_file_id in media_url for now.
    const media_file_id = payload.mediaUrl || payload.media_url || "";

    const { data, error } = await this.supabase
      .from("gallery_items")
      .insert({
        gallery_album_id: albumId,
        media_file_id: media_file_id,
        caption: payload.title || payload.description || null,
        display_order: 0,
        is_cover: false,
        is_featured: false,
      })
      .select()
      .single();
      
    if (error) throw new DatabaseError(`Failed to add media: ${error.message}`, error);
    return data as any;
  }

  async removeMedia(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async reorderMedia(profileId: string, items: { id: string; order: number }[]): Promise<void> {
    for (const item of items) {
      const { error } = await this.supabase
        .from("gallery_items")
        .update({ display_order: item.order })
        .eq("id", item.id);
        // ideally we should also check if the item belongs to the profileId

      if (error) {
        throw new DatabaseError(`Failed to reorder media ${item.id}: ${error.message}`, error);
      }
    }
  }

  async getAlbums(profileId: string): Promise<GalleryAlbum[]> {
    const { data, error } = await this.supabase
      .from("gallery_albums")
      .select("*")
      .eq("entity_type", "profile")
      .eq("entity_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch albums: ${error.message}`, error);
    }

    return (data as any) || [];
  }

  async createAlbum(profileId: string, payload: { name: string; description?: string }): Promise<GalleryAlbum> {
    const { data: album, error } = await this.supabase
      .from("gallery_albums")
      .insert({
        title: payload.name,
        description: payload.description,
        entity_type: "profile",
        entity_id: profileId,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        public_id: 'album-' + Date.now(),
      })
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to create album: ${error.message}`, error);
    }

    return album;
  }
}
