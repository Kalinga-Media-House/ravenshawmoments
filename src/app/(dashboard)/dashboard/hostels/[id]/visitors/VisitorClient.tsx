"use client";

import React, { useState } from "react";
import { updateVisitorStatusAction } from "@/app/actions/hostel/visitorActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function VisitorClient({ hostelId, initialVisitors }: { hostelId: string, initialVisitors: any[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatus = async (id: string, status: string) => {
    setIsLoading(true);
    const res = await updateVisitorStatusAction(id, status, hostelId);
    if (res.success) toast.success("Status updated");
    else toast.error(res.message);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-900">Visitor</th>
            <th className="p-4 font-semibold text-gray-900">Host (Student)</th>
            <th className="p-4 font-semibold text-gray-900">Status</th>
            <th className="p-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialVisitors.map(v => (
            <tr key={v.id}>
              <td className="p-4">
                <div className="font-semibold text-gray-900">{v.visitor_name}</div>
                <div className="text-gray-500 text-xs mt-1">{v.visitor_contact}</div>
                <div className="text-gray-400 text-xs mt-1">{v.purpose}</div>
              </td>
              <td className="p-4">
                {v.host_profile ? `${v.host_profile.first_name} ${v.host_profile.last_name}` : 'Unknown'}
              </td>
              <td className="p-4 capitalize">
                {v.status}
              </td>
              <td className="p-4 flex flex-wrap gap-2">
                {v.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => handleStatus(v.id, 'approved')} disabled={isLoading}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatus(v.id, 'rejected')} disabled={isLoading}>Reject</Button>
                  </>
                )}
                {v.status === 'approved' && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatus(v.id, 'checked_in')} disabled={isLoading}>Check In</Button>
                )}
                {v.status === 'checked_in' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus(v.id, 'checked_out')} disabled={isLoading}>Check Out</Button>
                )}
              </td>
            </tr>
          ))}
          {initialVisitors.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-gray-500">No visitors logged.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
