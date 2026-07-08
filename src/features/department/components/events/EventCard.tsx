// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/events/EventCard.tsx
// Purpose   : Card component displaying a departmental academic/cultural event
// =============================================================================

import React from "react";
import Image from "next/image";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentEvent } from "@/types/department";

export interface EventCardProps {
  event: DepartmentEvent;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const startDate = new Date(event.event_start_time);

  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer flex flex-col"
    >
      {event.cover_url && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur-xs font-semibold capitalize">
              {event.event_type.replace("_", " ")}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="space-y-2">
          {!event.cover_url && (
            <Badge variant="outline" className="text-2xs capitalize">
              {event.event_type.replace("_", " ")}
            </Badge>
          )}

          <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h4>

          <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>
              {startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.venue}</span>
            </div>

            {event.is_registration_required && (
              <span className="inline-flex items-center gap-1 text-primary font-medium">
                <span>Register</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
