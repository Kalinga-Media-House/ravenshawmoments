import React from "react";
import { HostelGridSkeleton } from "@/features/hostel/components";

export default function DashboardHostelsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-96 rounded-md bg-muted animate-pulse" />
      </div>
      <HostelGridSkeleton />
    </div>
  );
}
