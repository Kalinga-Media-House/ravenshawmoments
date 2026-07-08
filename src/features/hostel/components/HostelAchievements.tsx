// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelAchievements.tsx
// Purpose   : Inter-hostel achievements and honors showcase
// =============================================================================

import React from "react";
import { Trophy, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostelAchievement } from "@/types/hostel";

export interface HostelAchievementsProps {
  achievements: HostelAchievement[];
}

export const HostelAchievements: React.FC<HostelAchievementsProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {achievements.map((item) => (
        <Card key={item.id} className="overflow-hidden border-border">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500 shrink-0" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                  {item.title}
                </h4>
              </div>
              {item.is_verified && (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-label="Verified" />
              )}
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-2xs text-muted-foreground">
              <Badge variant="secondary" className="capitalize text-2xs">
                {item.category.replace("_", " ")}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{item.awarded_date}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
