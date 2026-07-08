// =============================================================================
// Ravenshaw Moments — Hostels Not Found Page
// =============================================================================

import React from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function HostelsNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-4 max-w-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Building2 className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Hostel Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The hostel you are looking for may have been removed or does not exist.
      </p>
      <Link
        href="/hostels"
        className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-7 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground transition-all"
      >
        Browse All Hostels
      </Link>
    </main>
  );
}
