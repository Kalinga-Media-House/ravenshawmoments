import React from 'react';
import { Metadata } from 'next';
import { getCampaignsAction } from '@/features/donations/actions/donation.actions';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import Link from 'next/link';
import { Database } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Donation Campaigns | Ravenshaw Moments',
  description: 'Explore and support active campaigns at Ravenshaw.',
};

export default async function CampaignsPage() {
  const result = await getCampaignsAction();
  const campaigns = result.success ? result.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Fundraising Campaigns"
        description="Support specific initiatives, infrastructure, and events that shape the future of our university."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Donate', href: '/donate' },
          { label: 'Campaigns' }
        ]}
        backgroundImage={innerPageHeroImages.donations}
      />
      
      <div className="container mx-auto py-16 px-4 max-w-6xl">
        {(!campaigns || campaigns.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#8F0028]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#171214] mb-2">No Active Campaigns</h3>
            <p className="text-[#756A6E]">Check back later for new fundraising initiatives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign: any) => {
              const goal = Number(campaign.target_amount) || 0;
              const raised = Number(campaign.raised_amount) || 0;
              const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
              
              return (
                <div key={campaign.id} className="bg-white border border-[#8F0028]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-[#3A000E] to-[#8F0028] relative">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#8F0028] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {campaign.status}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#171214] mb-2 line-clamp-2 group-hover:text-[#8F0028] transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-[#756A6E] text-sm mb-6 line-clamp-3 flex-grow">
                      {campaign.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-[#8F0028]">₹{raised.toLocaleString()} raised</span>
                        <span className="text-[#756A6E]">Goal: ₹{goal.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-[#8F0028]/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8F0028] rounded-full" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#756A6E] mt-2">
                        <span>{campaign.donor_count} Donors</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                    
                    <Link href={`/donate/campaigns/${campaign.id}`} className="w-full block text-center py-3 bg-[#8F0028]/5 hover:bg-[#8F0028] text-[#8F0028] hover:text-white rounded-xl font-bold transition-colors">
                      Support Campaign
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
