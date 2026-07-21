"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Quote } from "lucide-react";

export const AlumniEditorial: React.FC = () => {
  const revealRef = useScrollReveal({ selector: ".editorial-reveal", staggerDelay: 150 });

  return (
    <section 
      ref={revealRef as React.RefObject<HTMLElement>}
      aria-labelledby="alumni-editorial-heading" 
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #31000C 0%, #590018 50%, #790021 100%)",
        padding: "70px 24px"
      }}
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5" aria-hidden="true">
        <Quote className="w-64 h-64 text-[#F2B936]" />
      </div>

      <style>{`
        .editorial-reveal {
          opacity: 0;
          transition: opacity 800ms ease-in-out;
        }
        .rm-reveal-active.editorial-reveal {
          opacity: 1;
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 editorial-reveal">
        <div className="inline-flex items-center justify-center mb-2">
          <span className="text-[#F2B936] text-[12px] font-[700] uppercase tracking-[0.18em]">
            HERITAGE & COMMUNITY
          </span>
        </div>

        <h2
          id="alumni-editorial-heading"
          className="text-white font-[800] tracking-tight leading-tight"
          style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
        >
          Ravenshaw Never Becomes the Past
        </h2>

        <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.80)] max-w-[760px] mx-auto leading-[1.75]">
          The classrooms, hostels, friendships, celebrations, challenges, and
          dreams may belong to different years, but the connection remains. The
          Alumni Directory brings those generations together through the
          stories and journeys they choose to share.
        </p>
      </div>
    </section>
  );
};
