"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  Trophy,
  Flag,
  ArrowUpRight,
} from "lucide-react";
import { MemoryItem } from "../types/memory";
import { CANONICAL_MEMORIES } from "../data/memories";
import { MemoryStory } from "./MemoryStory";
import { MemoryInformation } from "./MemoryInformation";
import { MemoryPeople } from "./MemoryPeople";
import { MemoryContributor } from "./MemoryContributor";
import { MemoryCommunity } from "./MemoryCommunity";
import { MemoryGallery } from "./MemoryGallery";
import { MemoryShare } from "./MemoryShare";
import { RelatedMemories } from "./RelatedMemories";

export interface MemoryDetailsProps {
  memory: MemoryItem;
}

export const MemoryDetails: React.FC<MemoryDetailsProps> = ({ memory }) => {
  const [coverError, setCoverError] = useState(false);

  // Compute public approved canonical order for previous / next navigation
  const approvedMemories = CANONICAL_MEMORIES.filter(
    (item) => item.approved !== false && item.publicVisibility !== false
  );
  const currentIndex = approvedMemories.findIndex((item) => item.id === memory.id);
  const previousMemory = currentIndex > 0 ? approvedMemories[currentIndex - 1] : null;
  const nextMemory =
    currentIndex !== -1 && currentIndex < approvedMemories.length - 1
      ? approvedMemories[currentIndex + 1]
      : null;

  // Timeline Context (same year memories excluding current)
  const timelinePeers = approvedMemories
    .filter(
      (item) =>
        item.id !== memory.id &&
        item.memoryYear &&
        memory.memoryYear &&
        item.memoryYear === memory.memoryYear
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Navigation Bar & Breadcrumb */}
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] pt-28 md:pt-36 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            href="/memories"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded w-fit"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to All Memories
          </Link>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-white/50">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/memories"
                  className="hover:text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded"
                >
                  Memories
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--color-maroon)] font-bold truncate max-w-[220px] sm:max-w-[360px]" aria-current="page">
                {memory.title}
              </li>
            </ol>
          </nav>
        </div>

        {/* Compact Editorial Hero Header */}
        <header className="max-w-4xl pt-4 pb-8 border-b border-black/10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-rm-maroon)]/50 text-[var(--color-maroon)] border border-[var(--color-rm-gold)]/30">
              {memory.category}
            </span>

            {memory.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-rm-gold)]/20 text-[var(--color-maroon)] border border-[var(--color-rm-gold)]/40">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Featured Memory
              </span>
            )}

            {memory.memoryYear && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/80 border border-black/10">
                <Calendar className="w-3 h-3 text-[var(--color-maroon)]" aria-hidden="true" />
                {memory.memoryYear}
              </span>
            )}

            {memory.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/80 border border-black/10">
                <MapPin className="w-3 h-3 text-[var(--color-maroon)]" aria-hidden="true" />
                {memory.location}
              </span>
            )}
          </div>

          <h1 className="text-[clamp(2rem,4.5vw,4rem)] font-extrabold rm-heading-primary leading-[1.12] mb-5">
            {memory.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl rm-text-body text-black/80 font-medium leading-relaxed">
            {memory.shortDescription}
          </p>
        </header>
      </div>

      {/* Cinematic Memory Cover */}
      <section aria-label="Cover presentation" className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1200px] my-8">
        {!coverError && memory.coverImage ? (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden rm-glass-card border border-[var(--color-rm-gold)]/40 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
            <Image
              src={memory.coverImage}
              alt={memory.imageAlt || memory.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              onError={() => setCoverError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-rm-bg-deep)] via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        ) : (
          <div className="w-full rounded-[2rem] p-8 sm:p-12 rm-glass-card border border-[var(--color-rm-gold)]/30 bg-gradient-to-br from-[var(--color-rm-maroon)]/40 to-black/60 flex flex-col items-center justify-center text-center">
            <Sparkles className="w-10 h-10 text-[var(--color-maroon)] mb-3" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-maroon)] mb-1">
              RAVENSHAW MEMORY ARCHIVE
            </p>
            <p className="text-lg font-extrabold text-white">{memory.title}</p>
          </div>
        )}
      </section>

      {/* Story Section */}
      <MemoryStory memory={memory} />

      {/* Information Panel */}
      <MemoryInformation memory={memory} />

      {/* People Section */}
      <MemoryPeople memory={memory} />

      {/* Contributor & Photographer Section */}
      <MemoryContributor memory={memory} />

      {/* Community Connection Section */}
      <MemoryCommunity memory={memory} />

      {/* Gallery Section */}
      <MemoryGallery memory={memory} />

      {/* Related Event Banner */}
      {memory.eventName && memory.eventSlug && (
        <section aria-label="Connected event" className="w-full max-w-[760px] mx-auto my-10">
          <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] block mb-2">
              THE EVENT BEHIND THIS MEMORY
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {memory.eventName}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Explore the full event history, schedule, and community records.
                </p>
              </div>
              <Link
                href={`/events/${memory.eventSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-rm-gold)]/20 hover:bg-[var(--color-rm-gold)]/30 border border-[var(--color-rm-gold)]/40 text-xs font-bold text-[var(--color-maroon)] transition-colors self-start sm:self-center"
              >
                View Event
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Achievement Banner */}
      {memory.achievementName && memory.achievementSlug && (
        <section aria-label="Connected achievement" className="w-full max-w-[760px] mx-auto my-10">
          <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] block mb-2">
              A MOMENT OF ACHIEVEMENT
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/30 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {memory.achievementName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Explore recognition details on the Ravenshaw Wall of Pride.
                  </p>
                </div>
              </div>
              <Link
                href={`/achievements/${memory.achievementSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-rm-gold)]/20 hover:bg-[var(--color-rm-gold)]/30 border border-[var(--color-rm-gold)]/40 text-xs font-bold text-[var(--color-maroon)] transition-colors self-start sm:self-center"
              >
                Explore Achievement
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Context Section */}
      {timelinePeers.length > 0 && (
        <section aria-labelledby="timeline-context-heading" className="w-full max-w-[760px] mx-auto my-10">
          <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] block mb-2">
              FROM THIS CHAPTER OF RAVENSHAW ({memory.memoryYear})
            </span>
            <h3 id="timeline-context-heading" className="text-base sm:text-lg font-extrabold text-white mb-4">
              Other Memories Preserved in {memory.memoryYear}
            </h3>
            <ul className="space-y-3">
              {timelinePeers.map((peer) => (
                <li key={peer.id}>
                  <Link
                    href={`/memories/${peer.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 transition-colors group"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[var(--color-maroon)] transition-colors">
                        {peer.title}
                      </p>
                      <p className="text-xs text-black/60 truncate mt-0.5">
                        {peer.shortDescription}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--color-maroon)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Share Component */}
      <MemoryShare title={memory.title} />

      {/* Report an Issue Restrained Link */}
      <div className="w-full max-w-[760px] mx-auto mb-12 flex justify-end">
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
        >
          <Flag className="w-3.5 h-3.5" aria-hidden="true" />
          Report an Issue with This Memory
        </Link>
      </div>

      {/* Previous / Next Memory Navigation */}
      <nav
        aria-label="Memory Navigation"
        className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1200px] my-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previousMemory ? (
            <Link
              href={`/memories/${previousMemory.slug}`}
              className="group flex flex-col p-5 rounded-2xl rm-glass-card border border-[var(--color-rm-glass-border)] hover:border-[var(--color-rm-gold)]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-maroon)] mb-1">
                <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                Previous Memory
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white truncate">
                {previousMemory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextMemory ? (
            <Link
              href={`/memories/${nextMemory.slug}`}
              className="group flex flex-col sm:items-end text-left sm:text-right p-5 rounded-2xl rm-glass-card border border-[var(--color-rm-glass-border)] hover:border-[var(--color-rm-gold)]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-maroon)] mb-1">
                Next Memory
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white truncate">
                {nextMemory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* Related Memories */}
      <RelatedMemories currentMemory={memory} allMemories={approvedMemories} />

      {/* Contribution Call to Action */}
      <section aria-labelledby="memory-cta-heading" className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1200px] my-12">
        <div className="rm-glass-card rounded-[2rem] p-8 sm:p-12 border border-[var(--color-rm-gold)]/30 bg-gradient-to-br from-[var(--color-rm-maroon)]/40 via-black/40 to-black/60 text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)] block mb-3">
            SHARING OUR JOURNEY
          </span>
          <h2
            id="memory-cta-heading"
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold text-white mb-4"
          >
            Your Story Is Part of Ravenshaw
          </h2>
          <p className="text-base sm:text-lg text-black/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            The moments you remember today may become the memories future generations treasure tomorrow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/memories/submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-rm-gold)] hover:bg-[var(--color-rm-gold)]/90 text-black font-extrabold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
            >
              Share a Memory
            </Link>
            <Link
              href="/memories"
              className="section-cta"
            >
              Explore All Memories
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Back Navigation */}
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] mt-8">
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded w-fit"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to All Memories
        </Link>
      </div>
    </div>
  );
};
