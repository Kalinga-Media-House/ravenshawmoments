import React from "react";
import { OrganizationGalleryItem } from "@/types/organization";

export const OrganizationGallery = ({ items }: { items: OrganizationGalleryItem[] }) => {
  if (!items || items.length === 0) return <p className="text-gray-500">No gallery items found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="w-full aspect-square overflow-hidden rounded-lg">
            {item.media_type === "image" ? (
              <img src={item.media_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">Video</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
