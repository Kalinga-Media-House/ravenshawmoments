"use client";

import React, { useState } from "react";
import { 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    ShieldAlert, 
    RotateCcw, 
    Trash2, 
    AlertTriangle 
} from "lucide-react";
import { ProfileReviewPermissions } from "@/lib/authorization/profile-review";
import { 
    verifyProfileAction, 
    rejectVerificationAction, 
    requestCorrectionAction, 
    suspendProfileAction, 
    restoreProfileAction, 
    softDeleteProfileAction, 
    permanentlyDeleteProfileAction 
} from "@/app/actions/profileReview";
import { toast } from "sonner";

interface ProfileReviewControlsProps {
  targetProfileId: string;
  permissions: ProfileReviewPermissions;
  currentVerificationStatus: string;
  currentProfileStatus: string;
}

export function ProfileReviewControls({ 
    targetProfileId, 
    permissions, 
    currentVerificationStatus,
    currentProfileStatus
}: ProfileReviewControlsProps) {
  
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // States for Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [softDeleteModalOpen, setSoftDeleteModalOpen] = useState(false);
  const [hardDeleteModalOpen, setHardDeleteModalOpen] = useState(false);

  // Form values
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("IDENTITY");
  const [message, setMessage] = useState("");
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState("");

  const handleVerify = async () => {
    setLoadingAction("VERIFY");
    const res = await verifyProfileAction(targetProfileId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleReject = async () => {
    if (!reason) return toast.error("Reason is required.");
    setLoadingAction("REJECT");
    const res = await rejectVerificationAction(targetProfileId, reason);
    if (res.success) {
      toast.success(res.message);
      setRejectModalOpen(false);
      setReason("");
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleCorrection = async () => {
    if (!message) return toast.error("Message is required.");
    setLoadingAction("CORRECTION");
    const res = await requestCorrectionAction(targetProfileId, category, message);
    if (res.success) {
      toast.success(res.message);
      setCorrectionModalOpen(false);
      setMessage("");
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleSuspend = async () => {
    if (!reason) return toast.error("Reason is required.");
    setLoadingAction("SUSPEND");
    const res = await suspendProfileAction(targetProfileId, reason);
    if (res.success) {
      toast.success(res.message);
      setSuspendModalOpen(false);
      setReason("");
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleRestore = async () => {
    setLoadingAction("RESTORE");
    const res = await restoreProfileAction(targetProfileId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleSoftDelete = async () => {
    if (!reason) return toast.error("Reason is required.");
    setLoadingAction("SOFT_DELETE");
    const res = await softDeleteProfileAction(targetProfileId, reason);
    if (res.success) {
      toast.success(res.message);
      setSoftDeleteModalOpen(false);
      setReason("");
    } else {
      toast.error(res.error);
    }
    setLoadingAction(null);
  };

  const handleHardDelete = async () => {
    if (hardDeleteConfirm !== "PERMANENTLY DELETE") {
       return toast.error("You must type PERMANENTLY DELETE to confirm.");
    }
    if (!reason) return toast.error("Reason is required.");

    setLoadingAction("HARD_DELETE");
    const res = await permanentlyDeleteProfileAction(targetProfileId, reason);
    if (res.success) {
      toast.success(res.message);
      setHardDeleteModalOpen(false);
      setReason("");
      setHardDeleteConfirm("");
    } else {
      toast.error(res.error || res.message); // Should output the unavailability message
    }
    setLoadingAction(null);
  };

  const isSuspended = currentProfileStatus === "suspended";
  const isArchived = currentProfileStatus === "archived";
  const isVerified = currentVerificationStatus === "approved";
  const isPending = currentVerificationStatus === "pending";

  return (
    <div className="bg-white rounded-2xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 space-y-6">
      
      {/* PROFILE REVIEW SECTION */}
      {(permissions.canVerifyProfile || permissions.canRejectVerification || permissions.canRequestCorrection) && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#171214] border-b border-black/5 pb-2">Profile Review</h3>
          <div className="grid grid-cols-1 gap-3">
            
            {permissions.canVerifyProfile && !isVerified && (
              <button 
                onClick={handleVerify}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Verify Profile</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            {permissions.canRejectVerification && !isVerified && (
              <button 
                onClick={() => setRejectModalOpen(true)}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Reject Verification</span>
                <XCircle className="w-4 h-4" />
              </button>
            )}

            {permissions.canRequestCorrection && (
              <button 
                onClick={() => setCorrectionModalOpen(true)}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Request Correction</span>
                <MessageSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACCOUNT CONTROLS SECTION */}
      {(permissions.canSuspend || permissions.canRestore || permissions.canSoftDelete) && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#171214] border-b border-black/5 pb-2">Account Controls</h3>
          <div className="grid grid-cols-1 gap-3">
            
            {permissions.canRestore && (isSuspended || isArchived) && (
              <button 
                onClick={handleRestore}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Restore Profile</span>
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {permissions.canSuspend && !isSuspended && !isArchived && (
              <button 
                onClick={() => setSuspendModalOpen(true)}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Suspend Profile</span>
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {permissions.canSoftDelete && !isArchived && (
              <button 
                onClick={() => setSoftDeleteModalOpen(true)}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold">Soft Delete Profile</span>
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* DANGER ZONE (SUPER ADMIN ONLY) */}
      {permissions.isSuperAdmin && (
        <div className="space-y-4 pt-4 border-t-2 border-red-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => setHardDeleteModalOpen(true)}
              disabled={loadingAction !== null}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#8F0028] hover:bg-[#7a0022] text-white rounded-lg transition-colors disabled:opacity-50 shadow-md"
            >
              <span className="text-sm font-semibold">Permanently Delete</span>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODALS */}
      {/* ======================================= */}
      
      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Reject Verification</h3>
            <p className="text-sm text-gray-600">Please provide a reason for rejecting this verification request.</p>
            <textarea 
              value={reason} onChange={e => setReason(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8F0028] outline-none" 
              placeholder="e.g., ID card is illegible" rows={3} 
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleReject} disabled={loadingAction === "REJECT"} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Request Correction Modal */}
      {correctionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Request Correction</h3>
            <p className="text-sm text-gray-600">Ask the user to correct specific information on their profile.</p>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8F0028] outline-none">
              <option value="IDENTITY">Identity Documents</option>
              <option value="ACADEMIC">Academic Records</option>
              <option value="HOSTEL">Hostel Information</option>
              <option value="GENERAL">General Profile</option>
            </select>
            <textarea 
              value={message} onChange={e => setMessage(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8F0028] outline-none" 
              placeholder="Detail what needs to be fixed..." rows={4} 
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setCorrectionModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleCorrection} disabled={loadingAction === "CORRECTION"} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ShieldAlert className="text-amber-500 w-5 h-5"/> Suspend Profile</h3>
            <p className="text-sm text-gray-600">Temporarily restrict this user's access. They will not be able to log in.</p>
            <textarea 
              value={reason} onChange={e => setReason(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              placeholder="Reason for suspension..." rows={3} 
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSuspendModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSuspend} disabled={loadingAction === "SUSPEND"} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">Confirm Suspension</button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Delete Modal */}
      {softDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Trash2 className="text-gray-500 w-5 h-5"/> Soft Delete Profile</h3>
            <p className="text-sm text-gray-600">Archive this profile. It will vanish from public directories but remain recoverable.</p>
            <textarea 
              value={reason} onChange={e => setReason(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none" 
              placeholder="Reason for deletion..." rows={3} 
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSoftDeleteModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSoftDelete} disabled={loadingAction === "SOFT_DELETE"} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium disabled:opacity-50">Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}

      {/* Hard Delete Modal */}
      {hardDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-500">
            <h3 className="text-xl font-black text-red-600 flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> PERMANENT DELETION</h3>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-sm text-red-800 font-bold">WARNING: This action is destructive and irreversible.</p>
              <p className="text-xs text-red-700 mt-1">All associated user data will be wiped entirely from the database.</p>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Reason for Deletion</label>
              <textarea 
                value={reason} onChange={e => setReason(e.target.value)} 
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                rows={2} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Type "PERMANENTLY DELETE" to confirm</label>
              <input 
                type="text"
                value={hardDeleteConfirm} onChange={e => setHardDeleteConfirm(e.target.value)} 
                className="w-full mt-1 p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-mono text-center text-red-600" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t mt-4">
              <button onClick={() => { setHardDeleteModalOpen(false); setHardDeleteConfirm(""); setReason(""); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button 
                onClick={handleHardDelete} 
                disabled={loadingAction === "HARD_DELETE" || hardDeleteConfirm !== "PERMANENTLY DELETE" || !reason} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Execute Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
