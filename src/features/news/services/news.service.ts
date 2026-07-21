import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { NewsRepository } from '../repositories/news.repository';

export class NewsPublishingService {
  private repo: NewsRepository;

  constructor(private supabase: SupabaseClient<Database>) {
    this.repo = new NewsRepository(supabase);
  }

  async getLatestNews(
    entityType?: Database['public']['Enums']['entity_type'],
    entityId?: string,
    limit: number = 10
  ) {
    return this.repo.getNewsArticles(entityType, entityId, limit);
  }

  async getFeaturedNews(limit: number = 5) {
    return this.repo.getFeaturedNews(limit);
  }

  async getNewsArticle(slug: string, viewerProfileId?: string, sessionId?: string) {
    const article = await this.repo.getNewsBySlug(slug);
    if (article) {
      // Async logging, don't wait for it
      this.repo.logView(article.id, viewerProfileId, sessionId).catch(console.error);
    }
    return article;
  }

  async getCategories() {
    return this.repo.getCategories();
  }

  async getComments(contentId: string) {
    return this.repo.getArticleComments(contentId);
  }

  async postComment(contentId: string, profileId: string, body: string, parentId?: string) {
    return this.repo.addComment(contentId, profileId, body, parentId);
  }

  async reactToContent(contentId: string, profileId: string, reaction: Database['public']['Enums']['reaction_type']) {
    await this.repo.addReaction(contentId, profileId, reaction);
  }

  async removeReaction(contentId: string, profileId: string, reaction: Database['public']['Enums']['reaction_type']) {
    await this.repo.removeReaction(contentId, profileId, reaction);
  }

  // Editorial Workflow Methods
  async createDraft(
    authorId: string,
    entityType: Database['public']['Enums']['entity_type'],
    entityId: string,
    title: string,
    body: string,
    type: Database['public']['Enums']['content_type'] = 'news'
  ) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    
    const { data, error } = await this.supabase
      .from('content_items')
      .insert({
        author_profile_id: authorId,
        entity_type: entityType,
        entity_id: entityId,
        title,
        slug,
        body,
        content_type: type,
        status: 'draft',
        is_published: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async submitForReview(contentId: string) {
    const { error } = await this.supabase
      .from('content_items')
      .update({ status: 'review' })
      .eq('id', contentId);
    
    if (error) throw error;
  }

  async publishContent(contentId: string) {
    const { error } = await this.supabase
      .from('content_items')
      .update({ 
        status: 'published',
        is_published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', contentId);
    
    if (error) throw error;
  }

  async archiveContent(contentId: string) {
    const { error } = await this.supabase
      .from('content_items')
      .update({ 
        status: 'archived',
        is_published: false
      })
      .eq('id', contentId);
    
    if (error) throw error;
  }
}
