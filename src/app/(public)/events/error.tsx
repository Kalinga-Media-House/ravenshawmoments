
"use client";
import React from "react";
import { AlertCircle } from "lucide-react";
import { EmptyStateCard } from "@/features/shared";

export default function EventFeedError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto py-24 px-4">
      <EmptyStateCard 
        icon={<AlertCircle className="w-8 h-8" />}
        title="Something went wrong"
        description="We couldn't load the feed. Please try again later."
        action={<button onClick={reset} className="px-4 py-2 bg-primary text-white rounded-md">Try Again</button>}
      />
    </div>
  );
}
