import React, { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Gallery, EventList, NoticeList, PublicationList } from "@/features/shared";
import { MapPin, Mail, Users, Share2, Globe, Phone } from "lucide-react";
import { getPublicOrganizationBySlug, listActiveMembers } from "@/app/actions/organization";

export const revalidate = 60; // Revalidate every minute instead of 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await getPublicOrganizationBySlug(resolvedParams.slug);
  
  if (!res.success || !res.data) {
    return {
      title: "Organization Not Found | Ravenshaw Moments",
    };
  }
  
  return {
    title: `${res.data.name} | Organization`,
    description: res.data.description?.substring(0, 160) || `Learn more about ${res.data.name} at Ravenshaw University.`,
  };
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const res = await getPublicOrganizationBySlug(slug);
  if (!res.success || !res.data) {
    notFound();
  }

  const org = res.data;
  
  // Try to fetch members to show count, fail silently if error
  let memberCount = 0;
  try {
    const membersRes = await listActiveMembers(org.id);
    if (membersRes.success && membersRes.data) {
      memberCount = membersRes.data.length;
    }
  } catch (e) {
    console.error("Failed to fetch members for org count", e);
  }

  return (
    <article className="pb-24">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full flex items-end">
        <div className="absolute inset-0 z-0 bg-black">
          <Image 
            src="/images/hero/hero-3.webp"
            alt="Cover"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: "linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.38))" }} 
          />
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%)" }} 
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl rm-glass-card shadow-xl flex items-center justify-center p-2 border border-[var(--color-rm-glass-border)]">
                <div className="w-full h-full bg-[var(--color-rm-gold)]/10 rounded-xl flex items-center justify-center text-3xl font-bold text-[var(--color-rm-gold)]">
                  {org.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold rm-heading-primary mb-2 capitalize">{org.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="rm-text-body font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--color-rm-gold)]" /> Ravenshaw University Campus
                  </p>
                  <span className="text-xs font-bold tracking-wider text-[var(--color-rm-gold)] uppercase bg-[var(--color-rm-gold)]/10 px-3 py-1 rounded-full border border-[var(--color-rm-gold)]/20">
                    {org.org_type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-[var(--color-rm-glass-border)] text-[var(--color-rm-text-primary)] rounded-full font-semibold hover:bg-[var(--color-rm-gold)]/20 hover:border-[var(--color-rm-gold)]/50 transition-all">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section className="rm-reveal">
            <h2 className="text-2xl font-bold rm-heading-primary mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-rm-gold)]" />
              About
            </h2>
            <p className="rm-text-body leading-relaxed text-lg whitespace-pre-wrap">
              {org.description || "No description available for this organization."}
            </p>
          </section>

          <section className="rm-reveal" style={{ transitionDelay: '100ms' }}>
            <h2 className="text-2xl font-bold rm-heading-primary mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-rm-gold)]" />
              Recent Events
            </h2>
            <Suspense fallback={<div className="text-[var(--color-rm-gold)]">Loading events...</div>}>
               {/* <EventList events={[]} /> */}
               <div className="p-8 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl text-center rm-text-muted">No events scheduled.</div>
            </Suspense>
          </section>

          <section className="rm-reveal" style={{ transitionDelay: '200ms' }}>
            <h2 className="text-2xl font-bold rm-heading-primary mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-rm-gold)]" />
              Gallery
            </h2>
            <Suspense fallback={<div className="text-[var(--color-rm-gold)]">Loading gallery...</div>}>
               {/* <Gallery items={[]} /> */}
               <div className="p-8 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl text-center rm-text-muted">No gallery items found.</div>
            </Suspense>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8 rm-reveal" style={{ transitionDelay: '300ms' }}>
          <div className="rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl p-6 md:p-8">
            <h3 className="font-bold rm-heading-primary mb-6 text-xl">Quick Info</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 rm-text-body font-medium">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-rm-glass-border)] flex items-center justify-center">
                  <Users className="w-4 h-4 text-[var(--color-rm-gold)]" />
                </div>
                <span>{memberCount > 0 ? `${memberCount} Members` : 'Growing Community'}</span>
              </li>
              
              {org.contact_email && (
                <li className="flex items-center gap-4 rm-text-body font-medium">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-rm-glass-border)] flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[var(--color-rm-gold)]" />
                  </div>
                  <a href={`mailto:${org.contact_email}`} className="hover:text-[var(--color-rm-gold)] transition-colors">
                    {org.contact_email}
                  </a>
                </li>
              )}
              
              {org.contact_phone && (
                <li className="flex items-center gap-4 rm-text-body font-medium">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-rm-glass-border)] flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[var(--color-rm-gold)]" />
                  </div>
                  <a href={`tel:${org.contact_phone}`} className="hover:text-[var(--color-rm-gold)] transition-colors">
                    {org.contact_phone}
                  </a>
                </li>
              )}
              
              {org.social_links?.website && (
                <li className="flex items-center gap-4 rm-text-body font-medium">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-rm-glass-border)] flex items-center justify-center">
                    <Globe className="w-4 h-4 text-[var(--color-rm-gold)]" />
                  </div>
                  <a href={org.social_links.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-rm-gold)] transition-colors">
                    Visit Website
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl p-6 md:p-8">
            <h3 className="font-bold rm-heading-primary mb-6 text-xl">Latest Notices</h3>
            {/* <NoticeList notices={[]} /> */}
            <p className="rm-text-muted">No active notices.</p>
          </div>
        </div>
      </div>
    </article>
  );
}
