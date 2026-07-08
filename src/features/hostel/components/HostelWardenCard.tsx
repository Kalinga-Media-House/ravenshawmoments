// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelWardenCard.tsx
// Purpose   : Incumbent Warden Profile Card
// =============================================================================

import React from "react";
import { Shield, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HostelWarden } from "@/types/hostel";

export interface HostelWardenCardProps {
  warden: HostelWarden;
}

export const HostelWardenCard: React.FC<HostelWardenCardProps> = ({ warden }) => {
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/5 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-base font-semibold">Incumbent Warden</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{warden.name}</h3>
          <p className="text-xs font-medium text-primary">{warden.designation}</p>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          {warden.office_location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{warden.office_location}</span>
            </div>
          )}
          {warden.contact_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{warden.contact_number}</span>
            </div>
          )}
          {warden.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{warden.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
