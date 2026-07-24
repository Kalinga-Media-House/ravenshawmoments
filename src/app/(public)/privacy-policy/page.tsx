import React from "react";
import { Metadata } from "next";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";
import { Shield, Database, Settings, Lock, Share2, Eye, Clock, Users, FileText, Mail, Phone, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Ravenshaw Moments",
  description: "This Privacy Policy explains how Ravenshaw Moments collects, stores, protects, and uses your information while preserving the memories and legacy of the Ravenshaw community.",
};

const sections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    icon: Database,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          To provide a seamless and secure experience, we may collect the following information:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#3A0016]/80 text-base list-inside list-disc pl-2">
          <ul className="space-y-2">
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Academic Information</li>
            <li>Department</li>
            <li>Hostel</li>
          </ul>
          <ul className="space-y-2">
            <li>Batch</li>
            <li>Profile Photo</li>
            <li>User-generated content</li>
            <li>Device and browser information</li>
            <li>IP address</li>
            <li>Login history</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    icon: Settings,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          The information we collect is strictly used to enhance your experience and manage the platform efficiently. We use this data for:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#3A0016]/80 text-base list-inside list-disc pl-2">
          <ul className="space-y-2">
            <li>Account management</li>
            <li>Identity verification</li>
            <li>Community engagement</li>
            <li>Alumni networking</li>
            <li>Department management</li>
            <li>Hostel management</li>
          </ul>
          <ul className="space-y-2">
            <li>Competitions</li>
            <li>Certificate verification</li>
            <li>Platform analytics</li>
            <li>Security improvements</li>
            <li>Communication</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "media",
    title: "3. Media & Content",
    icon: ImageIcon,
    content: (
      <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
        <li>Users retain full ownership of the media and content they upload to the platform.</li>
        <li>By uploading content, users grant Ravenshaw Moments permission to securely display and distribute it on the platform.</li>
        <li>Users have the complete right to remove their own uploads at any time.</li>
        <li>Content violating our community policies or legal guidelines may be removed without prior notice.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "4. Cookies & Analytics",
    icon: Eye,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          We use cookies and similar tracking technologies to track activity on our platform and hold certain information. We use:
        </p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li><strong>Authentication cookies:</strong> To remember that you are logged in.</li>
          <li><strong>Session cookies:</strong> To operate our service and maintain your user session.</li>
          <li><strong>Performance cookies:</strong> To understand how you interact with the platform.</li>
          <li><strong>Analytics:</strong> To monitor and analyze the usage of our service to improve performance.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "security",
    title: "5. Data Security",
    icon: Lock,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          The security of your data is paramount. We employ robust, industry-standard security measures including:
        </p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li>End-to-end HTTPS encryption for all data in transit.</li>
          <li>Secure Authentication systems.</li>
          <li>Encrypted Storage for sensitive data.</li>
          <li>Strict Row Level Security (Supabase) to isolate your data.</li>
          <li>Rigorous Access Controls to prevent unauthorized data retrieval.</li>
          <li>Secure Cloudflare R2 Storage for media and assets.</li>
          <li>Continuous monitoring and automated vulnerability scanning.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "sharing",
    title: "6. Sharing Information",
    icon: Share2,
    content: (
      <div className="space-y-4">
        <div className="p-4 bg-[#D4AF37]/10 border-l-4 border-[#D4AF37] rounded-r-lg">
          <p className="text-[#3A0016] font-bold">
            Ravenshaw Moments does NOT sell user data to third parties under any circumstances.
          </p>
        </div>
        <p className="text-[#3A0016]/80 leading-relaxed text-base mt-4">
          Your personal information is strictly protected and is only shared:
        </p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li>When explicitly required by law or legal process.</li>
          <li>With trusted service providers necessary for platform operation.</li>
          <li>For processing secure payments.</li>
          <li>For managing user authentication.</li>
          <li>With your explicit, prior permission.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "rights",
    title: "7. User Rights",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          You maintain full control over your personal data. As a user, you have the right to:
        </p>
        <ul className="space-y-3 text-[#3A0016]/80 leading-relaxed text-base list-disc pl-5">
          <li>View and access your personal information at any time.</li>
          <li>Edit and update your profile details.</li>
          <li>Download an archive of your data (an upcoming future feature).</li>
          <li>Request complete deletion of your account and associated data.</li>
          <li>Control the visibility of your profile to other users.</li>
          <li>Change and manage your privacy settings.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "retention",
    title: "8. Data Retention",
    icon: Clock,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          We retain your personal data only for as long as your account remains active and as necessary to fulfill the purposes outlined in this policy.
        </p>
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          When you delete your account, your active data is securely erased. However, some historical records, public community posts, or aggregated data may remain for archival purposes unless legally required to remove them.
        </p>
      </div>
    ),
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    icon: Users,
    content: (
      <p className="text-[#3A0016]/80 leading-relaxed text-base">
        Our platform is intended exclusively for university students, alumni, faculty, and authorized administrative users. We do not knowingly collect personally identifiable information from individuals under the age of 13. If we become aware that we have collected such data, we will take immediate steps to remove that information from our servers.
      </p>
    ),
  },
  {
    id: "updates",
    title: "10. Policy Updates",
    icon: FileText,
    content: (
      <div className="space-y-4">
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          We may update our Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements.
        </p>
        <p className="text-[#3A0016]/80 leading-relaxed text-base">
          We will notify you of any significant changes by posting the new policy on this page and updating the "Effective Date." Continued use of the platform after any changes indicates your acceptance of the revised Privacy Policy.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        eyebrow="Official Data Protection Policy"
        title="Privacy Policy"
        description="Your privacy matters to us. This Privacy Policy explains how Ravenshaw Moments collects, stores, protects, and uses your information while preserving the memories and legacy of the Ravenshaw community."
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
                Privacy Questions?
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
