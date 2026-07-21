import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/features/department/components/detail/common";
import { Calendar, MapPin, Image as ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function EventsGalleryLandingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const departmentName = slug.replace(/-/g, " ");

  // Mock events list for scale demonstration
  const mockEvents = [
    { id: "e1", title: "National Level Hackathon 2026", date: "August 15, 2026", location: "Main Auditorium", photoCount: 124 },
    { id: "e2", title: "Annual Cultural Fest - Resonance", date: "January 10, 2026", location: "Open Air Theatre", photoCount: 215 },
    { id: "e3", title: "Department Alumni Meet", date: "December 20, 2025", location: "Seminar Hall", photoCount: 86 },
    { id: "e4", title: "Inter-College Debate Competition", date: "September 5, 2025", location: "Room 204", photoCount: 42 }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <SectionHeader
        title="Event Photos"
        subtitle={`Browse photo galleries from workshops, competitions, cultural programmes, and departmental events organized by the Department of ${departmentName}.`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
        {mockEvents.map((event) => (
          <Link
            key={event.id}
            href={`/departments/${slug}/gallery/events/${event.id}`}
            className="group flex flex-col justify-between bg-white border border-[#EADFCF] hover:border-[#10B981]/50 rounded-[24px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold text-[#7A7476]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-[#1E1B1C] group-hover:text-[#047857] transition-colors leading-snug line-clamp-2">
                {event.title}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#EADFCF]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#5B001B]">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{event.photoCount} Photos</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#10B981]/10 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#7A7476] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
