import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Building2, Users, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { HostelTypeEnum } from "@/types/hostel";

export const metadata = {
  title: "Hostels | Ravenshaw Moments",
  description: "Explore the hostels of Ravenshaw University.",
};

export default async function HostelsListingPage() {
  const supabase = await createClient();
  const { data: hostels, error } = await (supabase as any).from("hostels")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching hostels:", error);
    return <div>Error loading hostels. Please try again later.</div>;
  }

  const formatHostelType = (type: string) => {
    switch (type) {
      case "boys": return "Boys Hostel";
      case "girls": return "Girls Hostel";
      case "private_sponsored": return "Private Sponsored";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            University <span className="text-rose-700">Hostels</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the rich residential life at Ravenshaw. Explore facilities, capacities, and rich histories of our beloved hostels.
          </p>
        </div>

        {/* Grid Section */}
        {hostels && hostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostels.map((hostel: any, idx: any) => (
              <Link href={`/hostels/${hostel.slug}`} key={hostel.id}>
                <div 
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
                    {hostel.cover_image_url ? (
                      <img 
                        src={hostel.cover_image_url} 
                        alt={hostel.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Building2 className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-rose-700 shadow-sm">
                      {formatHostelType(hostel.hostel_type)}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-rose-700 transition-colors">
                      {hostel.name}
                    </h3>
                    
                    {hostel.description && (
                      <p className="text-gray-600 line-clamp-2 mb-4 flex-1">
                        {hostel.description}
                      </p>
                    )}

                    <div className="mt-auto space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-2 text-rose-600" />
                        <span>Capacity: <span className="font-semibold text-gray-900">{hostel.capacity || "N/A"}</span></span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-rose-600" />
                        <span className="truncate">{hostel.address || "Ravenshaw University Campus"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No Hostels Found</h3>
            <p className="text-gray-500 mt-2">Check back later for updates on university housing.</p>
          </div>
        )}

      </div>
    </div>
  );
}
