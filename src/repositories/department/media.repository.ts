import type { Database } from "../../types/database.types";
import { DatabaseError } from "../../lib/errors";

export class MediaRepository {
  constructor(private context: { supabase: any }) {}

  async registerMedia(payload: {
    url: string;
    bucket_name: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
  }) {
    // We only register metadata in the database. Cloudflare upload is handled elsewhere.
    const { data, error } = await this.context.supabase
      .from("media_files")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new DatabaseError("Failed to register media metadata in the database", error);
    }

    return data;
  }
}
