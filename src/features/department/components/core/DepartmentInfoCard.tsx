// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/core/DepartmentInfoCard.tsx
// Purpose   : Detailed Department information card (Vision, Mission, Overview)
// =============================================================================

import React from "react";
import { Info, Target, Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Department } from "@/types/department";

export interface DepartmentInfoCardProps {
  department: Department;
}

export const DepartmentInfoCard: React.FC<DepartmentInfoCardProps> = ({ department }) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Info className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>About Department</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-muted-foreground">
        <div>
          <p className="leading-relaxed text-foreground/90">
            {department.description || "No overview provided for this department yet."}
          </p>
        </div>

        {department.vision && (
          <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Vision</span>
            </div>
            <p className="text-muted-foreground">{department.vision}</p>
          </div>
        )}

        {department.mission && (
          <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Mission</span>
            </div>
            <p className="text-muted-foreground">{department.mission}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
