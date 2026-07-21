import React from "react";
import { Metadata } from "next";
import { InnerPageHero } from "@/features/shared/components/InnerPageHero";
import { CompetitionsDirectory } from "@/features/competition";
import {
  getCompetitions,
  competitionResultService,
  CompetitionCategoryPortalService
} from "@/features/competition/services";

import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competitions | Ravenshaw Moments",
  description:
    "Discover university, department, and inter-university competitions at Ravenshaw University across academics, culture, debates, sports, and creative arts.",
  openGraph: {
    title: "Competitions | Ravenshaw Moments",
    description:
      "Explore open competitions, eligibility rules, registration deadlines, and opportunities to showcase talent across Ravenshaw University.",
    type: "website",
  },
};

export default async function CompetitionsPage() {
  const categoriesPromise = CompetitionCategoryPortalService.getActiveCategories();

  const [competitions, leaderboard, champion, winners, categories] = await Promise.all([
    getCompetitions().catch((err) => {
      console.error("[CompetitionsPage] Error fetching competitions:", err);
      return [];
    }),
    competitionResultService.getGlobalLeaderboard(5, 0).catch((err) => {
      console.error("[CompetitionsPage] Error fetching leaderboard:", err);
      return [];
    }),
    competitionResultService.getChampionSpotlight().catch((err) => {
      console.error("[CompetitionsPage] Error fetching champion spotlight:", err);
      return null;
    }),
    competitionResultService.getWinnersGallery(5, 0).catch((err) => {
      console.error("[CompetitionsPage] Error fetching winners gallery:", err);
      return [];
    }),
    categoriesPromise, // Let errors propagate to the Next.js error boundary as mandated
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      <main className="flex-1 w-full pb-24 relative overflow-hidden">
        {/* Seamless Hero Section */}
        <InnerPageHero
          title="Ravenshaw Competitions"
          highlightedText="& Achievements"
          description="Discover competitions across academics, culture, debates, and creative excellence. Explore eligibility, track deadlines, and showcase your talent."
          eyebrow="SHOWCASE YOUR TALENT"
          backgroundImage={innerPageHeroImages.gallery}
          overlayGradient="linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.45))"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Competitions" },
          ]}
          primaryAction={{
            label: "Explore Competitions",
            href: "#competitions-directory-header",
          }}
          secondaryAction={{
            label: "View Achievements",
            href: "#hall-of-fame-section",
          }}
          compact
        />

        <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] mt-12 sm:mt-16">
          <CompetitionsDirectory
            competitions={competitions}
            categories={categories}
            leaderboard={leaderboard}
            champion={champion}
            winners={winners}
          />
        </div>
      </main>
    </div>
  );
}
