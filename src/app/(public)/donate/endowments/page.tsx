import React from 'react';
import { Metadata } from 'next';
import { getEndowmentFundsAction } from '@/features/donations/actions/donation.actions';
import { InnerPageHero } from '@/features/shared/components';
import { innerPageHeroImages } from '@/config/innerPageHeroImages';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Endowment Funds | Ravenshaw Moments',
  description: 'Contribute to permanent funds ensuring the long-term sustainability of the university.',
};

export default async function EndowmentsPage() {
  const result = await getEndowmentFundsAction();
  const funds = result.success ? result.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Endowment Funds"
        description="Endowment funds provide perpetual support. Your donation is invested, and only the yield is used to fund scholarships, research, and infrastructure."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Donate', href: '/donate' },
          { label: 'Endowments' }
        ]}
        backgroundImage={innerPageHeroImages.donations}
      />
      
      <div className="container mx-auto py-16 px-4 max-w-6xl">
        {(!funds || funds.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#8F0028]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#171214] mb-2">No Active Funds</h3>
            <p className="text-[#756A6E]">Check back later for new endowment funds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funds.map((fund: any) => {
              const principal = Number(fund.principal_amount) || 0;
              const typeLabels: Record<string, string> = {
                permanent: 'Permanent',
                named: 'Named Fund',
                scholarship: 'Scholarship',
                department: 'Department Fund',
                hostel: 'Hostel Fund',
                memorial: 'Memorial Fund',
                general: 'General Endowment',
                research: 'Research Fund'
              };

              return (
                <div key={fund.id} className="bg-white border border-[#E8B83F]/30 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#E8B83F]/20 text-[#3A000E] rounded-bl-2xl text-xs font-bold tracking-widest uppercase">
                    {typeLabels[fund.fund_type] || fund.fund_type}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#171214] mb-3 mt-4 group-hover:text-[#8F0028] transition-colors">
                    {fund.name}
                  </h3>
                  <p className="text-[#756A6E] mb-8 line-clamp-3">
                    {fund.description}
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-[#FFFDF8] rounded-2xl mb-8 border border-[#8F0028]/5">
                    <div>
                      <p className="text-xs text-[#756A6E] uppercase tracking-wider font-bold mb-1">Principal Amount</p>
                      <p className="text-xl font-extrabold text-[#171214]">₹{principal.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#756A6E] uppercase tracking-wider font-bold mb-1">Disbursed</p>
                      <p className="text-xl font-extrabold text-[#8F0028]">₹{(Number(fund.disbursed_amount) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Link href={`/donate/endowments/${fund.id}`} className="block w-full py-3.5 bg-[#171214] text-white text-center font-bold rounded-xl hover:bg-[#8F0028] transition-colors shadow-md hover:shadow-lg">
                    Contribute to Fund
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
