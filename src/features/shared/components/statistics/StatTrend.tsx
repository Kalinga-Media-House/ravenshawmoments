// =============================================================================
// Ravenshaw Moments - Enterprise Statistics Components
// File: src/features/shared/components/statistics/StatTrend.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatTrendProps {
  value?: number;
  direction?: "up" | "down" | "neutral";
  label?: string;
  className?: string;
}

export function StatTrend({ value, direction, label, className }: StatTrendProps) {
  const isPositive = direction === "up" || (typeof value === "number" && value > 0);
  const isNegative = direction === "down" || (typeof value === "number" && value < 0);

  let Icon = Minus;
  let colorClass = "text-muted-foreground bg-muted";

  if (isPositive) {
    Icon = TrendingUp;
    colorClass = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
  } else if (isNegative) {
    Icon = TrendingDown;
    colorClass = "text-red-600 dark:text-red-400 bg-red-500/10";
  }

  return (
    <span
      data-slot="stat-trend"
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-tight shrink-0",
        colorClass,
        className
      )}
    >
      <Icon className="size-3.5" />
      {typeof value === "number" && <span>{Math.abs(value)}%</span>}
      {label && <span>{label}</span>}
    </span>
  );
}
