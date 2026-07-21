// =============================================================================
// Ravenshaw Moments - Enterprise Statistics Components
// File: src/features/shared/components/statistics/StatCard.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTrend, type StatTrendProps } from "./StatTrend";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  trend?: StatTrendProps;
  comparison?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  variant?: "default" | "glass" | "maroon" | "accent";
  className?: string;
}

export function StatCard({
  title,
  value,
  label,
  icon,
  trend,
  comparison,
  isLoading = false,
  isEmpty = false,
  variant = "default",
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("p-6 space-y-3", className)} data-slot="stat-card-loading">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="size-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="h-3 w-44 rounded-md" />
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)} data-slot="stat-card-empty">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xl font-bold mt-1">—</p>
        <p className="text-xs text-muted-foreground/80 mt-1">No data available</p>
      </Card>
    );
  }

  const variantStyles = {
    default: "bg-card text-card-foreground border-border/80 shadow-sm",
    glass: "glass-card text-card-foreground",
    maroon: "heritage-card text-white",
    accent: "bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20",
  };

  return (
    <Card
      data-slot="stat-card"
      className={cn(
        "rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground uppercase truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-2.5 flex-wrap pt-0.5">
              <span className={cn(
                "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight",
                variant === "maroon" ? "text-white" : "text-primary dark:text-foreground"
              )}>
                {value}
              </span>
              {trend && <StatTrend {...trend} />}
            </div>
          </div>

          {icon && (
            <div className={cn(
              "size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
              variant === "maroon"
                ? "bg-white/15 text-[#E8B83F] border border-white/20"
                : "bg-primary/10 text-primary border border-primary/15"
            )}>
              {icon}
            </div>
          )}
        </div>

        {(label || comparison) && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground pt-1 border-t border-border/40">
            {label && <span className="font-medium truncate">{label}</span>}
            {comparison && <span className="text-muted-foreground/80">{comparison}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
