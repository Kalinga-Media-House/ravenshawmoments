import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const OrganizationSkeleton = () => {
  return (
    <div className="space-y-8 w-full" role="status" aria-label="Loading organizations">
      <div className="rounded-[24px] border border-[#EADED2] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <Skeleton className="h-64 sm:h-80 w-full rounded-[20px]" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-[24px] border border-[#EADED2] bg-white p-5 shadow-xs space-y-4">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
