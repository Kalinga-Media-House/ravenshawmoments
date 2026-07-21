import React from "react";
import { HeroSlider, HeroScrollDown, HeroLegacySection, HeroDepartmentsSection, HeroHostelSection, JoinCommunitySection, OrganizationsShowcaseSection, LatestMemoriesSection, UpcomingEventsSection, AchievementsStoriesSection, NewsPublicationsSection, InstitutionalIdentityBanner, HomepageDisclaimerTicker } from "@/features/shared/components";

export default async function PublicHomepage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        id="hero-section"
        className="relative w-full flex flex-col items-center justify-center overflow-hidden -mt-[72px] pt-[72px] sm:-mt-[76px] sm:pt-[76px] min-[1150px]:-mt-20 min-[1150px]:pt-20"
        style={{ minHeight: "100dvh" }}
      >
        <HeroSlider />


        <HeroScrollDown />

        {/* Disclaimer Ticker */}
        <HomepageDisclaimerTicker />
      </section>

      {/* Institutional Identity Banner */}
      <InstitutionalIdentityBanner />

      {/* Legacy Section */}
      <HeroLegacySection />

      {/* Departments Section */}
      <HeroDepartmentsSection />

      {/* Hostels Section */}
      <HeroHostelSection />

      {/* Organizations Section */}
      <OrganizationsShowcaseSection />

      {/* Gallery Section */}
      <LatestMemoriesSection />

      {/* Events Section */}
      <UpcomingEventsSection />

      {/* Achievements Section */}
      <AchievementsStoriesSection />

      {/* News & Publications Section */}
      <NewsPublicationsSection />

      {/* Join Community Section */}
      <JoinCommunitySection />
    </div>
  );
}