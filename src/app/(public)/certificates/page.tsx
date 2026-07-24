import React, { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  Database, 
  CheckCircle,
  Mail,
  Lock,
  Clock,
  ShieldAlert,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CertificateVerification } from "@/features/certificate";

export const metadata: Metadata = {
  title: "Certificate Verification | Ravenshaw Moments",
  description:
    "Verify approved certificates issued through Ravenshaw Moments using a valid certificate ID or verification code.",
  openGraph: {
    title: "Certificate Verification | Ravenshaw Moments",
    description:
      "Verify approved certificates issued through Ravenshaw Moments using a valid certificate ID or verification code.",
    url: "https://ravenshawmoments.com/certificates",
    siteName: "Ravenshaw Moments",
    type: "website",
  },
};

export default function CertificatesPage() {
  const securityFeatures = [
    {
      title: "Official Records",
      description: "Directly connected to the Ravenshaw Moments encrypted database of certified records.",
      icon: <Database className="h-8 w-8 text-[#C8A046]" />
    },
    {
      title: "Secure Verification",
      description: "End-to-end encryption ensures your verification request and results remain private.",
      icon: <Lock className="h-8 w-8 text-[#C8A046]" />
    },
    {
      title: "Instant Results",
      description: "Get immediate confirmation of certificate authenticity without manual processing.",
      icon: <Clock className="h-8 w-8 text-[#C8A046]" />
    },
    {
      title: "Tamper Detection",
      description: "Cryptographic hashing prevents any unauthorized modification of issued credentials.",
      icon: <ShieldAlert className="h-8 w-8 text-[#C8A046]" />
    }
  ];

  const faqs = [
    {
      question: "How do I verify my certificate?",
      answer: "Enter the unique Certificate ID or Verification Code found on your certificate into the search field above and click 'Verify Certificate'. The system will instantly validate it against our official records."
    },
    {
      question: "Where can I find my Certificate ID?",
      answer: "Your Certificate ID is typically a 12-to-16 character alphanumeric code located at the bottom-left or bottom-right corner of your official certificate."
    },
    {
      question: "Why did verification fail?",
      answer: "Verification may fail if the ID was entered incorrectly, if the certificate has been revoked by the issuing authority, or if the certificate is not part of our digital records system."
    },
    {
      question: "Can employers verify certificates?",
      answer: "Yes. Employers, academic institutions, and other third parties can freely use this portal to verify the authenticity of any Ravenshaw Moments issued certificate."
    },
    {
      question: "Is verification free?",
      answer: "Yes, our digital certificate verification service is completely free and accessible to the public 24/7."
    },
    {
      question: "How do I contact Certificate Support?",
      answer: "If you believe your certificate should be valid but is failing verification, please contact the Certificate Cell using the support section at the bottom of this page."
    }
  ];

  return (
    <div className="flex flex-col w-full bg-[#F8F4EC] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/hero-1.webp"
            alt="Ravenshaw Higher Secondary School Campus"
            fill
            className="object-cover"
            priority
          />
          {/* Dark maroon overlay with soft vignette and elegant gradient */}
          <div className="absolute inset-0 bg-[#3A0016]/85 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A0016] via-[#3A0016]/80 to-[#3A0016]/40 z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#1a000a]/70 z-30 mix-blend-overlay" />
        </div>

        <div className="container relative z-40 px-4 md:px-6 flex flex-col items-center text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A046]/20 border border-[#C8A046]/50 text-[#C8A046] text-xs font-black uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>OFFICIAL DIGITAL CERTIFICATE VERIFICATION</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8F4EC] mb-4 font-serif drop-shadow-lg">
            Certificate Verification
          </h1>
          
          <p className="text-sm md:text-lg text-[#F8F4EC]/90 max-w-2xl font-medium leading-relaxed mb-8 text-shadow-sm">
            Instantly verify the authenticity of official certificates, awards, and recognitions issued by Ravenshaw Moments.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-[#C8A046] tracking-wide mb-8">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10"><CheckCircle className="w-4 h-4" /> Official</div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10"><ShieldCheck className="w-4 h-4" /> Secure</div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10"><Clock className="w-4 h-4" /> Instant</div>
          </div>
        </div>
      </section>

      {/* Main Verification Section (PRIMARY FOCUS) */}
      <section className="relative z-50 -mt-10 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Suspense
            fallback={
              <div className="bg-[#3A0016]/90 backdrop-blur-xl rounded-3xl p-10 border border-[#C8A046]/30 text-center space-y-3 shadow-2xl">
                <div className="w-8 h-8 rounded-full border-2 border-[#C8A046] border-t-transparent animate-spin mx-auto" />
                <p className="text-sm font-bold text-[#F8F4EC]/70 uppercase tracking-wider">
                  Loading Verification Portal...
                </p>
              </div>
            }
          >
            <CertificateVerification />
          </Suspense>
        </div>
      </section>

      {/* Verification Process Timeline */}
      <section className="bg-white py-20 border-y border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Verification Process</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
            <p className="text-[#5A1024]/80 text-lg max-w-2xl mx-auto">
              Our automated system ensures a rigorous multi-step validation for every request.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A046]/50 to-transparent -translate-y-1/2 z-0" />
            
            {/* Vertical Line for Mobile */}
            <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C8A046]/20 via-[#C8A046]/50 to-[#C8A046]/20 -translate-x-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 1, title: "Enter Details", icon: <Search className="w-6 h-6 text-[#3A0016]" /> },
                { step: 2, title: "Database Validation", icon: <Database className="w-6 h-6 text-[#3A0016]" /> },
                { step: 3, title: "Digital Verification", icon: <ShieldCheck className="w-6 h-6 text-[#3A0016]" /> },
                { step: 4, title: "Result", icon: <FileCheck className="w-6 h-6 text-[#3A0016]" /> },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center bg-white p-4 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-[#F8F4EC] border-4 border-[#C8A046] shadow-lg flex items-center justify-center mb-4 relative">
                    {item.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#3A0016] text-[#C8A046] text-xs font-bold flex items-center justify-center border-2 border-white">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#3A0016] text-lg">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 bg-[#F8F4EC]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Trust & Security</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, idx) => (
              <Card key={idx} className="bg-white border-[#C8A046]/20 shadow-md hover:shadow-xl hover:border-[#C8A046]/50 transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#3A0016]/5 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-serif text-[#3A0016] mb-3">{feature.title}</h3>
                  <p className="text-sm text-[#5A1024]/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24 border-t border-[#3A0016]/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#3A0016]">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[#C8A046] mx-auto mb-6 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-[#F8F4EC] border border-[#3A0016]/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#3A0016] text-lg select-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#C8A046] transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-[#5A1024]/80 leading-relaxed border-t border-[#3A0016]/5 mt-2">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="bg-[#3A0016] border-t-4 border-[#C8A046] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5A1024] to-[#3A0016] z-0" />
        
        <div className="container relative z-10 px-4 text-center max-w-3xl mx-auto">
          <HelpCircle className="h-16 w-16 text-[#C8A046] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black font-serif text-[#F8F4EC] mb-4 drop-shadow-md">
            Need Assistance?
          </h2>
          <p className="text-lg text-[#F8F4EC]/80 mb-10 leading-relaxed">
            If you are experiencing issues verifying a legitimate certificate, or suspect a fraudulent document, please contact the Certificate Cell immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:support@ravenshawmoments.com">
              <Button size="lg" className="bg-[#C8A046] text-[#3A0016] hover:bg-[#e0b85a] font-bold px-8 h-14 text-base shadow-xl w-full sm:w-auto transition-transform hover:scale-105">
                <Mail className="w-5 h-5 mr-2" /> Contact Certificate Cell
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
