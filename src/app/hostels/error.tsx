// =============================================================================
// Ravenshaw Moments — Hostels Directory Error Boundary
// =============================================================================

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function HostelsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-xl">
      <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl border border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">
          Failed to load hostels
        </h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "An error occurred while loading the hostel directory."}
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try Again
        </Button>
      </div>
    </main>
  );
}
