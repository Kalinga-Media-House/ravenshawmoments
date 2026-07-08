// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/cr/CRHistoryTimeline.tsx
// Purpose   : Chronological timeline of past & current Department CR appointments
// =============================================================================

import React from "react";
import { History, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentCR } from "@/types/department";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface CRHistoryTimelineProps {
  crList: DepartmentCR[];
}

export const CRHistoryTimeline: React.FC<CRHistoryTimelineProps> = ({ crList }) => {
  if (crList.length === 0) {
    return (
      <EmptyDepartmentState
        title="No CR History"
        description="No past or current Department Representatives recorded."
      />
    );
  }

  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <History className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Representative History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative border-l border-border pl-4 space-y-6 ml-2">
          {crList.map((cr) => (
            <div key={cr.id} className="relative group">
              <span className="absolute -left-5.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h5 className="font-semibold text-sm text-foreground">
                    {cr.profile?.full_name || "Department CR"}
                  </h5>
                  <p className="text-xs text-muted-foreground">{cr.role_title}</p>
                </div>
                <div className="mt-1 sm:mt-0 flex items-center gap-2">
                  <Badge variant={cr.is_active ? "default" : "secondary"} className="text-2xs">
                    {cr.is_active ? "Active" : "Alumni CR"}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {cr.term_start_date} – {cr.term_end_date || "Present"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
