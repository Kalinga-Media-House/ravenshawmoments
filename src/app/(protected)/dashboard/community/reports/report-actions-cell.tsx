'use client';

import { useState, useTransition } from 'react';
import { Eye, CheckCircle, Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { moderatePostAction } from '@/features/community/actions/community.actions';
import { toast } from 'sonner';

export function ReportActionsCell({ report }: { report: any }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (actionType: 'hide' | 'remove' | 'restore') => {
    if (report.reported_entity_type !== 'post') {
      toast.error('Moderation for this entity type is not yet supported.');
      return;
    }
    
    const authorId = 'unknown'; // Service could look it up.
    
    const reason = window.prompt(`Reason for ${actionType}:`);
    if (!reason) return;

    startTransition(async () => {
      const res = await moderatePostAction(report.reported_entity_id, authorId, actionType, reason);
      if (res.success) {
        toast.success(`Content ${actionType}d successfully.`);
      } else {
        toast.error(res.error || 'Failed to moderate content.');
      }
    });
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Eye className="w-4 h-4 mr-1" /> View
      </Button>
      {report.status === 'pending' && (
        <>
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 bg-[#800000] text-white"
            onClick={() => handleAction('remove')}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Ban className="w-4 h-4 mr-1" />}
            Take Action
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-green-600"
            onClick={() => handleAction('restore')}
            disabled={isPending}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Dismiss
          </Button>
        </>
      )}
    </div>
  );
}
