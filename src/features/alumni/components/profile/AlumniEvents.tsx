import React from "react";
import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";

export interface AlumniEventSummary {
  id: string;
  slug: string;
  title: string;
  date?: string;
  role?: string;
}

interface AlumniEventsProps {
  events?: AlumniEventSummary[];
}

export const AlumniEvents: React.FC<AlumniEventsProps> = ({ events }) => {
  const items = Array.isArray(events) ? events : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-events-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Calendar className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-events-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Events and Campus Moments
            </h2>
            <p className="text-xs text-white/70">
              Approved campus celebrations, reunions, and event participation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((ev) => (
            <div
              key={ev.id}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4 hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <div className="space-y-1">
                {ev.role && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
                    {ev.role}
                  </span>
                )}
                <h3 className="text-base font-black text-white">{ev.title}</h3>
                {ev.date && (
                  <p className="text-xs text-white/60">{ev.date}</p>
                )}
              </div>

              <Link
                href={`/events/${ev.slug}`}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[var(--color-rm-gold)] hover:border-[var(--color-rm-gold)]/50 shrink-0 transition-colors"
                aria-label={`View event ${ev.title}`}
              >
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
