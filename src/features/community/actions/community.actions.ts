'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CommunityFeedService } from '../services/community-feed.service';
import { CommunityInteractionService } from '../services/community-interaction.service';
import { CommunityModerationService } from '../services/community-moderation.service';
import { Database } from '@/types/database.types';

import { canCreatePublicContent } from '@/lib/utils/permissions';

export async function getFeedAction(filter?: any) {
  return CommunityFeedService.getFeed(filter);
}

export async function getPostDetailsAction(slug: string) {
  return CommunityFeedService.getPostDetails(slug);
}

export async function createPostAction(payload: any, mediaIds: string[] = []) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, profile_status, is_verified')
    .or(`auth_user_id.eq.${user.id},id.eq.${user.id}`)
    .single();

  if (!canCreatePublicContent(profile)) {
    return {
      success: false,
      error: `Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can publish posts.`
    };
  }

  const res = await CommunityFeedService.createPost(profile.id, payload, mediaIds);
  if (res.success) {
    revalidatePath('/community');
  }
  return res;
}

export async function addCommentAction(payload: { post_id: string; parent_comment_id?: string; content: string; }) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, profile_status, is_verified')
    .or(`auth_user_id.eq.${user.id},id.eq.${user.id}`)
    .single();

  if (!canCreatePublicContent(profile)) {
    return {
      success: false,
      error: `Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can comment on posts.`
    };
  }

  const res = await CommunityInteractionService.addComment({
    ...payload,
    author_profile_id: profile.id
  });
  if (res.success) {
    revalidatePath('/community');
    revalidatePath(`/community/post/[slug]`, 'page');
  }
  return res;
}

export async function toggleReactionAction(postId: string, reactionType: string) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const res = await CommunityInteractionService.toggleReaction(postId, user.id, reactionType);
  if (res.success) {
    revalidatePath('/community');
  }
  return res;
}

export async function toggleFollowAction(entityType: string, entityId: string) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const res = await CommunityInteractionService.toggleFollow(user.id, entityType, entityId);
  return res;
}

export async function reportContentAction(payload: {
  entity_type: string;
  entity_id: string;
  reason: string;
  details?: string;
}) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const res = await CommunityModerationService.reportContent(user.id, payload);
  return res;
}

export async function moderatePostAction(postId: string, authorId: string, action: 'hide' | 'restore' | 'remove', reason: string) {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Assume the action is protected via middleware or layout for admin routes, but double check.
  const { data: isSuper } = await supabase.rpc('is_super_admin');
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isSuper && !isAdmin) {
    return { success: false, error: 'Unauthorized Moderation Access' };
  }

  const res = await CommunityModerationService.moderatePost(user.id, postId, authorId, action, reason);
  if (res.success) {
    revalidatePath('/dashboard/community/moderation');
    revalidatePath('/community');
  }
  return res;
}

export async function getReportsAction() {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  return CommunityModerationService.getReports();
}

export async function getModerationLogsAction() {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: isSuper } = await supabase.rpc('is_super_admin');
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isSuper && !isAdmin) {
    return { success: false, error: 'Unauthorized Access' };
  }
  
  return CommunityModerationService.getModerationLogs();
}

export async function deletePostAction(postId: string) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('community_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('author_profile_id', user.id);

    if (error) throw error;
    
    revalidatePath('/community');
    revalidatePath('/dashboard/community');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePostAction(postId: string, content: string) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('community_posts')
      .update({ content })
      .eq('id', postId)
      .eq('author_profile_id', user.id)
      .is('deleted_at', null);

    if (error) throw error;
    
    revalidatePath('/community');
    revalidatePath(`/community/post/${postId}`); // valid fallback or will revalidate all post pages
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
