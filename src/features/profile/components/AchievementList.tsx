import * as React from "react";
import { AchievementSummary } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { Trophy, Calendar, Building, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AchievementListProps {
  achievements: AchievementSummary[];
  title?: string;
  description?: string;
  className?: string;
}

export function AchievementList({
  achievements = [],
  title = "Highlights & Achievements",
  description = "Institutional honors, competitive victories, and notable campus milestones.",
  className,
}: AchievementListProps) {
  if (!achievements.length) {
    return (
      <div className={cn("space-y-4", className)}>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-light-heading-primary)] flex items-center gap-2">
            <Trophy className="h-5 w-5 heritage-icon" />
            <span>{title}</span>
          </h2>
          <p className="text-xs text-[var(--color-light-text-muted)] mt-0.5">{description}</p>
        </div>
        <EmptyState
          title="No achievements highlighted yet"
          description="Verified university awards and competition highlights will appear here."
          icon={Trophy}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-lg font-bold text-[var(--color-light-heading-primary)] flex items-center gap-2">
          <Trophy className="h-5 w-5 heritage-icon" />
          <span>{title} ({achievements.length})</span>
        </h2>
        <p className="text-xs text-[var(--color-light-text-muted)] mt-0.5">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => (
          <Card key={item.id} className="overflow-hidden heritage-card-glass transition-all hover:shadow-md flex flex-col justify-between border-0">
            {item.featured_media_url && (
              <div className="relative h-36 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.featured_media_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {item.category_name && (
                  <Badge className="absolute top-3 left-3 bg-black/70 text-white backdrop-blur-xs text-[10px]">
                    {item.category_name}
                  </Badge>
                )}
              </div>
            )}

            <CardContent className={cn("p-5 space-y-3 flex-1 flex flex-col justify-between", !item.featured_media_url && "pt-5")}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm heritage-card-title line-clamp-2">
                    {item.title}
                  </h3>
                  {item.position && (
                    <Badge variant="secondary" className="bg-[var(--color-heritage-gold)]/20 text-[var(--color-heritage-gold)] font-semibold shrink-0 gap-1 text-xs">
                      <Medal className="h-3 w-3" />
                      <span>{item.position}</span>
                    </Badge>
                  )}
                </div>

                {!item.featured_media_url && item.category_name && (
                  <Badge variant="outline" className="text-[10px]">
                    {item.category_name}
                  </Badge>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs heritage-card-muted">
                {item.issuing_organization ? (
                  <span className="flex items-center gap-1 font-medium heritage-card-title truncate max-w-[200px]">
                    <Building className="h-3.5 w-3.5 heritage-icon shrink-0" />
                    <span className="truncate">{item.issuing_organization}</span>
                  </span>
                ) : <span />}

                {item.achievement_date && (
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(item.achievement_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
