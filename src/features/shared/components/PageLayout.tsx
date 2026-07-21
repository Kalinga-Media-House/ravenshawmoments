// =============================================================================
// Ravenshaw Moments - Global Page Layout System
// File: src/features/shared/components/PageLayout.tsx
// Purpose: Standardized layout primitives (PageContainer, PageHeader, PageSection,
//          PageActions, PageContent, PageGrid, PageSidebar) for all pages.
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { AutoBreadcrumb, type AutoBreadcrumbProps } from "@/components/ui/breadcrumb";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PageContainer({
  fluid = false,
  size = "xl",
  className,
  children,
  ...props
}: PageContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      data-slot="page-container"
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10",
        !fluid && sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: AutoBreadcrumbProps["customItems"] | boolean;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs = true,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-col gap-4 mb-6 sm:mb-8 border-b border-border/60 pb-6", className)}
      {...props}
    >
      {breadcrumbs && (
        typeof breadcrumbs === "boolean" ? (
          <AutoBreadcrumb />
        ) : (
          <AutoBreadcrumb customItems={breadcrumbs} />
        )
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground truncate">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <PageActions className="sm:self-center shrink-0">{actions}</PageActions>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}

export interface PageActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageActions({ className, children, ...props }: PageActionsProps) {
  return (
    <div
      data-slot="page-actions"
      className={cn("flex flex-wrap items-center gap-2.5 sm:gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  variant?: "default" | "muted" | "glass" | "maroon";
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageSection({
  variant = "default",
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageSectionProps) {
  const variantStyles = {
    default: "bg-transparent",
    muted: "bg-muted/40 rounded-2xl p-6 sm:p-8 border border-border/50",
    glass: "glass-card p-6 sm:p-8",
    maroon: "heritage-card p-6 sm:p-8 text-white",
  };

  return (
    <section
      data-slot="page-section"
      className={cn("py-6 sm:py-8 first:pt-0 last:pb-0", variantStyles[variant], className)}
      {...props}
    >
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {actions && <PageActions>{actions}</PageActions>}
        </div>
      )}
      {children}
    </section>
  );
}

export interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContent({ className, children, ...props }: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      className={cn("space-y-6 sm:space-y-8 animate-page-transition", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

export function PageGrid({ cols = 3, className, children, ...props }: PageGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      data-slot="page-grid"
      className={cn("grid gap-6 sm:gap-8", gridCols[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarSpan?: 1 | 2;
}

export function PageSidebar({
  sidebar,
  sidebarPosition = "right",
  sidebarSpan = 1,
  className,
  children,
  ...props
}: PageSidebarProps) {
  const mainSpan = sidebarSpan === 1 ? "lg:col-span-3" : "lg:col-span-2";
  const sideSpan = sidebarSpan === 1 ? "lg:col-span-1" : "lg:col-span-2";

  return (
    <div
      data-slot="page-sidebar"
      className={cn("grid grid-cols-1 lg:grid-cols-4 gap-8 items-start", className)}
      {...props}
    >
      {sidebarPosition === "left" && (
        <aside className={cn("w-full lg:sticky lg:top-24 space-y-6", sideSpan)}>
          {sidebar}
        </aside>
      )}

      <main className={cn("w-full min-w-0 space-y-6 sm:space-y-8", mainSpan)}>
        {children}
      </main>

      {sidebarPosition === "right" && (
        <aside className={cn("w-full lg:sticky lg:top-24 space-y-6", sideSpan)}>
          {sidebar}
        </aside>
      )}
    </div>
  );
}
