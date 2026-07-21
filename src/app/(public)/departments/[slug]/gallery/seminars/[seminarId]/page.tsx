import React from "react";
import { MinimalGalleryGrid } from "@/features/department/components/gallery/MinimalGalleryGrid";
import { GalleryHeader } from "@/features/department/components/gallery/GalleryHeader";

export default async function SeminarGalleryPage({
  params
}: {
  params: Promise<{ slug: string; seminarId: string }>
}) {
  const resolvedParams = await params;
  const { slug, seminarId } = resolvedParams;
  const departmentName = slug.replace(/-/g, " ");

  // Mock photos for the specific seminar
  const mockPhotos = Array.from({ length: 8 }).map((_, i) => ({
    id: `seminar-${seminarId}-photo-${i}`,
    title: `Seminar ${seminarId} Presentation ${i + 1}`,
    imageUrl: `/images/competitions/culture-default.webp`, 
    category: "Seminar",
    date: `October 12, 2026` 
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <GalleryHeader
        title={`Seminar ${seminarId.toUpperCase()}`}
        subtitle={`Official photo gallery for this seminar organized by the Department of ${departmentName}.`}
        photoCount={8}
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
