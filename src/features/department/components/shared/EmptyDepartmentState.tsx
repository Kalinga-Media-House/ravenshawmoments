// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/Shared/EmptyDepartmentState.tsx
// Purpose   : Reusable empty state UI component consuming Shared Platform Layer
// =============================================================================

import React from "react";
import { FolderOpen } from "lucide-react";
import { EmptyStateCard } from "@/features/shared/components";

export interface EmptyDepartmentStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyDepartmentState: React.FC<EmptyDepartmentStateProps> = ({
  title = "No Content Found",
  description = "There are no items to display in this departmental section at the moment.",
  action,
  icon,
}) => {
  return (
    <EmptyStateCard
      title={title}
      description={description}
      icon={icon || <FolderOpen className="h-6 w-6" aria-hidden="true" />}
      action={action}
    />
  );
};
