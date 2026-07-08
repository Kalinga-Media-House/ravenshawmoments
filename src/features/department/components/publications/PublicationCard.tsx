// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/publications/PublicationCard.tsx
// Purpose   : Card component displaying an annual magazine or research publication
// =============================================================================

import React from "react";
import Image from "next/image";
import { BookOpen, Download, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentPublication } from "@/types/department";

export interface PublicationCardProps {
  publication: DepartmentPublication;
  onDownload?: (publication: DepartmentPublication) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({ publication, onDownload }) => {
  return (
    <Card className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md flex flex-col">
      {publication.cover_url ? (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={publication.cover_url}
            alt={publication.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur-xs font-semibold capitalize">
              {publication.publication_type.replace("_", " ")}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-primary/10 text-primary">
          <BookOpen className="h-12 w-12" aria-hidden="true" />
        </div>
      )}

      <CardContent className="p-5 flex flex-col gap-4 flex-1 justify-between">
        <div className="space-y-2">
          {!publication.cover_url && (
            <Badge variant="outline" className="text-2xs capitalize">
              {publication.publication_type.replace("_", " ")}
            </Badge>
          )}

          <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {publication.title}
          </h4>

          {publication.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{publication.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Downloads: {publication.download_count.toLocaleString()}</span>
          </span>

          <button
            type="button"
            onClick={() => onDownload?.(publication)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
