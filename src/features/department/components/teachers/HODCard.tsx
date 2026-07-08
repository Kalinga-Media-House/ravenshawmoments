// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/teachers/HODCard.tsx
// Purpose   : Prominent highlight card for the Head of Department (HOD)
// =============================================================================

import React from "react";
import { Award, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentTeacher } from "@/types/department";

export interface HODCardProps {
  hod: DepartmentTeacher;
}

export const HODCard: React.FC<HODCardProps> = ({ hod }) => {
  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/5 via-card to-card shadow-sm">
      <CardContent className="p-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl border border-primary/20">
          {hod.profile?.full_name?.slice(0, 2).toUpperCase() || "HD"}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
              Head of Department
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">Leadership Profile</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {hod.profile?.full_name || "Department Head"}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">{hod.designation_title}</p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
            {hod.qualification && (
              <span className="inline-flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>{hod.qualification}</span>
              </span>
            )}
            {hod.contact_email && (
              <a
                href={`mailto:${hod.contact_email}`}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>{hod.contact_email}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
