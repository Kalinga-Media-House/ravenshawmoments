// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelHistory.tsx
// Purpose   : Heritage and historical narrative display for Hostel profile
// =============================================================================

import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface HostelHistoryProps {
  description?: string;
  history?: string;
}

export const HostelHistory: React.FC<HostelHistoryProps> = ({ description, history }) => {
  if (!description && !history) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
        <CardTitle className="text-lg font-semibold tracking-tight">
          About & Heritage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {description && <p className="text-foreground">{description}</p>}
        {history && (
          <div className="border-t border-border pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Historical Overview
            </h4>
            <p className="whitespace-pre-line">{history}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
