import React from "react";

export const OrganizationEmptyState = ({ title, description }: { title: string, description?: string }) => {
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1 text-gray-500">{description}</p>}
    </div>
  );
};
