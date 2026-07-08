
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryFeedLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-4 w-96 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
