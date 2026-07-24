import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Users, Phone, Mail, Building, History, Shield, BookOpen, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HostelService } from "@/features/hostel/services";
import { HostelWardenRepository, HostelBMCRepository } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/repositories"; // If available, or I'll just skip profile name if not joined

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const hostel = await HostelService.getHostelBySlug(params.slug);
    return {
      title: `${hostel.name} | Ravenshaw Moments`,
      description: hostel.description || `Details for ${hostel.name}`,
    };
  } catch (error) {
    return { title: "Hostel Not Found" };
  }
}

export default async function HostelDetailsPage({ params }: { params: { slug: string } }) {
  let hostel;
  try {
    hostel = await HostelService.getHostelBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  const supabase = await createClient();
  const wardenRepo = new HostelWardenRepository(supabase as any);
  const bmcRepo = new HostelBMCRepository(supabase as any);

  const warden = await wardenRepo.findCurrentWarden(hostel.id);
  const rawActiveBmcs = await bmcRepo.findActiveBMCCouncil(hostel.id);

  const profileRepo = new ProfileRepository(supabase as any);
  
  // Hydrate BMCs with profiles
  const activeBmcs = await Promise.all(
    rawActiveBmcs.map(async (bmc) => {
      if (!bmc.profile_id) return { ...bmc, profile: null };
      const profile = await profileRepo.findById(bmc.profile_id);
      return { ...bmc, profile };
    })
  );

  return (
    <div className="min-h-screen bg-[#F8F4EC] pb-20">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {hostel.cover_image_url ? (
            <Image
              src={hostel.cover_image_url}
              alt={hostel.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <Image
              src="/hero/hero-1.webp"
              alt="Ravenshaw University Campus"
              fill
              className="object-cover grayscale"
              priority
            />
          )}
          <div className="absolute inset-0 bg-[#3A0016]/85 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A0016] via-[#3A0016]/70 to-[#3A0016]/30 z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#1a000a]/60 z-30 mix-blend-overlay" />
        </div>

        <div className="container relative z-40 px-4 md:px-6 flex flex-col items-center text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A046]/20 border border-[#C8A046]/50 text-[#C8A046] text-xs font-black uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            <span>{hostel.hostel_type.replace("_", " ")}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8F4EC] mb-8 font-serif drop-shadow-lg">
            {hostel.name}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-[#F8F4EC]/90 text-sm md:text-base font-medium">
            <div className="flex items-center bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Users className="w-5 h-5 mr-2 text-[#C8A046]" />
              <span>{(hostel as any).capacity ? `${(hostel as any).capacity} Residents` : "Capacity N/A"}</span>
            </div>
            <div className="flex items-center bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <MapPin className="w-5 h-5 mr-2 text-[#C8A046]" />
              <span>{hostel.address || "Ravenshaw University Campus"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About */}
            <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-serif text-[#3A0016] flex items-center mb-6">
                  <BookOpen className="w-6 h-6 mr-3 text-[#C8A046]" />
                  About {hostel.name}
                </h2>
                <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                <p className="text-[#5A1024]/80 leading-relaxed text-lg whitespace-pre-wrap">
                  {hostel.description || "No description available yet."}
                </p>
              </CardContent>
            </Card>

            {/* History */}
            {hostel.history && (
              <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-serif text-[#3A0016] flex items-center mb-6">
                    <History className="w-6 h-6 mr-3 text-[#C8A046]" />
                    Rich History
                  </h2>
                  <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                  <p className="text-[#5A1024]/80 leading-relaxed whitespace-pre-wrap">
                    {hostel.history}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Facilities */}
            {hostel.facilities && Array.isArray(hostel.facilities) && hostel.facilities.length > 0 && (
              <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-serif text-[#3A0016] flex items-center mb-6">
                    <Shield className="w-6 h-6 mr-3 text-[#C8A046]" />
                    Facilities
                  </h2>
                  <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(hostel.facilities as any[]).map((f: any, idx: any) => (
                      <div key={idx} className="p-4 bg-[#F8F4EC] rounded-xl border border-[#3A0016]/5 text-center flex flex-col items-center justify-center hover:border-[#C8A046]/30 transition-colors">
                        <span className="font-bold text-[#5A1024] text-sm">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            
            {/* Warden Card */}
            {warden && (
              <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold font-serif text-[#3A0016] mb-4">Hostel Warden</h3>
                  <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-[#F8F4EC] rounded-full flex items-center justify-center text-[#3A0016] border-2 border-[#C8A046] text-3xl font-bold mb-4 shadow-sm">
                      {warden.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-[#3A0016] text-xl">{warden.name}</h4>
                    <p className="text-[#C8A046] font-bold text-sm tracking-wide uppercase mt-1">{warden.designation}</p>
                    
                    <div className="mt-6 space-y-3 w-full text-left text-sm text-[#5A1024]/80 bg-[#F8F4EC] p-4 rounded-xl border border-[#3A0016]/5">
                      {warden.contact_number && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-3 text-[#C8A046]" /> {warden.contact_number}
                        </div>
                      )}
                      {warden.email && (
                        <div className="flex items-center break-all">
                          <Mail className="w-4 h-4 mr-3 text-[#C8A046]" /> {warden.email}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Block Management Committee */}
            <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold font-serif text-[#3A0016] mb-4">Management Committee</h3>
                <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                
                {activeBmcs && activeBmcs.length > 0 ? (
                  <div className="space-y-4">
                    {activeBmcs.map((bmc: any) => (
                      <div key={bmc.id} className="flex items-center p-4 bg-[#F8F4EC] rounded-xl border border-[#3A0016]/5 hover:border-[#C8A046]/30 transition-colors">
                        {bmc.profile?.avatar_url ? (
                          <img src={bmc.profile.avatar_url} className="w-12 h-12 rounded-full mr-4 object-cover border border-[#C8A046]/50" alt="avatar" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white border border-[#C8A046]/30 flex items-center justify-center font-bold text-[#3A0016] mr-4 shadow-sm">
                            {bmc.profile?.first_name?.charAt(0) || "B"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#3A0016] text-sm">{bmc.profile?.first_name} {bmc.profile?.last_name}</p>
                          <p className="text-xs text-[#C8A046] font-bold capitalize mt-0.5 tracking-wide">{bmc.role_title.replace("_", " ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#5A1024]/60 text-sm italic">Committee details not available.</p>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white border-[#3A0016]/10 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold font-serif text-[#3A0016] mb-4">Contact Details</h3>
                <div className="w-12 h-1 bg-[#C8A046] rounded-full mb-6" />
                
                <div className="space-y-4 text-[#5A1024]/80 text-sm font-medium">
                  {hostel.contact_number && (
                    <div className="flex items-center bg-[#F8F4EC] p-3 rounded-lg border border-[#3A0016]/5">
                      <Phone className="w-5 h-5 mr-3 text-[#C8A046]" />
                      <span>{hostel.contact_number}</span>
                    </div>
                  )}
                  {hostel.contact_email && (
                    <div className="flex items-center bg-[#F8F4EC] p-3 rounded-lg border border-[#3A0016]/5">
                      <Mail className="w-5 h-5 mr-3 text-[#C8A046]" />
                      <span>{hostel.contact_email}</span>
                    </div>
                  )}
                  <div className="flex items-start bg-[#F8F4EC] p-3 rounded-lg border border-[#3A0016]/5">
                    <MapPin className="w-5 h-5 mr-3 text-[#C8A046] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{hostel.address || "Ravenshaw University Campus"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
