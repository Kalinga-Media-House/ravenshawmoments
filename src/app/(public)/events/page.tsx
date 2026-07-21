import React from "react";
import { Metadata } from "next";
import { EventsDirectory } from "@/features/event/components";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Events | Ravenshaw Moments",
  description: "Discover upcoming and past Ravenshaw events, celebrations, competitions, academic programmes, cultural activities, and community experiences.",
};

export const revalidate = 3600;

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Moments That Bring Us Together"
        eyebrow="CAMPUS EVENTS"
        description="From academic seminars and cultural celebrations to competitions, reunions, hostel functions, and student activities, discover the events that shape life at Ravenshaw and preserve memories for generations."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events" }
        ]}
        backgroundImage={innerPageHeroImages.events}
      />

      {/* Directory Application */}
      <EventsDirectory />
    </div>
  );
}
