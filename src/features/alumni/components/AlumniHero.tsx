"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const AlumniHero: React.FC = () => {
  const revealRef = useScrollReveal({ selector: ".hero-reveal", staggerDelay: 100 });

  return (
    <section 
      ref={revealRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden -mt-[72px] sm:-mt-[76px] min-[1150px]:-mt-20"
      style={{
        background: "linear-gradient(135deg, rgba(12, 12, 12, 0.96) 0%, rgba(20, 20, 20, 0.88) 48%, rgba(32, 32, 32, 0.78) 100%)",
        minHeight: "360px",
        height: "auto",
        padding: "80px 24px 72px"
      }}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('/patterns/arch.svg')] bg-no-repeat bg-center mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(242,185,54,0.06)_0%,transparent_70%)] blur-[60px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(142,0,40,0.06)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <style>{`
        .hero-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 600ms ease-out, transform 600ms ease-out;
        }
        .rm-reveal-active.hero-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .hero-eyebrow-line {
          width: 24px;
          height: 1px;
          background: #F2B936;
        }
        .hero-eyebrow-text {
          color: #F2B936;
          text-transform: uppercase;
          font-size: clamp(12px, 1.2vw, 13px);
          font-weight: 700;
          letter-spacing: 0.18em;
        }
      `}</style>

      <div className="pt-[72px] sm:pt-[76px] min-[1150px]:pt-20 w-full flex flex-col items-center">
        <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Label */}
          <div className="hero-eyebrow hero-reveal" style={{ transitionDelay: '50ms' }}>
            <span className="hero-eyebrow-line" aria-hidden="true" />
            <span className="hero-eyebrow-text">GENERATIONS OF RAVENSHAW</span>
            <span className="hero-eyebrow-line" aria-hidden="true" />
          </div>

          {/* Main Heading */}
          <h1 className="hero-reveal text-white font-[800] max-w-[900px] mx-auto mb-6 leading-[1.05]" style={{ fontSize: "clamp(34px, 5vw, 68px)", transitionDelay: '150ms' }}>
            Find Your People.<br />
            <span className="text-[#F2B936]">Relive Your Ravenshaw Journey.</span>
          </h1>

          {/* Description */}
          <p className="hero-reveal text-[rgba(255,255,255,0.82)] leading-[1.7] max-w-[760px] mx-auto text-[15px] md:text-[17px] lg:text-[18px]" style={{ transitionDelay: '250ms' }}>
            Reconnect with classmates, discover alumni across generations, and preserve the friendships, achievements, and memories that continue long after college.
          </p>
        </div>
      </div>
    </section>
  );
};
