import React from "react";

export default function NewsDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Back Navigation Skeleton */}
      <div className="w-full pt-28 pb-4">
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
          <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      <article className="w-full pb-16 animate-pulse">
        {/* Hero Skeleton */}
        <header className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-6">
              <div className="h-8 w-24 bg-white/5 rounded" />
              <div className="h-8 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-16 w-3/4 bg-white/10 rounded-xl mb-6" />
            <div className="h-16 w-1/2 bg-white/10 rounded-xl mb-6" />
            <div className="h-6 w-full max-w-2xl bg-white/5 rounded mb-4" />
            <div className="h-6 w-3/4 bg-white/5 rounded mb-8" />
            <div className="flex gap-6 pt-6 border-t border-white/5">
              <div className="h-6 w-32 bg-white/5 rounded" />
              <div className="h-6 w-32 bg-white/5 rounded" />
            </div>
          </div>
        </header>

        {/* Image Skeleton */}
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] mb-16">
          <div className="w-full aspect-[21/9] md:aspect-[2.35/1] bg-white/5 rounded-2xl md:rounded-3xl border border-white/10" />
        </div>

        {/* Content Layout Skeleton */}
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Main Content */}
            <div className="flex-grow max-w-4xl space-y-6">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-11/12 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded mt-8" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
            </div>

            {/* Sidebar Skeleton */}
            <aside className="w-full lg:w-[350px] shrink-0 space-y-8">
              <div className="h-48 w-full bg-white/5 rounded-[2rem] border border-white/10" />
              <div className="h-48 w-full bg-white/5 rounded-[2rem] border border-white/10" />
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
