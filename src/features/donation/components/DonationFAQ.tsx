"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqItems = [
  {
    id: "faq-1",
    question: "How can contributions support Ravenshaw Moments?",
    answer: "Contributions may help support website infrastructure, digital archive preservation, secure media storage, community features, approved events, competitions, certificate infrastructure, accessibility improvements, and long-term platform sustainability.",
  },
  {
    id: "faq-2",
    question: "Can I contribute anonymously?",
    answer: "Yes. When the contribution system becomes available, you will be able to choose whether your name appears in the public Contributors section. Anonymous contributions will not display any identifying information publicly.",
  },
  {
    id: "faq-3",
    question: "Will my contribution amount be public?",
    answer: "No, not by default. Contribution amounts will only be displayed publicly if you explicitly provide separate consent. Public name consent and public amount consent are independent choices.",
  },
  {
    id: "faq-4",
    question: "Will my contact information be displayed?",
    answer: "No. Email addresses, phone numbers, and private contact details are never displayed in the public Contributors section. Contact information is used only for payment communication, receipts, and contribution verification.",
  },
  {
    id: "faq-5",
    question: "Can I receive a receipt?",
    answer: "Receipt availability will depend on the approved receipt architecture connected with the payment system. Receipt details will be provided when the contribution system is active.",
  },
  {
    id: "faq-6",
    question: "Are contributions tax deductible?",
    answer: "Tax-deduction information is not currently provided. Please rely only on approved legal and receipt information displayed during contribution.",
  },
];

export const DonationFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section aria-labelledby="faq-heading" className="py-20 lg:py-28 bg-[#FFFDF8]">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mx-auto mb-6">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-black text-[#3A0016] font-serif mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#3A0016]/70">
            Have questions about contributing? Find answers to common questions below.
          </p>
        </div>

        <div className="space-y-4" role="list">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                role="listitem"
                className={`bg-white shadow-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20 shadow-md" : "border-[#3A0016]/10 hover:border-[#D4AF37]/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-trigger`}
                  className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className="text-lg md:text-xl font-bold text-[#3A0016]">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#D4AF37] text-white" : "bg-[#3A0016]/5 text-[#3A0016]"}`}>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
                <div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-trigger`}
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-8 px-6 md:px-8" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[#3A0016]/70 leading-relaxed text-base md:text-lg border-t border-[#3A0016]/5 pt-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
