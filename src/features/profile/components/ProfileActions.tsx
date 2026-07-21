"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, ShieldAlert, Share2, Lock } from "lucide-react";
import { toast } from "sonner";

export interface ProfileActionsProps {
  isOwner?: boolean;
  isClaimed?: boolean;
  canClaim?: boolean;
  onEditClick?: () => void;
  onClaimClick?: () => void;
  onPrivacyClick?: () => void;
  editUrl?: string;
  claimUrl?: string;
  privacyUrl?: string;
  shareUrl?: string;
  className?: string;
}

export function ProfileActions({
  isOwner = false,
  isClaimed = false,
  canClaim = false,
  onEditClick,
  onClaimClick,
  onPrivacyClick,
  editUrl,
  claimUrl,
  privacyUrl,
  shareUrl,
  className,
}: ProfileActionsProps) {
  const handleShare = () => {
    let url = shareUrl || "";
    if (url && url.startsWith("/") && typeof window !== "undefined") {
      url = window.location.origin + url;
    } else if (!url && typeof window !== "undefined") {
      url = window.location.href;
    }

    if (!url) return;

    if (navigator.share) {
      navigator.share({ title: "Ravenshaw Profile", url }).catch(() => {
        // Ignore share abort
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isOwner ? (
        <>
          {editUrl ? (
            <Link
              href={editUrl}
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-9 gap-1.5 font-medium shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground")}
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onEditClick}
              className="h-9 gap-1.5 font-medium shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}

          {canClaim && !isClaimed && (
            claimUrl ? (
              <Link
                href={claimUrl}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 font-medium shadow-sm border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent animate-pulse")}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Claim Roll No.</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onClaimClick}
                className="h-9 gap-1.5 font-medium shadow-sm border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent animate-pulse"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Claim Roll No.</span>
              </Button>
            )
          )}

          {(onPrivacyClick || privacyUrl) && (
            privacyUrl ? (
              <Link
                href={privacyUrl}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 font-medium border-white/10 hover:bg-white/5 bg-black/20 text-foreground")}
                title="Privacy Settings"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">Privacy</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrivacyClick}
                className="h-9 gap-1.5 font-medium border-white/10 hover:bg-white/5 bg-black/20 text-foreground"
                title="Privacy Settings"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">Privacy</span>
              </Button>
            )
          )}
        </>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="h-9 gap-1.5 font-medium"
        title="Share Profile"
      >
        <Share2 className="h-4 w-4 text-muted-foreground" />
        <span>Share</span>
      </Button>
    </div>
  );
}
