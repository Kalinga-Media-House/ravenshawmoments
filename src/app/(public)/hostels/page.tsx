
import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyStateCard } from "@/features/shared";

export const metadata: Metadata = {
  title: "Hostel Directory",
  description: "Browse the official hostels directory of Ravenshaw University.",
};

export const revalidate = 3600;

export default async function HostelDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const typeFilter = resolvedParams.type || "";

  // In a real implementation, we would fetch from the action here
  // const res = await listPublicHostel({ query: q, type: typeFilter, page });
  
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Hostel</h1>
          <p className="text-lg text-muted-foreground">
            Explore the vibrant hostels ecosystem at Ravenshaw.
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder cards mapped */}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="text-muted-foreground text-sm">Showing page {page}</div>
      </div>
    </div>
  );
}
