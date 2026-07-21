"use client";

import { ChevronDown } from "lucide-react";

export function HeroScrollDown() {
  const handleScroll = () => {
    const hero = document.getElementById("hero-section");
    const nextSection = hero?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-subtle-float {
            animation: subtle-float 3s ease-in-out infinite;
          }
        }
      `}</style>
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={handleScroll}
          aria-label="Scroll down to next section"
          className="w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white hover:border-white/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="animate-subtle-float">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      </div>
    </>
  );
}
