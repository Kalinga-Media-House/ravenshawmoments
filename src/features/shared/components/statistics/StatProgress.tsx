// =============================================================================
// Ravenshaw Moments - Enterprise Statistics Components
// File: src/features/shared/components/statistics/StatProgress.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { StatCard, type StatCardProps } from "./StatCard";

export interface StatProgressProps extends Omit<StatCardProps, "comparison"> {
  percentage: number;
  progressLabel?: string;
  progressColor?: "primary" | "success" | "warning" | "secondary";
}

export function StatProgress({
  percentage,
  progressLabel,
  progressColor = "primary",
  className,
  ...props
}: StatProgressProps) {
  const boundedPct = Math.min(Math.max(percentage, 0), 100);

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    secondary: "bg-[#D4AF37]",
  };

  return (
    <StatCard
      className={className}
      {...props}
      comparison={
        <div className="w-full space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>{progressLabel || "Progress"}</span>
            <span className="font-bold">{boundedPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted/80 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", colorClasses[progressColor])}
              style={{ width: `${boundedPct}%` }}
            />
          </div>
        </div> as any
      }
    />
  );
}
