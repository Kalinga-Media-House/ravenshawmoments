import React from "react";
import { Organization } from "@/types/organization";

export const OrganizationHistory = ({ organization }: { organization: Organization }) => {
  if (!organization.vision && !organization.mission) return null;
  return (
    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Vision & Mission</h2>
      {organization.vision && <div className="mb-4"><strong>Vision:</strong> <p>{organization.vision}</p></div>}
      {organization.mission && <div><strong>Mission:</strong> <p>{organization.mission}</p></div>}
    </div>
  );
};
