"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    data-slot="breadcrumb-list"
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="breadcrumb-item"
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
    href?: string;
  }
>(({ className, href = "#", children, ...props }, ref) => {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        data-slot="breadcrumb-link"
        className={cn("transition-colors hover:text-foreground font-medium", className)}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      ref={ref}
      href={href}
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground font-medium", className)}
      {...props}
    >
      {children}
    </a>
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    data-slot="breadcrumb-page"
    className={cn("font-semibold text-foreground truncate max-w-[200px] sm:max-w-none", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn("[&>svg]:size-3.5 text-muted-foreground/60", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

// =============================================================================
// Automatic Deep Navigation Breadcrumb Component
// =============================================================================
export interface AutoBreadcrumbProps {
  customItems?: { label: string; href?: string }[];
  homeHref?: string;
  className?: string;
}

export function AutoBreadcrumb({
  customItems,
  homeHref = "/",
  className,
}: AutoBreadcrumbProps) {
  const pathname = usePathname();

  const pathSegments = React.useMemo(() => {
    if (customItems) return [];
    if (!pathname || pathname === "/") return [];
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label = segment
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return { label, href, isLast: idx === segments.length - 1 };
    });
  }, [pathname, customItems]);

  const items = customItems
    ? customItems.map((item, idx) => ({
        ...item,
        isLast: idx === customItems.length - 1,
      }))
    : pathSegments;

  if (items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={homeHref} className="flex items-center gap-1">
            <Home className="size-3.5 shrink-0" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
