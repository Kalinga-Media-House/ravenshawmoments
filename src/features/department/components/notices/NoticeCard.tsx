// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/notices/NoticeCard.tsx
// Purpose   : Card component displaying a departmental circular or notice
// =============================================================================

import React from "react";
import { Pin, Calendar, Paperclip, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentNotice } from "@/types/department";
import { NoticeBadge } from "./NoticeBadge";

export interface NoticeCardProps {
  notice: DepartmentNotice;
  onClick?: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {notice.is_pinned && (
              <Pin className="h-4 w-4 text-primary shrink-0" aria-label="Pinned Notice" />
            )}
            <NoticeBadge
              priority={notice.priority}
              audience={notice.target_audience}
              isPinned={notice.is_pinned}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{new Date(notice.published_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {notice.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {notice.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {notice.attachment_url && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Attachment available</span>
              </span>
            )}
            <span>Views: {notice.view_count.toLocaleString()}</span>
          </div>

          <span className="inline-flex items-center gap-0.5 text-primary font-medium group-hover:underline">
            <span>Read more</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
