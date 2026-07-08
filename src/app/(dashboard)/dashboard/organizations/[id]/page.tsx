
import React from "react";
import { OrganizationEmptyState } from "@/features/organization/components";

export default function OrganizationDashboardOverview({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organization Dashboard Overview</h1>
      <OrganizationEmptyState title="No recent activity" />
    </div>
  );
}
