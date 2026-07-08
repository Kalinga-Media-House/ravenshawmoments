import React from "react";
import { OrganizationMember } from "@/types/organization";

export const OrganizationOfficeBearers = ({ bearers }: { bearers: OrganizationMember[] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Office Bearers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bearers.map(m => (
          <div key={m.id} className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="font-semibold">{m.profile_id}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">{m.designation || m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
