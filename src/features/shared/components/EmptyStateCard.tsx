// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/components/EmptyStateCard.tsx
// Purpose   : Backwards-compatible wrapper around EmptyState for legacy calls
// =============================================================================

import React from "react";
import { EmptyState } from "@/features/shared/components/EmptyState";

export interface EmptyStateCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyStateCard({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateCardProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={icon}
      primaryAction={action}
      variant="dashed"
      className={className}
    />
  );
}
