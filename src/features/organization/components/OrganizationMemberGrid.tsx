import React from "react";
import { OrganizationMember } from "@/types/organization";

export const OrganizationMemberGrid = ({ members }: { members: OrganizationMember[] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m.id} className="p-4 border rounded-lg">
            <p className="font-semibold">{m.profile_id}</p>
            <p className="text-sm text-gray-500">{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
