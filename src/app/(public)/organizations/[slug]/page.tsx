
import React, { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Gallery, EventList, NoticeList, PublicationList } from "@/features/shared";
import { MapPin, Mail, Users, Share2 } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.slug} | Organization`,
  };
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Real implementation will fetch the item here
  // const res = await getPublicOrganizationBySlug(slug);
  // if (!res.success) notFound();

  return (
    <article className="pb-24">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full bg-gray-900 flex items-end">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Cover"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white shadow-xl flex items-center justify-center p-2">
                <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center text-3xl font-bold text-primary">
                  {slug.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 capitalize">{slug.replace(/-/g, ' ')}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Ravenshaw University Campus
                </p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Detailed description of the organization goes here. It provides a comprehensive overview of its history, objectives, and community impact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Events</h2>
            <Suspense fallback={<div>Loading events...</div>}>
               {/* <EventList events={[]} /> */}
               <div className="p-8 border border-border rounded-xl text-center text-muted-foreground">No events scheduled.</div>
            </Suspense>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <Suspense fallback={<div>Loading gallery...</div>}>
               {/* <Gallery items={[]} /> */}
               <div className="p-8 border border-border rounded-xl text-center text-muted-foreground">No gallery items found.</div>
            </Suspense>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-lg">Quick Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span>1,200+ Members</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@ravenshaw.edu</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-lg">Latest Notices</h3>
            {/* <NoticeList notices={[]} /> */}
            <p className="text-sm text-muted-foreground">No active notices.</p>
          </div>
        </div>
      </div>
    </article>
  );
}
