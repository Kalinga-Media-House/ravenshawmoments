import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCompetitionBySlug,
  computeCompetitionStatus,
  computeRegistrationStatus,
  getRelatedCompetitions,
  getPreviousCompetition,
  getNextCompetition,
  CompetitionDetails,
  RelatedCompetitions,
} from "@/features/competition";
import { 
  CompetitionSponsors, 
  CompetitionAnnouncements, 
  CompetitionJudges 
} from "@/features/competition/components";
import { InnerPageHero } from "@/features/shared/components/InnerPageHero";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";

export interface CompetitionPageProps {
  params: Promise<{ slug: string }>;
}



export async function generateMetadata({
  params,
}: CompetitionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const competition = await getCompetitionBySlug(resolvedParams.slug);

  if (!competition) {
    return {
      title: "Competition Not Found | Ravenshaw Moments",
      description: "The requested competition opportunity could not be found.",
    };
  }

  return {
    title: `${competition.title} | Ravenshaw Moments`,
    description: competition.shortDescription,
    openGraph: {
      title: `${competition.title} | Ravenshaw Moments`,
      description: competition.shortDescription,
      siteName: "Ravenshaw Moments",
      type: "article",
      url: `https://ravenshawmoments.edu.in/competitions/${competition.slug}`,
      images: [
        {
          url: competition.coverImage || "",
          width: 1200,
          height: 630,
          alt: competition.imageAlt || "",
        },
      ],
    },
  };
}

export default async function CompetitionDetailPage({
  params,
}: CompetitionPageProps) {
  const resolvedParams = await params;
  const competition = await getCompetitionBySlug(resolvedParams.slug);

  if (!competition) {
    notFound();
  }

  const compStatus = computeCompetitionStatus(competition);
  const regStatus = computeRegistrationStatus(competition);

  const formattedStartDate = new Date(competition.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedDeadline = competition.registrationDeadline
    ? new Date(competition.registrationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isInvalidImage =
    !competition.coverImage ||
    competition.coverImage.includes("unsplash.com") ||
    competition.coverImage.includes("placeholder");

  // Resolution Order: 1. uploaded, 2. category fallback, 3. generic fallback
  const displayImage =
    !isInvalidImage && competition.coverImage?.trim()
      ? competition.coverImage
      : "/images/competitions/hero-competition.webp";

  // Check if logged-in user is authorized administrator for this competition
  const supabase = await createClient();
  // @ts-ignore
  const { data: isAdmin } = await supabase.rpc("is_competition_admin", {
    p_competition_id: competition.id,
  });

  // Navigation and Related via bounded queries
  const related = await getRelatedCompetitions(
    competition.categoryId,
    competition.id,
    competition.level,
    3
  );

  const prevCompetition = await getPreviousCompetition(
    competition.startsAt,
    competition.id
  );

  const nextCompetition = await getNextCompetition(
    competition.startsAt,
    competition.id
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full pb-24 relative overflow-hidden" style={{ background: '#FFF9F5' }}>
        {/* Seamless Hero Section */}
        <InnerPageHero
          title={competition.title}
          description={competition.shortDescription}
          eyebrow={`${compStatus} • ${competition.category} • ${competition.level} Level`}
          backgroundImage={displayImage}
          overlayGradient="linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.38))"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Competitions", href: "/competitions" },
            { label: competition.title },
          ]}
          compact
        />

        {/* Ambient Dark Heritage Backlighting */}
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center_left,var(--color-rm-maroon)_0%,transparent_65%)] opacity-[0.08] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] mt-8 sm:mt-12 space-y-6">
          {isAdmin && (
            <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-stone-800">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-stone-200">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Authorized Admin: You can manage participant evaluations and official results for this competition.</span>
              </div>
              <Link
                href={`/admin/competitions/${competition.id}/results`}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
              >
                Manage Results
              </Link>
            </div>
          )}

          {/* Master Competition Details Assembly */}
          <CompetitionDetails competition={competition} />
          
          {/* New Submodules Components */}
          <CompetitionAnnouncements competitionId={competition.id} />
          <CompetitionJudges competitionId={competition.id} />
          <CompetitionSponsors competitionId={competition.id} />

          <RelatedCompetitions
            currentCompetition={competition}
            related={related}
            prevCompetition={prevCompetition}
            nextCompetition={nextCompetition}
          />
        </div>
      </main>
    </div>
  );
}
