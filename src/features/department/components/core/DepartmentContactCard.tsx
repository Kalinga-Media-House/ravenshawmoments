// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/core/DepartmentContactCard.tsx
// Purpose   : Official department contact details card
// =============================================================================

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Department } from "@/types/department";

export interface DepartmentContactCardProps {
  department: Department;
}

export const DepartmentContactCard: React.FC<DepartmentContactCardProps> = ({ department }) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Official Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {department.contact_email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Email Address</p>
              <a
                href={`mailto:${department.contact_email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {department.contact_email}
              </a>
            </div>
          </div>
        )}

        {department.contact_phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Office Telephone</p>
              <a
                href={`tel:${department.contact_phone}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {department.contact_phone}
              </a>
            </div>
          </div>
        )}

        {department.office_location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Campus Location</p>
              <p className="text-muted-foreground">{department.office_location}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
