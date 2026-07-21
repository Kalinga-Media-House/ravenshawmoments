import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlumniLoading() {
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

      {/* Alumni Directory Grid Skeleton */}
      <div className="container mx-auto px-3 sm:px-[clamp(1.5rem,4vw,3rem)] max-w-[1400px] py-10 sm:py-16 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-11 w-full max-w-md rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-[24px] border border-[#EADED2] bg-white p-6 shadow-xs text-center space-y-4">
              <Skeleton className="h-24 w-24 mx-auto rounded-full" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-5 w-36 mx-auto rounded-md" />
                <Skeleton className="h-4 w-24 mx-auto rounded-md" />
                <Skeleton className="h-4 w-44 mx-auto rounded-md" />
              </div>
              <Skeleton className="h-9 w-28 mx-auto rounded-full pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
