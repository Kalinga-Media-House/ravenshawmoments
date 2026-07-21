"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowUpRight, ArrowRight, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Types
export interface EventItem {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: string; // ISO or parseable string
  endDate?: string;
  time: string;
  location: string;
  image?: string;
  imageAlt?: string;
  href: string;
  registrationRequired: boolean;
  registrationStatus: "Open" | "Closed" | "Not Required";
}

// Temporary homepage event data. Replace with Supabase event records when the event-management module is connected.
const TEMPORARY_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    category: "University Event",
    title: "Ravenshaw Foundation Day Celebration",
    description: "Join the Ravenshaw community in celebrating its history, achievements, traditions, and generations of inspiring journeys.",
    startDate: "2027-01-20T10:00:00Z",
    time: "10:00 AM",
    location: "Ravenshaw University Campus",
    href: "/events",
    registrationRequired: false,
    registrationStatus: "Not Required"
  },
  {
    id: "evt-2",
    category: "Competition",
    title: "Inter Department Cultural Competition",
    description: "Celebrate creativity, talent, music, dance, theatre, and the spirit of friendly competition across departments.",
    startDate: "2027-02-08T11:00:00Z",
    time: "11:00 AM",
    location: "Seven Pillars of Wisdom Convention Centre",
    href: "/events",
    registrationRequired: true,
    registrationStatus: "Open"
  },
  {
    id: "evt-3",
    category: "Academic",
    title: "Student Research and Innovation Seminar",
    description: "Explore student ideas, research, innovation, academic achievements, and conversations that inspire future possibilities.",
    startDate: "2027-02-15T14:00:00Z",
    time: "2:00 PM",
    location: "Ravenshaw University",
    href: "/events",
    registrationRequired: true,
    registrationStatus: "Open"
  },
  {
    id: "evt-4",
    category: "Hostel Event",
    title: "Hostel Cultural Evening",
    description: "An evening of friendship, performances, celebrations, traditions, and memories shared across hostel communities.",
    startDate: "2027-03-05T18:00:00Z",
    time: "6:00 PM",
    location: "Ravenshaw Hostel Community",
    href: "/events",
    registrationRequired: false,
    registrationStatus: "Not Required"
  }
];

// Helper to format Date block
const EventDateBlock = ({ dateString, isFeatured = false }: { dateString: string, isFeatured?: boolean }) => {
  const d = new Date(dateString);
  const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();

  const sizeClasses = isFeatured ? "w-[72px] h-[94px]" : "w-[68px] h-[86px]";

  return (
    <div className={`flex flex-col items-center justify-center shrink-0 event-date-card ${sizeClasses}`}>
      <span className="month">{month}</span>
      <span className="day">{day}</span>
      <span className="year">{year}</span>
    </div>
  );
};

// Helper for Registration Badge
const RegistrationBadge = ({ status, isFeatured = false }: { status: EventItem["registrationStatus"], isFeatured?: boolean }) => {
  if (status === "Not Required") {
    return (
      <span className="event-registration event-registration-none">
        No Registration
      </span>
    );
  }
  
  if (status === "Open") {
    return (
      <span className="event-registration event-registration-open">
        Registration Open
      </span>
    );
  }

  return (
    <span className="event-registration event-registration-closed">
      Closed
    </span>
  );
};

// Helper for Featured Registration Badge
const FeaturedRegistrationBadge = ({ status }: { status: EventItem["registrationStatus"] }) => {
  if (status === "Not Required") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-wider bg-[#FFF5F7] text-[#8F002A] border border-[rgba(169,0,50,0.20)]">
        No Registration
      </span>
    );
  }
  
  if (status === "Open") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-wider bg-[#A90032] text-[#FFFFFF] border-none">
        Registration Open
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-wider bg-white/5 text-white/50 border border-white/10">
      Closed
    </span>
  );
};

export const UpcomingEventsSection = () => {
  const hasEvents = TEMPORARY_EVENTS.length > 0;
  const featuredEvent = TEMPORARY_EVENTS[0];
  const listEvents = TEMPORARY_EVENTS.slice(1);
  const revealRef = useScrollReveal();

  return (
    <section className="events-section relative w-full py-20 md:py-28 lg:py-36 bg-transparent z-20" ref={revealRef as React.RefObject<HTMLDivElement>}>
      
      <div className="events-container container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 rm-reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[var(--color-rm-gold)] uppercase">
              What&apos;s Happening
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
          </div>
          
          <h2 className="text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold rm-heading-primary leading-[1.1] mb-6 tracking-tight text-balance">
            <span className="heading-highlight">Moments</span> Waiting to Happen
          </h2>
          
          <p className="text-[clamp(1rem,2vw,1.15rem)] rm-text-body leading-[1.7] font-medium max-w-[800px]">
            Discover upcoming celebrations, programmes, competitions, and community gatherings that bring Ravenshawvians together and create memories for the future.
          </p>
        </div>

        {/* Dynamic Styles */}
        <style>{`
          .events-section,
          .events-container,
          .events-layout,
          .featured-event-card {
            height: auto;
            max-height: none;
            overflow: visible;
          }

          .events-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(420px, 1fr);
            align-items: stretch;
            gap: 28px;
            max-width: 1180px;
            margin-inline: auto;
          }

          .featured-event-card {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: auto;
            min-height: 0;
            overflow: visible;
            border-radius: 22px;
          }

          .featured-event-visual {
            position: relative;
            min-height: 180px;
            flex-shrink: 0;
            overflow: hidden;
            background: linear-gradient(135deg, #a80032 0%, #73001f 55%, #35000e 100%);
            border-top-left-radius: 22px;
            border-top-right-radius: 22px;
          }

          .featured-event-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: auto;
            min-height: 0;
            padding: 28px 32px;
            overflow: visible;
          }

          .featured-event-details {
            display: grid;
            grid-template-columns: 72px minmax(0, 1fr);
            align-items: start;
            gap: 24px;
          }

          .featured-event-info {
            min-width: 0;
          }

          .featured-event-title {
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            overflow-wrap: anywhere;
            line-height: 1.15;
            color: #1d1115;
          }

          .featured-event-description {
            color: #62575b;
          }

          .featured-event-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            width: 100%;
            margin-top: 24px;
            padding-top: 18px;
            padding-bottom: 2px;
            border-top: 1px solid rgba(109, 0, 32, 0.12);
          }

          .upcoming-events-list {
            display: grid;
            grid-template-rows: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          /* New label row and typography updates */
          .event-label-row {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            width: 100%;
            min-width: 0;
            gap: 8px;
            margin-bottom: 10px;
          }

          .event-category {
            display: inline-flex;
            align-items: center;
            flex: 0 0 auto;
            min-width: 0;
            color: #a90032;
            font-size: 0.72rem;
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .event-registration {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: fit-content;
            max-width: 100%;
            min-height: 26px;
            padding: 5px 11px;
            border-radius: 999px;
            font-size: 0.68rem;
            font-weight: 800;
            line-height: 1;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .event-registration-open {
            color: #ffffff;
            background: #ad0035;
            border: 1px solid #ad0035;
          }

          .event-registration-closed,
          .event-registration-none {
            color: #765000;
            background: #fff7e3;
            border: 1px solid #e7c66d;
          }

          .upcoming-event-card {
            position: relative;
            display: grid;
            grid-template-columns: 66px minmax(0, 1fr) 28px;
            align-items: center;
            width: 100%;
            min-width: 0;
            min-height: 138px;
            height: auto;
            gap: 16px;
            padding: 22px;
            overflow: visible;
            box-sizing: border-box;
            border-radius: 22px;
          }

          .upcoming-event-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            min-width: 0;
          }

          .upcoming-event-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: center;
            width: 28px;
            height: 28px;
            flex-shrink: 0;
          }

          .upcoming-event-title {
            display: block;
            width: 100%;
            min-width: 0;
            margin: 0;
            color: #171114;
            font-size: clamp(1rem, 1.2vw, 1.15rem);
            font-weight: 750;
            line-height: 1.3;
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            overflow-wrap: break-word;
            word-break: normal;
          }

          .event-meta-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            min-width: 0;
            gap: 8px 14px;
            margin-top: 9px;
          }

          .event-meta-item {
            display: inline-flex;
            align-items: center;
            min-width: 0;
            gap: 6px;
            color: #6c6266;
            font-size: 0.78rem;
            line-height: 1.4;
          }

          .event-location {
            white-space: normal;
            overflow-wrap: break-word;
          }

          .event-card-container {
            background: #ffffff;
            border: 1px solid rgba(122, 0, 31, 0.14);
            box-shadow: 0 12px 35px rgba(70, 0, 20, 0.07);
          }
          
          .event-card-meta {
            color: #6b5960;
          }
          
          .event-card-icon {
            color: #a80032;
          }
          
          .event-date-card {
            background: linear-gradient(145deg, #7a001f 0%, #a80032 55%, #5b0018 100%);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 20px rgba(91, 0, 24, 0.20);
            border-radius: 14px;
            color: #ffffff !important;
          }
          
          .event-date-card .month {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.88) !important;
            margin-bottom: 2px;
          }
          
          .event-date-card .day {
            font-size: 30px;
            font-weight: 900;
            line-height: 1;
            color: #ffffff !important;
            margin-bottom: 2px;
          }
          
          .event-date-card .year {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.78) !important;
          }
          
          .event-btn {
            background: #920029;
            color: #ffffff;
            transition: background-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
          }
          
          .event-btn:hover {
            background: #b00035;
            transform: translateY(-2px);
          }

          @media (min-width: 1201px) {
            .event-label-row {
              flex-direction: row;
              align-items: center;
              gap: 8px;
            }
          }

          @media (min-width: 1025px) and (max-width: 1200px) {
            .events-layout {
              grid-template-columns: minmax(0, 1.05fr) minmax(390px, 0.95fr);
              gap: 22px;
            }

            .upcoming-event-card {
              grid-template-columns: 60px minmax(0, 1fr) 24px;
              gap: 13px;
              padding: 19px;
            }

            .event-label-row {
              gap: 7px;
            }

            .event-category {
              font-size: 0.66rem;
            }

            .event-registration {
              padding: 5px 9px;
              font-size: 0.62rem;
            }
          }

          @media (max-width: 1024px) {
            .events-layout {
              display: grid;
              grid-template-columns: minmax(0, 1fr);
              gap: 24px;
            }

            .upcoming-events-list {
              display: grid;
              grid-template-columns: minmax(0, 1fr);
              gap: 18px;
            }

            .upcoming-event-card {
              grid-template-columns: 64px minmax(0, 1fr) 28px;
              min-height: 130px;
            }

            .event-label-row {
              flex-wrap: wrap;
              gap: 8px;
            }

            .featured-event-card {
              height: auto;
            }
          }

          @media (max-width: 640px) {
            .events-section {
              padding-inline: 16px;
            }

            .events-layout {
              width: 100%;
              grid-template-columns: minmax(0, 1fr);
              gap: 18px;
            }

            .featured-event-visual {
              min-height: 140px;
            }

            .featured-event-content {
              padding: 22px 18px;
            }

            .featured-event-details {
              grid-template-columns: 58px minmax(0, 1fr);
              gap: 16px;
            }

            .featured-event-title {
              font-size: clamp(1.45rem, 7vw, 2rem) !important;
              line-height: 1.15;
            }

            .featured-event-description {
              font-size: 0.95rem;
              line-height: 1.65;
            }

            .event-meta {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .featured-event-footer {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }

            .featured-event-footer a,
            .featured-event-footer button,
            .featured-event-footer span {
              width: 100%;
              justify-content: center;
            }

            .upcoming-event-card {
              position: relative;
              grid-template-columns: 56px minmax(0, 1fr);
              align-items: start;
              min-height: 0;
              gap: 14px;
              padding: 18px;
              padding-right: 44px;
            }

            .event-date-card {
              width: 56px;
              min-width: 56px;
              height: 76px;
            }

            .event-label-row {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              flex-wrap: nowrap;
              gap: 7px;
              padding-right: 4px;
            }

            .event-category {
              font-size: 0.66rem;
            }

            .event-registration {
              min-height: 24px;
              padding: 5px 9px;
              font-size: 0.62rem;
            }

            .upcoming-event-title {
              margin-top: 2px;
              font-size: 1rem;
              line-height: 1.3;
            }

            .event-meta-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 7px;
            }

            .upcoming-event-arrow {
              position: absolute;
              top: 18px;
              right: 15px;
            }
          }

          @media (max-width: 390px) {
            .upcoming-event-card {
              grid-template-columns: 50px minmax(0, 1fr);
              gap: 12px;
              padding: 15px;
              padding-right: 38px;
            }

            .event-date-card {
              width: 50px;
              min-width: 50px;
              height: 70px;
            }

            .event-label-row {
              gap: 6px;
            }

            .event-registration {
              white-space: normal;
              text-align: center;
              line-height: 1.15;
            }

            .upcoming-event-title {
              font-size: 0.95rem;
            }

            .upcoming-event-arrow {
              top: 15px;
              right: 11px;
            }
          }
        `}</style>

        {!hasEvents ? (
          // Optional Empty State
          <div className="rm-reveal flex flex-col items-center justify-center p-12 rm-glass-card text-center">
            <div className="rm-icon-container p-4 rounded-full mb-4">
              <CalendarDays className="w-8 h-8 text-[var(--color-rm-gold)]" />
            </div>
            <h3 className="text-2xl font-bold rm-heading-primary mb-2">New Events Coming Soon</h3>
            <p className="rm-text-body mb-8 max-w-md">Upcoming celebrations, programmes, competitions, and community gatherings will appear here.</p>
            <Link 
              href="/gallery"
              className="inline-flex items-center justify-center bg-[var(--color-rm-accent)] text-white px-6 py-3 rounded-full font-bold transition-all hover:bg-[var(--color-rm-gold)] hover:text-[#2A0F16]"
            >
              Explore Ravenshaw Moments
            </Link>
          </div>
        ) : (
          <div className="events-layout mb-12 sm:mb-16">
            
            {/* Featured Left Side */}
            <div className="flex flex-col rm-reveal">
              <Link 
                href={featuredEvent.href}
                className="group featured-event-card event-card-container focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA] transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[5px]"
              >
                {/* CSS Abstract Event Composition */}
                <div className="featured-event-visual flex items-center justify-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-rm-gold)]/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                  
                  <CalendarDays className="w-24 h-24 text-[rgba(255,255,255,0.20)] relative z-10" strokeWidth={1} />
                  
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20">
                    <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.13)] text-[#FFFFFF] border border-[rgba(255,255,255,0.28)] shadow-sm">
                      {featuredEvent.category}
                    </span>
                  </div>
                </div>
                
                {/* Featured Content */}
                <div className="featured-event-content relative z-10">
                  <div className="featured-event-details">
                    <div className="shrink-0">
                      <EventDateBlock dateString={featuredEvent.startDate} isFeatured={true} />
                    </div>
                    
                    <div className="featured-event-info flex flex-col">
                      <h3 className="font-[800] featured-event-title mb-3" style={{ fontSize: 'clamp(1.75rem, 2.2vw, 2.25rem)' }}>
                        {featuredEvent.title}
                      </h3>
                      
                      <p className="text-[0.95rem] sm:text-[1rem] featured-event-description leading-relaxed mb-5">
                        {featuredEvent.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-y-3 gap-x-6 event-meta text-sm font-semibold mb-6 event-card-meta">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 event-card-icon" aria-hidden="true" />
                          <time dateTime={featuredEvent.startDate}>{featuredEvent.time}</time>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 event-card-icon" aria-hidden="true" />
                          <span>{featuredEvent.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                    
                  <div className="featured-event-footer">
                    <FeaturedRegistrationBadge status={featuredEvent.registrationStatus} />
                    <div className="flex items-center event-card-icon font-bold tracking-wide transition-all [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-[3px]">
                      View Event
                      <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Event List */}
            <div className="upcoming-events-list">
              {listEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="rm-reveal h-full"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link 
                    href={event.href}
                    className="group upcoming-event-card event-card-container focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA] transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[4px]"
                  >
                    <div className="self-start group-hover:opacity-90 transition-opacity mt-1">
                      <EventDateBlock dateString={event.startDate} />
                    </div>
                    
                    <div className="upcoming-event-content">
                      <div className="event-label-row">
                        <span className="event-category">
                          {event.category}
                        </span>
                        <RegistrationBadge status={event.registrationStatus} />
                      </div>
                      
                      <h3 className="upcoming-event-title">
                        {event.title}
                      </h3>
                      
                      <div className="event-meta-row">
                        <div className="event-meta-item">
                          <Clock className="w-3.5 h-3.5 event-card-icon" aria-hidden="true" />
                          <time dateTime={event.startDate}>{event.time}</time>
                        </div>
                        <div className="event-meta-item event-location">
                          <MapPin className="w-3.5 h-3.5 event-card-icon shrink-0" aria-hidden="true" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="upcoming-event-arrow">
                      <ArrowUpRight className="w-5 h-5 event-card-icon transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110" strokeWidth={2.5} aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Global CTA */}
        {hasEvents && (
          <div className="flex justify-center mt-[34px] rm-reveal">
            <Link 
              href="/events"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-bold text-sm tracking-wide event-btn"
            >
              View All Events
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

