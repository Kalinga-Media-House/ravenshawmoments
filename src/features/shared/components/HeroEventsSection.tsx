"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// TODO: Replace with Supabase generated types when integrated
interface EventData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  eventType: "Academic" | "Cultural" | "Competition" | "Hostel Event" | "Sports" | "Workshop" | "Community";
  organizerName: string;
  organizerType: string;
  eventDate: string; // ISO string or parsable date
  startTime: string;
  endTime: string;
  location: string;
  image: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  featured: boolean;
  href: string;
  accessibleImageAlt: string;
}

// Temporary demonstration data only.
// This must later be replaced with live Supabase event records.
const UPCOMING_EVENTS: EventData[] = [
  {
    id: "evt-001",
    title: "Annual Cultural Celebration",
    slug: "annual-cultural-celebration",
    shortDescription: "An evening of music, dance, creativity, performances, and traditions celebrating the vibrant spirit of Ravenshaw.",
    eventType: "Cultural",
    organizerName: "Ravenshaw University",
    organizerType: "University",
    eventDate: "2026-10-15T00:00:00.000Z",
    startTime: "17:00",
    endTime: "21:00",
    location: "Ravenshaw University Campus",
    image: "/images/hero/hero-1.webp",
    registrationRequired: false,
    featured: true,
    href: "/events/annual-cultural-celebration",
    accessibleImageAlt: "Students performing a cultural dance on stage at Ravenshaw University"
  },
  {
    id: "evt-002",
    title: "Inter Department Debate Competition",
    slug: "inter-department-debate",
    shortDescription: "Students come together to exchange ideas, challenge perspectives, and celebrate the power of thoughtful expression.",
    eventType: "Competition",
    organizerName: "Department Community",
    organizerType: "Community",
    eventDate: "2026-10-20T00:00:00.000Z",
    startTime: "10:00",
    endTime: "14:00",
    location: "Seven Pillars of Wisdom",
    image: "/images/hero/hero-2.webp",
    registrationRequired: true,
    featured: false,
    href: "/events/inter-department-debate",
    accessibleImageAlt: "Students debating in front of the Seven Pillars of Wisdom"
  },
  {
    id: "evt-003",
    title: "Hostel Annual Function",
    slug: "hostel-annual-function",
    shortDescription: "A celebration of friendships, achievements, traditions, performances, and memories shared within hostel life.",
    eventType: "Hostel Event",
    organizerName: "Ravenshaw Hostel Community",
    organizerType: "Community",
    eventDate: "2026-10-25T00:00:00.000Z",
    startTime: "18:30",
    endTime: "22:00",
    location: "Ravenshaw University Campus",
    image: "/images/hero/hero-3.webp",
    registrationRequired: false,
    featured: false,
    href: "/events/hostel-annual-function",
    accessibleImageAlt: "Students celebrating the hostel annual function"
  },
  {
    id: "evt-004",
    title: "Career Guidance and Alumni Interaction",
    slug: "career-guidance-alumni",
    shortDescription: "Connect with alumni, explore career opportunities, learn from their journeys, and gain guidance for the future.",
    eventType: "Academic",
    organizerName: "Ravenshaw Alumni Community",
    organizerType: "Community",
    eventDate: "2026-11-05T00:00:00.000Z",
    startTime: "11:00",
    endTime: "15:00",
    location: "Ravenshaw Convention Centre",
    image: "/images/hero/hero-4.webp",
    registrationRequired: true,
    featured: false,
    href: "/events/career-guidance-alumni",
    accessibleImageAlt: "Alumni interacting with students at Ravenshaw Convention Centre"
  }
];

// Reusable Date Component
const EventDateBlock = ({ dateStr, isFeatured = false }: { dateStr: string, isFeatured?: boolean }) => {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  return (
    <div className={`flex flex-col items-center justify-center rounded-xl overflow-hidden shrink-0 border border-[var(--color-rm-glass-border)] ${isFeatured ? 'w-20 h-24 shadow-md bg-black/40 backdrop-blur-md' : 'w-16 h-20 bg-black/20 backdrop-blur-sm'}`}>
      <div className={`w-full py-1 text-center font-bold text-[0.65rem] tracking-wider ${isFeatured ? 'bg-[var(--color-rm-accent)] text-white' : 'bg-[var(--color-rm-gold)] text-[#12070B]'}`}>
        {month}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center pt-1 pb-2">
        <span className={`font-black leading-none text-[var(--color-rm-text-primary)] ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>{day}</span>
        <span className="text-[0.65rem] font-bold text-[var(--color-rm-gold)]/80 mt-1">{year}</span>
      </div>
    </div>
  );
};

// Reusable Category Badge Component
const EventCategoryBadge = ({ category }: { category: string }) => {
  let colors = "bg-white/10 text-[var(--color-rm-text-primary)] border-white/20";
  
  if (category === "Cultural") colors = "bg-[var(--color-rm-gold)]/20 text-[var(--color-rm-gold)] border-[var(--color-rm-gold)]/30";
  else if (category === "Competition") colors = "bg-blue-500/10 text-blue-300 border-blue-500/20";
  else if (category === "Hostel Event") colors = "bg-[var(--color-rm-accent)]/20 text-[var(--color-rm-text-primary)] border-[var(--color-rm-accent)]/30";
  else if (category === "Academic") colors = "bg-white/5 text-[var(--color-rm-text-primary)] border-[var(--color-rm-glass-border)]";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.7rem] font-bold tracking-wider uppercase border backdrop-blur-sm ${colors}`}>
      {category}
    </span>
  );
};

export const HeroEventsSection = () => {
  const featuredEvent = UPCOMING_EVENTS.find(e => e.featured);
  const compactEvents = UPCOMING_EVENTS.filter(e => !e.featured);
  const revealRef = useScrollReveal();

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 bg-transparent overflow-hidden z-20" ref={revealRef as React.RefObject<HTMLElement>}>
      
      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 rm-reveal">
          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <span className="w-8 h-[2px] bg-[var(--color-rm-gold)]" />
            <span className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.15em] text-[var(--color-rm-gold)] uppercase">
              What&apos;s Happening at Ravenshaw
            </span>
            <span className="w-8 h-[2px] bg-[var(--color-rm-gold)]" />
          </div>
          
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold rm-heading-primary leading-[1.15] mb-6 tracking-tight">
            <span className="heading-highlight">Moments</span> Waiting to Happen
          </h2>
          
          <p className="text-[clamp(1rem,1.8vw,1.125rem)] rm-text-body leading-[1.7] font-medium">
            Every event brings people together and creates stories worth remembering. Discover upcoming celebrations, competitions, academic programmes, cultural activities, and community experiences across Ravenshaw.
          </p>
        </div>

        {/* Content Layout */}
        {UPCOMING_EVENTS.length > 0 ? (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
            
            {/* Featured Event Column */}
            {featuredEvent && (
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col rm-reveal" style={{ transitionDelay: '100ms' }}>
                <Link 
                  href={featuredEvent.href}
                  className="interactive-card group relative flex flex-col rm-glass-card rounded-2xl sm:rounded-3xl border border-[var(--color-rm-glass-border)] overflow-hidden transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/60 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_20px_40px_rgba(176,24,70,0.15)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 h-full"
                >
                  <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[360px] overflow-hidden bg-black">
                    <Image
                      src={featuredEvent.image}
                      alt={featuredEvent.accessibleImageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-rm-bg-deep)] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-6 left-6 flex gap-3 z-20">
                      <EventCategoryBadge category={featuredEvent.eventType} />
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col sm:flex-row gap-6 p-6 sm:p-8 md:p-10 flex-grow z-20 -mt-16 sm:-mt-20">
                    <div className="hidden sm:block">
                      <EventDateBlock dateStr={featuredEvent.eventDate} isFeatured={true} />
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <div className="sm:hidden mb-4 self-start shadow-md rounded-xl">
                        <EventDateBlock dateStr={featuredEvent.eventDate} isFeatured={true} />
                      </div>
                      
                      <h3 className="text-2xl sm:text-3xl font-extrabold rm-heading-primary mb-3 tracking-tight transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--color-rm-gold)]">
                        {featuredEvent.title}
                      </h3>
                      
                      <p className="text-base rm-text-body leading-relaxed mb-6">
                        {featuredEvent.shortDescription}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 mb-8 text-[0.9rem] font-medium text-[var(--color-rm-text-primary)]/80 mt-auto">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-[18px] h-[18px] text-[var(--color-rm-gold)]" />
                          <span>{featuredEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-[18px] h-[18px] text-[var(--color-rm-gold)]" />
                          <span>{featuredEvent.startTime} - {featuredEvent.endTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--color-rm-glass-border)] mt-auto">
                        <span className={`inline-flex items-center gap-2 text-sm font-bold ${featuredEvent.registrationRequired ? 'text-[var(--color-rm-gold)]' : 'text-green-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${featuredEvent.registrationRequired ? 'bg-[var(--color-rm-gold)]' : 'bg-green-400'}`} />
                          {featuredEvent.registrationRequired ? 'Registration Required' : 'No Registration Required'}
                        </span>
                        
                        <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-semibold">
                          <span>View Event</span>
                          <ArrowRight className="w-5 h-5 transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Compact Events Column */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col md:grid md:grid-cols-2 lg:flex gap-4 sm:gap-5 md:gap-6 lg:gap-5 xl:gap-6 mt-8 lg:mt-0">
              {compactEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-grow rm-reveal"
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <Link
                    href={event.href}
                    className="interactive-card group flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-xl sm:rounded-2xl h-full transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_24px_rgba(176,24,70,0.1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5"
                  >
                    <EventDateBlock dateStr={event.eventDate} />
                    
                    <div className="flex flex-col flex-grow">
                      <div className="mb-2">
                        <EventCategoryBadge category={event.eventType} />
                      </div>
                      <h4 className="text-[1.15rem] sm:text-xl font-bold rm-heading-primary leading-snug mb-2 transition-colors duration-300 group-hover:text-[var(--color-rm-gold)]">
                        {event.title}
                      </h4>
                      <p className="text-sm rm-text-body line-clamp-2 mb-3">
                        {event.shortDescription}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--color-rm-gold-soft)] mt-auto">
                        <span>{event.location}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-rm-gold)]/50" />
                        <span className={event.registrationRequired ? 'text-[var(--color-rm-gold)]' : 'text-green-400'}>
                          {event.registrationRequired ? 'Reg. Required' : 'Open Entry'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 rm-glass-card rounded-3xl border border-[var(--color-rm-glass-border)] text-center max-w-4xl mx-auto rm-reveal">
            <h3 className="text-2xl font-bold rm-heading-primary mb-3">New Moments Are Coming</h3>
            <p className="rm-text-body mb-8 max-w-md">Upcoming events and experiences will appear here as soon as they are announced.</p>
            <Link 
              href="/events/past"
              className="inline-flex items-center justify-center bg-white/5 border border-[var(--color-rm-glass-border)] text-[var(--color-rm-text-primary)] px-6 h-11 rounded-full text-sm font-semibold transition-all hover:bg-[var(--color-rm-gold)]/20 hover:border-[var(--color-rm-gold)]/50"
            >
              Explore Past Events
            </Link>
          </div>
        )}

        {/* Global CTA Section */}
        <div className="flex flex-col items-center justify-center mt-12 md:mt-16 text-center rm-reveal" style={{ transitionDelay: '400ms' }}>
          <p className="text-[var(--color-rm-gold-soft)]/90 font-serif italic text-lg sm:text-xl mb-8">
            There is always something new to experience at Ravenshaw.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <Link 
              href="/events"
              className="section-cta"
            >
              Explore All Events
            </Link>
            
            <Link 
              href="/events/organize"
              className="group flex items-center gap-2 text-[var(--color-rm-gold)] font-semibold text-base transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] rounded-md px-2 py-1 -mx-2"
            >
              <span className="relative">
                Organize an Event
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-rm-gold)] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:w-full" />
              </span>
              <ArrowRight className="w-4 h-4 transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
