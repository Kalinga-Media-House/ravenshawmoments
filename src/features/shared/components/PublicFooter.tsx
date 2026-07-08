import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, MapPin } from "lucide-react";

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Ravenshaw <span className="text-primary">Moments</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Preserving Memories. Celebrating Achievements. Connecting Generations. The premier digital community platform for Ravenshaw University students, alumni, and faculty.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/departments" className="hover:text-primary transition-colors">Departments</Link></li>
              <li><Link href="/hostels" className="hover:text-primary transition-colors">Hostels</Link></li>
              <li><Link href="/organizations" className="hover:text-primary transition-colors">Organizations</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Global Gallery</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Upcoming Events</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-6">Community</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">News & Publications</Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors">Support the Platform</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>Ravenshaw University Campus,<br/>Cuttack, Odisha 753003</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <a href="mailto:support@ravenshawmoments.com" className="hover:text-primary transition-colors">
                  support@ravenshawmoments.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Ravenshaw Moments. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
