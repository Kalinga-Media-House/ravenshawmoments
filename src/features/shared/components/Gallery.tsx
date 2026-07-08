import React from "react";
import Image from "next/image";
import { SharedGalleryItem } from "../gallery";

export const Gallery = ({ items }: { items: SharedGalleryItem[] }) => {
  if (!items || items.length === 0) return <p className="text-gray-500">No gallery items found.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id} className="w-full aspect-square overflow-hidden rounded-lg relative bg-gray-100 dark:bg-gray-800">
          <Image 
            src={item.media_url} 
            alt={item.title || item.caption || "Gallery image"} 
            fill
            className="object-cover hover:scale-105 transition-transform duration-300" 
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
};
