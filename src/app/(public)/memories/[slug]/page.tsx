import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CANONICAL_MEMORIES } from "@/features/memory/data/memories";
import { MemoryDetails } from "@/features/memory/components/MemoryDetails";

export const revalidate = 3600;

function getApprovedMemoryBySlug(slug: string) {
  return CANONICAL_MEMORIES.find(
    (item) =>
      item.slug === slug &&
      item.approved !== false &&
      item.publicVisibility !== false
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const memory = getApprovedMemoryBySlug(resolvedParams.slug);

  if (!memory) {
    return { title: "Memory Not Found | Ravenshaw Moments" };
  }

  return {
    title: `${memory.title} | Ravenshaw Moments`,
    description: memory.shortDescription,
    openGraph: memory.coverImage
      ? {
          title: `${memory.title} | Ravenshaw Moments`,
          description: memory.shortDescription,
          siteName: "Ravenshaw Moments",
          type: "article",
          images: [
            {
              url: memory.coverImage,
              width: 1200,
              height: 630,
              alt: memory.imageAlt || memory.title,
            },
          ],
        }
      : {
          title: `${memory.title} | Ravenshaw Moments`,
          description: memory.shortDescription,
          siteName: "Ravenshaw Moments",
          type: "article",
        },
  };
}

export async function generateStaticParams() {
  return CANONICAL_MEMORIES.filter(
    (item) => item.approved !== false && item.publicVisibility !== false
  ).map((item) => ({
    slug: item.slug,
  }));
}

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const memory = getApprovedMemoryBySlug(resolvedParams.slug);

  if (!memory) {
    notFound();
  }

  return <MemoryDetails memory={memory} />;
}
