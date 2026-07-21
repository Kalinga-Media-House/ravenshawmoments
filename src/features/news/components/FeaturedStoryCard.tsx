import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, ArrowRight, User } from "lucide-react";
import { ContentItem } from "../types/content";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface FeaturedStoryCardProps {
  item: ContentItem;
}

export const FeaturedStoryCard = ({ item }: FeaturedStoryCardProps) => {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group relative flex flex-col md:flex-row w-full rm-glass-card rounded-2xl md:rounded-3xl border border-[var(--color-rm-glass-border)] overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] transition-all duration-500 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_20px_50px_-15px_rgba(176,24,70,0.2)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/60"
      aria-label={`Read featured story: ${item.title}`}
    >
      {/* Visual Side */}
      <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-full bg-gradient-to-br from-[var(--color-rm-bg-wine)] via-[#5C0A22] to-[var(--color-rm-bg-deep)] overflow-hidden shrink-0">
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.coverImageAlt || item.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none"
            priority
          />
        ) : (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-rm-gold)]/30 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
          </>
        )}

        {/* Tags Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2 z-10">
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {item.contentType}
          </span>
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest bg-[var(--color-rm-accent)]/80 backdrop-blur-md text-white border border-[var(--color-rm-accent)] shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex flex-col p-6 sm:p-8 md:p-10 flex-grow relative z-10 bg-transparent">
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold rm-heading-primary mb-4 sm:mb-6 tracking-tight leading-tight group-hover:text-[var(--color-rm-gold)] transition-colors duration-300">
            {item.title}
          </h3>

          <p className="text-[1rem] sm:text-[1.1rem] rm-text-body leading-relaxed font-medium mb-8 max-w-2xl">
            {item.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[var(--color-rm-text-primary)]/90 text-[0.95rem] font-semibold mb-8">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <span>{formatDate(item.publishedDate)}</span>
            </div>
            {item.readingTime && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>{item.readingTime} min read</span>
              </div>
            )}
            {item.author && (
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>{item.author}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--color-rm-glass-border)]">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-wider bg-[var(--color-rm-gold)]/10 text-[var(--color-rm-gold)]">
              Featured Story
            </span>

            <div className="flex items-center text-[var(--color-rm-gold)] font-bold tracking-wide text-[0.95rem]">
              Read Story
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
