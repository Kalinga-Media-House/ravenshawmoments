import React from "react";
import { SharedEventMetadata } from "../events";

export const EventList = ({ events }: { events: SharedEventMetadata[] }) => {
  if (!events || events.length === 0) return <p className="text-gray-500">No events found.</p>;
  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <p className="text-sm text-gray-500">{event.venue}</p>
          <p className="text-sm text-gray-600">Start: {new Date(event.start_time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
