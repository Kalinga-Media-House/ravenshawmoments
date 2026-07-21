import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DepartmentsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8] text-[#2D1F1F]">
      {/* 1. Hero Section Skeleton */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] bg-gradient-to-br from-[#1E1B1C] via-[#2D1F1F] to-[#5B001B] flex flex-col justify-end p-6 sm:p-12 border-b border-[#D4AF37]/30">
        <div className="container mx-auto max-w-[1400px] space-y-3">
          <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
          <Skeleton className="h-10 sm:h-14 w-3/4 sm:w-1/2 rounded-xl bg-white/25" />
          <Skeleton className="h-4 sm:h-5 w-full sm:w-2/3 rounded-md bg-white/15" />
        </div>
      </div>

      {/* 2. Search Bar & Directory Cards Grid Skeleton */}
      <div className="container mx-auto px-3 sm:px-[clamp(1.5rem,4vw,3rem)] max-w-[1400px] py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Sticky Search Box Skeleton */}
        <div className="mb-7 sm:mb-12 lg:mb-16 rounded-[18px] sm:rounded-[24px] bg-white border border-[#D4AF37]/30 p-3.5 sm:p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-row items-center justify-between gap-3">
            <Skeleton className="h-[42px] sm:h-12 w-full max-w-xl rounded-[18px] sm:rounded-full" />
            <Skeleton className="h-[42px] sm:h-12 w-[112px] sm:w-32 rounded-[18px] sm:rounded-full shrink-0" />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EADED2]/60">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>

        {/* 15 Directory Cards Grid Skeleton */}
        <DepartmentSkeleton variant="directory" count={15} />
      </div>
    </div>
  );
}
