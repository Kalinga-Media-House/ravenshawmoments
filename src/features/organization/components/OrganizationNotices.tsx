import React from "react";
import { OrganizationNotice } from "@/types/organization";

export const OrganizationNotices = ({ notices }: { notices: OrganizationNotice[] }) => {
  if (!notices || notices.length === 0) return <p className="text-gray-500">No notices found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Notices</h2>
      <div className="space-y-4">
        {notices.map(notice => (
          <div key={notice.id} className="p-4 border rounded-lg border-l-4 border-l-blue-500">
            <h3 className="font-semibold text-lg">{notice.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
