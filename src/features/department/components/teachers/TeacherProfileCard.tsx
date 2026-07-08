// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/teachers/TeacherProfileCard.tsx
// Purpose   : Detailed profile card for a selected faculty member
// =============================================================================

import React from "react";
import { Mail, Award, BookOpen, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentTeacher } from "@/types/department";

export interface TeacherProfileCardProps {
  teacher: DepartmentTeacher;
}

export const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ teacher }) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
          {teacher.profile?.full_name?.slice(0, 2).toUpperCase() || <User className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-foreground">
              {teacher.profile?.full_name || "Faculty Profile"}
            </CardTitle>
            {teacher.is_hod && <Badge variant="default">Head of Department</Badge>}
            {teacher.is_visiting && <Badge variant="outline">Visiting</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{teacher.designation_title}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {teacher.bio_override && (
          <p className="text-muted-foreground leading-relaxed">{teacher.bio_override}</p>
        )}

        <div className="space-y-2.5 pt-2 border-t border-border/60">
          {teacher.research_interests && teacher.research_interests.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Research Interests:</strong>{" "}
                {teacher.research_interests.join(", ")}
              </span>
            </div>
          )}

          {teacher.qualification && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span><strong className="text-foreground">Qualification:</strong> {teacher.qualification}</span>
            </div>
          )}

          {teacher.contact_email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
              <a href={`mailto:${teacher.contact_email}`} className="hover:underline text-foreground">
                {teacher.contact_email}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
