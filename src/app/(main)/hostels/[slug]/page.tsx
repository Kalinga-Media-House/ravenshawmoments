import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Users, Phone, Mail, Building, History, Shield, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data } = await (supabase as any).from("hostels")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Hostel Not Found" };
  return {
    title: `${data.name} | Ravenshaw Moments`,
    description: data.description || `Details for ${data.name}`,
  };
}

export default async function HostelDetailsPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: hostel, error } = await (supabase as any).from("hostels")
    .select("*, hostel_wardens(*), hostel_bmcs(*, profile:profiles(first_name, last_name, avatar_url))")
    .eq("slug", params.slug)
    .single();

  if (error || !hostel) {
    notFound();
  }

  // Current warden
  const warden = hostel.hostel_wardens?.find((w: any) => w.is_current);
  const activeBmcs = hostel.hostel_bmcs?.filter((bmc: any) => bmc.is_active);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900 overflow-hidden">
        {hostel.cover_image_url && (
          <img 
            src={hostel.cover_image_url} 
            alt={hostel.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {hostel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-200">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                <span className="capitalize">{hostel.hostel_type.replace("_", " ")}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{hostel.capacity ? `${hostel.capacity} Residents Capacity` : "Capacity N/A"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{hostel.address || "Campus"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <BookOpen className="w-6 h-6 mr-3 text-rose-700" />
                About {hostel.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {hostel.description || "No description available yet."}
              </p>
            </section>

            {/* History */}
            {hostel.history && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                  <History className="w-6 h-6 mr-3 text-rose-700" />
                  Rich History
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {hostel.history}
                </p>
              </section>
            )}

            {/* Facilities */}
            {hostel.facilities && Array.isArray(hostel.facilities) && hostel.facilities.length > 0 && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-rose-700" />
                  Facilities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(hostel.facilities as any[]).map((f: any, idx: any) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                      <span className="font-medium text-gray-800">{f.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            
            {/* Warden Card */}
            {warden && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Hostel Warden</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 text-2xl font-bold mb-4">
                    {warden.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl">{warden.name}</h4>
                  <p className="text-rose-700 font-medium">{warden.designation}</p>
                  
                  <div className="mt-4 space-y-2 w-full text-left text-sm text-gray-600">
                    {warden.contact_number && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" /> {warden.contact_number}
                      </div>
                    )}
                    {warden.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" /> {warden.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Block Management Committee */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Block Management Committee</h3>
              {activeBmcs && activeBmcs.length > 0 ? (
                <div className="space-y-4">
                  {activeBmcs.map((bmc: any) => (
                    <div key={bmc.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                      {bmc.profile?.avatar_url ? (
                        <img src={bmc.profile.avatar_url} className="w-10 h-10 rounded-full mr-3 object-cover" alt="avatar" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 mr-3">
                          {bmc.profile?.first_name?.charAt(0) || "B"}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{bmc.profile?.first_name} {bmc.profile?.last_name}</p>
                        <p className="text-xs text-rose-600 font-medium capitalize">{bmc.role_title.replace("_", " ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Committee details not available.</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contact Details</h3>
              <div className="space-y-3 text-gray-600">
                {hostel.contact_number && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{hostel.contact_number}</span>
                  </div>
                )}
                {hostel.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{hostel.contact_email}</span>
                  </div>
                )}
                <div className="flex items-start mt-4">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{hostel.address || "Ravenshaw University"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
