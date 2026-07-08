// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/news/NewsCard.tsx
// Purpose   : Card component displaying a departmental news bulletin
// =============================================================================

import React from "react";
import Image from "next/image";
import { Calendar, Newspaper, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentNews } from "@/types/department";

export interface NewsCardProps {
  news: DepartmentNews;
  onClick?: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer flex flex-col"
    >
      {news.featured_image_url && (
        <div className="relative h-44 w-full overflow-hidden bg-muted">
          <Image
            src={news.featured_image_url}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardContent className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-primary">
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Department Bulletin</span>
            </span>

            {news.published_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{new Date(news.published_at).toLocaleDateString()}</span>
              </span>
            )}
          </div>

          <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {news.title}
          </h4>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {news.summary || news.body}
          </p>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Department Editorial</span>
          <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:underline">
            <span>Read Article</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
