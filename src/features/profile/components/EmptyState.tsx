// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/components/EmptyState.tsx
// Purpose   : Profile empty state consuming Shared Platform Layer
// =============================================================================

import * as React from "react";
import { LucideIcon, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/features/shared/components";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description = "There are currently no records to display here.",
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <EmptyStateCard
      title={title}
      description={description}
      icon={<Icon className="h-6 w-6" aria-hidden="true" />}
      className={className}
      action={
        actionLabel && onAction ? (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}
