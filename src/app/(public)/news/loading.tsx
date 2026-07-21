import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8] text-[#2D1F1F]">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] bg-gradient-to-br from-[#1E1B1C] via-[#2D1F1F] to-[#5B001B] flex flex-col justify-end p-6 sm:p-12 border-b border-[#D4AF37]/30">
        <div className="container mx-auto max-w-[1400px] space-y-3">
          <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
          <Skeleton className="h-10 sm:h-14 w-3/4 sm:w-1/2 rounded-xl bg-white/25" />
          <Skeleton className="h-4 sm:h-5 w-full sm:w-2/3 rounded-md bg-white/15" />
        </div>
      </div>

      {/* News Cards Grid Skeleton */}
      <div className="container mx-auto px-3 sm:px-[clamp(1.5rem,4vw,3rem)] max-w-[1400px] py-10 sm:py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-[24px] border border-[#EADED2] bg-white p-5 shadow-xs space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
