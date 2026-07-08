// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/events/UpcomingEvents.tsx
// Purpose   : Grid showcase of upcoming departmental academic/cultural events
// =============================================================================

import React from "react";
import { DepartmentEvent } from "@/types/department";
import { EventCard } from "./EventCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface UpcomingEventsProps {
  events: DepartmentEvent[];
  onSelectEvent?: (event: DepartmentEvent) => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onSelectEvent }) => {
  if (events.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Upcoming Events"
        description="There are currently no upcoming seminars, workshops, or events scheduled."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => onSelectEvent?.(event)}
        />
      ))}
    </div>
  );
};
