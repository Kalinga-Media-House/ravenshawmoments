import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { EventItem } from "../types/event";
import { formatEventDateRange, getEventStatus } from "../utils/event-date";

interface FeaturedEventCardProps {
  event: EventItem;
}

export const FeaturedEventCard = ({ event }: FeaturedEventCardProps) => {
  const status = getEventStatus(event.startsAt, event.endsAt);
  const formattedDate = formatEventDateRange(event.startsAt, event.endsAt);

  return (
    <Link
      href={event.href}
      className="group relative flex flex-col md:flex-row w-full heritage-card-glass rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-4 transition-all duration-500 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_20px_50px_-15px_rgba(176,24,70,0.2)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-heritage-gold)]/60"
      aria-label={`View featured event: ${event.title}`}
    >
      {/* Visual Side */}
      <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-full bg-black overflow-hidden shrink-0">
        
        {/* If image exists, display it. Otherwise show abstract pattern */}
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.imageAlt || event.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none"
            priority
          />
        ) : (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-heritage-gold)]/30 blur-3xl rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <CalendarDays className="w-32 h-32 text-white" strokeWidth={1} />
            </div>
          </>
        )}
        
        {/* Tags Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2 z-10">
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {event.category}
          </span>
          <span 
            className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md border shadow-sm ${
              status === "Upcoming" ? "bg-[var(--color-heritage-gold)]/80 text-black border-[var(--color-heritage-gold)]" :
              status === "Ongoing" ? "bg-green-600/80 text-white border-green-600" :
              "bg-black/60 text-white/90 border-white/20"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex flex-col p-6 sm:p-8 md:p-10 flex-grow relative z-10 bg-transparent">
        
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold heritage-card-title mb-4 sm:mb-6 tracking-tight leading-tight group-hover:text-[var(--color-heritage-gold)] transition-colors duration-300">
            {event.title}
          </h3>
          
          <p className="text-[1rem] sm:text-[1.1rem] heritage-card-muted leading-relaxed font-medium mb-8 max-w-2xl">
            {event.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-white/90 text-[0.95rem] font-semibold mb-8">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-5 h-5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
              <span>{formattedDate}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          
          {event.organizerName && (
            <p className="text-[0.85rem] font-bold text-[var(--color-heritage-gold)] uppercase tracking-wider mb-6">
              Organized By {event.organizerName}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-wider ${
                event.registrationStatus === "Not Required" ? "bg-white/10 text-[var(--color-heritage-gold)]" :
                event.registrationStatus === "Open" ? "bg-[var(--color-heritage-gold)]/10 text-[var(--color-heritage-gold)]" :
                "bg-white/5 text-white/50"
              }`}>
                {event.registrationStatus === "Not Required" ? "No Registration" : 
                 event.registrationStatus === "Open" ? "Registration Open" : "Registration Closed"}
              </span>
              {event.registrationFee !== undefined && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10">
                  Fee: ₹{event.registrationFee}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-[var(--color-heritage-gold)] font-bold tracking-wide text-[0.95rem]">
              View Event
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
