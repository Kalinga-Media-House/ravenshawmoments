
import React, { Suspense } from "react";
import { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Latest News & Notices | Ravenshaw Moments",
  description: "Stay updated with important announcements and publications.",
};

export const revalidate = 3600;

export default async function NewsFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Latest News & Notices</h1>
          <p className="text-lg text-muted-foreground">Stay updated with important announcements and publications.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
              defaultValue={q}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-muted-foreground py-24 border border-dashed rounded-2xl">
         Content will be rendered here dynamically via Shared Content Layer.
      </div>
    </div>
  );
}
