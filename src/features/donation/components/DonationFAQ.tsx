"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqItems = [
  {
    id: "faq-1",
    question: "How can contributions support Ravenshaw Moments?",
    answer:
      "Contributions may help support website infrastructure, digital archive preservation, secure media storage, community features, approved events, competitions, certificate infrastructure, accessibility improvements, and long-term platform sustainability.",
  },
  {
    id: "faq-2",
    question: "Can I contribute anonymously?",
    answer:
      "Yes. When the contribution system becomes available, you will be able to choose whether your name appears in the public Contributors section. Anonymous contributions will not display any identifying information publicly.",
  },
  {
    id: "faq-3",
    question: "Will my contribution amount be public?",
    answer:
      "No, not by default. Contribution amounts will only be displayed publicly if you explicitly provide separate consent. Public name consent and public amount consent are independent choices.",
  },
  {
    id: "faq-4",
    question: "Will my contact information be displayed?",
    answer:
      "No. Email addresses, phone numbers, and private contact details are never displayed in the public Contributors section. Contact information is used only for payment communication, receipts, and contribution verification.",
  },
  {
    id: "faq-5",
    question: "Can I receive a receipt?",
    answer:
      "Receipt availability will depend on the approved receipt architecture connected with the payment system. Receipt details will be provided when the contribution system is active.",
  },
  {
    id: "faq-6",
    question: "Are contributions tax deductible?",
    answer:
      "Tax-deduction information is not currently provided. Please rely only on approved legal and receipt information displayed during contribution.",
  },
];

export const DonationFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#8F0028]/10 border border-[#E8B83F]/30 text-[#8F0028] mx-auto">
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3" role="list">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                role="listitem"
                className="bg-white shadow-sm rounded-2xl border border-[#8F0028]/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-trigger`}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] focus:ring-inset rounded-2xl"
                >
                  <span className="text-sm font-bold text-[#171214]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8F0028] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`${item.id}-panel`}
                    role="region"
                    aria-labelledby={`${item.id}-trigger`}
                    className="px-5 pb-5"
                  >
                    <p className="text-xs sm:text-sm text-[#756A6E] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
