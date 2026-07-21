"use client";

import React from "react";
import Link from "next/link";
import { 
  Building, 
  PartyPopper, 
  Camera, 
  CalendarDays, 
  Presentation,
  ArrowRight
} from "lucide-react";
import { SectionHeader } from "./common";
import { cn } from "@/lib/utils";

export interface DepartmentGalleryHubProps {
  departmentName: string;
  slug: string;
}

// Ensure Tailwind compiles these specific gradient classes by defining them completely
const galleryThemes = {
  department: "bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#60A5FA]",
  freshers: "bg-gradient-to-br from-[#C2410C] via-[#F59E0B] to-[#FBBF24]",
  farewell: "bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A78BFA]",
  event: "bg-gradient-to-br from-[#065F46] via-[#059669] to-[#34D399]",
  seminar: "bg-gradient-to-br from-[#9F1239] via-[#E11D48] to-[#FB7185]",
};

const GALLERY_CARDS = [
  {
    id: "department",
    title: "Department Photos",
    description: "Department building, laboratories, classrooms, teachers, campus life and academic environment.",
    icon: Building,
    href: "department",
    theme: galleryThemes.department,
  },
  {
    id: "freshers",
    title: "Freshers Photos",
    description: "Freshers celebrations organised for every UG and PG batch.",
    icon: PartyPopper,
    href: "freshers",
    theme: galleryThemes.freshers,
  },
  {
    id: "farewell",
    title: "Farewell Photos",
    description: "Farewell memories for every outgoing batch.",
    icon: Camera,
    href: "farewell",
    theme: galleryThemes.farewell,
  },
  {
    id: "events",
    title: "Event Photos",
    description: "Workshops, competitions, annual functions, cultural programmes and departmental events.",
    icon: CalendarDays,
    href: "events",
    theme: galleryThemes.event,
  },
  {
    id: "seminars",
    title: "Seminar Photos",
    description: "National seminars, guest lectures, conferences and academic presentations.",
    icon: Presentation,
    href: "seminars",
    theme: galleryThemes.seminar,
  }
];

export const DepartmentGalleryHub: React.FC<DepartmentGalleryHubProps> = ({
  departmentName,
  slug,
}) => {
  return (
    <section id="gallery" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2]">
      <SectionHeader
        title="Department Gallery"
        subtitle="Browse photographs and memories of the department across different activities and academic years."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-6 mt-8 sm:mt-12">
        {GALLERY_CARDS.map((card) => {
          const Icon = card.icon;
          
          return (
            <Link
              key={card.id}
              href={`/departments/${slug}/gallery/${card.href}`}
              className={cn(
                "group relative flex flex-col w-full overflow-hidden isolate",
                "h-[280px]",
                "rounded-3xl p-6 pb-7",
                card.theme,
                "border border-white/15",
                "shadow-xl",
                "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:brightness-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8]"
              )}
            >
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)] z-[-1] pointer-events-none" />
              <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-white/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/2 z-[-1] pointer-events-none" />
              <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 border border-white/10 rounded-full z-[-1] pointer-events-none" />
              <div className="absolute bottom-[10%] right-[-10%] w-24 h-24 border border-white/10 rounded-full z-[-1] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-[-1] pointer-events-none" />

              {/* Top: Icon */}
              <div className="z-10 w-14 h-14 mb-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/30 shrink-0">
                <Icon className="w-7 h-7 stroke-[1.5]" />
              </div>

              {/* Middle: Text */}
              <div className="z-10">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-white/90 leading-snug line-clamp-3 group-hover:text-white transition-colors">
                  {card.description}
                </p>
              </div>
                
              {/* Footer: Explore & Arrow - Pinned to bottom using mt-auto */}
              <div className="z-10 flex items-center justify-between pt-4 border-t border-white/20 mt-auto w-full">
                <span className="text-sm font-semibold text-white group-hover:text-white">
                  Explore Gallery
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
