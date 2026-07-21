import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import {
  CategoryHero,
  CategoryActiveCompetitionCard,
  CategoryWinnersGallery,
  CategoryWinnersArchive,
  CategoryLeaderboardSection
} from "@/features/competition";
import { CompetitionCategoryPortalService } from "@/features/competition/services/competitionCategoryPortalService";

export const revalidate = 3600;
export const dynamicParams = true;

export interface CategoryPortalPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data } = await supabase
    .from("competition_categories")
    .select("slug")
    .eq("is_active", true);

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row) => ({
    categorySlug: row.slug
  }));
}

export async function generateMetadata({
  params
}: CategoryPortalPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await CompetitionCategoryPortalService.getCategoryBySlug(
    resolvedParams.categorySlug
  );

  if (!category) {
    return {
      title: "Category Not Found | Ravenshaw Moments",
      description: "The requested competition category could not be found."
    };
  }

  return {
    title: `${category.name} Competitions | Ravenshaw Moments`,
    description:
      category.description ||
      `Official portal for ${category.name} competitions, active registration opportunities, monthly published winners, historical archives, and category leaderboards at Ravenshaw University.`,
    openGraph: {
      title: `${category.name} Competitions | Ravenshaw Moments`,
      description:
        category.description ||
        `Explore ${category.name} competitions, live registrations, and past winners at Ravenshaw University.`,
      siteName: "Ravenshaw Moments",
      type: "website",
      url: `https://ravenshawmoments.edu.in/competitions/categories/${category.slug}`
    }
  };
}

export default async function CompetitionCategoryPortalPage({
  params,
  searchParams
}: CategoryPortalPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const category = await CompetitionCategoryPortalService.getCategoryBySlug(
    resolvedParams.categorySlug
  );

  if (!category || !category.is_active) {
    notFound();
  }

  // Parse archive search parameters safely
  const rawYear = resolvedSearchParams.year
    ? Array.isArray(resolvedSearchParams.year)
      ? resolvedSearchParams.year[0]
      : resolvedSearchParams.year
    : undefined;
  const yearNumber = rawYear ? parseInt(rawYear, 10) : undefined;
  const validYear = yearNumber && !isNaN(yearNumber) && yearNumber > 1900 && yearNumber <= 2100 ? yearNumber : undefined;

  const rawMonth = resolvedSearchParams.month
    ? Array.isArray(resolvedSearchParams.month)
      ? resolvedSearchParams.month[0]
      : resolvedSearchParams.month
    : undefined;
  const monthNumber = rawMonth ? parseInt(rawMonth, 10) : undefined;
  const validMonth = monthNumber && !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12 ? monthNumber : undefined;

  const rawLevel = resolvedSearchParams.level
    ? Array.isArray(resolvedSearchParams.level)
      ? resolvedSearchParams.level[0]
      : resolvedSearchParams.level
    : undefined;
  const validLevel = CompetitionCategoryPortalService.validateCanonicalLevel(rawLevel);

  // Determine if we are querying the archive or the latest
  const isArchiveRequest = Boolean(validYear || validMonth || validLevel);
  let winnersEdition = null;

  if (isArchiveRequest) {
    const archiveResponse = await CompetitionCategoryPortalService.getCategoryWinnersArchive(
      category.id,
      {
        year: validYear,
        month: validMonth,
        level: validLevel
      }
    );
    winnersEdition = archiveResponse.edition;
  } else {
    winnersEdition = await CompetitionCategoryPortalService.getLatestCategoryWinners(category.id);
  }

  // Fetch data in parallel for the portal sections (that don't depend on each other)
  const [activeCompetition, leaderboardEntries] = await Promise.all([
    CompetitionCategoryPortalService.getActiveCompetitionForCategory(
      category.id,
      category.name
    ),
    CompetitionCategoryPortalService.getCategoryLeaderboard(category.id, 50)
  ]);

  return (
    <main className="min-h-screen bg-black text-white pb-24 pt-28">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8A1735]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#4A0E17]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section A: Category Hero */}
        <CategoryHero category={category} />

        {/* Section B: Active or Upcoming Competition Registration Card */}
        <section aria-labelledby="active-competition-heading">
          <h2 id="active-competition-heading" className="sr-only">
            Active and Upcoming Registration
          </h2>
          <Suspense fallback={<div className="h-48 w-full animate-pulse rounded-3xl bg-[#2B070E]/60 border border-[#8A1735]/30" />}>
            <CategoryActiveCompetitionCard
              competition={activeCompetition}
              categoryName={category.name}
            />
          </Suspense>
        </section>

        {/* Section C: Current Monthly Winners Gallery */}
        <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-3xl bg-[#2B070E]/40 border border-[#8A1735]/30" />}>
          <CategoryWinnersGallery
            edition={winnersEdition}
            categoryName={category.name}
          />
        </Suspense>

        {/* Section D: Previous Winners Archive Filter */}
        <section aria-labelledby="archive-filter-heading">
          <h2 id="archive-filter-heading" className="sr-only">
            Historical Winners Filter
          </h2>
          <CategoryWinnersArchive
            currentYear={validYear}
            currentMonth={validMonth}
            currentLevel={validLevel}
          />
        </section>

        {/* Section E: Category-Specific Leaderboard */}
        <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-3xl bg-[#2B070E]/40 border border-[#8A1735]/30" />}>
          <CategoryLeaderboardSection
            entries={leaderboardEntries}
            categoryName={category.name}
          />
        </Suspense>
      </div>
    </main>
  );
}
