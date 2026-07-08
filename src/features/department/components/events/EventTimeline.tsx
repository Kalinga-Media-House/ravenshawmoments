// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/events/EventTimeline.tsx
// Purpose   : Chronological vertical timeline of departmental events
// =============================================================================

import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DepartmentEvent } from "@/types/department";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface EventTimelineProps {
  events: DepartmentEvent[];
  onSelectEvent?: (event: DepartmentEvent) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, onSelectEvent }) => {
  if (events.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Event History"
        description="No events recorded in the departmental timeline."
      />
    );
  }

  return (
    <div className="relative border-l border-border pl-6 space-y-6 ml-2">
      {events.map((event) => {
        const start = new Date(event.event_start_time);
        return (
          <div
            key={event.id}
            onClick={() => onSelectEvent?.(event)}
            className="relative group cursor-pointer"
          >
            <span className="absolute -left-7.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs transition-all group-hover:border-primary/50">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Badge variant="outline" className="text-2xs capitalize">
                  {event.event_type.replace("_", " ")}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  <span>{start.toLocaleDateString()}</span>
                </span>
              </div>

              <h5 className="font-semibold text-sm text-foreground group-hover:text-primary">
                {event.title}
              </h5>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {event.description}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
