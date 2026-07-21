import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { PublicationRepository } from '../repositories/publication.repository';

export class DigitalMagazineService {
  private repo: PublicationRepository;

  constructor(private supabase: SupabaseClient<Database>) {
    this.repo = new PublicationRepository(supabase);
  }

  async getAllPublications(entityType?: Database['public']['Enums']['entity_type'], entityId?: string) {
    return this.repo.getPublications(entityType, entityId);
  }

  async getPublicationDetails(slug: string) {
    const publication = await this.repo.getPublicationBySlug(slug);
    if (!publication) return null;

    const editions = await this.repo.getEditions(publication.id);
    const board = await this.repo.getEditorialBoard(publication.id);

    return {
      ...publication,
      editions,
      editorialBoard: board
    };
  }

  async getEditionReader(publicationId: string, editionSlug: string) {
    const edition = await this.repo.getEditionBySlug(publicationId, editionSlug);
    if (!edition) return null;

    const articles = await this.repo.getEditionArticles(edition.id);

    return {
      ...edition,
      articles
    };
  }

  async trackDownload(editionId: string) {
    await this.repo.incrementDownloadCount(editionId);
  }

  async subscribe(email: string, publicationId?: string, profileId?: string) {
    await this.repo.subscribeToNewsletter(email, publicationId, profileId);
  }

  // Publisher Management
  async createPublication(data: {
    entity_type: Database['public']['Enums']['entity_type'];
    entity_id: string;
    title: string;
    description?: string;
    type: Database['public']['Enums']['publication_type'];
    issn?: string;
  }) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const { data: pub, error } = await this.supabase
      .from('publications')
      .insert({
        ...data,
        slug
      })
      .select()
      .single();
    
    if (error) throw error;
    return pub;
  }

  async publishEdition(editionId: string) {
    const { error } = await this.supabase
      .from('publication_editions')
      .update({ 
        is_published: true,
        publish_date: new Date().toISOString()
      })
      .eq('id', editionId);
    
    if (error) throw error;
  }
}
