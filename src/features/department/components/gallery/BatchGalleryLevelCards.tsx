import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchGalleryLevelCardsProps {
  slug: string;
  galleryType: "freshers" | "farewell";
}

export const BatchGalleryLevelCards: React.FC<BatchGalleryLevelCardsProps> = ({
  slug,
  galleryType
}) => {
  const cards = [
    {
      id: "ug",
      title: "UG Batch Photos",
      description: "Browse historical and recent undergraduate batches.",
      icon: GraduationCap,
      href: `/departments/${slug}/gallery/${galleryType}/ug`,
      gradient: "from-[#5B001B] via-[#7A1432] to-[#A3254D]",
      accent: "text-[#D4AF37]",
      shadow: "hover:shadow-[0_25px_70px_rgba(91,0,27,0.3)]",
      border: "hover:border-[#D4AF37]/50"
    },
    {
      id: "pg",
      title: "PG Batch Photos",
      description: "Browse historical and recent postgraduate batches.",
      icon: BookOpen,
      href: `/departments/${slug}/gallery/${galleryType}/pg`,
      gradient: "from-[#0F3A52] via-[#175B7E] to-[#2B82B5]",
      accent: "text-blue-300",
      shadow: "hover:shadow-[0_25px_70px_rgba(15,58,82,0.3)]",
      border: "hover:border-blue-400/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className={cn(
              "group relative flex flex-col justify-between w-full overflow-hidden isolate",
              "h-[200px] sm:h-[240px]",
              "rounded-[24px] p-6 sm:p-8",
              "bg-gradient-to-br backdrop-blur-xl",
              card.gradient,
              "border border-white/10",
              card.border,
              "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_40px_rgba(0,0,0,0.15)]",
              card.shadow,
              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "hover:scale-[1.03] hover:-translate-y-2 hover:brightness-105",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8]"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] z-[-1] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay z-[-1] pointer-events-none" />

            <div className="flex items-start justify-between z-10 w-full">
              <div className={`w-14 h-14 rounded-full bg-black/20 border border-white/20 flex items-center justify-center ${card.accent} shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 shrink-0`}>
                <Icon className="w-7 h-7 stroke-[1.5]" />
              </div>

              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-white/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 shrink-0">
                <ArrowRight className={`w-5 h-5 ${card.accent} transform transition-transform duration-500 group-hover:translate-x-1`} />
              </div>
            </div>

            <div className="z-10 mt-auto pt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-white/70 leading-snug group-hover:text-white/90 transition-colors duration-300">
                {card.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
