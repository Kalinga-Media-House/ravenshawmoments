// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/teachers/TeacherCard.tsx
// Purpose   : Compact card displaying a faculty member profile
// =============================================================================

import React from "react";
import { Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentTeacher } from "@/types/department";

export interface TeacherCardProps {
  teacher: DepartmentTeacher;
  onClick?: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
            {teacher.profile?.full_name?.slice(0, 2).toUpperCase() || "FC"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground truncate">
                {teacher.profile?.full_name || "Faculty Profile"}
              </h4>
              {teacher.is_hod && (
                <Badge variant="default" className="text-2xs px-1.5 py-0">
                  HOD
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{teacher.designation_title}</p>
          </div>
        </div>

        {teacher.research_interests && teacher.research_interests.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="truncate">{teacher.research_interests.join(", ")}</span>
          </div>
        )}

        {teacher.qualification && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            <span className="truncate">{teacher.qualification}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
