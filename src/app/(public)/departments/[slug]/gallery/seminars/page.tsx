import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/features/department/components/detail/common";
import { Calendar, MapPin, Image as ImageIcon, ArrowRight } from "lucide-react";

export default async function SeminarsGalleryLandingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const departmentName = slug.replace(/-/g, " ");

  // Mock seminars list for scale demonstration
  const mockSeminars = [
    { id: "s1", title: "National Conference on Recent Advances", date: "October 12, 2026", location: "Seminar Hall", photoCount: 94 },
    { id: "s2", title: "Guest Lecture Series: Industry Insights", date: "April 22, 2026", location: "Room 102", photoCount: 36 },
    { id: "s3", title: "International Webinar on AI Applications", date: "November 5, 2025", location: "Virtual (Teams)", photoCount: 15 },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-12 sm:py-16">
      <SectionHeader
        title="Seminar Photos"
        subtitle={`Browse photo galleries from national seminars, guest lectures, conferences, and academic presentations organized by the Department of ${departmentName}.`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
        {mockSeminars.map((seminar) => (
          <Link
            key={seminar.id}
            href={`/departments/${slug}/gallery/seminars/${seminar.id}`}
            className="group flex flex-col justify-between bg-white border border-[#EADFCF] hover:border-[#E11D48]/50 rounded-[24px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold text-[#7A7476]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>{seminar.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span className="line-clamp-1">{seminar.location}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-[#1E1B1C] group-hover:text-[#BE123C] transition-colors leading-snug line-clamp-2">
                {seminar.title}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#EADFCF]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#5B001B]">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{seminar.photoCount} Photos</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#E11D48]/10 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#7A7476] group-hover:text-[#E11D48] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
