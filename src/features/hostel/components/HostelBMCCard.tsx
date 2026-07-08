// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelBMCCard.tsx
// Purpose   : Block Management Committee / Hostel Council Member Card
// =============================================================================

import React from "react";
import { Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostelBMC } from "@/types/hostel";

export interface HostelBMCCardProps {
  member: HostelBMC;
  profileName?: string;
}

export const HostelBMCCard: React.FC<HostelBMCCardProps> = ({
  member,
  profileName = "Council Representative",
}) => {
  const formatRoleTitle = (role: HostelBMC["role_title"]) => {
    switch (role) {
      case "general_secretary":
        return "General Secretary";
      case "mess_secretary":
        return "Mess Secretary";
      case "cultural_secretary":
        return "Cultural Secretary";
      case "sports_secretary":
        return "Sports Secretary";
      default:
        return "Executive Member";
    }
  };

  return (
    <Card className="overflow-hidden border-border transition-all hover:border-primary/40">
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Award className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">{profileName}</h4>
            <Badge
              variant={member.role_title === "general_secretary" ? "default" : "secondary"}
              className="text-2xs mt-1"
            >
              {formatRoleTitle(member.role_title)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 font-mono">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{member.term_year}</span>
        </div>
      </CardContent>
    </Card>
  );
};
