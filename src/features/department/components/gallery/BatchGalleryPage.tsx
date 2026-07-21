"use client";

import React from "react";
import { MinimalGalleryGrid } from "@/features/department/components/gallery/MinimalGalleryGrid";
import { GalleryHeader } from "@/features/department/components/gallery/GalleryHeader";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BatchGalleryPageProps {
  slug: string;
  galleryType: "freshers" | "farewell";
  level: "ug" | "pg";
  batch: string;
}

export const BatchGalleryPage: React.FC<BatchGalleryPageProps> = ({
  slug,
  galleryType,
  level,
  batch
}) => {
  const departmentName = slug.replace(/-/g, " ");
  
  // Clean string parsing
  const cleanBatch = decodeURIComponent(batch);
  const titlePrefix = level === "ug" ? "UG" : "PG";
  const galleryTitle = galleryType.charAt(0).toUpperCase() + galleryType.slice(1);
  const fullTitle = `${titlePrefix} ${galleryTitle} Gallery`;

  // Mock static photos to demonstrate scale
  const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
    id: `photo-${galleryType}-${level}-${batch}-${i}`,
    title: `Batch ${cleanBatch} ${galleryTitle} Celebration Moments`,
    imageUrl: `/images/competitions/culture-default.webp`, // Placeholder for realistic campus events
    category: galleryType,
    date: `Sep ${15 + (i % 5)}, ${cleanBatch.substring(0,4)}` // Use the start year of the batch
  }));

  // Simulating permissions and limits
  const currentPhotoCount = 83; // As requested in the prompt
  const maxPhotos = 100;
  
  // Real implementation would check user session role here
  // const { user } = useSession();
  // const isCR = user.role === "CR" && user.batch === cleanBatch;
  // const isAdmin = user.role === "Admin";
  const canUpload = true; // Simulating CR/Admin access for demonstration

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] pt-8 pb-16">
      <nav className="flex items-center text-xs sm:text-sm font-medium text-[#7A7476] mb-8">
        <Link href={`/departments/${slug}/gallery`} className="hover:text-[#5B001B] transition-colors">Department Gallery</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-[#EADFCF] shrink-0" />
        <Link href={`/departments/${slug}/gallery/${galleryType}`} className="hover:text-[#5B001B] transition-colors">{galleryTitle}</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-[#EADFCF] shrink-0" />
        <span className="text-[#1E1B1C]">{titlePrefix} Batch {cleanBatch}</span>
      </nav>
      <GalleryHeader
        title={fullTitle}
        subtitle={`Batch ${cleanBatch}`}
        photoCount={currentPhotoCount}
        maxPhotos={maxPhotos}
        showUpload={canUpload}
      />
      
      <MinimalGalleryGrid
        photos={mockPhotos}
        departmentName={departmentName}
      />
    </div>
  );
};
