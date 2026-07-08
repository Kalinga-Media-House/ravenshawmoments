// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelEmptyState.tsx
// Purpose   : Hostel empty state delegating to Shared Platform Layer
// =============================================================================

import React from "react";
import { Building2 } from "lucide-react";
import { EmptyStateCard } from "@/features/shared/components";

export interface HostelEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const HostelEmptyState: React.FC<HostelEmptyStateProps> = ({
  title = "No Hostel Records Found",
  description = "There are no entries in this hostel section at the moment.",
  action,
  icon,
}) => {
  return (
    <EmptyStateCard
      title={title}
      description={description}
      icon={icon || <Building2 className="h-6 w-6" aria-hidden="true" />}
      action={action}
    />
  );
};
