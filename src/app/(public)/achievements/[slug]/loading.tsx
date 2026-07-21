import React from "react";

export default function AchievementDetailLoading() {
  return (
    <div className="w-full pt-28 pb-20 min-h-screen">
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        {/* Breadcrumb skeleton */}
        <div className="w-48 h-4 bg-white/10 rounded-md mb-8 animate-pulse" />

        {/* Hero skeleton */}
        <div className="max-w-4xl mb-12 space-y-4">
          <div className="flex gap-2 mb-4">
            <div className="w-24 h-6 bg-[var(--color-rm-gold)]/20 rounded-full animate-pulse" />
            <div className="w-24 h-6 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="w-3/4 h-12 bg-white/15 rounded-xl animate-pulse" />
          <div className="w-full h-6 bg-white/10 rounded-lg animate-pulse" />
          <div className="w-2/3 h-6 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Cover presentation skeleton */}
        <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-white/5 border border-white/10 rounded-[2rem] mb-14 animate-pulse" />

        {/* Content sections skeleton */}
        <div className="space-y-8 max-w-4xl">
          <div className="rm-glass-card rounded-[2rem] p-8 border border-[var(--color-rm-glass-border)] space-y-4">
            <div className="w-48 h-6 bg-white/15 rounded-lg animate-pulse mb-6" />
            <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
            <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
            <div className="w-4/5 h-4 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
