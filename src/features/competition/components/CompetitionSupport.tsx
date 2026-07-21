"use client";

import React from "react";
import { HelpCircle, Mail } from "lucide-react";

export const CompetitionSupport: React.FC = () => {
  return (
    <section aria-labelledby="support-heading" className="mt-8">
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 id="support-heading" className="text-lg font-bold text-stone-900">
            Need Help?
          </h2>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">
            If you have any questions regarding eligibility, registration, or submission requirements for this competition, please reach out to our dedicated support team.
          </p>
        </div>
        <div className="shrink-0 mt-4 sm:mt-0">
          <a
            href="mailto:support@ravenshawmoments.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rm-maroon hover:bg-rm-maroon-dark text-white font-bold text-sm shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rm-gold"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </section>
  );
};
