// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/shared/DepartmentErrorCard.tsx
// Purpose   : Reusable error state UI component for Department modules
// =============================================================================

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DepartmentErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const DepartmentErrorCard: React.FC<DepartmentErrorCardProps> = ({
  title = "Unable to load department data",
  message = "An error occurred while communicating with the server. Please check your connection and try again.",
  onRetry,
}) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-destructive/30 bg-destructive/5 text-destructive-foreground shadow-xs"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
