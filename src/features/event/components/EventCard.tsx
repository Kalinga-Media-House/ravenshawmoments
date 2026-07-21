import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { EventItem } from "../types/event";
import { formatEventDateRange, getEventStatus } from "../utils/event-date";

interface EventCardProps {
  event: EventItem;
}

export const EventCard = ({ event }: EventCardProps) => {
  const status = getEventStatus(event.startsAt, event.endsAt);
  const formattedDate = formatEventDateRange(event.startsAt, event.endsAt);

  return (
    <Link
      href={event.href}
      className="group flex flex-col h-full heritage-card-glass rounded-2xl border border-white/10 overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2 transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_35px_-15px_rgba(176,24,70,0.2)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-heritage-gold)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
      aria-label={`View event details for ${event.title}`}
    >
      {/* Optional Image */}
      {event.imageUrl && (
        <div className="relative w-full h-48 sm:h-56 bg-black shrink-0 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.imageAlt || event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6">
        
        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
          <span className="text-[0.65rem] font-bold tracking-widest text-[var(--color-heritage-gold)] uppercase bg-[var(--color-heritage-gold)]/10 px-2.5 py-1 rounded-sm border border-[var(--color-heritage-gold)]/20">
            {event.category}
          </span>
          <span 
            className={`text-[0.65rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border ${
              status === "Upcoming" ? "bg-[var(--color-heritage-gold)]/10 text-[var(--color-heritage-gold)] border-[var(--color-heritage-gold)]/20" :
              status === "Ongoing" ? "bg-green-500/10 text-green-400 border-green-500/20" :
              "bg-white/5 text-white/50 border-white/10"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-[1.35rem] font-bold heritage-card-title mb-2 leading-tight group-hover:text-[var(--color-heritage-gold)] transition-colors duration-300">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-[0.95rem] heritage-card-muted font-medium leading-relaxed mb-6 line-clamp-3">
          {event.shortDescription || event.description}
        </p>

        {/* Metadata section pushed to bottom */}
        <div className="flex flex-col gap-3 mt-auto border-t border-white/10 pt-5">
          <div className="flex items-start gap-2.5 text-white/90">
            <CalendarDays className="w-4 h-4 text-[var(--color-heritage-gold)] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm font-semibold">{formattedDate}</span>
          </div>

          {(event.time || event.location) && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/70 text-[0.85rem] font-medium">
              {event.time && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-heritage-gold)] shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[200px]">{event.location}</span>
                </div>
              )}
            </div>
          )}
          
          {event.organizerName && (
            <p className="text-[0.8rem] font-bold text-[var(--color-heritage-gold)] uppercase tracking-wide mt-1">
              By {event.organizerName}
            </p>
          )}

          {/* Registration Info */}
          {(event.registrationStatus !== "Not Required" || event.registrationFee !== undefined) && (
            <div className="flex flex-wrap gap-2 mt-1">
              {event.registrationStatus !== "Not Required" && (
                <span className={`text-[0.65rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
                  event.registrationStatus === "Open" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  Registration {event.registrationStatus}
                </span>
              )}
              {event.registrationFee !== undefined && (
                <span className="text-[0.65rem] font-bold tracking-widest text-white uppercase bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
                  Fee: ₹{event.registrationFee}
                </span>
              )}
            </div>
          )}

          {/* Action Link */}
          <div className="flex items-center text-[var(--color-heritage-gold)] font-bold text-sm tracking-wide mt-2">
            View Event
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </div>

      </div>
    </Link>
  );
};
