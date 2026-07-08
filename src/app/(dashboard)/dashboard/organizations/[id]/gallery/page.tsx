
import React from "react";
import { OrganizationEmptyState } from "@/features/organization/components";

export default function OrganizationDashboardSubPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">gallery</h1>
      <OrganizationEmptyState title={`No ${'gallery'} found`} />
    </div>
  );
}
  