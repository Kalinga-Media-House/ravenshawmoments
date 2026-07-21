import React from "react";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const DonationHero: React.FC = () => {
  return (
    <InnerPageHero
      title="Support Ravenshaw Moments"
      eyebrow="Preserve the Legacy"
      description="Help preserve the memories, stories, achievements, events, and shared experiences that connect generations of Ravenshawvians."
      quote="Every contribution can help strengthen the digital home where Ravenshaw's moments are preserved, shared, and remembered."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Donations" },
      ]}
      backgroundImage={innerPageHeroImages.donations}
      primaryAction={{
        label: "Learn How Contributions Help",
        href: "#impact",
      }}
      secondaryAction={{
        label: "View Contributors",
        href: "#contributors",
      }}
    />
  );
};
