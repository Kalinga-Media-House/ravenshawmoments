// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/shared/EmptyDepartmentState.tsx
// Purpose   : Reusable empty state UI component for Department modules
// =============================================================================

import React from "react";
import { FolderOpen } from "lucide-react";

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
    <div
      role="status"
      aria-label={title}
      className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/40 text-card-foreground shadow-xs"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {icon || <FolderOpen className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
