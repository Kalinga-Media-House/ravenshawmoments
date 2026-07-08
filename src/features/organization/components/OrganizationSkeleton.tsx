import React from "react";

export const OrganizationSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>)}
      </div>
    </div>
  );
};
