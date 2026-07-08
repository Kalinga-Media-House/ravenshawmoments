// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/publications/PublicationList.tsx
// Purpose   : Grid layout for departmental magazines and research publications
// =============================================================================

import React from "react";
import { DepartmentPublication } from "@/types/department";
import { PublicationCard } from "./PublicationCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface PublicationListProps {
  publications: DepartmentPublication[];
  onDownloadPublication?: (publication: DepartmentPublication) => void;
}

export const PublicationList: React.FC<PublicationListProps> = ({
  publications,
  onDownloadPublication,
}) => {
  if (publications.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Publications Available"
        description="There are currently no annual magazines, brochures, or publications available."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <PublicationCard
          key={pub.id}
          publication={pub}
          onDownload={onDownloadPublication}
        />
      ))}
    </div>
  );
};
