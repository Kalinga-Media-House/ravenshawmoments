// =============================================================================
// Ravenshaw Moments — Hostel Slug Loading Skeleton
// =============================================================================

import React from "react";
import { HostelBannerSkeleton, HostelHeaderSkeleton, HostelGridSkeleton } from "@/features/hostel/components";

export default function HostelSlugLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <HostelBannerSkeleton />
      <HostelHeaderSkeleton />
      <HostelGridSkeleton />
    </main>
  );
}
