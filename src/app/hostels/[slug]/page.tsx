// =============================================================================
// Ravenshaw Moments
// File      : src/app/hostels/[slug]/page.tsx
// Purpose   : Public Hostel Profile Landing Page with SEO, JSON-LD & Open Graph
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getPublicHostelBySlug } from "@/app/actions/hostel";
import {
  HostelBanner,
  HostelHeader,
  HostelStats,
  HostelHistory,
  HostelFacilities,
  HostelWardenCard,
  HostelEmptyState,
} from "@/features/hostel/components";
import type { HostelWarden } from "@/types/hostel";

interface HostelSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: HostelSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getPublicHostelBySlug(slug);
  if (!response.success || !response.data) {
    return { title: "Hostel Not Found | Ravenshaw Moments" };
  }
  const hostel = response.data;
  return {
    title: `${hostel.name} | Ravenshaw Moments`,
    description:
      hostel.description ||
      `Explore ${hostel.name} hostel — facilities, warden, gallery, events, and community.`,
    alternates: { canonical: `/hostels/${slug}` },
    openGraph: {
      title: `${hostel.name} | Ravenshaw Moments`,
      description:
        hostel.description ||
        `Explore ${hostel.name} hostel at Ravenshaw University.`,
      type: "website",
      url: `/hostels/${slug}`,
      ...(hostel.cover_image_url
        ? { images: [{ url: hostel.cover_image_url }] }
        : {}),
    },
  };
}

export default async function HostelProfilePage({
  params,
}: HostelSlugPageProps) {
  const { slug } = await params;
  const response = await getPublicHostelBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
    return; // TypeScript narrowing: unreachable, but helps inference
  }

  const hostel = response.data!;

  // Mock warden data — in production, a server action would fetch this
  const mockWarden = undefined as HostelWarden | undefined;

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: hostel.name,
            description: hostel.description,
            address: {
              "@type": "PostalAddress",
              streetAddress: hostel.address,
            },
            telephone: hostel.contact_number,
            email: hostel.contact_email,
            url: `/hostels/${slug}`,
            ...(hostel.cover_image_url
              ? { image: hostel.cover_image_url }
              : {}),
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href="/hostels"
          className="hover:text-foreground transition-colors"
        >
          Hostels
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{hostel.name}</span>
      </nav>

      {/* Banner */}
      <HostelBanner
        coverUrl={hostel.cover_image_url}
        logoUrl={hostel.logo_url}
        name={hostel.name}
      />

      {/* Header */}
      <HostelHeader hostel={hostel} />

      {/* Stats */}
      <HostelStats
        roomTypesCount={hostel.room_types?.length ?? 0}
        facilitiesCount={hostel.facilities?.length ?? 0}
        wardenName={mockWarden?.name}
      />

      {/* About & Heritage */}
      <HostelHistory
        description={hostel.description}
        history={hostel.history}
      />

      {/* Facilities */}
      <HostelFacilities facilities={hostel.facilities ?? []} />

      {/* Warden Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Hostel Administration
        </h2>
        {mockWarden ? (
          <HostelWardenCard warden={mockWarden} />
        ) : (
          <HostelEmptyState
            title="Warden Information Pending"
            description="The incumbent warden details will be published shortly."
          />
        )}
      </section>
    </main>
  );
}
