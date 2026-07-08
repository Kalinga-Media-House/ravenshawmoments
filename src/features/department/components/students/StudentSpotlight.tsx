// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/students/StudentSpotlight.tsx
// Purpose   : Spotlight showcase component for featured department students
// =============================================================================

import React from "react";
import { Sparkles, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DepartmentStudent } from "@/types/department";

export interface StudentSpotlightProps {
  featuredStudents: DepartmentStudent[];
}

export const StudentSpotlight: React.FC<StudentSpotlightProps> = ({ featuredStudents }) => {
  if (featuredStudents.length === 0) return null;

  return (
    <Card className="rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-card to-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Student Spotlight</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {featuredStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-2xs"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 font-bold">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-semibold text-sm text-foreground truncate">
                {student.profile?.full_name || "Featured Student"}
              </h5>
              <p className="text-xs text-muted-foreground truncate">
                {student.batch?.name || "Batch Member"} • {student.leadership_role || "Student Leader"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
