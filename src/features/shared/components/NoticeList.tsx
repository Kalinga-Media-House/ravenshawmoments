import React from "react";
import { SharedNoticeItem } from "../notices";

export const NoticeList = ({ notices }: { notices: SharedNoticeItem[] }) => {
  if (!notices || notices.length === 0) return <p className="text-gray-500">No notices found.</p>;
  return (
    <div className="space-y-4">
      {notices.map(notice => (
        <div key={notice.id} className="p-4 border rounded-lg border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-lg">{notice.title}</h3>
          <p className="text-sm text-gray-700 mt-2">{notice.content}</p>
        </div>
      ))}
    </div>
  );
};
