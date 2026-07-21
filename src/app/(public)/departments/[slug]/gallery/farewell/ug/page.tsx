import React from "react";
import { BatchGallerySelectorPage } from "@/features/department/components/gallery/BatchGallerySelectorPage";

export default async function FarewellUGGalleryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  
  return <BatchGallerySelectorPage slug={resolvedParams.slug} galleryType="farewell" level="ug" />;
}
