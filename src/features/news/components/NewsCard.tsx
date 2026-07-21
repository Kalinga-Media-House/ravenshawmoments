import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { ContentItem } from "../types/content";

const PUBLICATION_TYPES = ["Magazine", "Newsletter", "Report", "E-Publication"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface NewsCardProps {
  item: ContentItem;
}

export const NewsCard = ({ item }: NewsCardProps) => {
  const isPublication = PUBLICATION_TYPES.includes(item.contentType);
  const isExternal = !!item.externalUrl;
  const href = isExternal ? item.externalUrl! : `/news/${item.slug}`;

  const linkProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className="group flex flex-col h-full heritage-card-glass rounded-2xl border border-white/10 overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2 transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_35px_-15px_rgba(176,24,70,0.2)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-heritage-gold)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
      aria-label={`${isPublication ? "View publication" : "Read"}: ${item.title}`}
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/10] bg-black shrink-0 overflow-hidden">
        {item.coverImage ? (
          <>
            <Image
              src={item.coverImage}
              alt={item.coverImageAlt || item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-heritage-gold)]/10 blur-3xl rounded-full" />
            <FileText className="w-16 h-16 text-white/10" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[0.65rem] font-bold tracking-widest text-[var(--color-heritage-gold)] uppercase bg-[var(--color-heritage-gold)]/10 px-2.5 py-1 rounded-sm border border-[var(--color-heritage-gold)]/20">
            {item.contentType}
          </span>
          <span className="text-[0.65rem] font-bold tracking-widest uppercase bg-white/5 text-white/60 border border-white/10 px-2.5 py-1 rounded-sm">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold heritage-card-title mb-2 leading-tight group-hover:text-[var(--color-heritage-gold)] transition-colors duration-300 line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-[0.9rem] heritage-card-muted font-medium leading-relaxed mb-6 line-clamp-3 flex-grow">
          {item.shortDescription}
        </p>

        {/* Metadata */}
        <div className="flex flex-col gap-3 mt-auto border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/70 text-[0.85rem] font-medium">
            <div className="flex items-center gap-1.5 shrink-0">
              <CalendarDays className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
              <span>{formatDate(item.publishedDate)}</span>
            </div>
            {item.readingTime && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
                <span>{item.readingTime} min read</span>
              </div>
            )}
          </div>

          {(item.author || item.publisher) && (
            <p className="text-[0.8rem] font-bold text-[var(--color-heritage-gold)] uppercase tracking-wide">
              By {item.author || item.publisher}
            </p>
          )}

          {/* Action */}
          <div className="flex items-center text-[var(--color-heritage-gold)] font-bold text-sm tracking-wide mt-1">
            {isPublication ? "View Publication" : "Read More"}
            {isExternal ? (
              <ExternalLink className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
            ) : isPublication ? (
              <FileText className="w-4 h-4 ml-1.5 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
            ) : (
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
