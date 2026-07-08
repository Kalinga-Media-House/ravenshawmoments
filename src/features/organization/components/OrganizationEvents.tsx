import React from "react";
import { OrganizationEvent } from "@/types/organization";
import { EventList } from "@/features/shared";

export const OrganizationEvents = ({ events }: { events: OrganizationEvent[] }) => {
  if (!events || events.length === 0) return <p className="text-gray-500">No events found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      <EventList events={events as any} />
    </div>
  );
};
