import React from "react";
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Contact Us | Ravenshaw Moments",
  description: "Get in touch with the Ravenshaw Moments team.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Contact Us"
        description="Have questions, suggestions, or want to contribute? We'd love to hear from you."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" }
        ]}
        backgroundImage={innerPageHeroImages.contact}
        compact
      />
      <div className="container mx-auto py-16 px-4 max-w-5xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-6 bg-white border border-[#8F0028]/10 rounded-2xl shadow-sm hover:shadow-md hover:border-[#8F0028]/20 transition-all">
             <div className="p-3 bg-[#E8B83F]/10 rounded-full text-[#E8B83F]"><MapPin className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1 text-[#171214]">Campus Address</h3>
                <p className="text-[#756A6E]">Ravenshaw University<br/>College Square, Cuttack<br/>Odisha 753003, India</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-[#8F0028]/10 rounded-2xl shadow-sm hover:shadow-md hover:border-[#8F0028]/20 transition-all">
             <div className="p-3 bg-[#E8B83F]/10 rounded-full text-[#E8B83F]"><Mail className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1 text-[#171214]">Email Support</h3>
                <p className="text-[#756A6E]">support@ravenshawmoments.com<br/>alumni@ravenshawmoments.com</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-[#8F0028]/10 rounded-2xl shadow-sm hover:shadow-md hover:border-[#8F0028]/20 transition-all">
             <div className="p-3 bg-[#E8B83F]/10 rounded-full text-[#E8B83F]"><Phone className="w-6 h-6" /></div>
             <div>
                <h3 className="text-xl font-bold mb-1 text-[#171214]">Contact Person</h3>
                <p className="text-[#171214] font-medium mb-1">BANAMALI KANHAR</p>
                <p className="text-[#756A6E]">
                  <a href="tel:+918260672009" className="hover:text-[#8F0028] transition-colors">+91 8260672009</a>
                </p>
             </div>
          </div>
        </div>

        <form className="p-8 bg-white border border-[#8F0028]/10 rounded-3xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-[#171214]">Send a Message</h2>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#171214]">Full Name</label>
            <input id="name" type="text" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#8F0028]/20 focus:border-[#8F0028] outline-none transition-all text-[#171214]" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#171214]">Email Address</label>
            <input id="email" type="email" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#8F0028]/20 focus:border-[#8F0028] outline-none transition-all text-[#171214]" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[#171214]">Message</label>
            <textarea id="message" rows={5} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#8F0028]/20 focus:border-[#8F0028] outline-none transition-all text-[#171214]" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="w-full py-4 bg-[#4A0012] text-white rounded-xl font-bold hover:bg-[#6E1028] transition-colors focus:ring-2 focus:ring-[#E8B83F] focus:outline-none">Send Message</button>
        </form>
      </div>
      </div>
    </div>
  );
}
