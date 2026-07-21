
import React from "react";

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[65vh] min-h-[400px] bg-[var(--color-rm-bg-deep)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rm-bg-wine)] to-[var(--color-rm-bg-deep)]">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-rm-gold)]/5 blur-[120px] rounded-full animate-pulse" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-10 md:pb-16 w-full max-w-7xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="h-7 w-24 bg-white/10 rounded-sm animate-pulse" />
              <div className="h-7 w-20 bg-white/10 rounded-sm animate-pulse" />
            </div>
            <div className="h-12 md:h-16 w-[70%] max-w-xl bg-white/10 rounded-lg animate-pulse mb-4" />
            <div className="h-5 w-[50%] max-w-md bg-white/5 rounded-lg animate-pulse mb-6" />
            <div className="flex gap-6">
              <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-28 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-36 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-10 md:mt-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-[75%] bg-white/5 rounded animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-72 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)] animate-pulse" />
            <div className="h-52 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
