// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/notices/NoticeList.tsx
// Purpose   : Stacked list layout for departmental notices and circulars
// =============================================================================

import React from "react";
import { DepartmentNotice } from "@/types/department";
import { NoticeCard } from "./NoticeCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface NoticeListProps {
  notices: DepartmentNotice[];
  onSelectNotice?: (notice: DepartmentNotice) => void;
}

export const NoticeList: React.FC<NoticeListProps> = ({ notices, onSelectNotice }) => {
  if (notices.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Notices Available"
        description="There are currently no published circulars or notices for this department."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onClick={() => onSelectNotice?.(notice)}
        />
      ))}
    </div>
  );
};
