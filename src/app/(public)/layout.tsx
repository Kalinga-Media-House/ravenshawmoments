import React from "react";
import { Metadata } from "next";
import { PublicNavbar, PublicFooter } from "@/features/shared";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://ravenshawmoments.com",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": "Ravenshaw University",
    "url": "https://ravenshawmoments.com",
    "logo": "https://ravenshawmoments.com/logo.png",
    "description": "Preserving Memories. Celebrating Achievements. Connecting Generations.",
    "sameAs": [
      "https://www.instagram.com/ravenshaw.moments",
      "https://youtube.com/@ravenshawmoments",
      "https://www.facebook.com/ravenshaw.moments",
      "https://x.com/ravenshawx"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans selection:bg-[#B01846] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicNavbar />
      <main className="flex-1 pt-[72px] sm:pt-[76px] min-[1150px]:pt-20 animate-page-transition">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
