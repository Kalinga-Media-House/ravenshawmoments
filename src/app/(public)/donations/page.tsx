import React from "react";
import { Metadata } from "next";
import {
  DonationHero,
  DonationWhyContribute,
  DonationImpact,
  DonationTransparency,
  DonationPaymentUnavailable,
  ContributorPrivacy,
  DonationFAQ,
  DonationCTA,
} from "@/features/donation";
import { PremiumContributorsClient, RegularContributorsSection } from "@/features/donation";
import { getPublicContributors, getContributorYears } from "@/app/actions/donations";
import { isPayUConfigured, getPayUConfig } from "@/lib/payu/config";
import { DonationForm } from "@/features/donation/components/DonationForm";

export const metadata: Metadata = {
  title: "Support Ravenshaw Moments | Donations and Contributors",
  description:
    "Learn how contributions may support the preservation of Ravenshaw memories, digital archives, community experiences, and the long-term growth of Ravenshaw Moments.",
  openGraph: {
    title: "Support Ravenshaw Moments | Donations and Contributors",
    description:
      "Learn how contributions may support the preservation of Ravenshaw memories, digital archives, community experiences, and the long-term growth of Ravenshaw Moments.",
    type: "website",
  },
};


export default async function DonationsPage() {
  const payuConfigured = isPayUConfigured();
  const config = payuConfigured ? getPayUConfig() : null;
  const isTestMode = config?.environment === "test";

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { premium, regular } = await getPublicContributors(currentMonth, currentYear);
  const availableYears = await getContributorYears();

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#171214]">
      {/* 1. Hero */}
      <DonationHero />

      {/* 2. Why Contribute */}
      <DonationWhyContribute />

      {/* 3. Impact Areas */}
      <DonationImpact />

      {/* 4. Contribution Form OR Payment Unavailable */}
      {payuConfigured ? (
        <DonationForm isTestMode={isTestMode} />
      ) : (
        <DonationPaymentUnavailable />
      )}

      {/* 5. Transparency */}
      <DonationTransparency />

      {/* 6. Premium Contributors */}
      <PremiumContributorsClient 
        initialPremium={premium}
        availableYears={availableYears}
        initialMonth={currentMonth}
        initialYear={currentYear}
      />

      {/* 7. Regular Contributors */}
      <RegularContributorsSection contributors={regular} />

      {/* 7. Contributor Privacy Notice */}
      <ContributorPrivacy />

      {/* 8. FAQ */}
      <DonationFAQ />

      {/* 9. Final CTA */}
      <DonationCTA />
    </div>
  );
}
