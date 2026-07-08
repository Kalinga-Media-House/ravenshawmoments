// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/Notices/NoticeBadge.tsx
// Purpose   : Priority and target audience badge consuming Shared Platform Layer
// =============================================================================

import React from "react";
import { Badge } from "@/components/ui/badge";
import { DepartmentNoticePriority, DepartmentNoticeAudience } from "@/types/department";
import { StatusBadge } from "@/features/shared/components";

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
        <StatusBadge label="Critical" variant="critical" className="text-2xs" />
      )}

      {priority === "high" && (
        <StatusBadge label="High Priority" variant="high" className="text-2xs" />
      )}

      {audience && audience !== "all" && (
        <Badge variant="outline" className="text-2xs capitalize">
          {audience}
        </Badge>
      )}
    </div>
  );
};
