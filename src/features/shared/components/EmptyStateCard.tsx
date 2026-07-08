// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/components/EmptyStateCard.tsx
// Purpose   : Shared Platform Layer — Reusable Accessible Empty State Component
// =============================================================================

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className={`w-full text-center border border-dashed py-12 ${className}`} role="region" aria-label={title}>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {icon && <div className="text-muted-foreground p-3 rounded-full bg-muted/40">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
