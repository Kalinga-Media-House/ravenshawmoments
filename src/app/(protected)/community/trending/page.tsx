import React from 'react';
import { TrendingUp, Hash, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getFeedAction } from '@/features/community/actions/community.actions';
import { CommunityPost } from '@/features/community/components/CommunityPost';

export default async function CommunityTrendingPage() {
  const feedResult = await getFeedAction();
  const posts = feedResult.success ? (feedResult.data || []) : [];

  // Extract trending hashtags
  const hashtagRegex = /#[\w-]+/g;
  const tagCounts: Record<string, number> = {};
  
  posts.forEach((post: any) => {
    const matches = post.content?.match(hashtagRegex) || [];
    matches.forEach((tag: string) => {
      const cleanTag = tag.substring(1);
      tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Extract trending posts (most reactions)
  const trendingPosts = [...posts]
    .sort((a: any, b: any) => {
      const aReactions = a.reactions?.[0]?.count || 0;
      const bReactions = b.reactions?.[0]?.count || 0;
      return bReactions - aReactions;
    })
    .slice(0, 10)
    .filter((p: any) => (p.reactions?.[0]?.count || 0) > 0);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#800000] to-red-900 p-8 rounded-xl shadow-sm mb-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold">Trending Now</h1>
        </div>
        <p className="text-red-100 max-w-xl">Discover what the Ravenshaw community is talking about. Top discussions, hashtags, and popular posts updated in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-[#800000]" />
            Trending Posts
          </h2>
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post: any) => (
              <CommunityPost key={post.id} post={post} />
            ))
          ) : (
            <Card className="p-12 text-center border-[#F5F5DC]">
              <p className="text-gray-500">More data is required to calculate trending posts.</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Hash className="w-5 h-5 mr-2 text-[#800000]" />
            Top Hashtags
          </h2>
          <Card className="p-6 border-[#F5F5DC]">
            <div className="space-y-4">
              {trendingTags.length > 0 ? (
                trendingTags.map(([tag, count], idx) => (
                  <div key={tag} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-gray-400 w-4">{idx + 1}</span>
                      <span className="font-medium text-gray-900">#{tag}</span>
                    </div>
                    <span className="text-xs text-gray-500">{count} posts</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No trending tags yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
