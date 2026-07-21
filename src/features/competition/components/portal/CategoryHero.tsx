import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { CompetitionCategoryRecord } from "../../types/categoryPortal";
import { getCategoryPortalTheme, renderCategoryPortalIcon } from "./CategoryThemeRegistry";
import { getCompetitionFallbackImage } from "../../utils/images";

interface CategoryHeroProps {
  category: CompetitionCategoryRecord;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  const theme = getCategoryPortalTheme(category.slug);
  const fallbackImage = getCompetitionFallbackImage(category.name);

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12 md:p-16"
      style={{
        background: "linear-gradient(135deg, rgba(12, 12, 12, 0.96) 0%, rgba(20, 20, 20, 0.88) 100%)"
      }}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={fallbackImage}
          alt=""
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div 
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.42))" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-start gap-6 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#FFF9F0]/70">
          <Link
            href="/competitions"
            className="hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
          >
            Competitions
          </Link>
          <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#FFF9F0] font-medium">{category.name}</span>
        </nav>

        {/* Category Badge & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl border border-[#D4AF37]/30 bg-[#4A0E17]/80 text-[#D4AF37] shadow-lg"
            aria-hidden="true"
          >
            {renderCategoryPortalIcon(theme.iconName, "w-8 h-8")}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FFF9F0]">
              {category.name}
            </h1>
          </div>
        </div>

        {/* Category Authoritative Description */}
        <p className="text-base sm:text-lg text-[#FFF9F0]/85 leading-relaxed max-w-3xl">
          {category.description ||
            `Explore active competition opportunities, recent monthly winners, historical archives, and the official leaderboard for ${category.name} at Ravenshaw University.`}
        </p>
      </div>
    </section>
  );
}
