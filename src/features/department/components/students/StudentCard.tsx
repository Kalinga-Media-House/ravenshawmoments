// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/students/StudentCard.tsx
// Purpose   : Student directory card component
// =============================================================================

import React from "react";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentStudent } from "@/types/department";

export interface StudentCardProps {
  student: DepartmentStudent;
  onClick?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
          {student.profile?.full_name?.slice(0, 2).toUpperCase() || "ST"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h5 className="font-semibold text-sm text-foreground truncate">
              {student.profile?.full_name || "Student"}
            </h5>
            {student.is_verified_by_cr && (
              <CheckCircle2
                className="h-4 w-4 text-primary shrink-0"
                aria-label="Verified Student"
              />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {student.batch?.name || "Academic Batch"}
            </span>
            {student.program?.program_name && (
              <span className="text-2xs text-muted-foreground/80">
                • {student.program.program_name}
              </span>
            )}
          </div>
        </div>

        {student.is_featured && (
          <Badge variant="secondary" className="text-2xs">
            Featured
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
