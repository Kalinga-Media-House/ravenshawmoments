// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/core/DepartmentStats.tsx
// Purpose   : Metric grid displaying core departmental numerical counts
// =============================================================================

import React from "react";
import { Users, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { DepartmentStatistics } from "@/types/department";

export interface DepartmentStatsProps {
  stats: DepartmentStatistics;
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({ stats }) => {
  const items = [
    {
      label: "Active Students",
      value: stats.total_students,
      icon: <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />,
    },
    {
      label: "Faculty Members",
      value: stats.total_teachers,
      icon: <Users className="h-5 w-5 text-blue-500" aria-hidden="true" />,
    },
    {
      label: "Events Organized",
      value: stats.total_events,
      icon: <Calendar className="h-5 w-5 text-emerald-500" aria-hidden="true" />,
    },
    {
      label: "Publications",
      value: stats.total_publications,
      icon: <BookOpen className="h-5 w-5 text-amber-500" aria-hidden="true" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            {item.icon}
          </div>
          <span className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};
