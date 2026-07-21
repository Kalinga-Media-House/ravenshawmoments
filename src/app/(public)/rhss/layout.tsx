import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ravenshaw Higher Secondary School | Ravenshaw Moments",
  description: "Preserving the memories, friendships, achievements, and journeys of Ravenshaw's +2 students.",
  openGraph: {
    title: "Ravenshaw Higher Secondary School (RHSS) Directory",
    description: "Explore the legacy, alumni, and current students of the Arts, Science, and Commerce streams at RHSS.",
    url: "https://ravenshawmoments.com/rhss",
    siteName: "Ravenshaw Moments",
    type: "website",
  },
};

export default function RhssLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {children}
    </div>
  );
}
