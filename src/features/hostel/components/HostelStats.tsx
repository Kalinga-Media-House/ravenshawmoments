// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelStats.tsx
// Purpose   : Statistical highlight metrics for Hostel landing and dashboard pages
// =============================================================================

import React from "react";
import { Users, Shield, BedDouble, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface HostelStatsProps {
  roomTypesCount: number;
  facilitiesCount: number;
  residentsCount?: number;
  wardenName?: string;
}

export const HostelStats: React.FC<HostelStatsProps> = ({
  roomTypesCount,
  facilitiesCount,
  residentsCount = 0,
  wardenName,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          <BedDouble className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold tracking-tight text-foreground">{roomTypesCount}</p>
          <p className="text-xs text-muted-foreground">Room Types</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold tracking-tight text-foreground">{facilitiesCount}</p>
          <p className="text-xs text-muted-foreground">Facilities</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          <Users className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold tracking-tight text-foreground">{residentsCount}</p>
          <p className="text-xs text-muted-foreground">Verified Residents</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          <Shield className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground line-clamp-1">
            {wardenName || "Assigned"}
          </p>
          <p className="text-xs text-muted-foreground">Warden Administration</p>
        </CardContent>
      </Card>
    </div>
  );
};
