import React from 'react';
import { Shield, EyeOff, Trash2, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { getModerationLogsAction } from '@/features/community/actions/community.actions';
import { formatDistanceToNow } from 'date-fns';

export default async function ModerationActionCenter() {
  const logsResult = await getModerationLogsAction();
  const logs = logsResult.success ? (logsResult.data || []) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Action Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-[#F5F5DC] shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Hide Content</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Temporarily remove a post or comment from the public feed while it undergoes review.</p>
          <a 
            href="/dashboard/community/reports"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between group")}
          >
            View Reports <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
          </a>
        </Card>

        <Card className="p-6 border-[#F5F5DC] shadow-sm border-l-4 border-l-[#800000]">
          <div className="w-12 h-12 bg-red-50 text-[#800000] rounded-lg flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Remove Content</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Permanently remove a post or comment. This action is logged in the audit trail.</p>
          <a 
            href="/dashboard/community/reports"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between group")}
          >
            Manage Content <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
          </a>
        </Card>

        <Card className="p-6 border-[#F5F5DC] shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">User Suspension</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Restrict a user's ability to post or comment on the community hub.</p>
          <Button variant="outline" className="w-full justify-between group" disabled>
            Coming in V2 <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
          </Button>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audit Actions</h3>
        
        {logs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center text-gray-500 text-sm">
            No moderation actions recorded.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Moderator</th>
                  <th className="px-6 py-3 font-medium">Target User</th>
                  <th className="px-6 py-3 font-medium">Reason</th>
                  <th className="px-6 py-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        log.action.includes('REMOVE') ? 'bg-red-50 text-red-700' :
                        log.action.includes('HIDE') ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.moderator?.full_name || 'System'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {log.target?.full_name || log.target_profile_id || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={log.reason}>
                      {log.reason}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
