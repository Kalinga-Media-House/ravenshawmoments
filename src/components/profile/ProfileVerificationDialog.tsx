"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ProfileStatus } from "@/types/profile";

interface ProfileVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: ProfileStatus | string | null;
  actionName?: string;
}

export function ProfileVerificationDialog({
  open,
  onOpenChange,
  status,
  actionName = "publish content",
}: ProfileVerificationDialogProps) {
  const currentStatus = (status || "pending").toString().toLowerCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/95 border border-white/10 text-white backdrop-blur-xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
          </div>
          <DialogTitle className="text-center text-lg font-bold text-white">
            Verification Required
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-300">
            Only <span className="text-amber-400 font-semibold">VERIFIED</span> profiles can {actionName}.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center gap-3">
            {currentStatus === "pending" && <Clock className="h-5 w-5 text-amber-400 shrink-0" />}
            {currentStatus === "rejected" && <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />}
            {currentStatus !== "pending" && currentStatus !== "rejected" && (
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Your Current Status
              </p>
              <p className="text-sm font-bold text-white capitalize">
                {currentStatus || "Unverified"}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            A user may register and create their profile, but until the profile is verified by the appropriate authority (Department CR, Hostel BMC, or Admin), they cannot publish any user-generated content across Ravenshaw Moments.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-white/10 text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Link href="/profile" className="w-full sm:w-auto">
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={() => onOpenChange(false)}
            >
              View Profile Status
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
