"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    image: "/hero/hero-1.webp",
    tagline: "Preserving Memories",
    titleClamp: "clamp(1.8rem, 6.5vw, 5rem)"
  },
  {
    image: "/hero/hero-2.webp",
    tagline: "Connecting Generations",
    titleClamp: "clamp(1.6rem, 5.5vw, 4.2rem)"
  },
  {
    image: "/hero/hero-3.webp",
    tagline: "Celebrating Achievements",
    titleClamp: "clamp(1.5rem, 5vw, 3.8rem)"
  },
  {
    image: "/hero/hero-4.webp",
    tagline: "Living Legacy",
    titleClamp: "clamp(2.2rem, 8vw, 5.5rem)"
  },
];

const FADE_MS = 1000;

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(SLIDES.length - 1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const tick = () => {
      const currentIsMobile = window.innerWidth < 768;
      
      if (!document.hidden) {
        setCurrentIndex((prev) => {
          setPrevIndex(prev);
          return (prev + 1) % SLIDES.length;
        });
      }
      
      timer = setTimeout(tick, currentIsMobile ? 4500 : 5000);
    };

    timer = setTimeout(tick, window.innerWidth < 768 ? 4500 : 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
      <style>{`
        @keyframes rm-hero-zoom-mobile {
          0% { transform: scale(1); }
          100% { transform: scale(1.04) translateX(-0.5%); }
        }
        @keyframes rm-hero-zoom-tablet {
          0% { transform: scale(1); }
          100% { transform: scale(1.05) translateX(-0.5%); }
        }
        @keyframes rm-hero-zoom-desktop {
          0% { transform: scale(1); }
          100% { transform: scale(1.06) translateX(-0.5%); }
        }

        .rm-hero-zoom {
          animation: rm-hero-zoom-mobile 7s ease-out forwards;
        }
        @media (min-width: 640px) {
          .rm-hero-zoom {
            animation-name: rm-hero-zoom-tablet;
          }
        }
        @media (min-width: 1024px) {
          .rm-hero-zoom {
            animation-name: rm-hero-zoom-desktop;
          }
        }
      `}</style>

      {/* 1. Images Layer */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === prevIndex;
        // Preload next image before transition
        const isNext = index === (currentIndex + 1) % SLIDES.length;
        const shouldMount = isActive || isPrev || isNext || index === 0;

        // Current image stays zoomed so it doesn't jump backwards while crossfading out
        const isZoomed = isActive || isPrev;

        return (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive ? "opacity-100 z-10" : isPrev ? "opacity-100 z-0" : "opacity-0 z-0"
            } ${isActive || isPrev ? "will-change-[opacity]" : ""}`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={!isActive}
          >
            <div
              className={`relative w-full h-full transform-gpu ${
                isZoomed ? "rm-hero-zoom will-change-transform" : ""
              } motion-reduce:animation-none motion-reduce:scale-100`}
            >
              {shouldMount && (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                  quality={85}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* 2. Permanent Stable Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* 3. Text & Action Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pb-16 px-4 sm:px-6 lg:px-8 pointer-events-none">
        
        {/* Changing Animated Tagline Layer */}
        <div className="relative w-full max-w-4xl h-[60px] sm:h-[80px] md:h-[100px] mb-4 sm:mb-6">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === prevIndex;
            
            // Minimal premium upward movement (16px = translate-y-4)
            let yOffset = "translate-y-4"; 
            let opacity = "opacity-0";
            if (isActive) {
              yOffset = "translate-y-0";
              opacity = "opacity-100";
            } else if (isPrev) {
              yOffset = "-translate-y-2";
              opacity = "opacity-0";
            }

            const baseAnimClass = `transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${yOffset} ${opacity} motion-reduce:transition-none motion-reduce:translate-y-0`;

            return (
              <div
                key={`text-${index}`}
                className={`absolute inset-0 flex flex-col items-center justify-end w-full h-full ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                aria-hidden={!isActive}
              >
                <h1 
                  className={`font-extrabold tracking-tight drop-shadow-sm leading-[1.02] w-full whitespace-nowrap ${baseAnimClass}`}
                  style={{ fontSize: slide.titleClamp }}
                >
                  <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-sm contrast-125 saturate-150 brightness-110">
                    {slide.tagline}
                  </span>
                </h1>
              </div>
            );
          })}
        </div>

        {/* Permanent Description Layer - Never Remounts */}
        <p className="text-gray-100 drop-shadow-md mx-auto leading-[1.5] w-[min(92vw,850px)] px-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.9rem,2.5vw,1.1rem)] mb-8 sm:mb-9 pointer-events-auto">
          The premier digital community platform for Ravenshaw University students, alumni, and faculty. Discover events, celebrate achievements, and stay connected.
        </p>

        {/* Permanent Buttons Layer - Never Remounts */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full pointer-events-auto">
          <Link 
            href="/organizations" 
            className="interactive-card flex items-center justify-center bg-primary text-white px-5 sm:px-7 h-10 sm:h-11 rounded-full text-sm sm:text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Explore Campus
          </Link>
          <Link 
            href="/about" 
            className="interactive-card flex items-center justify-center bg-white/10 text-white backdrop-blur-sm border border-white/30 px-5 sm:px-7 h-10 sm:h-11 rounded-full text-sm sm:text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Our Heritage
          </Link>
        </div>
      </div>
    </div>
  );
}
