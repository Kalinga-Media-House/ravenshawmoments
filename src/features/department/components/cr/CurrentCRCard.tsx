// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/cr/CurrentCRCard.tsx
// Purpose   : Highlight card displaying the active Department Representative
// =============================================================================

import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentCR } from "@/types/department";

export interface CurrentCRCardProps {
  currentCR: DepartmentCR;
}

export const CurrentCRCard: React.FC<CurrentCRCardProps> = ({ currentCR }) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
          {currentCR.profile?.full_name?.slice(0, 2).toUpperCase() || "CR"}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-2xs">
              Active CR
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {currentCR.role_title}
            </span>
          </div>

          <h4 className="font-semibold text-base text-foreground truncate">
            {currentCR.profile?.full_name || "Department Representative"}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              Term: {currentCR.term_start_date} – {currentCR.term_end_date || "Present"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
