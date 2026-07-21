import React from "react";
import { MinimalGalleryGrid } from "@/features/department/components/gallery/MinimalGalleryGrid";
import { GalleryHeader } from "@/features/department/components/gallery/GalleryHeader";

export default async function EventGalleryPage({
  params
}: {
  params: Promise<{ slug: string; eventId: string }>
}) {
  const resolvedParams = await params;
  const { slug, eventId } = resolvedParams;
  const departmentName = slug.replace(/-/g, " ");

  // Mock photos for the specific event
  const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
    id: `event-${eventId}-photo-${i}`,
    title: `Event ${eventId} Highlight ${i + 1}`,
    imageUrl: `/images/competitions/culture-default.webp`, 
    category: "Event",
    date: `August 15, 2026` 
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <GalleryHeader
        title={`Event ${eventId.toUpperCase()}`}
        subtitle={`Official photo gallery for this event organized by the Department of ${departmentName}.`}
        photoCount={12}
        maxPhotos={500}
        showUpload={false} 
      />
      
      <MinimalGalleryGrid
        photos={mockPhotos}
        departmentName={departmentName}
      />
    </div>
  );
}
