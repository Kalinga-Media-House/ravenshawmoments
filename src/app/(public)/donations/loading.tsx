import React from "react";

export default function DonationsLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-rm-background)]">
      {/* Hero Skeleton */}
      <div className="pt-8 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="h-4 w-32 bg-white/5 rounded-full mx-auto animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto animate-pulse" />
          <div className="h-3 w-40 bg-white/5 rounded-full mx-auto animate-pulse" />
          <div className="h-10 sm:h-14 w-3/4 max-w-lg bg-white/5 rounded-2xl mx-auto animate-pulse" />
          <div className="h-5 w-2/3 max-w-md bg-white/5 rounded-full mx-auto animate-pulse" />
          <div className="flex justify-center gap-3 pt-4">
            <div className="h-12 w-56 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-12 w-40 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Why Contribute Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <div className="h-3 w-28 bg-white/5 rounded-full mx-auto animate-pulse" />
            <div className="h-9 w-80 bg-white/5 rounded-xl mx-auto animate-pulse" />
            <div className="h-4 w-64 bg-white/5 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Impact Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="h-8 w-72 bg-white/5 rounded-xl mx-auto animate-pulse" />
            <div className="h-4 w-48 bg-white/5 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Payment Status Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-48 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>

      {/* Transparency Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="h-8 w-56 bg-white/5 rounded-xl mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contributors Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="h-8 w-52 bg-white/5 rounded-xl mx-auto animate-pulse" />
          </div>
          <div className="h-48 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>

      {/* CTA Skeleton */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
