import React from "react";
import { OrganizationGalleryItem } from "@/types/organization";
import { Gallery } from "@/features/shared";

export const OrganizationGallery = ({ items }: { items: OrganizationGalleryItem[] }) => {
  if (!items || items.length === 0) return <p className="text-gray-500">No gallery items found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Gallery</h2>
      <Gallery items={items as any} />
    </div>
  );
};
