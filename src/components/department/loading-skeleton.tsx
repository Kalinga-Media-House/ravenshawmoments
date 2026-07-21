import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-[#2D1F23] bg-[#1A1214] space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 bg-[#2D1F23]" />
        <Skeleton className="h-8 w-8 rounded-full bg-[#2D1F23]" />
      </div>
      <Skeleton className="h-8 w-32 bg-[#2D1F23]" />
      <Skeleton className="h-3 w-48 bg-[#2D1F23]" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-3 border-b border-[#2D1F23]">
      <Skeleton className="h-4 w-4 bg-[#2D1F23]" />
      <Skeleton className="h-4 w-48 bg-[#2D1F23]" />
      <Skeleton className="h-4 w-24 bg-[#2D1F23]" />
      <Skeleton className="h-4 w-32 bg-[#2D1F23]" />
      <Skeleton className="h-8 w-8 ml-auto bg-[#2D1F23]" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20 bg-[#2D1F23]" />
        <Skeleton className="h-10 w-full bg-[#2D1F23]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 bg-[#2D1F23]" />
        <Skeleton className="h-32 w-full bg-[#2D1F23]" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24 bg-[#2D1F23]" />
        <Skeleton className="h-10 w-24 bg-[#2D1F23]" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#2D1F23]" />
          <Skeleton className="h-4 w-96 bg-[#2D1F23]" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#2D1F23]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-8 space-y-4">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
    </div>
  );
}
