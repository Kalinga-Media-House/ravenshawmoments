import React from "react";

export default function CompetitionLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full pt-32 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] space-y-10">
          {/* Skeleton Breadcrumb */}
          <div className="w-64 h-4 rounded bg-white/10 animate-pulse" />

          {/* Skeleton Hero Header */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex gap-2">
              <div className="w-24 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="w-32 h-6 rounded-full bg-white/10 animate-pulse" />
            </div>
            <div className="w-full sm:w-3/4 h-12 rounded-xl bg-white/10 animate-pulse" />
            <div className="w-full sm:w-1/2 h-6 rounded bg-white/5 animate-pulse" />
          </div>

          {/* Skeleton Two-Column Cover & Quick Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 aspect-[16/10] rounded-3xl bg-white/10 animate-pulse border border-white/10" />
            <div className="lg:col-span-5 h-[420px] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
          </div>

          {/* Skeleton Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              <div className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            </div>
            <div className="lg:col-span-4 h-80 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
          </div>
        </div>
      </main>
    </div>
  );
}
