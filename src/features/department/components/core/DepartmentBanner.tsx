// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/core/DepartmentBanner.tsx
// Purpose   : Hero banner component for Department cover and logo
// =============================================================================

import React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Department } from "@/types/department";

export interface DepartmentBannerProps {
  department: Department;
}

export const DepartmentBanner: React.FC<DepartmentBannerProps> = ({ department }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {/* Cover background */}
      <div className="relative h-48 w-full bg-linear-to-r from-primary/20 via-primary/10 to-card sm:h-64">
        {department.cover_url ? (
          <Image
            src={department.cover_url}
            alt={`${department.name} Cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <Building2 className="h-20 w-20" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative -mt-16 flex flex-col items-center gap-4 px-6 pb-6 sm:flex-row sm:items-end">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-md sm:h-28 sm:w-28">
          {department.logo_url ? (
            <Image
              src={department.logo_url}
              alt={`${department.name} Logo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
              {department.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{department.name}</h2>
          {department.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground max-w-3xl">
              {department.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
