import React from 'react';
import { Metadata } from 'next';
import { getBusinessCategoriesAction, getBusinessListingsAction } from '@/features/business/actions/business.actions';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import Link from 'next/link';
import { MapPin, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Businesses in ${params.slug} | Ravenshaw Moments`,
    description: `Discover local businesses in the ${params.slug} category.`,
  };
}

export default async function BusinessCategoryPage({ params }: { params: { slug: string } }) {
  const [categoriesRes, listingsRes] = await Promise.all([
    getBusinessCategoriesAction(),
    getBusinessListingsAction({ categorySlug: params.slug })
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const currentCategory = categories?.find((c: any) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const listings = listingsRes.success ? listingsRes.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title={currentCategory.name}
        description={currentCategory.description || `Browse trusted businesses in ${currentCategory.name}.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Businesses', href: '/businesses' },
          { label: currentCategory.name }
        ]}
        backgroundImage={innerPageHeroImages.community}
      />
      
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#171214]">{listings?.length} Results Found</h2>
        </div>

        {(!listings || listings.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#8F0028]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#171214] mb-2">No Businesses Found</h3>
            <p className="text-[#756A6E]">We are currently onboarding verified local businesses in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing: any) => (
              <Link href={`/businesses/${listing.slug}`} key={listing.id} className="group flex flex-col bg-white border border-[#8F0028]/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 relative">
                {(listing.is_featured || listing.is_premium) && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#E8B83F] text-[#3A000E] text-xs font-bold rounded-full uppercase tracking-widest shadow-md">
                    {listing.is_premium ? 'Premium' : 'Featured'}
                  </div>
                )}
                
                <div className="h-40 bg-[#3A000E] relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#171214] group-hover:text-[#8F0028] transition-colors line-clamp-1">
                      {listing.name}
                    </h3>
                    {listing.verification_status === 'verified' && (
                      <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" aria-label="Verified Business"/>
                    )}
                  </div>
                  
                  <p className="text-sm text-[#756A6E] line-clamp-2 mb-4">
                    {listing.address || 'Address not provided'}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-[#171214] font-bold">
                      {Array.from({length: listing.price_range || 1}).map(() => '$').join('')}
                    </span>
                    <span className="text-[#8F0028] font-semibold group-hover:underline">
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
  );
}
