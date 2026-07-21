"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Home,
  Users,
  Sparkles,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryCommunityProps {
  memory: MemoryItem;
}

export const MemoryCommunity: React.FC<MemoryCommunityProps> = ({ memory }) => {
  const connections = [
    {
      label: "Department",
      name: memory.departmentName,
      href: memory.departmentSlug ? `/departments/${memory.departmentSlug}` : undefined,
      icon: <Building2 className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Hostel",
      name: memory.hostelName,
      href: memory.hostelSlug ? `/hostels/${memory.hostelSlug}` : undefined,
      icon: <Home className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Organization",
      name: memory.organizationName,
      href: memory.organizationSlug ? `/organizations/${memory.organizationSlug}` : undefined,
      icon: <Users className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Event",
      name: memory.eventName,
      href: memory.eventSlug ? `/events/${memory.eventSlug}` : undefined,
      icon: <Sparkles className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Achievement",
      name: memory.achievementName,
      href: memory.achievementSlug ? `/achievements/${memory.achievementSlug}` : undefined,
      icon: <Trophy className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
  ].filter((c) => Boolean(c.name));

  if (connections.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="memory-community-heading" className="w-full max-w-[760px] mx-auto my-10">
      <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
        <h2
          id="memory-community-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] mb-6"
        >
          Connected to Ravenshaw
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connections.map((item, idx) => {
            const content = (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 border border-black/10 hover:border-[var(--color-rm-gold)]/40 transition-all group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/30 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white truncate group-hover:text-[var(--color-maroon)] transition-colors">
                      {item.name}
                    </p>
                  </div>
                </div>

                {item.href && (
                  <ArrowRight
                    className="w-4 h-4 text-[var(--color-maroon)] transition-transform group-hover:translate-x-1 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            );

            return item.href ? (
              <Link key={idx} href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded-2xl">
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
