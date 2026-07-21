import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CalendarDays, MapPin, Clock, ArrowLeft, Users, 
  Tag, Info, ExternalLink, CheckCircle2, Ticket
} from "lucide-react";
import { EVENTS } from "@/features/event/data/events";
import { getEventStatus, formatEventDateRange } from "@/features/event/utils/event-date";
import { EventShare } from "@/features/event/components/EventShare";
import { EventCard } from "@/features/event/components/EventCard";

export const revalidate = 3600; // Static revalidation

// Metadata Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const event = EVENTS.find(e => e.slug === resolvedParams.slug);
  
  if (!event) {
    return { title: "Event Not Found | Ravenshaw Moments" };
  }

  return {
    title: `${event.title} | Ravenshaw Moments`,
    description: event.shortDescription || event.description.substring(0, 160),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const event = EVENTS.find(e => e.slug === resolvedParams.slug);

  if (!event) {
    notFound();
  }

  const status = getEventStatus(event.startsAt, event.endsAt);
  const formattedDate = formatEventDateRange(event.startsAt, event.endsAt);

  // Get related events (same category or organizer, exclude current)
  const relatedEvents = EVENTS
    .filter(e => e.id !== event.id && (e.category === event.category || e.organizerName === event.organizerName))
    .slice(0, 3);

  // Fallback to latest events if no related
  const displayRelatedEvents = relatedEvents.length > 0 
    ? relatedEvents 
    : EVENTS.filter(e => e.id !== event.id).slice(0, 3);

  return (
    <article className="min-h-screen pb-24">
      {/* Event Hero */}
      <div className="relative w-full h-[50vh] md:h-[65vh] min-h-[400px] bg-black border-b border-[var(--color-rm-glass-border)]">
        {event.imageUrl ? (
          <>
            <Image 
              src={event.imageUrl}
              alt={event.imageAlt || event.title}
              fill
              className="object-cover object-center"
              priority
            />
            {/* Cinematic luxury black overlay */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: "linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.45))" }} 
            />
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.5) 60%, transparent)" }} 
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-black overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(12, 12, 12, 0.98), rgba(22, 22, 22, 0.92))" }}>
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-rm-gold)]/12 blur-[120px] rounded-full mix-blend-screen" />
          </div>
        )}

        {/* Hero Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-10 md:pb-16 w-full max-w-7xl">
            <div className="rm-reveal flex flex-col gap-4 max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-bold tracking-widest text-[var(--color-rm-gold)] uppercase bg-[var(--color-rm-gold)]/10 px-3 py-1.5 rounded-sm border border-[var(--color-rm-gold)]/20 backdrop-blur-sm">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-sm border border-amber-500/20 backdrop-blur-sm">
                    Featured
                  </span>
                )}
                <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm border backdrop-blur-sm ${
                  status === "Upcoming" ? "bg-[var(--color-rm-accent)]/20 text-white border-[var(--color-rm-accent)]/50" :
                  status === "Ongoing" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  "bg-white/10 text-white/70 border-white/20"
                }`}>
                  {status}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold rm-heading-primary tracking-tight leading-tight text-white mb-2 shadow-sm drop-shadow-md">
                {event.title}
              </h1>
              
              {/* Short Desc */}
              {event.shortDescription && (
                <p className="text-lg md:text-xl text-white/90 font-medium max-w-3xl mb-4 drop-shadow">
                  {event.shortDescription}
                </p>
              )}

              {/* Essential Meta in Hero */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-white/80 font-medium text-sm md:text-base mt-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-rm-gold)] drop-shadow" />
                  <span>{formattedDate}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-rm-gold)] drop-shadow" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-rm-gold)] drop-shadow" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-10 md:mt-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12 md:space-y-16">
            
            {/* About Event */}
            <section className="rm-reveal">
              <h2 className="text-2xl md:text-3xl font-bold rm-heading-primary mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-[var(--color-rm-gold)]" />
                About This Event
              </h2>
              <div className="rm-text-body text-base md:text-[1.05rem] leading-relaxed space-y-6">
                {event.description.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <section className="rm-reveal" style={{ transitionDelay: '100ms' }}>
                <h2 className="text-xl md:text-2xl font-bold rm-heading-primary mb-6">Event Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rm-glass-card rounded-xl border border-[var(--color-rm-glass-border)] hover:border-[var(--color-rm-gold)]/30 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" />
                      <span className="text-[var(--color-rm-text-primary)] font-medium leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <section className="rm-reveal" style={{ transitionDelay: '200ms' }}>
                <h2 className="text-2xl font-bold rm-heading-primary mb-8">Event Schedule</h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--color-rm-gold)] before:via-[var(--color-rm-glass-border)] before:to-transparent">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-rm-bg-deep)] border-[3px] border-[var(--color-rm-gold)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(217,164,65,0.2)] z-10" />
                      
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rm-glass-card rounded-2xl border border-[var(--color-rm-glass-border)] group-hover:border-[var(--color-rm-gold)]/40 transition-colors shadow-sm">
                        <div className="text-[var(--color-rm-gold)] font-bold text-sm tracking-wider mb-2">{item.time}</div>
                        <h4 className="text-lg font-bold rm-heading-primary mb-2">{item.title}</h4>
                        {item.description && <p className="text-sm rm-text-body mb-3">{item.description}</p>}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
                          {item.speaker && (
                            <span className="text-xs font-semibold text-[var(--color-rm-text-primary)]/80 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{item.speaker}</span>
                          )}
                          {item.venue && (
                            <span className="text-xs font-semibold text-[var(--color-rm-text-primary)]/80 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.venue}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Grid */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <section className="rm-reveal" style={{ transitionDelay: '300ms' }}>
                <h2 className="text-2xl font-bold rm-heading-primary mb-6">Event Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-rm-glass-border)] group bg-black/20">
                      <Image 
                        src={img.url} 
                        alt={img.alt} 
                        fill 
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Important Information */}
            {event.instructions && event.instructions.length > 0 && (
              <section className="rm-reveal" style={{ transitionDelay: '400ms' }}>
                <div className="p-6 md:p-8 bg-gradient-to-br from-[#2D0A14] to-[var(--color-rm-bg-deep)] border border-red-900/30 rounded-2xl shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
                   <h2 className="text-xl font-bold rm-heading-primary mb-5 flex items-center gap-3">
                     <Info className="w-5 h-5 text-red-400" />
                     Important Information
                   </h2>
                   <ul className="space-y-3">
                     {event.instructions.map((inst, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
                         <span className="text-[var(--color-rm-text-primary)]/90 text-sm md:text-base font-medium">{inst}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Registration Panel */}
             {event.registrationRequired && (
               <div className="rm-reveal p-6 md:p-8 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)] shadow-[0_8px_30px_rgba(0,0,0,0.3)] sticky top-28">
                 <h3 className="text-xl font-bold rm-heading-primary mb-6 flex items-center gap-3">
                   <Ticket className="w-5 h-5 text-[var(--color-rm-gold)]" />
                   Registration
                 </h3>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-[var(--color-rm-glass-border)]">
                      <span className="rm-text-muted text-sm font-medium">Status</span>
                      <span className={`text-sm font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border ${
                        event.registrationStatus === "Open" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {event.registrationStatus}
                      </span>
                    </div>

                    {event.registrationFee !== undefined && (
                      <div className="flex justify-between items-center pb-4 border-b border-[var(--color-rm-glass-border)]">
                        <span className="rm-text-muted text-sm font-medium">Fee</span>
                        <span className="text-base font-bold text-[var(--color-rm-text-primary)]">
                          {event.registrationFee === 0 ? "Free" : `₹${event.registrationFee}`}
                        </span>
                      </div>
                    )}

                    {event.availableSeats !== undefined && (
                      <div className="flex justify-between items-center pb-4 border-b border-[var(--color-rm-glass-border)]">
                        <span className="rm-text-muted text-sm font-medium">Available Seats</span>
                        <span className="text-sm font-bold text-[var(--color-rm-gold)]">
                          {event.availableSeats}
                        </span>
                      </div>
                    )}

                    {event.eligibility && (
                      <div className="flex flex-col gap-1 pb-4 border-b border-[var(--color-rm-glass-border)]">
                        <span className="rm-text-muted text-sm font-medium">Eligibility</span>
                        <span className="text-sm font-semibold text-[var(--color-rm-text-primary)]/90 leading-relaxed">
                          {event.eligibility}
                        </span>
                      </div>
                    )}
                 </div>

                 {event.registrationStatus === "Open" && status !== "Past" ? (
                   <button className="w-full py-4 bg-[var(--color-rm-gold)] text-[#12070B] font-bold rounded-xl hover:bg-white transition-all duration-300 shadow-[0_8px_20px_rgba(217,164,65,0.2)] flex items-center justify-center gap-2 group">
                     Register Now
                     <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                   </button>
                 ) : (
                   <button disabled className="w-full py-4 bg-white/5 text-white/40 font-bold rounded-xl border border-white/10 cursor-not-allowed">
                     {status === "Past" ? "Event Concluded" : "Registration Closed"}
                   </button>
                 )}
               </div>
             )}

             {/* No Registration Required */}
             {!event.registrationRequired && (
               <div className="rm-reveal p-6 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)]">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                     <Ticket className="w-5 h-5 text-[var(--color-rm-gold-soft)]" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-base font-bold rm-heading-primary">No Registration Required</span>
                     <span className="text-xs rm-text-muted">Open to all attendees</span>
                   </div>
                 </div>
               </div>
             )}

             {/* Event Information Panel */}
             <div className="rm-reveal p-6 md:p-8 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)]" style={{ transitionDelay: '100ms' }}>
               <h3 className="text-xl font-bold rm-heading-primary mb-6">Event Details</h3>
               <ul className="space-y-5">
                 <li className="flex gap-4">
                   <CalendarDays className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" />
                   <div className="flex flex-col">
                     <span className="text-xs text-[var(--color-rm-text-primary)]/60 font-medium uppercase tracking-wider mb-1">Date</span>
                     <span className="text-sm font-semibold text-[var(--color-rm-text-primary)]">{formattedDate}</span>
                   </div>
                 </li>
                 {event.time && (
                   <li className="flex gap-4">
                     <Clock className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" />
                     <div className="flex flex-col">
                       <span className="text-xs text-[var(--color-rm-text-primary)]/60 font-medium uppercase tracking-wider mb-1">Time</span>
                       <span className="text-sm font-semibold text-[var(--color-rm-text-primary)]">{event.time}</span>
                     </div>
                   </li>
                 )}
                 {event.location && (
                   <li className="flex gap-4">
                     <MapPin className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" />
                     <div className="flex flex-col">
                       <span className="text-xs text-[var(--color-rm-text-primary)]/60 font-medium uppercase tracking-wider mb-1">Venue</span>
                       <span className="text-sm font-semibold text-[var(--color-rm-text-primary)]">{event.location}</span>
                     </div>
                   </li>
                 )}
                 {event.eventMode && (
                   <li className="flex gap-4">
                     <Tag className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" />
                     <div className="flex flex-col">
                       <span className="text-xs text-[var(--color-rm-text-primary)]/60 font-medium uppercase tracking-wider mb-1">Mode</span>
                       <span className="text-sm font-semibold text-[var(--color-rm-text-primary)]">{event.eventMode}</span>
                     </div>
                   </li>
                 )}
               </ul>
             </div>

             {/* Organizer */}
             {event.organizerName && (
               <div className="rm-reveal p-6 md:p-8 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)]" style={{ transitionDelay: '200ms' }}>
                 <h3 className="text-xl font-bold rm-heading-primary mb-5">Organized By</h3>
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 flex items-center justify-center shrink-0">
                     <Users className="w-5 h-5 text-[var(--color-rm-gold)]" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-base font-bold text-[var(--color-rm-text-primary)] leading-tight">{event.organizerName}</span>
                     {event.organizerType && (
                       <span className="text-xs font-semibold tracking-wider text-[var(--color-rm-gold)] uppercase mt-1">
                         {event.organizerType}
                       </span>
                     )}
                   </div>
                 </div>
                 {event.contactInformation && (
                   <div className="mt-5 pt-5 border-t border-[var(--color-rm-glass-border)]">
                     <span className="block text-xs text-[var(--color-rm-text-primary)]/60 font-medium uppercase tracking-wider mb-1">Contact Support</span>
                     <a href={`mailto:${event.contactInformation}`} className="text-sm font-semibold text-[var(--color-rm-gold)] hover:underline">
                       {event.contactInformation}
                     </a>
                   </div>
                 )}
               </div>
             )}

             {/* Share Event */}
             <div className="rm-reveal p-6 rm-glass-card rounded-[2rem] border border-[var(--color-rm-glass-border)]" style={{ transitionDelay: '300ms' }}>
               <h3 className="text-lg font-bold rm-heading-primary mb-4">Share This Event</h3>
               <EventShare url={event.href} title={event.title} />
             </div>

          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {displayRelatedEvents.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 lg:px-8 mt-24 mb-10 max-w-7xl border-t border-[var(--color-rm-glass-border)] pt-16">
          <div className="rm-reveal flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold rm-heading-primary">You May Also Like</h2>
            <Link href="/events" className="hidden sm:flex items-center text-[var(--color-rm-gold)] font-bold text-sm tracking-wide hover:text-white transition-colors">
              View All Events
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRelatedEvents.map((evt, idx) => (
              <div key={evt.id} className="rm-reveal h-full" style={{ transitionDelay: `${idx * 100}ms` }}>
                <EventCard event={evt} />
              </div>
            ))}
          </div>
          <div className="mt-8 sm:hidden">
            <Link href="/events" className="flex items-center justify-center w-full py-4 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-xl text-[var(--color-rm-gold)] font-bold text-sm tracking-wide">
              View All Events
            </Link>
          </div>
        </section>
      )}

      {/* Back Navigation bottom */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-16 max-w-7xl flex justify-center pb-8">
        <Link 
          href="/events"
          className="rm-reveal inline-flex items-center gap-2 px-6 py-3 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-full text-sm font-bold text-[var(--color-rm-text-primary)] hover:text-[var(--color-rm-gold)] hover:border-[var(--color-rm-gold)]/40 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
          Back to All Events
        </Link>
      </div>

    </article>
  );
}
