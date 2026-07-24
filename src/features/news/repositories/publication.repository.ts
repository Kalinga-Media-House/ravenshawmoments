import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type Publication = Database['public']['Tables']['publications']['Row'];
type PublicationEdition = Database['public']['Tables']['publication_editions']['Row'];
type EditorialBoard = Database['public']['Tables']['editorial_boards']['Row'];

export class PublicationRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getPublications(entityType?: Database['public']['Enums']['entity_type'], entityId?: string): Promise<Publication[]> {
    let query = this.supabase
      .from('publications')
      .select(`
        *,
        media_files!publications_cover_media_id_fkey(storage_bucket, storage_path, public_id, alt_text)
      `)
      .order('created_at', { ascending: false });

    if (entityType && entityId) {
      query = query.eq('entity_type', entityType).eq('entity_id', entityId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as any[];
  }

  async getPublicationBySlug(slug: string): Promise<Publication | null> {
    const { data, error } = await this.supabase
      .from('publications')
      .select(`
        *,
        media_files!publications_cover_media_id_fkey(storage_bucket, storage_path, public_id, alt_text)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as any;
  }

  async getEditions(publicationId: string): Promise<PublicationEdition[]> {
    const { data, error } = await this.supabase
      .from('publication_editions')
      .select(`
        *,
        media_files!publication_editions_cover_media_id_fkey(storage_bucket, storage_path, public_id, alt_text),
        document:media_files!publication_editions_document_media_id_fkey(storage_bucket, storage_path, public_id)
      `)
      .eq('publication_id', publicationId)
      .eq('is_published', true)
      .order('publish_date', { ascending: false });
    
    if (error) throw error;
    return data as any[];
  }

  async getEditionBySlug(publicationId: string, slug: string): Promise<PublicationEdition | null> {
    const { data, error } = await this.supabase
      .from('publication_editions')
      .select(`
        *,
        media_files!publication_editions_cover_media_id_fkey(storage_bucket, storage_path, public_id, alt_text),
        document:media_files!publication_editions_document_media_id_fkey(storage_bucket, storage_path, public_id)
      `)
      .eq('publication_id', publicationId)
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as any;
  }

  async getEditionArticles(editionId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('publication_articles')
      .select(`
        id,
        page_number,
        display_order,
        content_items (
          *,
          profiles(full_name)
        )
      `)
      .eq('edition_id', editionId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async incrementDownloadCount(editionId: string): Promise<void> {
    const { data } = await this.supabase.from('publication_editions').select('download_count').eq('id', editionId).single();
    if (data) {
      await this.supabase.from('publication_editions').update({ download_count: (data.download_count || 0) + 1 }).eq('id', editionId);
    }
  }

  async getEditorialBoard(publicationId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('editorial_boards')
      .select(`
        id,
        role,
        profiles (id, full_name)
      `)
      .eq('publication_id', publicationId);
    
    if (error) throw error;
    return data;
  }

  async subscribeToNewsletter(email: string, publicationId?: string, profileId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('newsletter_subscribers')
      .upsert({
        email,
        publication_id: publicationId || null,
        profile_id: profileId || null,
        is_active: true
      }, { onConflict: 'email,publication_id' });
    
    if (error) throw error;
  }
}
