import { CommunityFeedRepository } from '../repositories/community-feed.repository';
import { createClient } from '@/lib/supabase/server';
import { canCreatePublicContent } from '@/lib/utils/permissions';

export class CommunityFeedService {
  /**
   * Get the global feed.
   */
  static async getFeed(filter?: any, limit = 20, offset = 0) {
    try {
      const { data, count } = await CommunityFeedRepository.getFeed(filter, limit, offset);
      return { success: true, data, count };
    } catch (error: any) {
      console.error('Error fetching feed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get single post details
   */
  static async getPostDetails(slug: string) {
    try {
      const post = await CommunityFeedRepository.getPostBySlug(slug);
      return { success: true, data: post };
    } catch (error: any) {
      console.error('Error fetching post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a post
   */
  static async createPost(authorId: string, payload: {
    content: string;
    post_type?: string;
    visibility?: string;
    group_id?: string;
    actor_entity_type?: string;
    actor_entity_id?: string;
    is_sponsored?: boolean;
    embedded_entity_type?: string;
    embedded_entity_id?: string;
  }, mediaIds: string[] = []) {
    try {
      // Basic validation
      if (!payload.content || payload.content.trim().length === 0) {
        return { success: false, error: "Content is required." };
      }

      const supabase = (await createClient()) as any;
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, profile_status, is_verified')
        .or(`auth_user_id.eq.${authorId},id.eq.${authorId}`)
        .single();

      if (!canCreatePublicContent(profile)) {
        return {
          success: false,
          error: `Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can create posts.`
        };
      }

      const slug = `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const postData = {
        ...payload,
        slug,
        author_profile_id: authorId,
        status: 'published',
        moderation_status: 'published'
      };

      const post = await CommunityFeedRepository.createPost(postData, mediaIds);

      // Trigger analytics or global search indexing here if needed
      
      return { success: true, data: post };
    } catch (error: any) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete post
   */
  static async deletePost(postId: string, userId: string) {
    try {
      // Admin verification can be done at the action level. 
      // If doing hard delete:
      await CommunityFeedRepository.deletePost(postId);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }
}
