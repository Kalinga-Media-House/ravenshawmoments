import React from "react";
import { OrganizationNotice } from "@/types/organization";
import { NoticeList } from "@/features/shared";

export const OrganizationNotices = ({ notices }: { notices: OrganizationNotice[] }) => {
  if (!notices || notices.length === 0) return <p className="text-gray-500">No notices found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Notices</h2>
      <NoticeList notices={notices as any} />
    </div>
  );
};
