// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelBanner.tsx
// Purpose   : Responsive cover banner with logo overlay for Hostel pages
// =============================================================================

import React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

export interface HostelBannerProps {
  coverUrl?: string;
  logoUrl?: string;
  name: string;
}

export const HostelBanner: React.FC<HostelBannerProps> = ({ coverUrl, logoUrl, name }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/10 via-muted to-accent/10">
      <div className="relative h-48 w-full sm:h-64 md:h-72">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${name} cover banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-background bg-card shadow-md sm:h-20 sm:w-20">
          {logoUrl ? (
            <Image src={logoUrl} alt={`${name} logo`} fill className="object-contain p-1" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
              <Building2 className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
