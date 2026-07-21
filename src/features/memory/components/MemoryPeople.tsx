"use client";

import React from "react";
import { User } from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryPeopleProps {
  memory: MemoryItem;
}

export const MemoryPeople: React.FC<MemoryPeopleProps> = ({ memory }) => {
  if (!memory.people || memory.people.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="memory-people-heading" className="w-full max-w-[760px] mx-auto my-10">
      <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
        <h2
          id="memory-people-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] mb-6"
        >
          People in This Memory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memory.people.map((person, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-black/5 border border-black/10"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{person}</p>
                <p className="text-xs text-black/60">Ravenshaw Community</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
