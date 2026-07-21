import { SupabaseClient } from '@supabase/supabase-js';
import { StudentGalleryRepository, GalleryMedia, GalleryAlbum } from '../../repositories/student/student-gallery.repository';
import { NotFoundError, StorageError } from '../../lib/errors';
import { STORAGE_BUCKETS } from '../../lib/constants';
import { canUploadMedia } from '../../lib/utils/permissions';

export class StudentGalleryService {
  private repository: StudentGalleryRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new StudentGalleryRepository({ supabase });
  }

  async getGallery(profileId: string, page: number = 1, limit: number = 20) {
    return this.repository.findByProfileId(profileId, page, limit);
  }

  async uploadMedia(profileId: string, file: File, albumId?: string): Promise<GalleryMedia> {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('id, profile_status, is_verified')
      .or(`auth_user_id.eq.${profileId},id.eq.${profileId}`)
      .single();

    if (!canUploadMedia(profile)) {
      throw new Error(`Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can upload memories/media.`);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKETS.GALLERY)
      .upload(filePath, file);

    if (uploadError) {
      throw new StorageError(`Failed to upload media: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(STORAGE_BUCKETS.GALLERY)
      .getPublicUrl(filePath);

    return this.repository.addMedia(profileId, {
      mediaUrl: publicUrl,
      albumId,
    });
  }

  async deleteMedia(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Media not found');
    
    // Attempt to delete from storage if possible
    const urlParts = existing.media_file_id.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (fileName) {
      await this.supabase.storage
        .from(STORAGE_BUCKETS.GALLERY)
        .remove([`gallery/${fileName}`]);
    }

    await this.repository.removeMedia(id);
  }

  async reorderMedia(profileId: string, items: { id: string; order: number }[]): Promise<void> {
    await this.repository.reorderMedia(profileId, items);
  }

  async getAlbums(profileId: string): Promise<GalleryAlbum[]> {
    return this.repository.getAlbums(profileId);
  }

  async createAlbum(profileId: string, data: any): Promise<GalleryAlbum> {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('id, profile_status, is_verified')
      .or(`auth_user_id.eq.${profileId},id.eq.${profileId}`)
      .single();

    if (!canUploadMedia(profile)) {
      throw new Error(`Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can create albums.`);
    }

    return this.repository.createAlbum(profileId, data);
  }
}
