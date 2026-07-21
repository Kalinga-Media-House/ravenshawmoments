import React from "react";
import { ShieldAlert, Clock } from "lucide-react";

export const DonationPaymentUnavailable: React.FC = () => {
  return (
    <section
      aria-labelledby="payment-unavailable-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-3xl p-8 sm:p-10 border border-amber-500/30 bg-amber-900/10 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-500/30 text-amber-400">
            <Clock className="w-7 h-7" aria-hidden="true" />
          </div>

          <h2
            id="payment-unavailable-heading"
            className="text-xl sm:text-2xl font-black text-[#171214] tracking-tight"
          >
            Online Contributions Are Being Prepared
          </h2>

          <p className="text-sm text-[#756A6E] leading-relaxed max-w-xl mx-auto">
            Secure online contribution functionality is not active yet. Payment
            options will appear here after the approved donation and verification
            system is connected.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-amber-400/80 font-bold">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            <span>No payment information is collected at this time</span>
          </div>
        </div>
      </div>
    </section>
  );
};
