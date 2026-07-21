"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// TODO: Replace with Supabase generated types when integrated
interface AchievementStory {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullName: string;
  profileImage?: string;
  coverImage?: string;
  achievementCategory: string;
  personType: "Student" | "Alumni" | "Teacher" | "Staff";
  department: string;
  batch: string;
  achievementYear: number;
  featured: boolean;
  href: string;
  accessibleImageAlt: string;
}

// Temporary demonstration data only.
// This must later be replaced with live Supabase achievement and profile records.
const ACHIEVEMENT_STORIES: AchievementStory[] = [
  {
    id: "ach-001",
    slug: "journey-of-purpose-public-service",
    title: "A Journey of Purpose and Public Service",
    shortDescription: "A story of determination, learning, and service that reflects how dreams shaped at Ravenshaw can grow into meaningful contributions to society.",
    fullName: "Aaradhya Mohanty",
    coverImage: "/images/hero/hero-3.webp", // Local placeholder
    achievementCategory: "Public Service",
    personType: "Alumni",
    department: "Political Science",
    batch: "Demonstration Profile",
    achievementYear: 2026,
    featured: true,
    href: "/achievements/journey-of-purpose-public-service",
    accessibleImageAlt: "Aaradhya Mohanty - Public Service Achievement"
  },
  {
    id: "ach-002",
    slug: "turning-curiosity-into-excellence",
    title: "Turning Curiosity Into Academic Excellence",
    shortDescription: "A journey shaped by curiosity, consistent effort, supportive friendships, and the courage to keep learning beyond the classroom.",
    fullName: "Ananya Das",
    achievementCategory: "Academic Excellence",
    personType: "Student",
    department: "Statistics",
    batch: "Demonstration Profile",
    achievementYear: 2026,
    featured: false,
    href: "/achievements/turning-curiosity-into-excellence",
    accessibleImageAlt: "Ananya Das - Academic Excellence Achievement"
  },
  {
    id: "ach-003",
    slug: "building-ideas-that-create-impact",
    title: "Building Ideas That Create an Impact",
    shortDescription: "An inspiring journey of creativity, collaboration, challenges, and ideas developed through years of learning and exploration.",
    fullName: "Aditya Rath",
    achievementCategory: "Innovation",
    personType: "Alumni",
    department: "Computer Science",
    batch: "Demonstration Profile",
    achievementYear: 2026,
    featured: false,
    href: "/achievements/building-ideas-that-create-impact",
    accessibleImageAlt: "Aditya Rath - Innovation Achievement"
  },
  {
    id: "ach-004",
    slug: "leading-with-creativity",
    title: "Leading With Creativity and Community Spirit",
    shortDescription: "A story of leadership, cultural expression, teamwork, and the friendships created while bringing people together.",
    fullName: "Sneha Behera",
    achievementCategory: "Culture and Leadership",
    personType: "Student",
    department: "English",
    batch: "Demonstration Profile",
    achievementYear: 2026,
    featured: false,
    href: "/achievements/leading-with-creativity",
    accessibleImageAlt: "Sneha Behera - Culture and Leadership Achievement"
  }
];

// Reusable Initials Avatar Component
const InitialsAvatar = ({ name, size = "md" }: { name: string; size?: "md" | "lg" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = size === "lg" ? "w-16 h-16 text-xl" : "w-12 h-12 sm:w-14 sm:h-14 text-sm sm:text-base";

  return (
    <div className={`flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-[var(--color-rm-accent)] to-[var(--color-rm-bg-wine)] text-white font-bold tracking-wider shadow-inner ${sizeClasses}`}>
      {initials}
    </div>
  );
};

// Reusable Category Badge
const StoryCategoryBadge = ({ category, variant = "light" }: { category: string; variant?: "light" | "dark" }) => {
  if (variant === "dark") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[0.7rem] font-bold tracking-wider uppercase bg-[var(--color-rm-gold)] text-[#12070B] backdrop-blur-sm">
        {category}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[0.7rem] font-bold tracking-wider uppercase bg-white/10 border border-white/20 text-[var(--color-rm-text-primary)] backdrop-blur-sm">
      {category}
    </span>
  );
};

export const HeroAchievementsSection = () => {
  const featuredStory = ACHIEVEMENT_STORIES.find(s => s.featured);
  const compactStories = ACHIEVEMENT_STORIES.filter(s => !s.featured);
  const revealRef = useScrollReveal();

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 bg-transparent overflow-hidden z-20" ref={revealRef as React.RefObject<HTMLElement>}>
      
      {/* Dev indicator purely for current development awareness */}
      <div className="sr-only" aria-hidden="true">
        Note: The achievement stories currently rendered are temporary demonstration records.
      </div>

      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 rm-reveal">
          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <span className="w-8 h-[2px] bg-[var(--color-rm-gold)]" />
            <span className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.15em] text-[var(--color-rm-gold)] uppercase">
              Stories That Inspire
            </span>
            <span className="w-8 h-[2px] bg-[var(--color-rm-gold)]" />
          </div>
          
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold rm-heading-primary leading-[1.15] mb-6 tracking-tight">
            Every Achievement Has a Journey
          </h2>
          
          <p className="text-[clamp(1rem,1.8vw,1.125rem)] rm-text-body leading-[1.7] font-medium">
            Behind every achievement is a journey of dreams, dedication, challenges, courage, and growth. Discover the people and stories that continue to inspire Ravenshaw and shape its living legacy.
          </p>
        </div>

        {/* Content Layout */}
        {ACHIEVEMENT_STORIES.length > 0 ? (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
            
            {/* Featured Story Column */}
            {featuredStory && (
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col rm-reveal" style={{ transitionDelay: '100ms' }}>
                <Link 
                  href={featuredStory.href}
                  className="interactive-card group relative flex flex-col rm-glass-card rounded-2xl sm:rounded-3xl border border-[var(--color-rm-glass-border)] overflow-hidden transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_20px_40px_rgba(176,24,70,0.15)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/50 h-full min-h-[450px]"
                >
                  <div className="absolute inset-0 overflow-hidden bg-black">
                    {featuredStory.coverImage && (
                      <Image
                        src={featuredStory.coverImage}
                        alt={featuredStory.accessibleImageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover opacity-50 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                        priority
                      />
                    )}
                    {/* Deep burgundy to Ravenshaw maroon gradient with subtle warm-gold light */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-rm-bg-deep)] via-[var(--color-rm-bg-wine)]/80 to-[var(--color-rm-accent)]/30" />
                    <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,rgba(217,164,65,0.1),transparent_50%)]" />
                  </div>
                  
                  <div className="relative flex flex-col p-6 sm:p-8 md:p-10 flex-grow z-20">
                    <div className="flex justify-between items-start mb-auto">
                      <StoryCategoryBadge category={featuredStory.achievementCategory} variant="dark" />
                      <span className="text-[var(--color-rm-gold)] font-bold text-lg opacity-80">{featuredStory.achievementYear}</span>
                    </div>
                    
                    <div className="mt-20">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold rm-heading-primary mb-4 tracking-tight leading-[1.2]">
                        {featuredStory.title}
                      </h3>
                      
                      <p className="text-base sm:text-lg rm-text-body leading-relaxed mb-8 opacity-90 max-w-xl">
                        {featuredStory.shortDescription}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[var(--color-rm-glass-border)] mt-auto">
                        <div className="flex items-center gap-4">
                          <InitialsAvatar name={featuredStory.fullName} size="lg" />
                          <div className="flex flex-col">
                            <span className="text-[var(--color-rm-text-primary)] font-bold text-base sm:text-lg">{featuredStory.fullName}</span>
                            <span className="text-[var(--color-rm-gold)] text-xs sm:text-sm font-semibold tracking-wide uppercase">
                              {featuredStory.personType} • {featuredStory.department}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-semibold">
                          <span>Read Their Story</span>
                          <ArrowRight className="w-5 h-5 transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Compact Stories Column */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 sm:gap-5 lg:gap-6 mt-8 lg:mt-0">
              {compactStories.map((story, index) => (
                <div
                  key={story.id}
                  className="flex-grow rm-reveal"
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <Link
                    href={story.href}
                    className="interactive-card group flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-xl sm:rounded-2xl h-full transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_24px_rgba(176,24,70,0.1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5"
                  >
                    <div className="flex-shrink-0">
                      {story.profileImage ? (
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[var(--color-rm-glass-border)]">
                          <Image src={story.profileImage} alt={story.fullName} fill className="object-cover" />
                        </div>
                      ) : (
                        <InitialsAvatar name={story.fullName} />
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <div className="mb-2">
                        <StoryCategoryBadge category={story.achievementCategory} />
                      </div>
                      
                      <h4 className="text-[1.15rem] sm:text-xl font-bold rm-heading-primary leading-snug mb-1.5 transition-colors duration-300 group-hover:text-[var(--color-rm-gold)]">
                        {story.title}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--color-rm-gold-soft)] mb-2.5">
                        <span className="text-[var(--color-rm-text-primary)] font-bold">{story.fullName}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-rm-gold)]/50" />
                        <span>{story.personType}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-rm-gold)]/50" />
                        <span>{story.department}</span>
                      </div>
                      
                      <p className="text-sm rm-text-body line-clamp-2 mb-4 flex-grow">
                        {story.shortDescription}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-semibold text-sm mt-auto">
                        <span className="transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--color-rm-gold-soft)]">Read Story</span>
                        <ArrowRight className="w-4 h-4 transform transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 rm-glass-card rounded-3xl border border-[var(--color-rm-glass-border)] text-center max-w-4xl mx-auto rm-reveal">
            <h3 className="text-2xl font-bold rm-heading-primary mb-3">Inspiring Stories Are Coming</h3>
            <p className="rm-text-body mb-8 max-w-md">Achievements and journeys from the Ravenshaw community will appear here as they are shared and preserved.</p>
            <Link 
              href="/achievements/share"
              className="inline-flex items-center justify-center bg-white/5 border border-[var(--color-rm-glass-border)] text-[var(--color-rm-text-primary)] px-6 h-11 rounded-full text-sm font-semibold transition-all hover:bg-[var(--color-rm-gold)]/20 hover:border-[var(--color-rm-gold)]/50"
            >
              Share an Achievement
            </Link>
          </div>
        )}

        {/* Global CTA Section */}
        <div className="flex flex-col items-center justify-center mt-12 md:mt-16 text-center rm-reveal" style={{ transitionDelay: '400ms' }}>
          <p className="text-[var(--color-rm-gold-soft)]/90 font-serif italic text-lg sm:text-xl mb-8">
            Every journey can inspire someone. Every achievement deserves to be remembered.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <Link 
              href="/achievements"
              className="section-cta"
            >
              Explore All Achievements
            </Link>
            
            <Link 
              href="/achievements/share"
              className="group flex items-center gap-2 text-[var(--color-rm-gold)] font-semibold text-base transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] rounded-md px-2 py-1 -mx-2"
            >
              <span className="relative">
                Share an Achievement
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-rm-gold)] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:w-full" />
              </span>
              <ArrowRight className="w-4 h-4 transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
