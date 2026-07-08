import React from "react";
import { OrganizationEvent } from "@/types/organization";

export const OrganizationEvents = ({ events }: { events: OrganizationEvent[] }) => {
  if (!events || events.length === 0) return <p className="text-gray-500">No events found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.venue}</p>
            <p className="text-sm text-gray-600">Start: {new Date(event.start_time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
