import React from "react";
import { OrganizationPublication } from "@/types/organization";
import { PublicationList } from "@/features/shared";

export const OrganizationPublications = ({ publications }: { publications: OrganizationPublication[] }) => {
  if (!publications || publications.length === 0) return <p className="text-gray-500">No publications found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Publications</h2>
      <PublicationList publications={publications as any} />
    </div>
  );
};
