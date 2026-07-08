import * as React from "react";
import { AchievementSummary, ProfileCertificate } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { Trophy, Award, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileTimelineProps {
  achievements?: AchievementSummary[];
  winnerCertificates?: ProfileCertificate[];
  title?: string;
  className?: string;
}

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: "achievement" | "certificate";
  badgeText: string;
  organization?: string;
  description?: string;
  link?: string;
}

export function ProfileTimeline({
  achievements = [],
  winnerCertificates = [],
  title = "Chronological Journey",
  className,
}: ProfileTimelineProps) {
  const mergedItems: TimelineItem[] = React.useMemo(() => {
    const achItems: TimelineItem[] = achievements.map((a) => ({
      id: `ach-${a.id}`,
      title: a.title,
      date: a.achievement_date || a.created_at || "",
      type: "achievement",
      badgeText: a.position || a.category_name || "Achievement",
      organization: a.issuing_organization,
    }));

    const certItems: TimelineItem[] = winnerCertificates.map((c) => ({
      id: `cert-${c.id}`,
      title: c.title,
      date: c.issued_on || c.created_at || "",
      type: "certificate",
      badgeText: c.certificate_type.replace(/_/g, " ").toUpperCase(),
      organization: c.issued_by || "Ravenshaw Moments",
      description: c.description,
      link: c.verification_url || c.pdf_media_url,
    }));

    return [...achItems, ...certItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [achievements, winnerCertificates]);

  if (!mergedItems.length) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </h2>
        <EmptyState
          title="No milestones recorded yet"
          description="Your campus journey, awards, and verified achievements will be charted here."
          icon={Calendar}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <span>{title} ({mergedItems.length})</span>
      </h2>

      <div className="relative border-l-2 border-primary/30 pl-6 ml-3 space-y-8 py-2">
        {mergedItems.map((item) => {
          const isCert = item.type === "certificate";
          const Icon = isCert ? Award : Trophy;

          return (
            <div key={item.id} className="relative group">
              <span
                className={cn(
                  "absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background shadow-xs transition-transform group-hover:scale-110",
                  isCert ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
              </span>

              <Card className="border bg-card/80 shadow-2xs transition-all hover:shadow-md">
                <CardContent className="p-4 sm:p-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Badge
                      variant={isCert ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        isCert && "bg-amber-500 hover:bg-amber-600 text-white"
                      )}
                    >
                      {item.badgeText}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>

                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  )}

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    {item.organization ? (
                      <span className="font-medium text-foreground">By {item.organization}</span>
                    ) : <span />}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        <span>View Document</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
