import React from 'react';
import { getPostDetailsAction } from '@/features/community/actions/community.actions';
import { CommunityPost } from '@/features/community/components/CommunityPost';
import { PostCommentSection } from '@/features/community/components/PostCommentSection';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export default async function CommunityPostDetailsPage({ params }: { params: { slug: string } }) {
  const res = await getPostDetailsAction(params.slug);
  
  if (!res.success || !res.data) {
    notFound();
  }

  const post = res.data;
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  let currentUser = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, profile_status, is_verified')
      .eq('id', user.id)
      .single();
    currentUser = data;
  }

  // Fetch comments (For now handled inside the page to avoid deep nesting issues in Server Actions return limits, or use the InteractionService)
  const { data: comments } = await supabase
    .from('post_comments')
    .select(`
      *,
      author:profiles!author_profile_id (id, full_name, avatar_url)
    `)
    .eq('post_id', post.id)
    .eq('moderation_status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <CommunityPost post={post} currentUser={currentUser} />

      <Card className="p-4 sm:p-6 border-[#F5F5DC] bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Comments</h3>
        
        <PostCommentSection
          postId={post.id}
          initialComments={comments || []}
          currentUser={currentUser}
        />
      </Card>
    </div>
  );
}
