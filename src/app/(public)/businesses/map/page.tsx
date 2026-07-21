import React from 'react';
import { Metadata } from 'next';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Business Map | Ravenshaw Moments',
  description: 'View local businesses on the map.',
};

export default function BusinessMapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Explore on Map"
        description="Find verified businesses and services near Ravenshaw University visually."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Businesses', href: '/businesses' },
          { label: 'Map View' }
        ]}
        backgroundImage={innerPageHeroImages.community}
      />
      
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <div className="bg-white rounded-3xl border border-[#8F0028]/10 shadow-sm p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#8F0028]/5 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8F0028]">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#171214] mb-4">Interactive Map Coming Soon</h2>
          <p className="text-[#756A6E] max-w-lg mx-auto mb-8">
            We are preparing the architecture for a fully interactive campus business map showing nearby landmarks and walking distances.
          </p>
          <Link href="/businesses" className="px-6 py-3 bg-[#8F0028] text-white font-bold rounded-xl hover:bg-[#3A000E] transition-colors">
            Return to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
