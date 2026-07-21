import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, User } from "lucide-react";
import { PublicContributor } from "../types/donation";

interface ContributorCardProps {
  contributor: PublicContributor;
}

export const ContributorCard: React.FC<ContributorCardProps> = ({
  contributor,
}) => {
  const nameContent = (
    <>
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
        {contributor.profilePhoto ? (
          <Image
            src={contributor.profilePhoto}
            alt={
              contributor.profilePhotoAlt ||
              `${contributor.publicDisplayName} profile photograph`
            }
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <User
            className="w-5 h-5 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="space-y-0.5 min-w-0">
        <h3 className="text-sm font-black text-foreground truncate">
          {contributor.publicDisplayName}
        </h3>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {contributor.label}
        </p>
      </div>
    </>
  );

  return (
    <div className="light-surface rounded-2xl p-5 border border-border space-y-4 hover:border-[var(--color-heritage-gold)]/40 transition-colors shadow-sm">
      {/* Header with avatar and name */}
      {contributor.profileSlug ? (
        <Link
          href={`/profile/${contributor.profileSlug}`}
          className="flex items-center gap-3 group"
        >
          {nameContent}
        </Link>
      ) : (
        <div className="flex items-center gap-3">{nameContent}</div>
      )}

      {/* Contribution details */}
      <div className="space-y-2 border-t border-border pt-3">
        {contributor.contributionDate && (
          <p className="text-xs text-muted-foreground">
            Contributed on {contributor.contributionDate}
          </p>
        )}
        {contributor.contributionPurpose && (
          <p className="text-xs text-muted-foreground">
            Purpose: {contributor.contributionPurpose}
          </p>
        )}
      </div>

      {/* Contributor badge */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
        <Heart className="w-3 h-3" aria-hidden="true" />
        <span>Verified Contributor</span>
      </div>
    </div>
  );
};
