import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export class CommunityInteractionRepository {
  /**
   * Get comments for a post, including nested replies (flat map or tree, handled in service)
   */
  static async getCommentsForPost(postId: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:profiles!author_profile_id (id, full_name),
        reactions:comment_reactions (reaction_type, profile_id)
      `)
      .eq('post_id', postId)
      .eq('moderation_status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createComment(commentData: { post_id: string; parent_comment_id?: string; author_profile_id: string; content: string; }) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('post_comments')
      .insert(commentData)
      .select(`*, author:profiles!author_profile_id(id, full_name)`)
      .single();

    if (error) throw error;
    return data;
  }

  static async togglePostReaction(postId: string, profileId: string, reactionType: string) {
    const supabase = (await createClient()) as any;
    
    // Check if exists
    const { data: existing } = await supabase
      .from('post_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('profile_id', profileId)
      .maybeSingle();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Toggle off
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('profile_id', profileId);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Update reaction
        const { error } = await supabase
          .from('post_reactions')
          .update({ reaction_type: reactionType })
          .eq('post_id', postId)
          .eq('profile_id', profileId);
        if (error) throw error;
        return { action: 'updated', reaction_type: reactionType };
      }
    } else {
      // Create reaction
      const { error } = await supabase
        .from('post_reactions')
        .insert({ post_id: postId, profile_id: profileId, reaction_type: reactionType });
      if (error) throw error;
      return { action: 'added', reaction_type: reactionType };
    }
  }

  static async toggleFollow(followerId: string, entityType: string, entityId: string) {
    const supabase = (await createClient()) as any;
    
    const { data: existing } = await supabase
      .from('follow_relationships')
      .select('*')
      .eq('follower_profile_id', followerId)
      .eq('target_entity_type', entityType)
      .eq('target_entity_id', entityId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('follow_relationships')
        .delete()
        .eq('follower_profile_id', followerId)
        .eq('target_entity_type', entityType)
        .eq('target_entity_id', entityId);
      if (error) throw error;
      return { action: 'unfollowed' };
    } else {
      const { error } = await supabase
        .from('follow_relationships')
        .insert({ follower_profile_id: followerId, target_entity_type: entityType, target_entity_id: entityId });
      if (error) throw error;
      return { action: 'followed' };
    }
  }
}
