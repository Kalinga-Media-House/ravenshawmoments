import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export type MediaFileRow = Database["public"]["Tables"]["media_files"]["Row"];
export type MediaFileInsert = Database["public"]["Tables"]["media_files"]["Insert"];
export type MediaFileUpdate = Database["public"]["Tables"]["media_files"]["Update"];

export class StorageRepository {
  constructor(private supabase: SupabaseClient<any, any, any>) {}

  /**
   * Retrieves a media file record by ID.
   */
  async getMediaById(id: string): Promise<MediaFileRow | null> {
    const { data, error } = await this.supabase
      .from("media_files")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get media record: ${error.message}`);
    }

    return data;
  }

  /**
   * Retrieves a media file record by storage bucket and path.
   */
  async getMediaByStoragePath(bucket: string, path: string): Promise<MediaFileRow | null> {
    const { data, error } = await this.supabase
      .from("media_files")
      .select("*")
      .eq("storage_bucket", bucket)
      .eq("storage_path", path)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get media by storage path: ${error.message}`);
    }

    return data;
  }

  /**
   * Inserts a new media file record into the database.
   */
  async insertMediaRecord(record: MediaFileInsert): Promise<MediaFileRow> {
    const { data, error } = await this.supabase
      .from("media_files")
      .insert(record)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert media record: ${error.message}`);
    }

    return data;
  }

  /**
   * Updates an existing media file record.
   */
  async updateMediaRecord(id: string, updates: MediaFileUpdate): Promise<MediaFileRow> {
    const { data, error } = await this.supabase
      .from("media_files")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update media record: ${error.message}`);
    }

    return data;
  }

  /**
   * Deletes a media file record from the database.
   * This operates on the DB only. R2 object deletion should happen separately.
   */
  async deleteMediaRecord(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("media_files")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete media record: ${error.message}`);
    }
  }
}
