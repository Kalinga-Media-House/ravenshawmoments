"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { submitBusinessClaimAction } from "@/features/business/actions/business.actions";
import { ProfileVerificationDialog } from "@/components/profile/ProfileVerificationDialog";
import { canCreateBusiness } from "@/lib/utils/permissions";
import { useRouter } from "next/navigation";
import { Store, ShieldCheck } from "lucide-react";

interface ClaimBusinessButtonProps {
  businessId: string;
  businessName: string;
  currentUser?: any;
}

export function ClaimBusinessButton({
  businessId,
  businessName,
  currentUser,
}: ClaimBusinessButtonProps) {
  const router = useRouter();
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [proofText, setProofText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleClick = () => {
    if (!currentUser) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    if (!canCreateBusiness(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    setClaimDialogOpen(true);
  };

  const handleSubmitClaim = async () => {
    setIsLoading(true);
    try {
      const res = await submitBusinessClaimAction(businessId, proofText);
      if (res.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimDialogOpen(false);
          router.refresh();
        }, 2000);
      } else {
        if (typeof res.error === "string" && res.error.toLowerCase().includes("verification required")) {
          setClaimDialogOpen(false);
          setVerificationDialogOpen(true);
        } else {
          alert("Could not submit claim: " + (res.error || "Unknown error"));
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProfileVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        status={currentUser?.profile_status || (currentUser?.is_verified ? "verified" : "pending")}
        actionName="claim and manage business listings"
      />

      <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900 border border-gray-200">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#800000] font-bold">
              <Store className="w-5 h-5" />
              <DialogTitle>Claim {businessName}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              As the verified owner or authorized representative, you will gain full administrative access to edit this listing, reply to reviews, and post offers once your claim is reviewed.
            </DialogDescription>
          </DialogHeader>

          {claimSuccess ? (
            <div className="py-6 text-center space-y-3 bg-green-50 rounded-xl border border-green-100">
              <ShieldCheck className="w-10 h-10 text-green-600 mx-auto" />
              <p className="text-sm font-bold text-green-900">Claim Submitted Successfully!</p>
              <p className="text-xs text-green-700 max-w-xs mx-auto">
                Our moderation team will review your verification credentials shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Verification Proof or Explanatory Note (Optional)
                </label>
                <Textarea
                  placeholder="Provide your role, contact number, or details verifying your relationship with this business..."
                  className="min-h-[90px] text-sm"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                />
              </div>
            </div>
          )}

          {!claimSuccess && (
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setClaimDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#800000] hover:bg-[#800000]/90 text-white font-semibold"
                onClick={handleSubmitClaim}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <button
        onClick={handleClick}
        className="w-full py-2.5 bg-white border-2 border-[#8F0028]/20 text-[#8F0028] font-bold rounded-lg hover:bg-[#8F0028] hover:text-white transition-colors"
      >
        Claim Business
      </button>
    </>
  );
}
