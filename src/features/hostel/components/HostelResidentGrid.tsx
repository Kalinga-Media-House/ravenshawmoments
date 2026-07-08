// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelResidentGrid.tsx
// Purpose   : Resident & Alumni Directory Grid
// =============================================================================

import React from "react";
import { User, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostelResident } from "@/types/hostel";

export interface HostelResidentGridProps {
  residents: HostelResident[];
}

export const HostelResidentGrid: React.FC<HostelResidentGridProps> = ({ residents }) => {
  if (!residents || residents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {residents.map((resident) => (
        <Card
          key={resident.id}
          className="overflow-hidden border-border transition-all hover:shadow-sm"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {resident.is_alumni ? (
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              ) : (
                <User className="h-5 w-5" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-semibold text-foreground truncate">
                  {resident.room_number ? `Room ${resident.room_number}` : "Resident"}
                </span>
                {resident.is_alumni && (
                  <Badge variant="outline" className="text-2xs">
                    Alumni
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Batch: {resident.batch_year}
              </p>
              {resident.department_name && (
                <p className="text-2xs text-muted-foreground truncate">
                  {resident.department_name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
