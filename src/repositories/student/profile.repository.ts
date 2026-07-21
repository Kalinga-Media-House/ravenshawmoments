import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Profile {
  id: string;
  authUserId: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  headline?: string;
  department?: string;
  course?: string;
  graduationYear?: number;
  socialLinks?: Record<string, string>;
  privacySettings?: Record<string, boolean>;
  profile_status?: string;
  is_verified?: boolean;
  profileStatus?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ProfileRepository extends BaseRepository<ProfileRow> {
  protected tableName: keyof Database["public"]["Tables"] = "profiles";

  async findByAuthUserId(authUserId: string): Promise<ProfileRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError(`Failed to find profile by auth user id: ${error.message}`, error);
    }

    return data as any;
  }

  async findBySlug(slug: string): Promise<ProfileRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError(`Failed to find profile by slug: ${error.message}`, error);
    }

    return data as any;
  }

  async updateProfile(profileId: string, data: Partial<ProfileRow>): Promise<ProfileRow> {
    return this.update(profileId, { ...data, updated_at: new Date().toISOString() });
  }

  async getPublicProfile(slug: string): Promise<ProfileRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, slug, full_name, profile_media_id, cover_media_id, bio, department_name, batch_year, is_verified")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError(`Failed to find public profile: ${error.message}`, error);
    }

    return data as ProfileRow;
  }

  async updatePrivacySettings(profileId: string, settings: Record<string, boolean>): Promise<ProfileRow> {
    return this.update(profileId, { privacy_settings: settings, updated_at: new Date().toISOString() } as any);
  }

  async searchProfiles(query: string, page: number = 1, limit: number = 10): Promise<{ data: ProfileRow[]; count: number }> {
    const offset = (page - 1) * limit;

    let dbQuery = this.supabase
      .from("profiles")
      .select("*", { count: "exact" });

    if (query) {
      dbQuery = dbQuery.or(`full_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`);
    }

    const { data, error, count } = await dbQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to search profiles: ${error.message}`, error);
    }

    return { data: data || [], count: count || 0 };
  }
}
