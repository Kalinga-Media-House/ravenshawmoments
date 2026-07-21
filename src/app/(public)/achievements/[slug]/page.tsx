import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ACHIEVEMENT_ITEMS, getAchievementBySlug } from "@/features/achievement/data/achievements";
import { AchievementDetails } from "@/features/achievement/components";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const achievement = getAchievementBySlug(resolvedParams.slug);

  if (!achievement) {
    return { title: "Achievement Not Found | Ravenshaw Moments" };
  }

  return {
    title: `${achievement.title} | Ravenshaw Moments`,
    description: achievement.shortDescription,
    openGraph: achievement.coverImage
      ? {
          title: `${achievement.title} | Ravenshaw Moments`,
          description: achievement.shortDescription,
          siteName: "Ravenshaw Moments",
          type: "article",
          images: [
            {
              url: achievement.coverImage,
              width: 1200,
              height: 630,
              alt: achievement.imageAlt || achievement.title,
            },
          ],
        }
      : {
          title: `${achievement.title} | Ravenshaw Moments`,
          description: achievement.shortDescription,
          siteName: "Ravenshaw Moments",
          type: "article",
        },
  };
}

export function generateStaticParams() {
  return ACHIEVEMENT_ITEMS.map((item) => ({
    slug: item.slug,
  }));
}

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const achievement = getAchievementBySlug(resolvedParams.slug);

  if (!achievement) {
    notFound();
  }

  // Calculate previous and next based on canonical order
  const currentIndex = ACHIEVEMENT_ITEMS.findIndex((item) => item.slug === achievement.slug);
  const prevAchievement = currentIndex > 0 ? ACHIEVEMENT_ITEMS[currentIndex - 1] : undefined;
  const nextAchievement =
    currentIndex < ACHIEVEMENT_ITEMS.length - 1
      ? ACHIEVEMENT_ITEMS[currentIndex + 1]
      : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full pt-28 pb-20">
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
          <AchievementDetails
            achievement={achievement}
            prevAchievement={prevAchievement}
            nextAchievement={nextAchievement}
          />
        </div>
      </main>
    </div>
  );
}
