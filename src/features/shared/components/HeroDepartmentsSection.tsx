"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Dna,
  ArrowRight,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DEPARTMENTS = [
  {
    name: "Statistics",
    description: "Discover the people, achievements, events, and memories of the Department of Statistics.",
    icon: BarChart3,
    href: "/departments/statistics",
  },
  {
    name: "Mathematics",
    description: "Explore the ideas, journeys, achievements, and memories shaped by the Department of Mathematics.",
    icon: Calculator,
    href: "/departments/mathematics",
  },
  {
    name: "Physics",
    description: "Discover the academic journeys, discoveries, events, and stories of the Department of Physics.",
    icon: Atom,
    href: "/departments/physics",
  },
  {
    name: "Chemistry",
    description: "Explore the people, experiences, achievements, and memories of the Department of Chemistry.",
    icon: FlaskConical,
    href: "/departments/chemistry",
  },
  {
    name: "Botany",
    description: "Discover the academic community, activities, achievements, and stories of the Department of Botany.",
    icon: Leaf,
    href: "/departments/botany",
  },
  {
    name: "Zoology",
    description: "Explore the people, events, achievements, and memories of the Department of Zoology.",
    icon: Dna,
    href: "/departments/zoology",
  },
];

export const HeroDepartmentsSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section
      className="relative w-full py-16 sm:py-24 overflow-hidden z-20"
      ref={revealRef as React.RefObject<HTMLDivElement>}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16 rm-reveal">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-0.5 bg-primary" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-primary uppercase">
              Academic Communities
            </span>
            <span className="w-8 h-0.5 bg-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-5">
            Explore Our <span className="text-primary">Departments</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
            Every department carries its own stories, achievements, friendships, and traditions. Explore the academic communities that continue to shape the legacy of Ravenshaw.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 lg:mb-16">
          {DEPARTMENTS.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.name}
                className="rm-reveal flex flex-col min-w-0"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link
                  href={dept.href}
                  className="flex flex-col h-full rounded-3xl overflow-hidden border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="p-6 sm:p-7 bg-gradient-to-br from-[#8F0028] via-[#6B001E] to-[#35000E] text-white flex flex-col justify-between min-h-[110px]">
                    <div className="size-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D4AF37] mb-3">
                      <Icon className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {dept.name.toLowerCase().startsWith("department")
                          ? dept.name
                          : `Department of ${dept.name}`}
                      </h3>
                      <span className="text-xs font-medium text-white/75 mt-1 block">
                        Academic Community
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-card text-card-foreground space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-bold text-sm pt-2 border-t border-border/40 group-hover:text-[#8F0028] transition-colors">
                      <span>Explore Department</span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center rm-reveal" style={{ transitionDelay: "400ms" }}>
          <Link href="/departments" className="section-cta">
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  );
};
