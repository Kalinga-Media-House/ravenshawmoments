// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/components/PaginationBar.tsx
// Purpose   : Shared Platform Layer — Reusable Accessible Pagination Controls
// =============================================================================

import React from "react";
import { Button } from "@/components/ui/button";

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-between py-4 ${className}`}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <div className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
