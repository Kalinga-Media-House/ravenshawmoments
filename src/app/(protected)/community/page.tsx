import React from 'react';
import { getFeedAction } from '@/features/community/actions/community.actions';
import { CommunityPost } from '@/features/community/components/CommunityPost';
import { CreatePostComposer } from '@/features/community/components/CreatePostComposer';
import { createClient } from '@/lib/supabase/server';

export default async function CommunityFeedPage() {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  
  let currentUser = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', user.id).single();
    currentUser = data;
  }

  const feedRes = await getFeedAction();
  const posts = feedRes.success && feedRes.data ? feedRes.data : [];

  return (
    <div className="max-w-2xl mx-auto w-full">
      {currentUser && (
        <CreatePostComposer currentUser={currentUser} />
      )}
      
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <CommunityPost key={post.id} post={post} currentUser={currentUser} />
          ))
        ) : (
          <div className="text-center p-12 bg-white rounded-xl border border-[#F5F5DC]">
            <p className="text-gray-500">No posts in the community feed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
