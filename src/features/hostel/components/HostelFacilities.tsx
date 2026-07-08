// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelFacilities.tsx
// Purpose   : Grid displaying hostel facilities and amenities
// =============================================================================

import React from "react";
import { CheckCircle, ShieldAlert, Utensils, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HostelFacility } from "@/types/hostel";

export interface HostelFacilitiesProps {
  facilities: HostelFacility[];
}

export const HostelFacilities: React.FC<HostelFacilitiesProps> = ({ facilities }) => {
  if (!facilities || facilities.length === 0) return null;

  const getCategoryIcon = (category?: HostelFacility["category"]) => {
    switch (category) {
      case "security":
        return <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />;
      case "dining":
        return <Utensils className="h-5 w-5 text-primary" aria-hidden="true" />;
      case "recreation":
        return <Wifi className="h-5 w-5 text-primary" aria-hidden="true" />;
      default:
        return <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Facilities & Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                {getCategoryIcon(fac.category)}
              </div>
              <span className="text-sm font-medium text-foreground">{fac.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
