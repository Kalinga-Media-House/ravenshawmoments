import React from "react";
import { PublicNavbar, PublicFooter } from "@/features/shared";

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
      "https://twitter.com/ravenshaw",
      "https://www.linkedin.com/school/ravenshaw-university/"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <head>
        <link rel="canonical" href="https://ravenshawmoments.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <PublicNavbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
