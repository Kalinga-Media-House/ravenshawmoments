"use client";

import React, { useState } from "react";
import { deleteNoticeAction } from "@/app/actions/hostel/noticeActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pin } from "lucide-react";

export function NoticeClient({ hostelId, initialNotices }: { hostelId: string, initialNotices: any[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete notice?")) return;
    setIsLoading(true);
    const res = await deleteNoticeAction(id, hostelId);
    if (res.success) toast.success("Notice deleted");
    else toast.error(res.message);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-900">Title</th>
            <th className="p-4 font-semibold text-gray-900">Status</th>
            <th className="p-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialNotices.map(n => (
            <tr key={n.id}>
              <td className="p-4">
                <div className="font-semibold text-gray-900 flex items-center">
                  {n.is_pinned && <Pin className="w-4 h-4 mr-2 text-indigo-500" />}
                  {n.title}
                </div>
                <div className="text-gray-500 text-xs mt-1 truncate max-w-sm">{n.content}</div>
              </td>
              <td className="p-4 capitalize">{n.status}</td>
              <td className="p-4">
                <Button size="sm" variant="destructive" onClick={() => handleDelete(n.id)} disabled={isLoading}>Delete</Button>
              </td>
            </tr>
          ))}
          {initialNotices.length === 0 && (
            <tr><td colSpan={3} className="p-4 text-center text-gray-500">No notices found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
