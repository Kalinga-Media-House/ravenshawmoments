import { CommunityInteractionRepository } from '../repositories/community-interaction.repository';
import { Database } from '@/types/database.types';
import { createClient } from '@/lib/supabase/server';
import { canCreatePublicContent } from '@/lib/utils/permissions';

export class CommunityInteractionService {
  static async getComments(postId: string) {
    try {
      const comments = await CommunityInteractionRepository.getCommentsForPost(postId);
      // Group replies into a tree structure if needed, or return flat depending on frontend needs.
      return { success: true, data: comments };
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return { success: false, error: error.message };
    }
  }

  static async addComment(payload: { post_id: string; parent_comment_id?: string; author_profile_id: string; content: string; }) {
    try {
      const supabase = (await createClient()) as any;
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, profile_status, is_verified')
        .or(`auth_user_id.eq.${payload.author_profile_id},id.eq.${payload.author_profile_id}`)
        .single();

      if (!canCreatePublicContent(profile)) {
        return {
          success: false,
          error: `Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can comment on posts.`
        };
      }

      const comment = await CommunityInteractionRepository.createComment(payload);
      // Add notification to post author or parent comment author here
      return { success: true, data: comment };
    } catch (error: any) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  }

  static async toggleReaction(postId: string, profileId: string, reactionType: string) {
    try {
      const result = await CommunityInteractionRepository.togglePostReaction(postId, profileId, reactionType);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error toggling reaction:', error);
      return { success: false, error: error.message };
    }
  }

  static async toggleFollow(followerId: string, entityType: string, entityId: string) {
    try {
      const result = await CommunityInteractionRepository.toggleFollow(followerId, entityType, entityId);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      return { success: false, error: error.message };
    }
  }
}
