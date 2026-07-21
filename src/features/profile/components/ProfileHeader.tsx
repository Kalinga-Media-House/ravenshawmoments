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
  level?: string | null;
  stream?: string | null;
  departmentName?: string | null;
  batchYear?: string | null;
  universityName?: string | null;
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
  shareUrl?: string;
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
    case "external_participant": return "Participant";
    default: return "Member";
  }
};

export function ProfileHeader({
  fullName,
  username,
  avatarUrl,
  coverUrl,
  profileType = "student",
  level,
  stream,
  departmentName,
  batchYear,
  universityName,
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
  shareUrl,
  className,
}: ProfileHeaderProps) {
  return (
    <div className={cn("w-full overflow-hidden heritage-card-glass", className)}>
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight heritage-card-title">
                {fullName}
              </h1>
              <Badge variant="secondary" className="font-semibold capitalize text-xs text-foreground bg-white/90 hover:bg-white border-white/20">
                {formatTypeLabel(profileType)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm heritage-card-muted">
              {username && <span className="font-medium text-[var(--color-heritage-gold)]">@{username}</span>}

              {(departmentName || stream || level || universityName) && (
                <span className="hidden sm:inline opacity-50">•</span>
              )}

              {profileType === "external_participant" && universityName ? (
                <span className="flex items-center gap-1.5 heritage-card-title font-medium bg-black/40 border border-white/5 px-2 py-0.5 rounded-md">
                  <Building2 className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" />
                  <span className="truncate max-w-[200px]">{universityName}</span>
                </span>
              ) : level === "+2" ? (
                <span className="flex items-center gap-1.5 heritage-card-title font-medium bg-black/40 border border-white/5 px-2 py-0.5 rounded-md">
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" />
                  {stream} <span className="heritage-card-muted font-normal">({level})</span>
                </span>
              ) : (departmentName || level) ? (
                <span className="flex items-center gap-1.5 heritage-card-title font-medium bg-black/40 border border-white/5 px-2 py-0.5 rounded-md">
                  <Building2 className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" />
                  <span className="truncate max-w-[200px]">{departmentName || level}</span>
                </span>
              ) : null}
              {batchYear && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="inline-flex items-center gap-1 heritage-card-title">
                    <GraduationCap className="h-3.5 w-3.5 text-[var(--color-heritage-gold)]" />
                    Batch {batchYear.replace('-', '–')}
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
            shareUrl={shareUrl}
          />
        </div>
      </div>
    </div>
  );
}
