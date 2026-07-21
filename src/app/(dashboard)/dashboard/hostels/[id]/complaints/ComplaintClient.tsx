"use client";

import React, { useState } from "react";
import { updateComplaintStatusAction } from "@/app/actions/hostel/complaintActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ComplaintClient({ hostelId, initialComplaints }: { hostelId: string, initialComplaints: any[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatus = async (id: string, status: string) => {
    setIsLoading(true);
    const res = await updateComplaintStatusAction(id, status, hostelId);
    if (res.success) toast.success("Status updated");
    else toast.error(res.message);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-900">Title & Desc</th>
            <th className="p-4 font-semibold text-gray-900">Category</th>
            <th className="p-4 font-semibold text-gray-900">Priority</th>
            <th className="p-4 font-semibold text-gray-900">Status</th>
            <th className="p-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialComplaints.map(c => (
            <tr key={c.id}>
              <td className="p-4">
                <div className="font-semibold text-gray-900">{c.title}</div>
                <div className="text-gray-500 text-xs mt-1 max-w-xs truncate">{c.description}</div>
              </td>
              <td className="p-4 capitalize">{c.category}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {c.priority}
                </span>
              </td>
              <td className="p-4 capitalize">{c.status}</td>
              <td className="p-4 flex gap-2">
                {c.status !== 'resolved' && (
                  <>
                    <Button size="sm" variant="outline" disabled={isLoading} onClick={() => handleStatus(c.id, 'in_progress')}>In Progress</Button>
                    <Button size="sm" onClick={() => handleStatus(c.id, 'resolved')} disabled={isLoading}>Resolve</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {initialComplaints.length === 0 && (
            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No complaints found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
