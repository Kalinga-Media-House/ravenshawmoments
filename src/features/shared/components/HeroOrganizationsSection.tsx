"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  HeartPulse,
  Trophy,
  Palette,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface OrganizationCategory {
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const ORGANIZATIONS: OrganizationCategory[] = [
  {
    name: "NCC",
    description: "Building discipline, leadership, courage, and a lifelong spirit of service.",
    icon: Shield,
    href: "/organizations/ncc",
  },
  {
    name: "NSS",
    description: "Bringing students together through social responsibility, community service, and meaningful action.",
    icon: Users,
    href: "/organizations/nss",
  },
  {
    name: "Youth Red Cross",
    description: "Inspiring compassion, humanitarian service, health awareness, and support for communities.",
    icon: HeartPulse,
    href: "/organizations/yrc",
  },
  {
    name: "Sports & Athletics",
    description: "Celebrating teamwork, determination, sporting achievements, and unforgettable moments on the field.",
    icon: Trophy,
    href: "/organizations/sports",
  },
  {
    name: "Cultural Communities",
    description: "Preserving creativity, traditions, music, dance, theatre, literature, and artistic expression.",
    icon: Palette,
    href: "/organizations/cultural",
  },
  {
    name: "Clubs & Societies",
    description: "Connecting students through shared interests, ideas, innovation, creativity, and collaboration.",
    icon: Lightbulb,
    href: "/organizations/clubs",
  },
];

export const HeroOrganizationsSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section
      className="relative w-full py-16 sm:py-24 bg-transparent overflow-hidden z-20"
      ref={revealRef as React.RefObject<HTMLDivElement>}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16 rm-reveal">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-[#D4AF37] uppercase">
              Student Communities
            </span>
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-5">
            Where Passions Become <span className="text-primary">Communities</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
            Beyond classrooms and hostels, Ravenshaw comes alive through communities built on service, leadership, creativity, culture, and shared passions. Explore the organizations where students find their purpose, build friendships, and create memories that last a lifetime.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 lg:mb-16">
          {ORGANIZATIONS.map((org, index) => {
            const Icon = org.icon;
            return (
              <div
                key={org.name}
                className="rm-reveal flex flex-col min-w-0"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link
                  href={org.href}
                  className="flex flex-col h-full p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
                >
                  <div className="size-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <Icon className="size-6 text-[#D4AF37]" />
                  </div>

                  <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {org.name}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 flex-1">
                    {org.description}
                  </p>

                  <div className="flex items-center gap-2 text-primary font-bold text-sm pt-4 border-t border-border/40 group-hover:text-[#8F0028] transition-colors mt-auto">
                    <span>Explore Community</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Global CTA Section */}
        <div
          className="flex flex-col items-center justify-center mt-8 text-center rm-reveal"
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-muted-foreground italic font-medium mb-6 text-sm sm:text-base">
            Every community carries stories worth remembering.
          </p>
          <Link href="/organizations" className="section-cta">
            Explore All Organizations
          </Link>
        </div>
      </div>
    </section>
  );
};
