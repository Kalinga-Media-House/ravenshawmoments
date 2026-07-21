"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Types
export interface AchievementItem {
  id: string;
  name: string;
  role: string;
  category: string;
  achievement: string;
  story: string;
  year: string;
  image?: string;
  imageAlt?: string;
  href: string;
  featured: boolean;
}

// Temporary homepage achievement data. Replace with approved Supabase achievement and story records when the content-management module is connected.
const TEMPORARY_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "ach-1",
    name: "A Journey of Dedication",
    role: "Ravenshaw Student",
    category: "Academic Excellence",
    achievement: "Turning Dreams Into Achievements",
    story: "A story of determination, learning, perseverance, and the courage to continue moving forward through every challenge.",
    year: "2026",
    href: "/achievements",
    featured: true
  },
  {
    id: "ach-2",
    name: "Leading Through Service",
    role: "Student Community",
    category: "Leadership and Service",
    achievement: "Creating Change Together",
    story: "Celebrating students who transform ideas into meaningful action and inspire others through leadership, responsibility, and service.",
    year: "2026",
    href: "/achievements",
    featured: false
  },
  {
    id: "ach-3",
    name: "Beyond the Classroom",
    role: "Ravenshaw Community",
    category: "Talent and Creativity",
    achievement: "Where Passion Finds Its Stage",
    story: "Honouring creativity, innovation, culture, talent, and the confidence to share meaningful ideas with the world.",
    year: "2026",
    href: "/achievements",
    featured: false
  }
];

export const AchievementsStoriesSection = () => {
  const hasStories = TEMPORARY_ACHIEVEMENTS.length > 0;
  const revealRef = useScrollReveal();
  
  // Separate featured and secondary stories
  const featuredStory = TEMPORARY_ACHIEVEMENTS.find(item => item.featured) || TEMPORARY_ACHIEVEMENTS[0];
  const secondaryStories = TEMPORARY_ACHIEVEMENTS.filter(item => item.id !== featuredStory?.id).slice(0, 2);

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 bg-transparent overflow-hidden z-20" ref={revealRef as React.RefObject<HTMLDivElement>}>
      
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,var(--color-rm-gold)_0%,transparent_60%)] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_bottom_left,var(--color-rm-accent)_0%,transparent_60%)] opacity-[0.03] pointer-events-none" />

      <style>{`
        .story-card {
          height: auto;
          min-width: 0;
          overflow: hidden;
        }
      `}</style>

      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 rm-reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[var(--color-rm-gold)] uppercase">
              Stories That Inspire
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
          </div>
          
          <h2 className="text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold rm-heading-primary leading-[1.1] mb-6 tracking-tight text-balance">
            <span className="heading-highlight">Achievements</span> That Become Legacies
          </h2>
          
          <p className="text-[clamp(1rem,2vw,1.15rem)] rm-text-body leading-[1.7] font-medium max-w-[800px]">
            Every achievement begins with a journey. Discover the dreams, dedication, challenges, and accomplishments of Ravenshawvians whose stories continue to inspire generations.
          </p>
        </div>

        {!hasStories ? (
          // Optional Empty State
          <div className="flex flex-col items-center justify-center p-12 rm-glass-card text-center shadow-sm rm-reveal" style={{ transitionDelay: "100ms" }}>
            <Quote className="w-12 h-12 text-[var(--color-rm-gold)] mb-4 opacity-50" aria-hidden="true" />
            <h3 className="text-2xl font-bold rm-heading-primary mb-2">Inspiring Stories Coming Soon</h3>
            <p className="rm-text-body mb-8 max-w-md font-medium">Achievements, journeys, and stories from the Ravenshaw community will appear here.</p>
            <Link 
              href="/gallery"
              className="inline-flex items-center justify-center bg-[var(--color-rm-accent)] text-white px-6 py-3 rounded-full font-bold transition-all hover:bg-[var(--color-rm-gold)] hover:text-[#2A0F16]"
            >
              Explore Ravenshaw Moments
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            
            {/* Featured Left Side */}
            {featuredStory && (
              <div className="lg:col-span-7 flex flex-col h-full rm-reveal" style={{ transitionDelay: "100ms" }}>
                <Link 
                  href={featuredStory.href}
                  className="story-card group flex flex-col relative h-full bg-[linear-gradient(145deg,#3b0714_0%,#65001f_48%,#8f002d_100%)] border border-[rgba(255,255,255,0.14)] rounded-3xl shadow-[0_20px_50px_rgba(70,0,20,0.20),inset_0_1px_0_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA] transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_24px_55px_rgba(75,0,22,0.28),inset_0_1px_0_rgba(255,255,255,0.10)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[5px]"
                >
                  
                  {/* Decorative Large Quotation Mark */}
                  <div className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none opacity-[1] transform scale-[2] sm:scale-[3] origin-top-right transition-transform duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[3.2] [@media(hover:hover)_and_(pointer:fine)]:group-hover:rotate-3 z-0">
                    <Quote className="w-24 h-24 text-[rgba(255,255,255,0.07)]" aria-hidden="true" />
                  </div>

                  <div className="relative z-10 flex flex-col flex-grow p-8 sm:p-10 md:p-12 text-[#ffffff]">
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-[800] tracking-widest text-[#ffd66b] uppercase bg-[rgba(242,189,60,0.14)] border border-[rgba(242,189,60,0.55)] shadow-sm">
                        {featuredStory.category}
                      </span>
                      <span className="text-sm font-[700] tracking-widest text-[#f2bd3c]">
                        {featuredStory.year}
                      </span>
                    </div>

                    <div className="flex flex-col flex-grow justify-center mb-8 sm:mb-12">
                      <h3 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-[850] text-[#ffffff] mb-6 tracking-tight leading-tight max-w-2xl">
                        {featuredStory.achievement}
                      </h3>
                      <p className="text-[clamp(1rem,1.5vw,1.2rem)] text-[rgba(255,255,255,0.82)] leading-relaxed max-w-2xl">
                        "{featuredStory.story}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-auto pt-8 border-t border-[rgba(255,255,255,0.18)]">
                      <div>
                        <p className="text-sm font-[700] text-[#f2bd3c] tracking-wider uppercase mb-1">
                          {featuredStory.role}
                        </p>
                        <p className="text-xl font-[750] text-[#ffffff] tracking-tight">
                          {featuredStory.name}
                        </p>
                      </div>
                      <div className="flex items-center text-[#f2bd3c] font-[750] tracking-wide transition-colors group-hover:text-[#ffd66b]">
                        Read Story
                        <ArrowRight className="w-5 h-5 ml-2.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-2" strokeWidth={2.5} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Secondary Right Side */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 h-full">
              {secondaryStories.map((story, index) => (
                <div
                  key={story.id}
                  className="rm-reveal flex-1 flex flex-col"
                  style={{ transitionDelay: `${200 + (index * 100)}ms` }}
                >
                  <Link 
                    href={story.href}
                    className="story-card group flex flex-col flex-grow relative bg-[linear-gradient(140deg,#460916_0%,#700021_55%,#8d002a_100%)] border border-[rgba(255,255,255,0.13)] rounded-2xl p-6 sm:p-8 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA] transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_14px_36px_rgba(75,0,22,0.16),inset_0_1px_0_rgba(255,255,255,0.07)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[5px] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_24px_55px_rgba(75,0,22,0.28),inset_0_1px_0_rgba(255,255,255,0.10)] text-[#ffffff]"
                  >
                    {/* Subtle Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[linear-gradient(90deg,#A90032,#E8B63F)]" />
                    
                    <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6 relative z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest text-[#ffd66b] uppercase bg-[rgba(242,189,60,0.14)] border border-[rgba(242,189,60,0.55)]">
                        {story.category}
                      </span>
                      <span className="text-xs font-bold tracking-widest text-[#f2bd3c]">
                        {story.year}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#ffffff] mb-3 leading-tight tracking-tight relative z-10">
                      {story.achievement}
                    </h3>
                    
                    <p className="text-[0.95rem] text-[rgba(255,255,255,0.80)] leading-relaxed mb-6 flex-grow relative z-10">
                      "{story.story}"
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[rgba(255,255,255,0.17)] relative z-10">
                      <div>
                        <p className="text-[0.65rem] sm:text-xs font-bold text-[#f2bd3c] tracking-wider uppercase mb-0.5">
                          {story.role}
                        </p>
                        <p className="text-[0.95rem] font-bold text-[#ffffff] tracking-tight">
                          {story.name}
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.22)] flex items-center justify-center transition-[background-color,border-color,color,transform] duration-300 ease-in-out text-[#f2bd3c] [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[#f2bd3c] [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-[#f2bd3c] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[#4a0015] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-[2px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-none" strokeWidth={2.5} aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Global CTA Section */}
        {hasStories && (
          <div className="flex justify-center mt-4 rm-reveal" style={{ transitionDelay: "300ms" }}>
            <Link 
              href="/achievements"
              className="section-cta"
            >
              Explore All Inspiring Stories
              <ArrowRight className="w-5 h-5 section-cta-arrow" strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};
