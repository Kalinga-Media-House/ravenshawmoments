import React from "react";
import { OrganizationAdvisor } from "@/types/organization";

export const OrganizationAdvisorCard = ({ advisor }: { advisor: OrganizationAdvisor }) => {
  return (
    <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-900/20 mb-8">
      <h3 className="text-lg font-bold">Faculty Advisor</h3>
      <p className="mt-2 font-medium">{advisor.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{advisor.designation}</p>
    </div>
  );
};
