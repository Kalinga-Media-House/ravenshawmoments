import React from "react";
import { Organization } from "@/types/organization";

export const OrganizationHeader = ({ organization }: { organization: Organization }) => {
  return (
    <header className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{organization.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{organization.description || "No description provided."}</p>
    </header>
  );
};
