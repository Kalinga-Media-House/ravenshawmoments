import React from "react";

export function HomepageDisclaimerTicker() {
  const disclaimerText = "This is not an official platform, but an independent community initiative dedicated to preserving Ravenshaw memories and celebrating achievements.";

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 w-full z-40 flex items-stretch border-t border-white/10"
      role="note" 
      aria-label="Website disclaimer"
      style={{
        height: "clamp(30px, 4vw, 42px)",
      }}
    >
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-attention {
          animation: subtle-pulse 1.4s ease-in-out infinite;
        }
        .animate-marquee {
          animation: marquee-scroll 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-attention {
            animation: none;
            opacity: 1;
          }
          .animate-marquee {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Left side: ATTENTION */}
      <div className="bg-white px-3 sm:px-5 md:px-7 flex items-center justify-center shrink-0 border-r border-black/10 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.15)] relative">
        <span className="animate-attention text-[var(--color-maroon)] font-bold text-[0.65rem] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase whitespace-nowrap">
          ATTENTION
        </span>
      </div>

      {/* Right side: Moving ticker */}
      <div className="heritage-navbar flex-1 overflow-hidden relative flex items-center">
        <div className="animate-marquee flex whitespace-nowrap items-center w-max">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} aria-hidden={i !== 1 ? "true" : "false"} className="flex pl-4 sm:pl-8 pr-12 sm:pr-24">
              <span className="text-white text-[0.7rem] sm:text-xs md:text-sm tracking-wide font-medium">
                {disclaimerText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
