// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/components/StatusBadge.tsx
// Purpose   : Shared Platform Layer — Reusable Semantic Status/Priority Badge
// =============================================================================

import React from "react";
import { Badge } from "@/components/ui/badge";

export type StatusVariant = "default" | "secondary" | "destructive" | "outline" | "verified" | "critical" | "high" | "normal";

export interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({ label, variant = "default", className = "" }: StatusBadgeProps) {
  let badgeStyle = "";

  switch (variant) {
    case "critical":
    case "destructive":
      badgeStyle = "bg-red-500/10 text-red-500 border-red-500/20";
      break;
    case "high":
      badgeStyle = "bg-amber-500/10 text-amber-500 border-amber-500/20";
      break;
    case "verified":
      badgeStyle = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      break;
    case "normal":
    case "secondary":
      badgeStyle = "bg-blue-500/10 text-blue-500 border-blue-500/20";
      break;
    default:
      badgeStyle = "bg-muted text-muted-foreground";
      break;
  }

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 rounded-full ${badgeStyle} ${className}`}>
      {label}
    </Badge>
  );
}
