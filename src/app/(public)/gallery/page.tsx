import React from "react";
import { Metadata } from "next";
import { GalleryDirectory } from "@/features/gallery/components";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Gallery | Ravenshaw Moments",
  description: "Explore Ravenshaw memories, celebrations, achievements, friendships, events, organizations, hostels, departments, and campus life preserved across generations.",
};

export const revalidate = 3600;

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Every Moment Has a Story"
        eyebrow="Memories Across Generations"
        description="Explore the memories, celebrations, achievements, friendships, and everyday moments that continue to shape the story of Ravenshaw."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" }
        ]}
        backgroundImage={innerPageHeroImages.gallery}
      >
        {/* Dynamic Gallery Summary based on our 5 canonical items */}
        <div className="flex flex-wrap items-center gap-4 text-[#E9B936] text-sm font-bold">
          <span className="bg-[#E9B936]/10 px-4 py-2 rounded-full border border-[#E9B936]/20">
            5 Memories Preserved
          </span>
          <span className="bg-[#E9B936]/10 px-4 py-2 rounded-full border border-[#E9B936]/20">
            2 Communities Represented
          </span>
        </div>
      </InnerPageHero>

      {/* Directory Application */}
      <GalleryDirectory />
    </div>
  );
}
