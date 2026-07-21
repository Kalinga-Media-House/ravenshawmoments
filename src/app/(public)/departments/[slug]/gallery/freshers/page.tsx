import React from "react";
import { BatchGalleryLevelCards } from "@/features/department/components/gallery/BatchGalleryLevelCards";
import { SectionHeader } from "@/features/department/components/detail/common";

export default async function FreshersGalleryLandingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const departmentName = slug.replace(/-/g, " ");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <SectionHeader
        title="Freshers Celebrations"
        subtitle={`Welcome ceremonies and freshers party memories for the Department of ${departmentName}.`}
      />
      
      <BatchGalleryLevelCards slug={slug} galleryType="freshers" />
    </div>
  );
}
