import React from "react";

export const OrganizationStats = ({ totalMembers, activeEvents }: { totalMembers: number, activeEvents: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">Total Members</p>
        <p className="text-2xl font-bold">{totalMembers}</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">Active Events</p>
        <p className="text-2xl font-bold">{activeEvents}</p>
      </div>
    </div>
  );
};
