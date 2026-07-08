import React from "react";
import { HostelHeaderSkeleton, HostelGridSkeleton } from "@/features/hostel/components";

export default function DashboardHostelHubLoading() {
  return (
    <div className="space-y-8">
      <HostelHeaderSkeleton />
      <HostelGridSkeleton />
    </div>
  );
}
