import React from 'react';
import Link from 'next/link';
import { Home, Users, TrendingUp, Bell, Hash, Zap } from 'lucide-react';
import { getFeedAction } from '@/features/community/actions/community.actions';
import { formatDistanceToNow } from 'date-fns';

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  // Fetch real feed data to extract trending and announcements
  const feedResult = await getFeedAction();
  const posts = feedResult.success ? (feedResult.data || []) : [];
  
  // Extract trending hashtags from post content (simple implementation)
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
    .slice(0, 5)
    .map(([tag]) => tag);

  // Extract official announcements (posts by department/business or pinned)
  const announcements = posts
    .filter((p: any) => p.is_pinned || ['department', 'business'].includes(p.actor_entity_type))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Left Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#F5F5DC] p-4">
          <nav className="space-y-1">
            <Link href="/community" className="flex items-center space-x-3 px-3 py-2 text-[#800000] font-medium bg-red-50 rounded-lg">
              <Home className="w-5 h-5" />
              <span>Global Feed</span>
            </Link>
            <Link href="/community/groups" className="flex items-center space-x-3 px-3 py-2 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Groups</span>
            </Link>
            <Link href="/community/trending" className="flex items-center space-x-3 px-3 py-2 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              <span>Trending</span>
            </Link>
            <Link href="/dashboard/profile/notifications" className="flex items-center space-x-3 px-3 py-2 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-lg">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#F5F5DC] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Trending Hashtags</h3>
          <div className="space-y-2">
            {trendingTags.length > 0 ? (
              trendingTags.map((tag) => (
                <Link key={tag} href={`/community/trending?tag=${tag}`} className="flex items-center text-sm text-gray-600 hover:text-[#800000] px-2 py-1">
                  <Hash className="w-4 h-4 mr-2 text-gray-400" />
                  {tag}
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 px-2">No trending tags right now.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-6 hidden lg:block">
        <div className="bg-white rounded-xl shadow-sm border border-[#F5F5DC] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Official Announcements</h3>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((post: any) => (
                <div key={post.id} className={`border-l-2 ${post.actor_entity_type === 'department' ? 'border-[#800000]' : 'border-blue-500'} pl-3`}>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    <Link href={`/community/post/${post.slug}`} className="hover:underline">
                      {post.content}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    {post.is_sponsored && <Zap className="w-3 h-3 text-amber-500" />}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No official announcements currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
