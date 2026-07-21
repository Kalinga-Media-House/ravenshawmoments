// =============================================================================
// Ravenshaw Moments
// File      : src/lib/repositories/profile.repository.ts
// Purpose   : Universal Profile System Repository Layer (Database Encapsulation)
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./base.repository";

export type DbRow = Record<string, unknown>;

export class ProfileRepository extends BaseRepository<DbRow> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "profiles");
  }

  async findByAuthUserId(authUserId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error) return null;

    // Fetch private fields via RPC (since column-level SELECT was revoked for security)
    const { data: privateData } = await this.supabase
      .rpc("get_private_profile_fields", { p_profile_id: data.id });
      
    if (privateData && privateData.length > 0) {
      return { ...data, ...privateData[0] } as DbRow;
    }

    return data as DbRow;
  }

  async findBySlug(slug: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  async upsertProfile(profileData: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single();

    if (error) throw new Error(`Repository Error (upsertProfile): ${error.message}`);
    return data as DbRow;
  }

  async updateByAuthUserId(authUserId: string, updateData: DbRow): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update(updateData)
      .eq("auth_user_id", authUserId);

    if (error) throw new Error(`Repository Error (updateByAuthUserId): ${error.message}`);
  }

  async updateById(profileId: string, updateData: DbRow): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profileId);

    if (error) throw new Error(`Repository Error (updateById): ${error.message}`);
  }

  // Academic / Education Records
  async upsertEducationRecord(recordData: DbRow): Promise<void> {
    const { error } = await this.supabase
      .from("education_records")
      .upsert(recordData, { onConflict: "batch_id,roll_number" });

    if (error) throw new Error(`Repository Error (upsertEducationRecord): ${error.message}`);
  }

  async getPrimaryEducationRecord(profileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("education_records")
      .select("*, departments(name, code), batches(year, name)")
      .eq("profile_id", profileId)
      .eq("is_primary", true)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  // Privacy Settings
  async getPrivacySettings(profileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("profile_privacy")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  async upsertPrivacySettings(privacyData: DbRow): Promise<void> {
    const { error } = await this.supabase
      .from("profile_privacy")
      .upsert(privacyData, { onConflict: "profile_id" });

    if (error) throw new Error(`Repository Error (upsertPrivacySettings): ${error.message}`);
  }

  // Claim Requests
  async insertClaimRequest(claimData: DbRow): Promise<void> {
    const { error } = await this.supabase
      .from("profile_claim_requests")
      .insert(claimData);

    if (error) throw new Error(`Repository Error (insertClaimRequest): ${error.message}`);
  }

  // Gallery Management
  async findProfileGalleryAlbum(profileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("gallery_albums")
      .select("id, title, slug")
      .eq("entity_type", "profile")
      .eq("entity_id", profileId)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  async createProfileGalleryAlbum(profileId: string): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("gallery_albums")
      .insert({
        entity_type: "profile",
        entity_id: profileId,
        title: "Personal Gallery",
        slug: `profile-gallery-${profileId}`,
        created_by: profileId,
        is_public: true,
      })
      .select()
      .single();

    if (error) throw new Error(`Repository Error (createProfileGalleryAlbum): ${error.message}`);
    return data as DbRow;
  }

  async getGalleryItems(albumId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("gallery_items")
      .select("*, media_files(storage_bucket, storage_path, file_size_bytes)")
      .eq("gallery_album_id", albumId)
      .order("display_order", { ascending: true });

    if (error) return [];
    return (data || []) as DbRow[];
  }

  async getGalleryItemById(itemId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("gallery_items")
      .select("id, media_file_id, gallery_albums!inner(entity_id)")
      .eq("id", itemId)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  async deleteGalleryItem(itemId: string): Promise<void> {
    const { error } = await this.supabase
      .from("gallery_items")
      .delete()
      .eq("id", itemId);

    if (error) throw new Error(`Repository Error (deleteGalleryItem): ${error.message}`);
  }

  // Media & Proofs
  async getMediaFileById(mediaFileId: string): Promise<DbRow | null> {
    const { data, error } = await this.supabase
      .from("media_files")
      .select("*")
      .eq("id", mediaFileId)
      .single();

    if (error) return null;
    return data as DbRow;
  }

  async insertContributionProof(proofData: DbRow): Promise<DbRow> {
    const { data, error } = await this.supabase
      .from("contribution_proofs")
      .insert(proofData)
      .select()
      .single();

    if (error) throw new Error(`Repository Error (insertContributionProof): ${error.message}`);
    return data as DbRow;
  }

  async getContributionProofs(profileId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("contribution_proofs")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []) as DbRow[];
  }

  // Certificates & Timeline
  async getCertificates(profileId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("certificates")
      .select("*")
      .eq("profile_id", profileId)
      .order("issued_on", { ascending: false });

    if (error) return [];
    return (data || []) as DbRow[];
  }

  async getAchievements(profileId: string): Promise<DbRow[]> {
    const { data, error } = await this.supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profileId)
      .order("achievement_date", { ascending: false });

    if (error) return [];
    return (data || []) as DbRow[];
  }
}
