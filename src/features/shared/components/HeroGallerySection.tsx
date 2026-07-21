"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GalleryMemory {
  id: string;
  category: string;
  title: string;
  date: string;
  imagePath: string;
  href: string;
  desktopSpan: string;
  tabletSpan: string;
}

const GALLERY_MEMORIES: GalleryMemory[] = [
  {
    id: "campus-life",
    category: "CAMPUS LIFE",
    title: "Where Every Journey Begins",
    date: "2026",
    imagePath: "/images/hero/hero-1.webp",
    href: "/gallery/campus-life",
    desktopSpan: "",
    tabletSpan: "", 
  },
  {
    id: "celebrations",
    category: "CELEBRATIONS",
    title: "Traditions We Celebrate Together",
    date: "2025",
    imagePath: "/images/hero/hero-2.webp",
    href: "/gallery/celebrations",
    desktopSpan: "",
    tabletSpan: "",
  },
  {
    id: "friendships",
    category: "FRIENDSHIPS",
    title: "The People Who Made It Home",
    date: "2025",
    imagePath: "/images/hero/hero-3.webp",
    href: "/gallery/friendships",
    desktopSpan: "",
    tabletSpan: "",
  },
  {
    id: "achievements",
    category: "ACHIEVEMENTS",
    title: "Moments That Made Us Proud",
    date: "2024",
    imagePath: "/images/hero/hero-4.webp",
    href: "/gallery/achievements",
    desktopSpan: "",
    tabletSpan: "",
  }
];

export const HeroGallerySection = () => {
  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 bg-background overflow-hidden z-20">
      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <span className="w-8 h-[2px] bg-[#D9A441]" />
            <span className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.15em] text-[#8A1538] uppercase">
              Moments That Live Forever
            </span>
            <span className="w-8 h-[2px] bg-[#D9A441]" />
          </div>
          
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-[var(--color-light-heading-primary)] leading-[1.15] mb-6 tracking-tight">
            Every Memory Has a Story
          </h2>
          
          <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-light-body)] leading-[1.7] font-medium">
            From friendships and celebrations to achievements, classrooms, hostel life, and quiet moments across campus, every photograph carries a story. Ravenshaw Moments brings these memories together so they can be revisited, shared, and preserved for generations.
          </p>
        </motion.div>

        {/* Interactive CSS for Gallery */}
        <style>{`
          .memory-gallery {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px;
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }

          .memory-card {
            position: relative;
            width: 100%;
            aspect-ratio: 1 / 1;
            min-width: 0;
            overflow: hidden;
            border-radius: 18px;
            background: #5b001b;
            cursor: pointer;
            isolation: isolate;
            transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms ease;
          }

          .memory-card,
          .memory-card-featured,
          .memory-card-small {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
            grid-column: auto;
            grid-row: auto;
          }

          .memory-card img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1), filter 600ms ease;
          }

          .memory-card[data-image-position="bottom"] img {
            object-position: center bottom;
          }

          .memory-card[data-image-position="top"] img {
            object-position: center top;
          }

          .memory-card::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background: linear-gradient(
              180deg,
              rgba(20, 0, 7, 0.02) 20%,
              rgba(20, 0, 7, 0.18) 48%,
              rgba(20, 0, 7, 0.92) 100%
            );
            transition: background 450ms ease;
          }

          .memory-card-content {
            position: absolute;
            inset: auto 0 0 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-width: 0;
            padding: 24px;
            color: #ffffff;
          }

          .memory-card-category {
            width: fit-content;
            margin-bottom: 12px;
            padding: 7px 12px;
            border-radius: 999px;
            background: #e6b83f;
            color: #27000c;
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .memory-card-title {
            margin: 0;
            color: #ffffff;
            font-size: clamp(1.15rem, 1.5vw, 1.55rem);
            font-weight: 750;
            line-height: 1.15;
            white-space: normal;
            overflow-wrap: anywhere;
          }

          .memory-card-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 14px;
            color: rgba(255, 255, 255, 0.88);
            font-size: 0.82rem;
          }

          .memory-card-arrow {
            position: absolute;
            top: 18px;
            right: 18px;
            z-index: 3;
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border: 1px solid rgba(255, 255, 255, 0.32);
            border-radius: 50%;
            color: #ffffff;
            background: rgba(50, 0, 15, 0.38);
            backdrop-filter: blur(10px);
            transition: transform 350ms ease, background-color 350ms ease, border-color 350ms ease;
          }

          @media (hover: hover) and (pointer: fine) {
            .memory-card:hover {
              transform: translateY(-7px);
              box-shadow: 0 24px 55px rgba(70, 0, 22, 0.18), 0 8px 22px rgba(20, 0, 8, 0.12);
            }

            .memory-card:hover img {
              transform: scale(1.07);
            }

            .memory-card:hover .memory-card-arrow {
              transform: rotate(45deg);
              color: #33000f;
              background: #e6b83f;
              border-color: #e6b83f;
            }
          }

          @media (max-width: 1024px) {
            .memory-gallery {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 18px;
            }

            .memory-card {
              aspect-ratio: 1 / 1;
            }
          }

          @media (max-width: 640px) {
            .memory-gallery {
              grid-template-columns: minmax(0, 1fr);
              gap: 18px;
              padding-inline: 18px;
            }

            .memory-card {
              width: 100%;
              aspect-ratio: 1 / 1;
              border-radius: 16px;
            }

            .memory-card-content {
              padding: 20px;
            }

            .memory-card-title {
              font-size: 1.35rem;
            }

            .memory-card-arrow {
              top: 15px;
              right: 15px;
              width: 38px;
              height: 38px;
            }
          }
        `}</style>

        {/* Gallery Grid */}
        <div className="memory-gallery">
          {GALLERY_MEMORIES.slice(0, 4).map((memory, index) => (
            <article key={memory.id} className="memory-card">
              <Link href={memory.href} className="absolute inset-0 outline-none" aria-label={`View memory: ${memory.title}`}>
                <Image
                  src={memory.imagePath}
                  alt={memory.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={index < 4}
                />
                <div className="memory-card-arrow">
                  <ArrowRight className="w-5 h-5 -rotate-45" strokeWidth={2.5} />
                </div>
                <div className="memory-card-content">
                  <div className="memory-card-category">
                    {memory.category}
                  </div>
                  <h3 className="memory-card-title">
                    {memory.title}
                  </h3>
                  <div className="memory-card-meta">
                    <span>{memory.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.4)]" />
                    <span>View Memory</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Global CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center mt-12 md:mt-16 text-center"
        >
          <p className="text-[var(--color-light-body)] font-serif italic text-lg sm:text-xl mb-8">
            Some moments pass in seconds. Their memories stay with us forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <Link 
              href="/gallery"
              className="section-cta"
            >
              Explore All Memories
              <ArrowRight className="w-5 h-5 section-cta-arrow" strokeWidth={2.5} aria-hidden="true" />
            </Link>
            
            <Link 
              href="/gallery/upload"
              className="group flex items-center gap-2 text-[#8A1538] font-semibold text-base transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A1538] focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-md px-2 py-1 -mx-2"
            >
              <span className="relative">
                Share Your Memory
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D9A441] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:w-full" />
              </span>
              <ArrowRight className="w-4 h-4 transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
