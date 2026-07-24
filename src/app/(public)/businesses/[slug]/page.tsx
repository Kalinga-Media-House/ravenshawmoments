import React from 'react';
import { Metadata } from 'next';
import { getBusinessProfileAction } from '@/features/business/actions/business.actions';
import { notFound } from 'next/navigation';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import { MapPin, Phone, Mail, Globe, Clock, CheckCircle2, ShieldCheck, Instagram, Facebook, Star } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ClaimBusinessButton } from '@/features/business/components/ClaimBusinessButton';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Business Details | Ravenshaw Moments`,
    description: `View business details on Ravenshaw Moments.`,
  };
}

export default async function BusinessDetailsPage({ params }: { params: { slug: string } }) {
  const result = await getBusinessProfileAction(params.slug);
  if (!result.success || !result.data) {
    notFound();
  }

  const { business, gallery, hours, reviews } = result.data;

  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  let currentUser = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('id, full_name, profile_status, is_verified').eq('id', user.id).single();
    currentUser = data;
  }

  // Formatting hours map for display
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title={business.name}
        description={business.description || business.category?.name || 'Local Business'}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Businesses', href: '/businesses' },
          { label: business.category?.name || 'Category', href: `/businesses/category/${business.category?.slug}` },
          { label: business.name }
        ]}
        backgroundImage={innerPageHeroImages.community}
      />
      
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 border border-[#8F0028]/10 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-extrabold text-[#171214]">{business.name}</h2>
                {business.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </span>
                )}
                {business.is_premium && (
                  <span className="flex items-center gap-1 text-sm font-bold text-[#3A000E] bg-[#E8B83F]/20 px-3 py-1 rounded-full border border-[#E8B83F]/30 uppercase tracking-wider">
                    Premium
                  </span>
                )}
              </div>
              
              {business.description && (
                <div className="prose prose-p:text-[#756A6E] max-w-none mb-8">
                  <p>{business.description}</p>
                </div>
              )}
              
              {/* Facilities & Services */}
              {(business.services_offered?.length > 0 || business.facilities?.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#171214] mb-4">What We Offer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {business.services_offered?.map((service: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-[#756A6E]">
                        <CheckCircle2 className="w-5 h-5 text-[#8F0028]" />
                        <span>{service}</span>
                      </div>
                    ))}
                    {business.facilities?.map((facility: string, i: number) => (
                      <div key={`f-${i}`} className="flex items-center gap-3 text-[#756A6E]">
                        <CheckCircle2 className="w-5 h-5 text-[#E8B83F]" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Gallery */}
              {gallery && gallery.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#171214] mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((img: any) => (
                      <div key={img.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative border border-[#8F0028]/10">
                        {/* Placeholder for actual image: img.media.file_path */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#756A6E] text-xs font-bold uppercase tracking-wider bg-[#8F0028]/5">
                          {img.caption || 'Image'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Reviews Section Placeholder */}
            <div className="bg-white rounded-3xl p-8 border border-[#8F0028]/10 shadow-sm">
              <h3 className="text-xl font-bold text-[#171214] mb-6">Reviews</h3>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((rev: any) => (
                    <div key={rev.id} className="border-b border-[#8F0028]/10 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-[#171214]">{rev.reviewer?.first_name} {rev.reviewer?.last_name}</div>
                        <div className="text-xs text-[#756A6E]">{new Date(rev.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[#E8B83F] mb-2">
                        {Array.from({length: rev.rating}).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-[#756A6E]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#756A6E]">No reviews yet.</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 border border-[#8F0028]/10 shadow-sm sticky top-24">
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#171214] mb-4">Contact Info</h3>
                <div className="space-y-4">
                  {business.address && (
                    <div className="flex items-start gap-3 text-[#756A6E]">
                      <MapPin className="w-5 h-5 text-[#8F0028] shrink-0 mt-0.5" />
                      <span>{business.address}</span>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-3 text-[#756A6E]">
                      <Phone className="w-5 h-5 text-[#8F0028] shrink-0" />
                      <a href={`tel:${business.phone}`} className="hover:text-[#8F0028] hover:underline">{business.phone}</a>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-3 text-[#756A6E]">
                      <Mail className="w-5 h-5 text-[#8F0028] shrink-0" />
                      <a href={`mailto:${business.email}`} className="hover:text-[#8F0028] hover:underline">{business.email}</a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-3 text-[#756A6E]">
                      <Globe className="w-5 h-5 text-[#8F0028] shrink-0" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#8F0028] hover:underline">Visit Website</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Socials */}
              {(business.instagram || business.facebook) && (
                <div className="mb-8">
                   <h3 className="text-lg font-bold text-[#171214] mb-4">Social Media</h3>
                   <div className="flex gap-4">
                     {business.instagram && (
                       <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#8F0028]/5 rounded-lg text-[#8F0028] hover:bg-[#8F0028] hover:text-white transition-colors">
                         <Instagram className="w-5 h-5" />
                       </a>
                     )}
                     {business.facebook && (
                       <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#8F0028]/5 rounded-lg text-[#8F0028] hover:bg-[#8F0028] hover:text-white transition-colors">
                         <Facebook className="w-5 h-5" />
                       </a>
                     )}
                   </div>
                </div>
              )}

              {/* Working Hours */}
              {hours && hours.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#171214] mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#8F0028]" /> Working Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    {hours.map((h: any) => (
                      <div key={h.day_of_week} className="flex justify-between border-b border-[#8F0028]/5 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-[#171214]">{daysOfWeek[h.day_of_week]}</span>
                        <span className="text-[#756A6E]">
                          {h.is_closed ? 'Closed' : `${h.open_time} - ${h.close_time}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!business.owner_profile_id && (
                <div className="mt-8 pt-8 border-t border-[#8F0028]/10 text-center">
                  <p className="text-sm text-[#756A6E] mb-4">Own this business? Claim it to manage your listing, add photos, and respond to reviews.</p>
                  <ClaimBusinessButton
                    businessId={business.id}
                    businessName={business.name}
                    currentUser={currentUser}
                  />
                </div>
              )}
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
