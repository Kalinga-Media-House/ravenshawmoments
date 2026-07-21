// =============================================================================
// Ravenshaw Moments - Enterprise Empty States
// File: src/features/shared/components/EmptyState.tsx
// Purpose: Reusable enterprise empty states supporting all 11 domain presets,
//          plus custom icon/title/description/actions.
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Trophy,
  Calendar,
  Building2,
  Users2,
  Image as ImageIcon,
  Award,
  Briefcase,
  Bell,
  SearchX,
  BarChart3,
  FileQuestion,
} from "lucide-react";

export type EmptyPreset =
  | "posts"
  | "competitions"
  | "events"
  | "departments"
  | "organizations"
  | "gallery"
  | "certificates"
  | "businesses"
  | "notifications"
  | "search"
  | "analytics";

export interface EmptyStateProps {
  preset?: EmptyPreset;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: "card" | "clean" | "glass" | "dashed";
  className?: string;
}

const PRESET_CONFIG: Record<
  EmptyPreset,
  { title: string; description: string; icon: React.ElementType }
> = {
  posts: {
    title: "No Posts Yet",
    description: "The community feed is quiet right now. Be the first to share a moment, update, or thought with fellow Ravenshawvians!",
    icon: MessageSquare,
  },
  competitions: {
    title: "No Competitions Active",
    description: "There are currently no active academic or cultural competitions listed. Check back soon or browse historical events.",
    icon: Trophy,
  },
  events: {
    title: "No Upcoming Events",
    description: "Our campus calendar has no scheduled events for this period. Stay tuned for upcoming symposiums and fests.",
    icon: Calendar,
  },
  departments: {
    title: "No Departments Found",
    description: "We couldn't find any academic departments matching your search criteria or filter selection.",
    icon: Building2,
  },
  organizations: {
    title: "No Organizations Listed",
    description: "No student societies or clubs match your current view. Explore other categories or propose a new society.",
    icon: Users2,
  },
  gallery: {
    title: "No Gallery Memories",
    description: "This gallery album or batch timeline hasn't been populated with photos yet. Share your campus memories!",
    icon: ImageIcon,
  },
  certificates: {
    title: "No Certificates Issued",
    description: "No verified digital certificates or achievement badges have been issued to this profile yet.",
    icon: Award,
  },
  businesses: {
    title: "No Businesses Listed",
    description: "Our alumni and student business directory has no listings in this category yet. List your venture today!",
    icon: Briefcase,
  },
  notifications: {
    title: "No New Notifications",
    description: "You're all caught up! You have no unread alerts, messages, or administrative announcements at this time.",
    icon: Bell,
  },
  search: {
    title: "No Search Results Found",
    description: "We couldn't find any matching profiles, posts, or records for your search query. Try adjusting your keywords.",
    icon: SearchX,
  },
  analytics: {
    title: "No Analytics Available",
    description: "Not enough data has been generated for this reporting period yet. Metrics will update dynamically as activity increases.",
    icon: BarChart3,
  },
};

export function EmptyState({
  preset,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  variant = "dashed",
  className,
}: EmptyStateProps) {
  const config = preset ? PRESET_CONFIG[preset] : null;
  const displayTitle = title || config?.title || "No Data Available";
  const displayDesc =
    description || config?.description || "There is currently nothing to display in this section.";
  const IconComponent = config?.icon || FileQuestion;

  const content = (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 px-4 sm:px-6">
      <div className="size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-inner mb-2 transition-transform hover:scale-105 duration-300">
        {icon ? (
          <div className="text-primary">{icon}</div>
        ) : (
          <IconComponent className="size-8 stroke-[1.75]" />
        )}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {displayTitle}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );

  if (variant === "clean") {
    return (
      <div
        data-slot="empty-state"
        role="region"
        aria-label={displayTitle}
        className={cn("w-full rounded-2xl", className)}
      >
        {content}
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <Card
        variant="glass"
        data-slot="empty-state"
        role="region"
        aria-label={displayTitle}
        className={cn("w-full", className)}
      >
        <CardContent className="p-0">{content}</CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-slot="empty-state"
      role="region"
      aria-label={displayTitle}
      className={cn(
        "w-full border-2 border-dashed border-border/80 bg-card/50 shadow-none transition-colors hover:border-border",
        className
      )}
    >
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}
