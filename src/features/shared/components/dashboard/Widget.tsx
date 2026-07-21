// =============================================================================
// Ravenshaw Moments - Enterprise Dashboard Widget System
// File: src/features/shared/components/dashboard/Widget.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardWidgetSkeleton } from "@/features/shared/components/skeletons/DashboardWidgetSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "maroon" | "elevated";
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function Widget({
  variant = "default",
  isLoading = false,
  isEmpty = false,
  isError = false,
  emptyMessage = "No data available in this widget right now.",
  errorMessage = "Failed to load widget data.",
  onRetry,
  className,
  children,
  ...props
}: WidgetProps) {
  if (isLoading) {
    return <DashboardWidgetSkeleton className={className} />;
  }

  if (isError) {
    return <WidgetError message={errorMessage} onRetry={onRetry} className={className} />;
  }

  if (isEmpty) {
    return <WidgetEmpty message={emptyMessage} className={className} />;
  }

  const variantStyles = {
    default: "bg-card text-card-foreground border-border/80 shadow-sm",
    glass: "glass-card text-card-foreground",
    maroon: "heritage-card text-white",
    elevated: "bg-card text-card-foreground border-border/80 shadow-md",
  };

  return (
    <Card
      data-slot="widget"
      className={cn("rounded-2xl flex flex-col justify-between transition-all duration-200 overflow-hidden", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Card>
  );
}

export interface WidgetHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function WidgetHeader({
  title,
  subtitle,
  icon,
  actions,
  className,
  children,
  ...props
}: WidgetHeaderProps) {
  return (
    <div
      data-slot="widget-header"
      className={cn("flex items-start justify-between gap-4 p-6 sm:p-7 pb-4 border-b border-border/40", className)}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && <WidgetActions className="shrink-0">{actions}</WidgetActions>}
      {children}
    </div>
  );
}

export interface WidgetBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WidgetBody({ className, children, ...props }: WidgetBodyProps) {
  return (
    <CardContent
      data-slot="widget-body"
      className={cn("p-6 sm:p-7 pt-4 pb-4 flex-1", className)}
      {...props}
    >
      {children}
    </CardContent>
  );
}

export interface WidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WidgetFooter({ className, children, ...props }: WidgetFooterProps) {
  return (
    <div
      data-slot="widget-footer"
      className={cn("flex items-center justify-between gap-3 p-6 sm:p-7 pt-3 border-t border-border/40 bg-muted/20", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface WidgetActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WidgetActions({ className, children, ...props }: WidgetActionsProps) {
  return (
    <div
      data-slot="widget-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface WidgetLoadingProps {
  className?: string;
}

export function WidgetLoading({ className }: WidgetLoadingProps) {
  return <DashboardWidgetSkeleton className={className} />;
}

export interface WidgetEmptyProps {
  message?: string;
  className?: string;
}

export function WidgetEmpty({
  message = "No data available in this widget right now.",
  className,
}: WidgetEmptyProps) {
  return (
    <Card
      data-slot="widget-empty"
      className={cn("rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center", className)}
    >
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </Card>
  );
}

export interface WidgetErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function WidgetError({
  message = "Failed to load widget data.",
  onRetry,
  className,
}: WidgetErrorProps) {
  return (
    <Card
      data-slot="widget-error"
      className={cn("rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3", className)}
    >
      <div className="size-10 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
        <AlertCircle className="size-5" />
      </div>
      <p className="text-sm font-semibold text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          <span>Retry</span>
        </Button>
      )}
    </Card>
  );
}
