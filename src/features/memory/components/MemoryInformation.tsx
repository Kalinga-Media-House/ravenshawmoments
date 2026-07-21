"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Tag,
  Building2,
  Home,
  Users,
  Trophy,
  User,
  Camera,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryInformationProps {
  memory: MemoryItem;
}

export const MemoryInformation: React.FC<MemoryInformationProps> = ({ memory }) => {
  const details = [
    {
      label: "Memory Date",
      value: memory.capturedAt,
      icon: <Calendar className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Memory Year",
      value: memory.memoryYear,
      icon: <Calendar className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Academic Session",
      value: memory.academicSession,
      icon: <GraduationCap className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Location",
      value: memory.location,
      icon: <MapPin className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Category",
      value: memory.category,
      icon: <Tag className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Memory Type",
      value: memory.memoryType,
      icon: <Sparkles className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Batch",
      value: memory.batch,
      icon: <GraduationCap className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Department",
      value: memory.departmentName,
      icon: <Building2 className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Hostel",
      value: memory.hostelName,
      icon: <Home className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Organization",
      value: memory.organizationName,
      icon: <Users className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Event",
      value: memory.eventName,
      icon: <Sparkles className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Achievement",
      value: memory.achievementName,
      icon: <Trophy className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Contributor",
      value: memory.contributorName,
      icon: <User className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
    {
      label: "Photographer",
      value: memory.photographerName,
      icon: <Camera className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />,
    },
  ].filter((item) => Boolean(item.value));

  if (details.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="memory-details-heading" className="w-full max-w-[760px] mx-auto my-10">
      <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
        <h2
          id="memory-details-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] mb-6"
        >
          Memory Details
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {details.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-black/5 border border-black/10 shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {item.label}
                </dt>
                <dd className="text-sm sm:text-base font-bold text-white mt-0.5 break-words">
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
