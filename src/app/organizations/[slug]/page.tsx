
export const revalidate = 3600;
import React from "react";
import { notFound } from "next/navigation";
import { OrganizationHeader, OrganizationBanner, OrganizationHistory } from "@/features/organization/components";

export default async function OrganizationProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1>Organization Profile: {resolvedParams.slug}</h1>
    </div>
  );
}
