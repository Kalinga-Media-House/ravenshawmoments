// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/notices/NoticeBadge.tsx
// Purpose   : Priority and target audience badge for department circulars
// =============================================================================

import React from "react";
import { Badge } from "@/components/ui/badge";
import { DepartmentNoticePriority, DepartmentNoticeAudience } from "@/types/department";

export interface NoticeBadgeProps {
  priority?: DepartmentNoticePriority;
  audience?: DepartmentNoticeAudience;
  isPinned?: boolean;
}

export const NoticeBadge: React.FC<NoticeBadgeProps> = ({ priority, audience, isPinned }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {isPinned && (
        <Badge variant="default" className="text-2xs bg-primary text-primary-foreground">
          Pinned
        </Badge>
      )}

      {priority === "critical" && (
        <Badge variant="destructive" className="text-2xs">
          Critical
        </Badge>
      )}

      {priority === "high" && (
        <Badge variant="secondary" className="text-2xs border-amber-500/40 text-amber-500">
          High Priority
        </Badge>
      )}

      {audience && audience !== "all" && (
        <Badge variant="outline" className="text-2xs capitalize">
          {audience}
        </Badge>
      )}
    </div>
  );
};
