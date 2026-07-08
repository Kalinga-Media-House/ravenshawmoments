// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/gallery/DepartmentGallery.tsx
// Purpose   : Complete gallery section wrapper with category filters
// =============================================================================

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DepartmentGallery as DepartmentGalleryType } from "@/types/department";
import { GalleryGrid } from "./GalleryGrid";

export interface DepartmentGalleryProps {
  items: DepartmentGalleryType[];
  title?: string;
  onSelectItem?: (item: DepartmentGalleryType) => void;
}

export const DepartmentGallery: React.FC<DepartmentGalleryProps> = ({
  items,
  title = "Department Gallery",
  onSelectItem,
}) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GalleryGrid items={items} onSelectItem={onSelectItem} />
      </CardContent>
    </Card>
  );
};
