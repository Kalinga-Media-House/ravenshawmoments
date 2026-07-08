import * as React from "react";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/profile";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileActions } from "./ProfileActions";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Building2 } from "lucide-react";

export interface ProfileHeaderProps {
  fullName: string;
  username: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  profileType?: ProfileType;
  departmentName?: string | null;
  batchYear?: string | null;
  isVerified?: boolean;
  isOwner?: boolean;
  isClaimed?: boolean;
  canClaim?: boolean;
  onEditClick?: () => void;
  onClaimClick?: () => void;
  onPrivacyClick?: () => void;
  onEditCover?: () => void;
  editUrl?: string;
  claimUrl?: string;
  privacyUrl?: string;
  className?: string;
}

const formatTypeLabel = (type: ProfileType): string => {
  switch (type) {
    case "student": return "Student";
    case "teacher": return "Faculty / Teacher";
    case "alumni": return "Alumni";
    case "department_cr": return "Department CR";
    case "hostel_bmc": return "Hostel BMC";
    case "organization_admin": return "Organization Admin";
    case "contributor": return "Contributor";
    case "volunteer": return "Volunteer";
    default: return "Member";
  }
};

export function ProfileHeader({
  fullName,
  username,
  avatarUrl,
  coverUrl,
  profileType = "student",
  departmentName,
  batchYear,
  isVerified = false,
  isOwner = false,
  isClaimed = false,
  canClaim = false,
  onEditClick,
  onClaimClick,
  onPrivacyClick,
  onEditCover,
  editUrl,
  claimUrl,
  privacyUrl,
  className,
}: ProfileHeaderProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border bg-card shadow-xs", className)}>
      <ProfileBanner
        coverUrl={coverUrl}
        profileType={profileType}
        isOwner={isOwner}
        onEditCover={onEditCover}
      />

      <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
          <ProfileAvatar
            src={avatarUrl}
            name={fullName}
            isVerified={isVerified}
            size="xl"
            className="z-10"
          />

          <div className="space-y-1.5 mb-1 sm:mb-2 z-10">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {fullName}
              </h1>
              <Badge variant="secondary" className="font-semibold capitalize text-xs">
                {formatTypeLabel(profileType)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
              <span>@{username}</span>
              {departmentName && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {departmentName}
                  </span>
                </>
              )}
              {batchYear && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Batch {batchYear}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end z-10 pt-2 sm:pt-0">
          <ProfileActions
            isOwner={isOwner}
            isClaimed={isClaimed}
            canClaim={canClaim}
            onEditClick={onEditClick}
            onClaimClick={onClaimClick}
            onPrivacyClick={onPrivacyClick}
            editUrl={editUrl}
            claimUrl={claimUrl}
            privacyUrl={privacyUrl}
          />
        </div>
      </div>
    </div>
  );
}
