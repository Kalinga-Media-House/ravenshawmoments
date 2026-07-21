import React from "react";
import { BatchGalleryPage } from "@/features/department/components/gallery/BatchGalleryPage";

export default async function FarewellPGGalleryBatchPage({
  params
}: {
  params: Promise<{ slug: string; batch: string }>
}) {
  const resolvedParams = await params;
  return <BatchGalleryPage slug={resolvedParams.slug} batch={resolvedParams.batch} galleryType="farewell" level="pg" />;
}
