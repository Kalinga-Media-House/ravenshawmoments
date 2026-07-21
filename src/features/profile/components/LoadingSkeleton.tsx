import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-[24px] border border-[#EADED2] bg-white shadow-sm", className)} role="status" aria-label="Loading profile header">
      <Skeleton className="h-44 sm:h-64 w-full rounded-none" />
      <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-18">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
          <Skeleton className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white shrink-0 shadow-md" />
          <div className="space-y-2 mb-2">
            <Skeleton className="h-8 w-56 rounded-xl" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2.5 justify-center sm:justify-end">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[24px] border border-[#EADED2] bg-white p-6 shadow-xs space-y-4", className)} role="status" aria-label="Loading profile card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="space-y-2.5 pt-1">
        <Skeleton className="h-4.5 w-full rounded-md" />
        <Skeleton className="h-4.5 w-4/5 rounded-md" />
        <Skeleton className="h-4.5 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export function GalleryGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)} role="status" aria-label="Loading gallery items">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-[20px]" />
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-6 pl-6 border-l-2 border-[#EADED2]", className)} role="status" aria-label="Loading timeline">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative space-y-2.5">
          <Skeleton className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full" />
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
