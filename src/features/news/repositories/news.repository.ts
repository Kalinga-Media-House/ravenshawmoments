import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type ContentItem = Database['public']['Tables']['content_items']['Row'];
type ContentComment = Database['public']['Tables']['content_comments']['Row'];
type ContentReaction = Database['public']['Tables']['content_reactions']['Row'];
type ContentCategory = Database['public']['Tables']['content_categories']['Row'];

export class NewsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getNewsArticles(
    entityType?: Database['public']['Enums']['entity_type'],
    entityId?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ContentItem[]> {
    let query = this.supabase
      .from('content_items')
      .select(`*, profiles(full_name)`)
      .in('content_type', ['news', 'press_release', 'editorial', 'opinion_piece', 'interview', 'magazine_article', 'research_news'])
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (entityType && entityId) {
      query = query.eq('entity_type', entityType).eq('entity_id', entityId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as any[]; // Type coercion needed due to join
  }

  async getFeaturedNews(limit: number = 5): Promise<ContentItem[]> {
    const { data, error } = await this.supabase
      .from('content_items')
      .select(`*, profiles(full_name)`)
      .in('content_type', ['news', 'press_release', 'editorial', 'opinion_piece', 'interview', 'magazine_article', 'research_news'])
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as any[];
  }

  async getNewsBySlug(slug: string): Promise<ContentItem | null> {
    const { data, error } = await this.supabase
      .from('content_items')
      .select(`
        *,
        profiles(full_name),
        media_files!content_items_featured_media_id_fkey(storage_bucket, storage_path, public_id, alt_text),
        banner:media_files!content_items_banner_media_id_fkey(storage_bucket, storage_path, public_id, alt_text)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as any;
  }

  async getCategories(): Promise<ContentCategory[]> {
    const { data, error } = await this.supabase
      .from('content_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async getArticleComments(contentId: string): Promise<ContentComment[]> {
    const { data, error } = await this.supabase
      .from('content_comments')
      .select(`*, profiles(full_name)`)
      .eq('content_id', contentId)
      .eq('status', 'published')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as any[];
  }

  async addComment(contentId: string, profileId: string, body: string, parentId?: string): Promise<ContentComment> {
    const { data, error } = await this.supabase
      .from('content_comments')
      .insert({
        content_id: contentId,
        profile_id: profileId,
        body,
        parent_id: parentId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async addReaction(contentId: string, profileId: string, reaction: Database['public']['Enums']['reaction_type']): Promise<void> {
    const { error } = await this.supabase
      .from('content_reactions')
      .upsert({
        content_id: contentId,
        profile_id: profileId,
        reaction
      }, { onConflict: 'content_id,profile_id,reaction' });
    
    if (error) throw error;
  }

  async removeReaction(contentId: string, profileId: string, reaction: Database['public']['Enums']['reaction_type']): Promise<void> {
    const { error } = await this.supabase
      .from('content_reactions')
      .delete()
      .eq('content_id', contentId)
      .eq('profile_id', profileId)
      .eq('reaction', reaction);
    
    if (error) throw error;
  }

  async getReactions(contentId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('content_reactions')
      .select('reaction, profile_id')
      .eq('content_id', contentId);
    
    if (error) throw error;
    return data;
  }

  async logView(contentId: string, profileId?: string, sessionId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('content_views')
      .insert({
        content_id: contentId,
        profile_id: profileId || null,
        session_id: sessionId || null
      });
    
    if (error) console.error('Error logging view', error);
  }
}
