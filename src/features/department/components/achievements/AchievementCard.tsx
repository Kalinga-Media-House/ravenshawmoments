// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/achievements/AchievementCard.tsx
// Purpose   : Card component displaying a departmental academic/student achievement
// =============================================================================

import React from "react";
import { Trophy, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentAchievement } from "@/types/department";

export interface AchievementCardProps {
  achievement: DepartmentAchievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 font-bold">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>

          <Badge variant="outline" className="text-2xs capitalize">
            {achievement.category_name || "Excellence"}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-base text-foreground">{achievement.title}</h4>
          {achievement.description && (
            <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
          {achievement.issuing_organization && (
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{achievement.issuing_organization}</span>
            </span>
          )}

          {achievement.achievement_date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{new Date(achievement.achievement_date).toLocaleDateString()}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
