import React from "react";

export default function MemoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-rm-bg-deep)] text-white pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        {/* Skeleton Breadcrumb */}
        <div className="w-48 h-4 rounded bg-white/10 mb-8" />

        {/* Skeleton Hero */}
        <div className="max-w-4xl space-y-4 mb-10">
          <div className="w-28 h-6 rounded-full bg-[var(--color-rm-gold)]/20" />
          <div className="w-full max-w-2xl h-12 rounded-xl bg-white/10" />
          <div className="w-full max-w-xl h-6 rounded bg-white/5" />
        </div>

        {/* Skeleton Cover Image */}
        <div className="max-w-[1200px] mx-auto w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] bg-white/5 border border-white/10 mb-12" />

        {/* Skeleton Story */}
        <div className="max-w-[760px] mx-auto space-y-4 mb-14">
          <div className="w-40 h-4 rounded bg-[var(--color-rm-gold)]/30 mb-6" />
          <div className="w-full h-4 rounded bg-white/10" />
          <div className="w-11/12 h-4 rounded bg-white/10" />
          <div className="w-4/5 h-4 rounded bg-white/10" />
          <div className="w-full h-4 rounded bg-white/10" />
        </div>

        {/* Skeleton Details Panel */}
        <div className="max-w-[760px] mx-auto h-48 rounded-[1.75rem] bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}
