import React from "react";
import { Metadata } from "next";
import {
  AboutHero,
  AboutWhy,
  AboutMissionVision,
  AboutPreservation,
  AboutHighlights,
  AboutStatement,
  AboutConnections,
  AboutSevenPillars,
  AboutPrivacy,
  AboutTransparency,
  AboutCTA,
  AboutClosing,
} from "@/features/about";

export const metadata: Metadata = {
  title: "About Ravenshaw Moments | Preserving Stories Across Generations",
  description:
    "Discover the mission, vision, values, and purpose of Ravenshaw Moments, a shared digital home created to preserve memories, journeys, achievements, events, and connections across generations of Ravenshawvians.",
  openGraph: {
    title: "About Ravenshaw Moments | Preserving Stories Across Generations",
    description:
      "Discover the mission, vision, values, and purpose of Ravenshaw Moments, a shared digital home created to preserve memories, journeys, achievements, events, and connections across generations of Ravenshawvians.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#171214]">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Our Story / Why We Exist */}
      <AboutWhy />

      {/* 3 & 4. Vision & Mission */}
      <AboutMissionVision />

      {/* 5. What is Ravenshaw Moments */}
      <AboutPreservation />

      {/* 6. Platform Highlights (Live Database Counters) */}
      <AboutHighlights />

      {/* 7. Why Ravenshaw Moments (Core Feature Grid & Statement) */}
      <AboutStatement />

      {/* 8. Platform Features (Comprehensive Grid & Ecosystem Map) */}
      <AboutConnections />

      {/* ⭐ Seven Pillars of Ravenshaw Legacy (Foundation Values) */}
      <AboutSevenPillars />

      {/* Trust, Privacy & Independence Disclaimers */}
      <AboutPrivacy />
      <AboutTransparency />

      {/* Join The Journey (Call to Action) */}
      <AboutCTA />

      {/* Footer Quote & Reflection */}
      <AboutClosing />
    </div>
  );
}
