import React from "react";
import { Organization } from "@/types/organization";

export const OrganizationBanner = ({ organization }: { organization: Organization }) => {
  if (!organization.cover_image_url) return null;
  return (
    <div className="w-full h-64 overflow-hidden rounded-lg mb-6">
      <img src={organization.cover_image_url} alt={organization.name} className="w-full h-full object-cover" />
    </div>
  );
};
