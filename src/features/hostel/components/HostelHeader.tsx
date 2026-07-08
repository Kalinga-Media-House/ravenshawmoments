// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelHeader.tsx
// Purpose   : Hostel Header displaying title, verification, sponsored tag & address
// =============================================================================

import React from "react";
import { BadgeCheck, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hostel } from "@/types/hostel";
import { StatusBadge } from "@/features/shared/components";

export interface HostelHeaderProps {
  hostel: Hostel;
  action?: React.ReactNode;
}

export const HostelHeader: React.FC<HostelHeaderProps> = ({ hostel, action }) => {
  const formatHostelType = (type: Hostel["hostel_type"]) => {
    switch (type) {
      case "university_boys":
        return "Boys' University Hostel";
      case "university_girls":
        return "Girls' University Hostel";
      case "private_sponsored":
        return "Sponsored Housing Hub";
      default:
        return "Hostel";
    }
  };

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {hostel.name}
          </h1>
          {hostel.is_verified && (
            <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified Hostel" />
          )}
          {hostel.is_sponsored && (
            <StatusBadge label="Featured Partner" variant="high" />
          )}
          <Badge variant="outline" className="text-xs font-medium">
            {formatHostelType(hostel.hostel_type)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>{hostel.address}</span>
          </span>
          {hostel.contact_number && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>{hostel.contact_number}</span>
            </span>
          )}
          {hostel.contact_email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{hostel.contact_email}</span>
            </span>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </header>
  );
};
