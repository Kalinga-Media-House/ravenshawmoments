import React from "react";
import { Metadata } from "next";
import { OrganizationsDirectory } from "@/features/organization/components";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";
import { listAllActiveOrganizationsAction } from "@/app/actions/organization";

export const metadata: Metadata = {
  title: "Organizations | Ravenshaw Moments",
  description: "Explore Ravenshaw student organizations, communities, service, leadership, creativity, activities, events, and shared memories.",
};

export const revalidate = 60; // Revalidate every minute instead of 3600

export default async function OrganizationsPage() {
  const res = await listAllActiveOrganizationsAction();
  const organizations = res.success && res.data ? res.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Beyond Classrooms"
        eyebrow="Student Communities"
        description="Discover communities where students serve, lead, create, collaborate, celebrate, and build experiences that become part of their Ravenshaw journey."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Organizations" }
        ]}
        backgroundImage={innerPageHeroImages.organizations}
      />

      {/* Directory Application */}
      <OrganizationsDirectory organizations={organizations} />
    </div>
  );
}
