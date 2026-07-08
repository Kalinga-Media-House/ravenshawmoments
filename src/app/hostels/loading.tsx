// =============================================================================
// Ravenshaw Moments — Hostels Directory Loading Skeleton
// =============================================================================

import React from "react";
import { HostelGridSkeleton } from "@/features/hostel/components";

export default function HostelsLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-96 rounded-md bg-muted animate-pulse" />
      </div>
      <HostelGridSkeleton />
    </main>
  );
}
