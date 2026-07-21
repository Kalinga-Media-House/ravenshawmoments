'use server';

import { createClient } from '@/lib/supabase/server';
import { NewsPublishingService } from '../services/news.service';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

export async function getLatestNewsAction(
  entityType?: Database['public']['Enums']['entity_type'],
  entityId?: string,
  limit: number = 10
) {
  const supabase = await createClient();
  const service = new NewsPublishingService(supabase as any);
  return service.getLatestNews(entityType, entityId, limit);
}

export async function getFeaturedNewsAction(limit: number = 5) {
  const supabase = await createClient();
  const service = new NewsPublishingService(supabase as any);
  return service.getFeaturedNews(limit);
}

export async function getNewsArticleAction(slug: string) {
  const supabase = await createClient();
  // Get viewer info for analytics
  const { data: { session } } = await supabase.auth.getSession();
  let profileId = undefined;
  if (session?.user?.id) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single();
    if (profile) profileId = (profile as any).id;
  }
  
  const service = new NewsPublishingService(supabase as any);
  return service.getNewsArticle(slug, profileId);
}

export async function getCategoriesAction() {
  const supabase = await createClient();
  const service = new NewsPublishingService(supabase as any);
  return service.getCategories();
}

export async function getCommentsAction(contentId: string) {
  const supabase = await createClient();
  const service = new NewsPublishingService(supabase as any);
  return service.getComments(contentId);
}

export async function postCommentAction(contentId: string, body: string, parentId?: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single();
  if (!profile) throw new Error('Profile not found');

  const service = new NewsPublishingService(supabase as any);
  const result = await service.postComment(contentId, (profile as any).id, body, parentId);
  
  revalidatePath('/news/[slug]', 'page');
  return result;
}

export async function reactToContentAction(contentId: string, reaction: Database['public']['Enums']['reaction_type']) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single();
  if (!profile) throw new Error('Profile not found');

  const service = new NewsPublishingService(supabase as any);
  await service.reactToContent(contentId, (profile as any).id, reaction);
  revalidatePath('/news/[slug]', 'page');
}

export async function removeReactionAction(contentId: string, reaction: Database['public']['Enums']['reaction_type']) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single();
  if (!profile) throw new Error('Profile not found');

  const service = new NewsPublishingService(supabase as any);
  await service.removeReaction(contentId, (profile as any).id, reaction);
  revalidatePath('/news/[slug]', 'page');
}
