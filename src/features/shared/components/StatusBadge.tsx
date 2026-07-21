// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/components/StatusBadge.tsx
// Purpose   : Shared Platform Layer - Reusable Semantic Status/Priority Badge
// =============================================================================

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, XCircle, ShieldCheck, Trophy, Award, FileText } from "lucide-react";

export type StatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "verified"
  | "pending"
  | "rejected"
  | "suspended"
  | "archived"
  | "active"
  | "inactive"
  | "completed"
  | "cancelled"
  | "published"
  | "draft"
  | "winner"
  | "champion"
  | "critical"
  | "high"
  | "normal";

export interface StatusBadgeProps {
  label?: string;
  status?: string;
  variant?: StatusVariant;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  status,
  variant,
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const displayLabel = label || status || "Unknown";
  const normalizedStatus = (variant || status || label || "")
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .trim() as StatusVariant;

  let badgeStyle = "bg-muted text-muted-foreground border-border/60";
  let IconComponent: React.ElementType | null = null;

  switch (normalizedStatus) {
    case "verified":
    case "active":
    case "completed":
    case "published":
      badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      IconComponent = CheckCircle2;
      break;
    case "pending":
    case "draft":
    case "normal":
      badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      IconComponent = Clock;
      break;
    case "rejected":
    case "suspended":
    case "cancelled":
    case "destructive":
    case "critical":
      badgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      IconComponent = XCircle;
      break;
    case "high":
      badgeStyle = "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      IconComponent = AlertCircle;
      break;
    case "winner":
    case "champion":
      badgeStyle = "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-semibold shadow-xs";
      IconComponent = Trophy;
      break;
    case "archived":
    case "inactive":
      badgeStyle = "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20";
      IconComponent = FileText;
      break;
    case "secondary":
      badgeStyle = "bg-secondary/15 text-primary border-secondary/30";
      IconComponent = Award;
      break;
    default:
      badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      IconComponent = ShieldCheck;
      break;
  }

  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 transition-colors ${badgeStyle} ${className}`}
    >
      {showIcon && IconComponent && <IconComponent className="size-3.5 shrink-0" />}
      <span className="capitalize">{displayLabel}</span>
    </Badge>
  );
}
