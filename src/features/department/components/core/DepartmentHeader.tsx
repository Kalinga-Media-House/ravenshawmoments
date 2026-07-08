// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/core/DepartmentHeader.tsx
// Purpose   : Core Department Header displaying title, short name, verification & badges
// =============================================================================

import React from "react";
import { BadgeCheck, Calendar, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Department } from "@/types/department";

export interface DepartmentHeaderProps {
  department: Department;
  action?: React.ReactNode;
}

export const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ department, action }) => {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {department.name}
          </h1>
          {department.is_verified && (
            <BadgeCheck
              className="h-6 w-6 text-primary"
              aria-label="Verified Department"
            />
          )}
          {department.short_name && (
            <Badge variant="secondary" className="font-mono text-xs">
              {department.short_name}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {department.established_year && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Est. {department.established_year}</span>
            </span>
          )}
          {department.office_location && (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              <span>{department.office_location}</span>
            </span>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </header>
  );
};
