import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook, Twitter, Mail, MapPin, Globe } from "lucide-react";

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full shrink-0 heritage-footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-10 lg:gap-8 items-start">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 space-y-3.5 md:space-y-6 mb-1 md:mb-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-105 shrink-0">
                <Image 
                  src="/logo.webp" 
                  alt="Ravenshaw Moments Logo" 
                  fill 
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] sm:text-[17px] lg:text-[19px] font-bold text-white uppercase tracking-[0.06em] leading-none mb-[3px]">
                  Ravenshaw
                </span>
                <span className="text-[10px] sm:text-[11.5px] lg:text-[13px] font-medium text-[#D8CFCC] uppercase tracking-[0.18em] leading-none pl-[1px]">
                  Moments
                </span>
              </div>
            </Link>
            <p className="text-[11px] sm:text-[12px] md:text-sm text-[#E8D9DC]/80 leading-[1.3] md:leading-relaxed max-w-xs">
              Preserving Memories. Celebrating Achievements. Connecting Generations. The premier digital community platform for Ravenshaw University students, alumni, and faculty.
            </p>
            <div className="flex items-center justify-start gap-4 sm:gap-5 md:gap-6 flex-nowrap pt-1">
              <a
                href="https://www.instagram.com/ravenshaw.moments"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#FFFDF8]/90 hover:text-[#FFD27A] transition-all duration-250 hover:-translate-y-[2px] inline-flex items-center justify-center p-0.5"
              >
                <Instagram className="w-[19px] h-[19px] md:w-[21px] md:h-[21px] shrink-0 transition-colors duration-250" />
              </a>
              <a
                href="https://youtube.com/@ravenshawmoments"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#FFFDF8]/90 hover:text-[#FFD27A] transition-all duration-250 hover:-translate-y-[2px] inline-flex items-center justify-center p-0.5"
              >
                <Youtube className="w-[19px] h-[19px] md:w-[21px] md:h-[21px] shrink-0 transition-colors duration-250" />
              </a>
              <a
                href="https://www.facebook.com/ravenshaw.moments"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#FFFDF8]/90 hover:text-[#FFD27A] transition-all duration-250 hover:-translate-y-[2px] inline-flex items-center justify-center p-0.5"
              >
                <Facebook className="w-[19px] h-[19px] md:w-[21px] md:h-[21px] shrink-0 transition-colors duration-250" />
              </a>
              <a
                href="https://x.com/ravenshawx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-[#FFFDF8]/90 hover:text-[#FFD27A] transition-all duration-250 hover:-translate-y-[2px] inline-flex items-center justify-center p-0.5"
              >
                <Twitter className="w-[19px] h-[19px] md:w-[21px] md:h-[21px] shrink-0 transition-colors duration-250" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-start w-full">
            <h3 className="text-[#FFD27A] font-semibold md:font-semibold text-[14px] md:text-base mb-2.5 md:mb-6 tracking-wide w-full">Platform</h3>
            <ul className="space-y-1.5 md:space-y-4 text-sm flex flex-col items-start w-full">
              <li><Link href="/departments" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Departments</Link></li>
              <li><Link href="/hostels" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Hostels</Link></li>
              <li><Link href="/organizations" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Organizations</Link></li>
              <li><Link href="/gallery" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Global Gallery</Link></li>
              <li><Link href="/events" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Upcoming Events</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-start w-full">
            <h3 className="text-[#FFD27A] font-semibold md:font-semibold text-[14px] md:text-base mb-2.5 md:mb-6 tracking-wide w-full">Community</h3>
            <ul className="space-y-1.5 md:space-y-4 text-sm flex flex-col items-start w-full">
              <li><Link href="/about" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">About Us</Link></li>
              <li><Link href="/news" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">News & Publications</Link></li>
              <li><Link href="/donations" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Support the Platform</Link></li>
              <li><Link href="/contact" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-start w-full">
            <h3 className="text-[#FFD27A] font-semibold md:font-semibold text-[14px] md:text-base mb-2.5 md:mb-6 tracking-wide w-full">Legal</h3>
            <ul className="space-y-1.5 md:space-y-4 text-sm flex flex-col items-start w-full">
              <li><Link href="/privacy-policy" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Contact Us</Link></li>
              <li><Link href="/certificates" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal py-0 break-words">Certificate Verification</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-start w-full">
            <h3 className="text-[#FFD27A] font-semibold md:font-semibold text-[14px] md:text-base mb-2.5 md:mb-6 tracking-wide w-full">Get in Touch</h3>
            <ul className="space-y-1.5 md:space-y-4 text-sm flex flex-col items-start w-full">
              <li className="flex items-start gap-1 md:gap-3 group cursor-default w-full">
                <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#F2B84B] shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_6px_rgba(242,184,75,0.30)] mt-0.5 md:mt-0" />
                <span className="text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal text-[#F5E8EA]/80 break-words pr-0.5">
                  Ravenshaw University Campus,<br className="hidden md:inline"/> Cuttack, Odisha 753003
                </span>
              </li>
              <li className="flex items-start md:items-center gap-1 md:gap-3 w-full">
                <Mail className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#E7A6B5] shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_6px_rgba(242,184,75,0.30)] mt-0.5 md:mt-0" />
                <a href="mailto:support@ravenshawmoments.com" className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block group text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal break-all sm:break-normal pr-0.5">
                  support@ravenshawmoments.com
                </a>
              </li>
              <li className="flex items-start md:items-center gap-1 md:gap-3 w-full">
                <Globe className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#D7B66D] shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_6px_rgba(242,184,75,0.30)] mt-0.5 md:mt-0" />
                <a 
                  href="https://ravenshawuniversity.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#F5E8EA]/80 hover:text-[#FFD27A] transition-all duration-200 hover:translate-x-1 inline-block group text-[10.5px] sm:text-[11px] md:text-sm leading-[1.25] md:leading-normal break-words pr-0.5"
                >
                  Visit Official Website
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Premium Gradient Divider */}
      <div className="w-full h-px bg-[linear-gradient(90deg,transparent,rgba(242,190,92,0.40),rgba(255,255,255,0.16),rgba(242,190,92,0.40),transparent)]" />
      
      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-xs md:text-sm pt-4 pb-6 md:pt-8 md:pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center md:text-left text-[#FFF8F5]/90">
          © {currentYear} Ravenshaw Moments. All Rights Reserved.
        </p>
        <p className="text-center md:text-right text-[#FFF8F5]/90">
          Powered by{" "}
          <a
            href="https://www.kalingamediahouse.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F2BE5C] hover:text-[#FFD97D] transition-colors font-medium ml-1"
          >
            Kalinga Media House
          </a>
        </p>
      </div>
    </footer>
  );
};
