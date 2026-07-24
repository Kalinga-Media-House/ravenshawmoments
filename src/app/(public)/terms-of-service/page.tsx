import React from "react";
import { Metadata } from "next";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";
import { CheckCircle2, ShieldAlert, UserCheck, AlertTriangle, FileText, Scale, XCircle, Mail, Phone, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Ravenshaw Moments",
  description: "These Terms of Service govern your access to and use of Ravenshaw Moments.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: CheckCircle2,
    content: (
      <p className="text-[#3A0016]/80 leading-relaxed text-base">
        By accessing or using the Ravenshaw Moments platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    icon: UserCheck,
    content: (
      <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
        <li>Users must provide accurate and complete information during registration.</li>
        <li>Fake identities, impersonation, or misrepresentation are strictly prohibited.</li>
        <li>Users are solely responsible for maintaining the security of their accounts.</li>
      </ul>
    ),
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    icon: User,
    content: (
      <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
        <li>You must maintain accurate and up-to-date profile information.</li>
        <li>You must protect your login credentials and notify us of any unauthorized access.</li>
        <li>One account per person is permitted unless specifically authorized by platform administrators.</li>
      </ul>
    ),
  },
  {
    id: "guidelines",
    title: "4. Community Guidelines",
    icon: ShieldAlert,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016] font-semibold">Users must NOT:</p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li>Upload illegal content or promote illegal activities.</li>
          <li>Upload copyrighted material without proper authorization or permission.</li>
          <li>Harass, threaten, or intimidate other users.</li>
          <li>Spread misinformation, spam, or advertise without explicit permission.</li>
          <li>Post hateful, abusive, or discriminatory content.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "ugc",
    title: "5. User Generated Content",
    icon: FileText,
    content: (
      <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
        <li>Users retain full ownership and intellectual property rights of their uploads.</li>
        <li>By uploading content, users grant Ravenshaw Moments permission to display, distribute, and reproduce the content on the platform.</li>
        <li>Content violating our policies or community guidelines may be removed without prior notice.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    icon: Scale,
    content: (
      <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
        <li>Ravenshaw Moments branding, design, logos, and underlying software are protected by intellectual property laws.</li>
        <li>Copying, reproducing, or using these assets without explicit permission is strictly prohibited.</li>
      </ul>
    ),
  },
  {
    id: "privacy",
    title: "7. Privacy",
    icon: ShieldAlert,
    content: (
      <p className="text-[#3A0016]/80 leading-relaxed text-base">
        Your privacy is critically important to us. User information is collected, processed, and handled strictly in accordance with our Privacy Policy. By using Ravenshaw Moments, you consent to our data practices as described in the Privacy Policy.
      </p>
    ),
  },
  {
    id: "suspension",
    title: "8. Account Suspension",
    icon: XCircle,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016] font-semibold">Accounts may be suspended or permanently removed for:</p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li>Creating fake profiles or impersonating others.</li>
          <li>Abuse, harassment, or threats against other users.</li>
          <li>Fraud or malicious activities.</li>
          <li>Repeated or severe violations of our policies.</li>
          <li>Positing security threats to the platform.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "9. Disclaimer",
    icon: AlertTriangle,
    content: (
      <div className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base">
        <p>Ravenshaw Moments is provided on an "as is" and "as available" basis without any warranties of any kind.</p>
        <p>The platform cannot guarantee uninterrupted availability, error-free operation, or absolute data security.</p>
      </div>
    ),
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    icon: Scale,
    content: (
      <p className="text-[#3A0016]/80 leading-relaxed text-base">
        To the maximum extent permitted by law, Ravenshaw Moments and its administrators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the platform.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    icon: FileText,
    content: (
      <p className="text-[#3A0016]/80 leading-relaxed text-base">
        We may modify these terms periodically to reflect updates to our platform or legal requirements. Continued use of Ravenshaw Moments after any changes indicates your acceptance of the updated Terms of Service.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        eyebrow="Official Platform Policies"
        title="Terms of Service"
        description="These Terms of Service govern your access to and use of Ravenshaw Moments. By using this platform, you agree to comply with these terms and all applicable laws."
        backgroundImage={innerPageHeroImages.legal}
      >
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#D4AF37] text-sm font-bold tracking-widest backdrop-blur-sm border border-[#D4AF37]/20">
          EFFECTIVE DATE: 24 JULY 2026
        </div>
      </InnerPageHero>

      <main className="container mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-8 lg:space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id} 
                className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-[#3A0016]/5 hover:border-[#D4AF37]/30 transition-colors duration-300 relative overflow-hidden"
              >
                {/* Subtle gold accent line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D4AF37] to-[#C8A046] opacity-80" />
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h2 className="text-xl sm:text-2xl font-black text-[#3A0016] mb-4 sm:mb-5 font-serif">
                      {section.title}
                    </h2>
                    <div className="prose prose-sm sm:prose-base max-w-none text-[#3A0016]/80">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <section className="mt-16 lg:mt-24">
          <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#3A0016] to-[#5C0528] rounded-[2rem] shadow-xl overflow-hidden group max-w-3xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif mb-2">
                Questions About These Terms?
              </h2>
              
              <div className="w-16 h-px bg-[#D4AF37]/40 mb-2" />
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">BANAMALI KANHAR</h3>
                <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                  Platform Administrator
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center mt-4">
                <a 
                  href="tel:+918260672009" 
                  className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-[#D4AF37]/50 transition-all text-white font-medium group/btn"
                >
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <span className="tracking-wide">+91 8260672009</span>
                </a>
                <a 
                  href="mailto:support@ravenshawmoments.com" 
                  className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-[#D4AF37]/50 transition-all text-white font-medium group/btn"
                >
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <span className="tracking-wide">support@ravenshawmoments.com</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
