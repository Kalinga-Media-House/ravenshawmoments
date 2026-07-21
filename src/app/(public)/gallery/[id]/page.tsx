
import React from "react";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug?: string; id?: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.slug || resolvedParams.id} | Gallery`,
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug?: string; id?: string }>;
}) {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug || resolvedParams.id || 'unknown';

  return (
    <article className="container mx-auto py-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 capitalize">{identifier.replace(/-/g, ' ')}</h1>
      <div className="relative w-full h-96 bg-muted rounded-2xl overflow-hidden mb-8">
         <Image 
            src="/hero/hero-4.webp"
            alt="Cover"
            fill
            className="object-cover"
         />
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>This is the detailed view for this gallery. Data will be fetched via the Shared Content Layer.</p>
      </div>
    </article>
  );
}
