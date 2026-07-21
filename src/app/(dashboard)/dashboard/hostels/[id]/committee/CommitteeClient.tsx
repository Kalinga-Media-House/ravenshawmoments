"use client";

import React, { useState } from "react";
import { removeCommitteeMemberAction } from "@/app/actions/hostel/committeeActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CommitteeClient({ hostelId, initialMembers }: { hostelId: string, initialMembers: any[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    setIsLoading(true);
    const res = await removeCommitteeMemberAction(id, hostelId);
    if (res.success) toast.success("Member removed");
    else toast.error(res.message);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-900">Name</th>
            <th className="p-4 font-semibold text-gray-900">Role</th>
            <th className="p-4 font-semibold text-gray-900">Status</th>
            <th className="p-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialMembers.map(m => (
            <tr key={m.id}>
              <td className="p-4">
                <div className="font-semibold text-gray-900">
                  {m.profile ? `${m.profile.first_name} ${m.profile.last_name}` : 'Unknown Profile'}
                </div>
              </td>
              <td className="p-4 capitalize">{m.role.replace(/_/g, ' ')}</td>
              <td className="p-4 capitalize">{m.status}</td>
              <td className="p-4">
                <Button size="sm" variant="destructive" onClick={() => handleRemove(m.id)} disabled={isLoading}>Remove</Button>
              </td>
            </tr>
          ))}
          {initialMembers.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-gray-500">No committee members active.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
