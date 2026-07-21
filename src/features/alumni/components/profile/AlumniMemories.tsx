import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export interface AlumniMemorySummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  year?: string;
  category?: string;
}

interface AlumniMemoriesProps {
  memories?: AlumniMemorySummary[];
}

export const AlumniMemories: React.FC<AlumniMemoriesProps> = ({
  memories,
}) => {
  const items = Array.isArray(memories) ? memories : [];

  if (items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, 6);

  return (
    <section aria-labelledby="alumni-memories-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="alumni-memories-heading"
                className="text-xl sm:text-2xl font-black text-white tracking-tight"
              >
                Memories Shared
              </h2>
              <p className="text-xs text-white/70">
                Approved campus stories and reflections shared with Ravenshaw.
              </p>
            </div>
          </div>

          <Link
            href="/memories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
          >
            <span>Explore All Memories</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((mem) => (
            <Link
              key={mem.id}
              href={`/memories/${mem.slug}`}
              className="group rm-glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between hover:border-[var(--color-rm-gold)]/50 transition-all"
            >
              {mem.coverImage && (
                <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                  <Image
                    src={mem.coverImage}
                    alt={mem.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
                    {mem.category && <span>{mem.category}</span>}
                    {mem.category && mem.year && <span className="text-white/30">•</span>}
                    {mem.year && <span>{mem.year}</span>}
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[var(--color-rm-gold)] transition-colors line-clamp-2">
                    {mem.title}
                  </h3>
                  {mem.excerpt && (
                    <p className="text-xs text-white/75 line-clamp-2 leading-relaxed">
                      {mem.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-[var(--color-rm-gold)]">
                  <span>Read Memory</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
