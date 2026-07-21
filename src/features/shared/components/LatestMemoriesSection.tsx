"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Types
export interface MemoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  imageAlt: string;
  href: string;
}

// Temporary Placeholder Data - Intended to be replaced by Supabase gallery fetch
const MEMORY_ITEMS: MemoryItem[] = [
  {
    id: "mem-1",
    category: "Campus Life",
    title: "A Beautiful Evening at Ravenshaw",
    date: "July 2026",
    location: "Ravenshaw University Campus",
    image: "/hero/hero-1.webp",
    imageAlt: "A beautiful evening at Ravenshaw University campus",
    href: "/gallery"
  },
  {
    id: "mem-2",
    category: "Achievement",
    title: "Celebrating Ravenshaw Excellence",
    date: "July 2026",
    location: "Ravenshaw University",
    image: "/hero/hero-2.webp",
    imageAlt: "Students celebrating excellence at Ravenshaw",
    href: "/gallery"
  },
  {
    id: "mem-3",
    category: "Department",
    title: "Moments That Bring Us Together",
    date: "June 2026",
    location: "Department Community",
    image: "/hero/hero-3.webp",
    imageAlt: "Department community gathering",
    href: "/gallery"
  },
  {
    id: "mem-4",
    category: "Hostel Life",
    title: "More Than Rooms, A Family",
    date: "June 2026",
    location: "Ravenshaw Hostels",
    image: "/hero/hero-4.webp",
    imageAlt: "Students sharing memories in Ravenshaw Hostels",
    href: "/gallery"
  },
  {
    id: "mem-5",
    category: "Culture",
    title: "Celebrating Talent and Tradition",
    date: "May 2026",
    location: "Ravenshaw University",
    image: "/hero/hero-5.webp",
    imageAlt: "Cultural programme at Ravenshaw",
    href: "/gallery"
  },
  {
    id: "mem-6",
    category: "Campus Life",
    title: "Evening Lights Over Heritage Hall",
    date: "April 2026",
    location: "Heritage Campus",
    image: "/hero/hero-2.webp",
    imageAlt: "Evening lights at Ravenshaw",
    href: "/gallery"
  }
];

export const LatestMemoriesSection = () => {
  const gridMemories = MEMORY_ITEMS.slice(0, 6);
  const revealRef = useScrollReveal();

  return (
    <section 
      className="relative w-full z-20" 
      style={{ 
        paddingTop: 'clamp(52px, 5vw, 72px)', 
        paddingBottom: 'clamp(20px, 4vw, 48px)', 
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(190, 20, 65, 0.22), transparent 42%), linear-gradient(145deg, #2b050e 0%, #500015 45%, #720020 100%)' 
      }} 
      ref={revealRef as React.RefObject<HTMLDivElement>}
    >
      <div className="container relative mx-auto px-[clamp(1.25rem,4vw,3rem)] z-10 max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-[18px] rm-reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 sm:w-8 h-[2px] bg-[#f2bd3c]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[#f2bd3c] uppercase">
              Moments That Live On
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[#f2bd3c]" />
          </div>
          
          <h2 
            className="text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold rm-heading-primary leading-[1.1] mb-6 tracking-tight text-balance"
            style={{ textShadow: '0 3px 20px rgba(0, 0, 0, 0.18)' }}
          >
            <span className="text-[#f2bd3c]">Every Memory</span> <span className="text-[#ffffff]">Tells a Story</span>
          </h2>
          
          <p 
            className="text-[clamp(1rem,2vw,1.15rem)] font-medium" 
            style={{ color: 'rgba(255, 255, 255, 0.82)', maxWidth: '760px', marginInline: 'auto', lineHeight: '1.75' }}
          >
            From celebrations and achievements to friendships and everyday campus life, every photograph preserves a moment that connects Ravenshawvians across generations.
          </p>
        </div>

        {/* Premium Editorial Photo Grid */}
        <style>{`
          .memory-gallery-container {
            display: flex;
            flex-direction: column;
            gap: 18px;
            width: 100%;
            max-width: 1100px;
            margin-inline: auto;
          }
          .gallery-row {
            display: flex;
            gap: 18px;
            width: 100%;
            height: 280px;
          }
          .gallery-card-wrapper {
            flex: 1;
            position: relative;
            height: 100%;
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 12px 30px rgba(20, 0, 7, 0.28);
            transition: flex 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms ease, box-shadow 400ms ease;
            cursor: pointer;
            outline: none;
          }
          
          @media (min-width: 768px) {
            .gallery-row:hover .gallery-card-wrapper {
              flex: 0.6;
            }
            .gallery-row .gallery-card-wrapper:hover {
              flex: 2.2;
              transform: translateY(-4px);
              border-color: rgba(242, 189, 60, 0.55);
              box-shadow: 0 20px 42px rgba(20, 0, 7, 0.42);
              z-index: 20;
            }
            .gallery-row:hover .gallery-card-wrapper:not(:hover) .gallery-card-content {
              opacity: 0;
              transform: translateY(10px);
            }
            .gallery-row:hover .gallery-card-wrapper:not(:hover) .gallery-card-overlay {
              background: linear-gradient(to top, rgba(20, 0, 7, 0.6) 0%, rgba(30, 0, 10, 0.2) 100%);
            }
          }
          
          .gallery-card-wrapper:focus-visible {
            box-shadow: 0 0 0 2px #f2bd3c, 0 0 0 6px #720020;
          }
          
          .gallery-card-wrapper img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
            transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          }
          
          .gallery-card-wrapper:hover img {
            transform: scale(1.05);
          }
          
          .gallery-card-content {
            position: absolute;
            left: 18px;
            bottom: 16px;
            width: calc(100% - 36px);
            min-width: 240px; /* Prevents text from squishing when card shrinks */
            z-index: 10;
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          
          .gallery-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(20, 0, 7, 0.92) 0%, rgba(30, 0, 10, 0.38) 48%, transparent 75%);
            pointer-events: none;
            z-index: 1;
            transition: background 0.4s ease;
          }
          
          @media (min-width: 1024px) and (max-width: 1440px) {
            .gallery-row {
              height: 250px;
            }
          }
          
          @media (max-width: 767px) {
            .memory-gallery-container {
              gap: 16px;
              padding-inline: 18px;
            }
            .gallery-row {
              flex-direction: column;
              height: auto;
              gap: 16px;
            }
            .gallery-card-wrapper {
              height: 220px;
              width: 100%;
              border-radius: 14px;
            }
            .gallery-card-content {
              min-width: 0;
            }
          }
        `}</style>

        <div className="memory-gallery-container" style={{ marginTop: 'clamp(32px, 3vw, 45px)' }}>
          {[0, 1].map((rowIndex) => (
            <div key={`row-${rowIndex}`} className="gallery-row">
              {gridMemories.slice(rowIndex * 3, rowIndex * 3 + 3).map((memory, index) => {
                const globalIndex = rowIndex * 3 + index;
                return (
                  <Link 
                    key={memory.id}
                    href={memory.href}
                    className="gallery-card-wrapper group rm-reveal block"
                    style={{ transitionDelay: `${globalIndex * 100}ms` }}
                    aria-label={`View memory: ${memory.title}`}
                  >
                    <div className="absolute inset-0 w-full h-full z-0">
                      <Image
                        src={memory.image}
                        alt={memory.imageAlt}
                        fill
                        quality={75}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="motion-reduce:transition-none"
                      />
                    </div>
                    
                    <div className="gallery-card-overlay" />
                    
                    <div className="gallery-card-content">
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#f2bd3c' }} className="uppercase drop-shadow-md">
                          {memory.category}
                        </span>
                        <div className="transform transition-transform duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1 [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-1">
                          <ArrowUpRight className="w-4 h-4 text-[#f2bd3c] drop-shadow-md" aria-hidden="true" />
                        </div>
                      </div>
                      
                      <h3 
                        className="mb-2 drop-shadow-md transition-colors group-hover:text-[#f2bd3c]" 
                        style={{ fontSize: 'clamp(17px, 1.4vw, 21px)', lineHeight: 1.18, fontWeight: 700, color: '#ffffff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {memory.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3" style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.78)' }}>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-[#f2bd3c]" aria-hidden="true" />
                          <span>{memory.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#f2bd3c]" aria-hidden="true" />
                          <span className="line-clamp-1">{memory.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Global CTA Section */}
        <div className="flex justify-center rm-reveal" style={{ marginTop: '28px' }}>
          <Link 
            href="/gallery"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-sm sm:text-base tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-[#720020] bg-[#f2bd3c] text-[#3d0012] border border-[#f2bd3c] hover:bg-[#ffffff] hover:text-[#65001f] hover:-translate-y-[2px]"
          >
            Explore All Memories
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
};
