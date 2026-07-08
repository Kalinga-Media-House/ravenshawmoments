// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/achievements/AchievementGrid.tsx
// Purpose   : Grid layout for departmental academic and cultural achievements
// =============================================================================

import React from "react";
import { DepartmentAchievement } from "@/types/department";
import { AchievementCard } from "./AchievementCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface AchievementGridProps {
  achievements: DepartmentAchievement[];
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Achievements Recorded"
        description="There are currently no departmental honors or student achievements listed."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
};
