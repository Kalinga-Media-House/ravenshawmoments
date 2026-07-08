import React from "react";
import Image from "next/image";
import { Organization } from "@/types/organization";

export const OrganizationBanner = ({ organization }: { organization: Organization }) => {
  if (!organization.cover_image_url) return null;
  return (
    <div className="w-full h-64 overflow-hidden rounded-lg mb-6 relative bg-gray-100">
      <Image 
        src={organization.cover_image_url} 
        alt={organization.name} 
        fill
        className="object-cover" 
        priority
      />
    </div>
  );
};
