import { SupabaseClient } from '@supabase/supabase-js';
import { ProfileRepository, Profile } from '../../repositories/student/profile.repository';
import { SessionService } from '../../auth/session.service';
import { AuthenticationError, NotFoundError, StorageError } from '../../lib/errors';
import { STORAGE_BUCKETS } from '../../lib/constants';

export class ProfileService {
  private repository: ProfileRepository;
  private sessionService: SessionService;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ProfileRepository({ supabase });
    this.sessionService = new SessionService();
  }

  async getMyProfile(): Promise<Profile> {
    const profile = await this.sessionService.getCurrentProfile();
    if (!profile) {
      throw new AuthenticationError('No profile found for current user');
    }
    return profile as any;
  }

  async getPublicProfile(slug: string): Promise<Partial<Profile>> {
    const profile = await this.repository.getPublicProfile(slug);
    if (!profile) {
      throw new NotFoundError(`Profile with slug ${slug} not found`);
    }
    return profile as any;
  }

  async updateProfile(profileId: string, data: Partial<Profile>): Promise<Profile> {
    // @ts-ignore
    return this.repository.updateProfile(profileId, data);
  }

  async updateAvatar(profileId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new StorageError(`Failed to upload avatar: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .getPublicUrl(filePath);

    await this.updateProfile(profileId, { avatarUrl: publicUrl });

    return publicUrl;
  }

  async updateCoverPhoto(profileId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKETS.COVERS)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new StorageError(`Failed to upload cover photo: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(STORAGE_BUCKETS.COVERS)
      .getPublicUrl(filePath);

    await this.updateProfile(profileId, { coverPhotoUrl: publicUrl });

    return publicUrl;
  }

  async updatePrivacy(profileId: string, settings: any): Promise<Profile> {
    // @ts-ignore
    return this.repository.updatePrivacySettings(profileId, settings);
  }

  async updateSocialLinks(profileId: string, links: any): Promise<Profile> {
    // @ts-ignore
    return this.repository.updateProfile(profileId, { socialLinks: links });
  }

  async searchProfiles(query: string, page: number = 1, limit: number = 10) {
    return this.repository.searchProfiles(query, page, limit);
  }
}
