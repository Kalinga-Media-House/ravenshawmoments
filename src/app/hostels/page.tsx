// =============================================================================
// Ravenshaw Moments
// File      : src/app/hostels/page.tsx
// Purpose   : Public Hostel & Housing Hub Directory Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BadgeCheck, Star, MapPin } from "lucide-react";
import { listPublicHostels } from "@/app/actions/hostel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Hostels & Accommodation | Ravenshaw Moments",
  description:
    "Explore university hostels, accommodation facilities, and the Housing Hub for verified private hostels near Ravenshaw University.",
  alternates: {
    canonical: "/hostels",
  },
  openGraph: {
    title: "Hostels & Accommodation | Ravenshaw Moments",
    description:
      "Browse verified university hostels and sponsored accommodation near Ravenshaw University.",
    type: "website",
    url: "/hostels",
  },
};

export default async function HostelsDirectoryPage() {
  const response = await listPublicHostels(undefined, 1, 100);
  const hostels =
    response.success && response.data ? response.data.hostels : [];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Hostels</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hostels & Accommodation
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          University hostels, facilities, and the Housing Hub for sponsored
          private accommodation near Ravenshaw University.
        </p>
      </header>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Ravenshaw University Hostels",
            itemListElement: hostels.map((h, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "LodgingBusiness",
                name: h.name,
                address: h.address,
                url: `/hostels/${h.slug}`,
              },
            })),
          }),
        }}
      />

      {/* Hostels Grid */}
      {hostels.length === 0 ? (
        <HostelEmptyState
          title="No Hostels Listed"
          description="Verified university hostels and accommodation will appear here once published."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Link
              key={hostel.id}
              href={`/hostels/${hostel.slug}`}
              className="group block"
            >
              <Card className="h-full rounded-xl border border-border bg-card shadow-xs transition-all group-hover:border-primary/50 group-hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      <span>{hostel.name}</span>
                      {hostel.is_verified && (
                        <BadgeCheck
                          className="h-5 w-5 text-primary shrink-0"
                          aria-label="Verified"
                        />
                      )}
                    </CardTitle>
                    {hostel.is_sponsored && (
                      <Badge
                        variant="default"
                        className="text-2xs bg-amber-500/10 text-amber-600 border-amber-500/30"
                      >
                        <Star className="h-3 w-3 mr-0.5" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="line-clamp-2">
                    {hostel.description ||
                      "Explore hostel details, facilities, and community."}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">
                        {hostel.address || "Campus"}
                      </span>
                    </span>

                    <span className="font-medium text-primary group-hover:underline">
                      Explore &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
