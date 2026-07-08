"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/logger";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Error occurred in dashboard profile module", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard Profile Error</h1>
          <p className="text-sm text-muted-foreground">
            We encountered a technical issue loading your dashboard profile information. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            Try Again
          </Button>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-2xs transition-colors hover:bg-muted hover:text-foreground">
            Dashboard Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
