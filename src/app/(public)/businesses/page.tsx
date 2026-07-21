import React from 'react';
import { Metadata } from 'next';
import { getBusinessCategoriesAction, getBusinessListingsAction } from '@/features/business/actions/business.actions';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import Link from 'next/link';
import { Map, Star, ShieldCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus Business Directory | Ravenshaw Moments',
  description: 'Discover verified local businesses, hostels, and services around Ravenshaw University.',
};

export default async function BusinessDirectoryPage() {
  const [categoriesRes, listingsRes] = await Promise.all([
    getBusinessCategoriesAction(),
    getBusinessListingsAction({ limit: 12 })
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const listings = listingsRes.success ? listingsRes.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Campus Business Directory"
        description="Discover trusted local businesses, accommodations, and services around Ravenshaw University."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Businesses' }
        ]}
        backgroundImage={innerPageHeroImages.community}
      />
      
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        
        {/* Top Actions & Categories */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="lg:w-1/4">
            <h3 className="text-xl font-bold text-[#171214] mb-6">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories?.map((cat: any) => (
                <Link 
                  key={cat.id} 
                  href={`/businesses/category/${cat.slug}`}
                  className="px-4 py-3 bg-white border border-[#8F0028]/10 rounded-xl hover:border-[#8F0028]/30 hover:bg-[#8F0028]/5 transition-colors text-[#3A000E] font-medium flex justify-between items-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-[#3A000E] to-[#6B0019] rounded-2xl text-white shadow-lg">
              <Map className="w-8 h-8 mb-4 text-[#E8B83F]" />
              <h4 className="font-bold mb-2">Explore on Map</h4>
              <p className="text-sm text-white/80 mb-6">Find nearby verified businesses visually.</p>
              <Link href="/businesses/map" className="block text-center w-full py-2.5 bg-[#E8B83F] text-[#3A000E] font-bold rounded-lg hover:bg-white hover:text-[#8F0028] transition-colors">
                View Map
              </Link>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#171214]">Featured & Verified</h2>
              <Link href="/businesses/map" className="hidden md:flex items-center gap-2 text-[#8F0028] font-bold hover:underline">
                <MapPin className="w-4 h-4"/> Browse Map
              </Link>
            </div>

            {(!listings || listings.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#8F0028]/10 shadow-sm">
                <h3 className="text-xl font-bold text-[#171214] mb-2">No Businesses Found</h3>
                <p className="text-[#756A6E]">We are currently onboarding verified local businesses.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing: any) => (
                  <Link href={`/businesses/${listing.slug}`} key={listing.id} className="group flex flex-col bg-white border border-[#8F0028]/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 relative">
                    {/* Badge */}
                    {(listing.is_featured || listing.is_premium) && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#E8B83F] text-[#3A000E] text-xs font-bold rounded-full uppercase tracking-widest shadow-md">
                        {listing.is_premium ? 'Premium' : 'Featured'}
                      </div>
                    )}
                    
                    <div className="h-48 bg-[#3A000E] relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[#171214] group-hover:text-[#8F0028] transition-colors line-clamp-1">
                          {listing.name}
                        </h3>
                        {listing.verification_status === 'verified' && (
                          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" aria-label="Verified Business"/>
                        )}
                      </div>
                      
                      <div className="text-sm font-bold text-[#8F0028] mb-3">
                        {listing.category?.name || 'Uncategorized'}
                      </div>
                      
                      <p className="text-sm text-[#756A6E] line-clamp-2 mb-6">
                        {listing.address || 'Address not provided'}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="text-[#171214] font-bold">
                          {Array.from({length: listing.price_range || 1}).map(() => '$').join('')}
                        </span>
                        <span className="text-[#8F0028] font-semibold flex items-center gap-1 group-hover:underline">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
