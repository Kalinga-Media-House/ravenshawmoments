'use client';

import { useState, useTransition } from 'react';
import { X as CloseIcon, X } from 'lucide-react';
import { toast } from 'sonner';

export function RejectDialog({ verificationId }: { verificationId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    
    startTransition(async () => {
      // Mock action
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Verification rejected');
      setIsOpen(false);
      setReason('');
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-[#7C2D3E]/30 rounded text-[#9B3A4D] hover:bg-[#7C2D3E]/60" 
        title="Reject"
      >
        <X size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#F5E6EA]">Reject Verification</h3>
              <button onClick={() => setIsOpen(false)} className="text-[#8B7078] hover:text-[#F5E6EA]">
                <CloseIcon size={20} />
              </button>
            </div>
            
            <p className="text-sm text-[#8B7078] mb-4">
              Please provide a reason for rejecting this verification request. This will be sent to the student.
            </p>
            
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., ID card is expired or unreadable"
              className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] min-h-[100px] mb-6"
              required
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-[#8B7078] hover:text-[#F5E6EA] transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={isPending}
                className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                {isPending ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
