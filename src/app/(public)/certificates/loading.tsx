import React from "react";

export default function CertificatesLoading() {
  return (
    <div className="min-h-screen pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="pt-28 pb-14 sm:pt-32 sm:pb-16 px-4 border-b border-white/10 text-center space-y-4">
        <div className="w-40 h-4 bg-white/10 rounded-full mx-auto" />
        <div className="w-52 h-6 bg-[var(--color-rm-maroon)]/60 rounded-full mx-auto" />
        <div className="w-72 sm:w-96 h-10 bg-white/15 rounded-xl mx-auto" />
        <div className="w-full max-w-lg h-5 bg-white/10 rounded-lg mx-auto" />
      </div>

      {/* Verification Panel Skeleton */}
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <div className="rm-glass-card rounded-3xl p-8 border border-white/10 space-y-6">
          <div className="w-48 h-6 bg-white/15 rounded mx-auto" />
          <div className="w-full h-14 bg-white/5 rounded-2xl" />
          <div className="w-full h-14 bg-[var(--color-rm-maroon)]/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
