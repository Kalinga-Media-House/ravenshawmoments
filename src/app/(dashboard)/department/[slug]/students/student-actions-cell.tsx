'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { 
  approveStudent, 
  rejectStudent, 
  verifyStudent, 
  removeStudent 
} from '@/actions/department/student.actions';
import { Check, X, ShieldAlert, Trash2, Loader2 } from 'lucide-react';

export function StudentActionsCell({
  studentId,
  status,
  departmentId,
  slug
}: {
  studentId: string;
  status: string;
  departmentId: string;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: 'approve' | 'reject' | 'verify' | 'remove') => {
    if (action === 'reject' || action === 'remove') {
      if (!confirm(`Are you sure you want to ${action} this student?`)) return;
    }

    startTransition(async () => {
      let result;
      switch (action) {
        case 'approve':
          // @ts-ignore
          result = await approveStudent(studentId);
          break;
        case 'reject':
          // @ts-ignore
          result = await rejectStudent(studentId);
          break;
        case 'verify':
          // @ts-ignore
          result = await verifyStudent(studentId);
          break;
        case 'remove':
          // @ts-ignore
          result = await removeStudent(studentId);
          break;
      }

      if (result.success) {
        toast.success(`Student ${action}ed successfully`);
      } else {
        // @ts-ignore
        toast.error(result.error || `Failed to ${action} student`);
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-end">
        <Loader2 className="w-5 h-5 text-[#8B7078] animate-spin" />
      </div>
    );
  }

  if (status === 'Pending') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => handleAction('approve')}
          className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-[#0F0A0B] rounded-md border border-emerald-500/20 hover:border-emerald-500/50 transition-colors"
          title="Approve"
        >
          <Check className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleAction('reject')}
          className="p-1.5 text-red-400 hover:text-red-300 bg-[#0F0A0B] rounded-md border border-red-500/20 hover:border-red-500/50 transition-colors"
          title="Reject"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (status === 'Rejected') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => handleAction('verify')}
          className="p-1.5 text-[#8B7078] hover:text-[#F5E6EA] bg-[#0F0A0B] rounded-md border border-[#2D1F23] hover:border-[#7C2D3E] transition-colors"
          title="Re-verify"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleAction('remove')}
          className="p-1.5 text-[#8B7078] hover:text-[#9B3A4D] bg-[#0F0A0B] rounded-md border border-[#2D1F23] hover:border-[#9B3A4D] transition-colors"
          title="Remove completely"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Verified status
  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleAction('reject')}
        className="text-xs px-2 py-1 text-[#8B7078] hover:text-amber-400 bg-[#0F0A0B] rounded border border-[#2D1F23] hover:border-amber-500/30 transition-colors"
      >
        Suspend
      </button>
      <button 
        onClick={() => handleAction('remove')}
        className="p-1.5 text-[#8B7078] hover:text-[#9B3A4D] bg-[#0F0A0B] rounded-md border border-[#2D1F23] hover:border-[#9B3A4D] transition-colors"
        title="Remove completely"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
