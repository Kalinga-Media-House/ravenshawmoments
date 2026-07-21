import React from "react";
import { MinimalGalleryGrid } from "@/features/department/components/gallery/MinimalGalleryGrid";
import { GalleryHeader } from "@/features/department/components/gallery/GalleryHeader";
import { generateDepartmentMockData } from "@/features/department/data/mock-department-detail";

export default async function DepartmentGalleryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Clean name for display
  const departmentName = slug.replace(/-/g, " ");
  const mockData = generateDepartmentMockData(departmentName, slug, 1949, "Science");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <GalleryHeader
        title={`${departmentName} Department Gallery`}
        subtitle="Official archive of department buildings, laboratories, and campus moments."
        photoCount={mockData.gallery.length}
        maxPhotos={500}
        showUpload={false} // Department galleries are read-only for most users
      />
      
      <MinimalGalleryGrid
        photos={mockData.gallery}
        departmentName={departmentName}
      />
    </div>
  );
}
