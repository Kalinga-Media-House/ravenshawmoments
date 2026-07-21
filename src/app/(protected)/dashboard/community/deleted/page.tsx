import React from 'react';
import { CommunityModerationService } from '@/features/community/services/community-moderation.service';
import { Trash2 } from 'lucide-react';

export default async function DeletedContentPage() {
  const res = await CommunityModerationService.getDeletedContent();
  const deletedPosts = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Deleted Content Log</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-[#F5F5DC]">
            <tr>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Content Excerpt</th>
              <th className="px-6 py-3">Deleted At</th>
            </tr>
          </thead>
          <tbody>
            {deletedPosts.length > 0 ? (
              deletedPosts.map((post: any) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 opacity-75">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {post.author?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {post.post_type}
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-md truncate text-gray-500 line-through">{post.content}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <Trash2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  No deleted content available for review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
