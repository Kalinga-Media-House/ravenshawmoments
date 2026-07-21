"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Image as ImageIcon, 
  ChevronRight, 
  MapPin
} from "lucide-react";

export interface DepartmentHeroSectionProps {
  name: string;
  slug: string;
  category: string;
  establishedYear: number;
  description: string;
  motto: string;
  officeLocation: string;
  coverImageUrl?: string;
  studentCount?: number;
  facultyCount?: number;

  achievementsCount?: number;

}

export const DepartmentHeroSection: React.FC<DepartmentHeroSectionProps> = ({
  name,
  slug,
  category,
  establishedYear,
  description,
  motto,
  officeLocation,
  coverImageUrl,
}) => {
  // Use department-specific database cover image if available, otherwise use high-res local 16:9 campus placeholder
  const placeholderIdx = (Math.abs(slug.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 5) + 1;
  const coverImage = coverImageUrl || `/hero/hero-${placeholderIdx}.webp`;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#181516] via-[#241318] to-[#5B001B] pt-8 sm:pt-12 pb-6 sm:pb-8 text-white border-b-2 border-[#D4AF37]">
      {/* Background Ambient Lighting & Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#5B001B]/40 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Bar with Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] mb-5 sm:mb-6 relative z-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          <Link href="/departments" className="hover:text-white transition-colors font-medium">Departments</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold truncate">Department of {name}</span>
        </nav>
      </div>

      {/* Main Two-Column Hero Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Breadcrumb context, Name, Motto, Description & CTA Row */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            {/* Department Name */}
            <h1 className="font-black text-white tracking-tight leading-[1.1] font-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
              Department of <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFFDF8] to-[#D4AF37]">{name}</span>
            </h1>

            {/* Department Motto */}
            <p className="text-lg sm:text-xl font-bold text-[#D4AF37] tracking-wide leading-relaxed italic">
              &ldquo;{motto}&rdquo;
            </p>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed font-medium">
              {description}
            </p>

            {/* Location Pill */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-semibold pt-1">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{officeLocation}</span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-8">
              <a
                href="https://ravenshawuniversity.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#e6c55c] text-[#1E1B1C] font-extrabold text-sm sm:text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Official Website</span>
              </a>

              <a
                href="#gallery"
                onClick={(e) => handleSmoothScroll(e, "gallery")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md hover:scale-105"
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Gallery</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Large 16:9 Department Cover Image inside Luxury 24px Glass Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* 16:9 Aspect Ratio Container with 24px rounded corners & subtle zoom/parallax */}
            <div className="relative rounded-[24px] overflow-hidden border border-white/20 shadow-2xl shadow-black/80 aspect-video group bg-black/60">
              {/* Department campus photograph with subtle hover zoom effect */}
              <Image
                src={coverImage}
                alt={`Department of ${name} Campus & Architecture`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />

              {/* Dark Black Cinematic Gradient Overlay for text readability & depth */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.85) 100%)"
                }}
              >
                {/* Top Overlay Bar: Category & Campus Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/60 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md shadow-md">
                    {category} Department
                  </span>
                  <span className="text-xs font-semibold text-white/90 bg-black/60 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                    Academic &amp; Research Wing
                  </span>
                </div>

                {/* Bottom Overlay Bar: Small Floating Established Badge & Title */}
                <div className="flex items-end justify-between gap-4 pt-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                      Ravenshaw University Heritage
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-serif drop-shadow-md">
                      Department of {name}
                    </h3>
                  </div>

                  {/* Small Floating Established Badge */}
                  <div className="px-3.5 py-2 rounded-xl bg-[#5B001B]/90 border border-[#D4AF37]/60 text-center shadow-lg backdrop-blur-md shrink-0">
                    <span className="text-[9px] font-bold text-white uppercase tracking-tighter block">Established</span>
                    <span className="text-sm font-black text-[#D4AF37] block leading-none mt-0.5">{establishedYear}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle external glow beneath the 16:9 card */}
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-[#D4AF37]/20 to-transparent blur-xl -z-10 opacity-60 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
