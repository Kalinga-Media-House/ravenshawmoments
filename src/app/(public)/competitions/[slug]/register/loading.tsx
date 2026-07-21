import React from "react";

export default function CompetitionRegistrationLoading() {
  return (
    <main
      aria-label="Loading competition registration page"
      className="min-h-screen bg-black text-white pb-20 pt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 rounded bg-white/10 animate-pulse motion-reduce:animate-none" />
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="w-24 h-4 rounded bg-white/10 animate-pulse motion-reduce:animate-none" />
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="w-32 h-4 rounded bg-white/20 animate-pulse motion-reduce:animate-none" />
        </div>

        {/* Header Skeleton */}
        <div className="space-y-3 max-w-3xl">
          <div className="w-36 h-5 rounded-full bg-white/10 animate-pulse motion-reduce:animate-none" />
          <div className="w-3/4 h-10 sm:h-12 rounded-xl bg-white/10 animate-pulse motion-reduce:animate-none" />
          <div className="w-1/2 h-5 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
        </div>

        {/* Layout Skeleton: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Form Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="h-20 rounded-3xl bg-white/5 border border-white/10 animate-pulse motion-reduce:animate-none" />
            <div className="h-[460px] rounded-3xl bg-white/5 border border-white/10 animate-pulse motion-reduce:animate-none" />
          </div>

          {/* Summary Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-[380px] rounded-3xl bg-white/5 border border-white/10 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
