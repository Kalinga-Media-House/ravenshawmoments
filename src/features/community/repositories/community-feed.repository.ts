import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export class CommunityFeedRepository {
  /**
   * Fetch the global feed or filtered feed, ordered by latest.
   */
  static async getFeed(
    filter?: { 
      group_id?: string; 
      author_id?: string;
      actor_entity_type?: string;
      actor_entity_id?: string;
      is_pinned?: boolean;
    },
    limit = 20,
    offset = 0
  ) {
    const supabase = (await createClient()) as any;
    
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles!author_profile_id (id, full_name, digital_identities (identity_type, status)),
        media:post_media (
          media:media_files (id, storage_bucket, storage_path, public_id, media_type)
        ),
        reactions:post_reactions (reaction_type, profile_id),
        comments:post_comments (count),
        group:community_groups!group_id (id, name, slug)
      `, { count: 'exact' })
      .eq('status', 'published')
      .eq('moderation_status', 'published')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filter) {
      if (filter.group_id) query = query.eq('group_id', filter.group_id);
      if (filter.author_id) query = query.eq('author_profile_id', filter.author_id);
      if (filter.actor_entity_type) query = query.eq('actor_entity_type', filter.actor_entity_type);
      if (filter.actor_entity_id) query = query.eq('actor_entity_id', filter.actor_entity_id);
      if (filter.is_pinned !== undefined) query = query.eq('is_pinned', filter.is_pinned);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  }

  /**
   * Get a single post by slug
   */
  static async getPostBySlug(slug: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles!author_profile_id (id, full_name, digital_identities (identity_type, status)),
        media:post_media (
          media:media_files (id, storage_bucket, storage_path, public_id, media_type)
        ),
        reactions:post_reactions (reaction_type, profile_id),
        group:community_groups!group_id (id, name, slug)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('moderation_status', 'published')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a post
   */
  static async createPost(postData: any, mediaIds: string[] = []) {
    const supabase = (await createClient()) as any;
    
    // Create post
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;

    // Attach media if any
    if (mediaIds.length > 0) {
      const mediaInserts = mediaIds.map((id, idx) => ({
        post_id: post.id,
        media_id: id,
        display_order: idx
      }));
      
      const { error: mediaError } = await supabase
        .from('post_media')
        .insert(mediaInserts);
        
      if (mediaError) console.error("Error attaching media to post", mediaError);
    }

    return post;
  }

  /**
   * Delete a post (soft delete or hard delete depending on policy, we will hard delete for user but soft delete for moderation)
   */
  static async deletePost(id: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
